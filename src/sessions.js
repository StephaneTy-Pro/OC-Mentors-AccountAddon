import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	OC_FUNDED, 
	} from './constants.js';
import App from './index.js';
import Core from './core.js';
import Student from './students.js';
import Ref from './refs.js';
import Meta from './meta.js';
import {extractDate, getKey, cyrb53, assert} from './utils.js';

/*
 * version 1.1
 * 		pour préparer la migration vers le futur modele on va découper la class
 */
 
 /*
  * session in database
  * 	id (string): identifier of session
  * 	cid (number) : calculated id (used if no id)
  * 	who_id
  * 	who_name:
  *		status
  * 	type
  * 	lvl
  * 	when:
  * 	path:
  * 	funding:
  */

class Session {

	static tbl_name = 'sessions'; // private field prefixed with # are not currently supported 
	/*
	 * An session element in db contain :
	 *   path: the path of the student when doing the session
	 */
	static add = async function(oSession){
		//console.log("%c so you wanna add a session to %o", APP_DEBUG_STYLE, oSession);
		let db=App.Cfg.dbase;
		if(GM_config.get("checksessionalreadyexists") === true) {
			//console.info(`%cRemark: i NEED to check existence before adding it to db`, APP_DEBUG_STYLE);
			var bCheckExistsBeforAdd = true;
		}
		if (oSession.id.length > 0){ 
			if(bCheckExistsBeforAdd === true && Session.exists(oSession.id) === true){
				//console.info(`%cSession id:${oSession.id} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
				return;
			}
		}else{
			if(bCheckExistsBeforAdd === true && Session.exists(oSession.cid) === true){
				//console.info(`%cSession cid:${oSession.id} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
				return;
		}}
		/*
		if(bCheckExistsBeforAdd === false){
			console.info(`%cSession id:${oSession.id} not check for existence !`, APP_DEBUG_STYLE);
		} 
		if(Session.exists(oSession.id) === false){
			console.info(`%cSession id:${oSession.id} is not present in database table sessions have to create it`, APP_DEBUG_STYLE);
		} else {
			console.info(`%cSession id:${oSession.id} exist id db!`, APP_DEBUG_STYLE);
		} 
		*/
		/* Sessions property
		 * - add field funding
		 * - add field path ,this field help us to know if
		 *  it was a defense or a coaching
		*/
		// Before and After 01/06
		if (Core.isInOldMode(dayjs(oSession.when))){
			//console.log(`%cWe are in old mode`, APP_DEBUG_STYLE);
			oSession.funding = OC_FUNDED;
			if (oSession.type.toLowerCase() === 'soutenance'){
				//console.log(`%cThis is a defense, we DON't need to add the path to the session`, APP_DEBUG_STYLE);
				oSession.path = "n/a (defense)";
			} else {
				oSession.path = "n/a (old mode)";
			}
		} else {
			//console.log(`%cWhich type is the session ${oSession.type.toLowerCase()}`, APP_DEBUG_STYLE)
			if (oSession.type.toLowerCase() === 'soutenance'){// type defense = nothing to do, they always be funding
				//console.log("%cThis is a defense nothing to do specially for now", APP_DEBUG_STYLE);
				oSession.funding = OC_FUNDED;
				oSession.path = "n/a (defense)";
			} else {// this is not a defense
				//console.log(`%cThis is NOT a defense we have to check if students with id:${oSession.who_id}  is in database and eventually add it`, APP_DEBUG_STYLE)
				//var bOldStudent = Student.exists(oSession.who_id);
				if (Student.exists(oSession.who_id) === false){// have to update database
					//console.warn(`%cStudent {oSession.who_id} not in Db, will updating student db by fetching students list from dashboard`, APP_WARN_STYLE);
					// prevent multiple request at same time wait 30 minutes between to update of student database
					if(dayjs(Meta.getStudenListUpd()).diff(dayjs(),'m') < -30){
						await Student.getAll();
						Meta.setStudenListUpd(dayjs().toISOString()); 
					}
					
					//var bPass2 = Student.exists(oSession.who_id, oSession.when);
					if(Student.exists(oSession.who_id, oSession.when) == false){// still not exists, have to add student manually
						console.warn(`%cStudent ${oSession.who_id} which exists at ${oSession.when} still not exit in Db, have to manually create him/her`, APP_DEBUG_STYLE);
						return Student.createManually(oSession.who_id, oSession.who_name, oSession.when);
					}
				}
				//console.log(`%cwill add funding and path mode of student with id ${oSession.who_id} at date ${dayjs(oSession.when).format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
				//console.log(`%cWill add funding mode : ${oSession.funding}`, APP_DEBUG_STYLE);
				oSession.funding = await Student.getFunding(oSession.who_id, oSession.when); // update funding of students
				//console.log(`%cWill add the path to the session`, APP_DEBUG_STYLE);
				oSession.path = await Student.getPath(oSession.who_id, oSession.when); // update path of students
			}
		}
		// calculate an id
		oSession.cid = Session.getHashId(oSession.when, oSession.who_id);
		// check if cid is known in refs table
		_r = Ref.getByKey(oSession.cid, 2, Ref.TYPE.SESSIONID_DATEREFID);
		//console.log("%cI've found a ref %d by using key (%s)%d", APP_DEBUG_STYLE, _r.key1, typeof oSession.cid, oSession.cid);
		if(_r !== undefined){
			oSession.id = _r.key1.toString(); 
		}
		Session._save(oSession);

	};
	// save session in db
	static _save = function(oSession){
		assert(
			typeof oSession.id === 'string',
			'Session object id need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.cid === 'number',
			'Session object cid need to be a number.',
			TypeError
			);
		assert(
			typeof oSession.who_id === 'string',
			'Session object who_id need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.who_name === 'string',
			'Session object who_name need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.status === 'string',
			'Session object status need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.type === 'string',
			'Session object type need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.lvl === 'string',
			'Session object lvl need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.when === 'string',
			'Session object when need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.path === 'string',
			'Session object path need to be a string.',
			TypeError
			);
		assert(
			typeof oSession.funding === 'string',
			'Session object funding need to be a string.',
			TypeError
			);
		
		
		
		// Since 202106 Canceled sessions have no level
		if(oSession.lvl == ''){
			oSession.lvl = '2';
		}
		// convert session to integer
		oSession.lvl.lvl = parseInt(oSession.lvl.lvl,10);
			
		//console.log(`%cSaving session id:${oSession.id} of ${oSession.who_name}[cid:${oSession.cid}](${oSession.who_id}) at ${oSession.when} to DB`, APP_DEBUG_STYLE);
		//console.log("%cSaving session %o to DB", APP_DEBUG_STYLE, oSession);
		let db=App.Cfg.dbase;
		db.get(Session.tbl_name).push(JSON.parse(JSON.stringify(oSession))).write();
	}
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 * since new version 202106 i have to check two field id and cid
	 * 
	 */
	static exists = function(sessionId){
		let db=App.Cfg.dbase;
        //console.log(`%cWill search existence of session id:(${typeof sessionId})${sessionId} in database`, APP_DEBUG_STYLE);
        //var r = db.get(Session.tbl_name).find({id: sessionId}).value();
        var _r = Session.findById(sessionId);
        if (_r === undefined){
             return false;
         }else {
             return true;
         }
    };
    
    static findById = function(sessionId){
		let db=App.Cfg.dbase;
        //console.log(`%cWill search session id:(${typeof sessionId})${sessionId} in database`, APP_DEBUG_STYLE);
        var _r = db.get(Session.tbl_name).find({id: sessionId}).value();
        if (_r === undefined){
			//console.log(`%cId not found, so will search session by cid:(${typeof sessionId})${sessionId} in database`, APP_DEBUG_STYLE);
			_r = db.get(Session.tbl_name).find({cid: sessionId}).value();
			return _r;
		}
		return _r;
	}
	

	/*
	 * 
	 * name: delete
	 * @param dtFrom dayjs format date from
	 * @param dtTo dayjs format date to
	 * @return
	 * 
	 * Delete elements form DB
	 * 
	 * dayjs could be string, the will be translated to dayjs bu be carreful with format entry
	 * 
	 * NOTE STT 20200908 : a renommer en remove
	 */
	static delete = function(dtFrom=null, dtTo=null){
		let db=App.Cfg.dbase; 
		if (typeof dtFrom === 'string'){ dtFrom = dtFrom.format("YYYY-MM-DD"); }
		if (typeof dtTo === 'string'){ dtTo = dtTo.format("YYYY-MM-DD"); }
		
		if(dtFrom === null && dtTo == null){
			console.log(`%cWanna suppress ALL Sessions from DB`, APP_DEBUG_STYLE);
			db.get(Session.tbl_name).remove().write(); // suppress all from sessions
			return;
		}
		if(dtTo == null){
			db.get(Session.tbl_name).remove( function(o){return dayjs(o.when).isBefore(dtTo), 'day'} ).write();
			return;
		}
		if(dtFrom == null){
			db.get(Session.tbl_name).remove( function(o){return dayjs(o.when).isAfter(dtFrom, 'day')} ).write();
			return;
		}
		//console.log(`%cWanna suppress Sessions from DB before/between ${dtFrom.format('DD/MM/YYYY')} and/or until ${dtTo.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		db.get(Session.tbl_name).remove( function(o){return dayjs(o.when).isBetween(dtFrom, dtTo, 'day','[]')} ).write();
	} 
	
	/*
	 * Delete a session by its id 
	 */
	static deleteById = function(sId){
		let db=App.Cfg.dbase; 
		db.get('sessions').remove((o)=>(o.id === sId)).write();
		console.log(`%cSession ${sId} suppressed from DB`, APP_DEBUG_STYLE);
	}     
	
	static getBetween(dtFrom,dtTo){
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
		if (typeof dtTo === 'string'){ dtFrom = dayjs(dtTo)};
		let db=App.Cfg.dbase;
		let _r = db.get(Session.tbl_name)
		.filter(v => dayjs(v.when).isSameOrBefore(dtTo,"day") && dayjs(v.when).isSameOrAfter(dtFrom, "day"))
		.value();
		return _r;
	}
    /*
     * Parse an HTML TABLE to extract
     * a session
     * return a session object
     * 
     * NOTE STT : need to call it parseRow
     */
    static parseTable= function(oEl){
        //console.log(`parseTable `); console.dir(oEl);
        var sWhen =oEl.children[0].children[0].innerText;
        var sId = getKey(oEl.children[0]);
        //var sWho = oEl.children[1].children[0].innerText; 		//--> NAME
        var sWho = oEl.children[1].children[0].innerText.trim(); //--> NAME sometime i could find space on sessions
        var iWho = getKey(oEl.children[1],-2); // key is not the last but the pre last :=> -2
        var sStatus = oEl.children[2].innerText.trim().toLowerCase(); // cause sometimes there were space in this string
        /* par défaut le type chez OC est session*/
        var sType = (oEl.children[3].children.length) ? oEl.children[3].children[0].innerText.trim().toLowerCase() : 'session'; 
        var sLvl = -1;
        /* sometimes level is not present */
        if (oEl.children[4].children.length > 0 ) {
			sLvl = oEl.children[4].children[0].innerText.trim(); // carreful OC love blank space
		}
        //console.log(`%cClé: ${sId}, étudiant: ${sWho} (${iWho}), quand: ${sWhen}, statut: ${sStatus}, type:${sType}, lvl:${sLvl}`, APP_DEBUG_STYLE);
        sWhen = extractDate(sWhen);
        var me = {id:sId, when:sWhen, who_id:iWho, who_name:sWho, status: sStatus, type:sType, lvl:sLvl}
        return me;
    } 
    
    /*
     * This is a computed id since i have no access to session
     * 	sDate is an ISO 8601 String : dayjs('2019-01-25').toISOString() // '2019-01-25T02:00:00.000Z'
     * return int
     */
    
    static getHashId = function(sDate, sId){
		assert (
			typeof sDate ==='string' && typeof sId ==='string',
			"getId need two string",
			TypeError
		)
		return cyrb53(sDate+sId);
	} 
    /*
     * used only on historical row
     * 
     * sample of data 
     * Mentorat | 27 mai 2021 à 16:15 | Sabrina Kingani | Expertise 3
     * Note avant mentorat on a un icon svg avec un aria-label qui permet de savoir ce que c'est
     */
    static parseRow = function(oRow){
		var sType = oRow.children[0].innerText.length >0 ? oRow.children[0].innerText.trim().toLowerCase() : 'session'; 
		var sStatus = oRow.children[0].querySelector('svg').getAttribute('aria-label').trim().toLowerCase();
		var sWhen = oRow.children[1].querySelector('time').dateTime;
		sWhen = dayjs(sWhen).toISOString();
		var iWho = getKey(oRow.children[2],-2);
		var sWho = oRow.children[2].innerText.trim();
		// since id of session has disapear, i need to use datetime+reference of students to calculate an id
		var iId = Session.getHashId(sWhen, iWho); // prevent name changing by using student id
		var sLvl = oRow.children[3].innerText.trim(); // sample "Expertise\n\n3"
		//console.log("SLVL is %o",sLvl);
		sLvl = sLvl.replace(/[^\d]/gmis,''); // replace all not numeric with nothing ; thanx to invert char ^
		//console.log("FINAL SLVL is %o",sLvl);
		var me = {id:'', cid:iId ,when:sWhen, who_id:iWho, who_name:sWho, status: sStatus, type:sType, lvl:sLvl}
		return me;
	}  
}

export default Session;
