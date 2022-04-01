import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	OC_FUNDED, 
	OC_STATUS_0, OC_STATUS_1, OC_STATUS_2, OC_STATUS_3_M,
	OC_API_SESSION_STATUS_0, OC_API_SESSION_STATUS_1,
	OC_API_SESSION_STATUS_2, OC_API_SESSION_STATUS_3
	} from './constants.js';
import App from './index.js';
import Core from './core.js';
import Student from './students.js';
import Ref from './refs.js';
import Meta from './meta.js';
import {extractDate, getKey, cyrb53, assert} from './utils.js';
import Api from'./api.openclassrooms.js';
import History from'./history.js';
import {
	toastOk,
	} from './components.js';

import t from './vendor/tcomb/tcomb.neutral.js';

/*
 * version 1.1
 * 		pour préparer la migration vers le futur modele on va découper la classe
 * 
 * 	SessionMgr -> gestionnaire de session
 *  Session    -> objet Session
 *  _dbSession -> interaction avec la base de donnée
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
  
	const SessionData = t.struct({
		id: t.String,              		// required string
		cid: t.maybe(t.Integer),  		// optional string
		who_id: t.String,				// required string
		who_name: t.String,				// required string
		type: t.String,					// required string
		lvl: t.Integer,					// required string
		when: t.Date,					// required string
		path: t.String,					// required string
		funding: t.String,				// required string
	}, 'SessionData');
	// mapper for oc session object
	SessionData.prototype.ocmapper = function(o){
		
	}

class Session {
	


	static tbl_name = 'sessions'; // private field prefixed with # are not currently supported 
	
    static _checkObject = function(oSession){
		let bDebug = false;
		if(bDebug===true)console.log("%cChecking object session:%o ", APP_DEBUG_STYLE, oSession);
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
	}
	
	/*
	 * An session element in db contain :
	 *   path: the path of the student when doing the session
	 *   
	 *   since juin 2021 le type defense (soutenance) est devenu presentation
	 * 
	 *   collect auto ajoute 
{
    "id": "",
    "who_id": "7520502",
    "who_name": "Emmanuel Barencourt",
    "status": "Emmanuel Barencourt",
    "type": "mentoring",
    "lvl": "2",
    "when": "2021-06-30T14:00:00.000Z",
    "path": "Chef de projet digital",
    "funding": "auto-financé",
    "cid": 746008049893661
}


* 2021-06-30T14:00:00.000Z
* Will search session id:(number)7531056463903914 in database
* 
* 2021-06-30T14:00:00.000Z
* Will search session id:(number)746008049893661 in database
* 
* 
	 *   collect manuel ajoute
	 * 
	 */
	static add = async function(oSession){
		const iRefreshStudentDataBaseTreshold = 30 // limite pour un nouveau refresh de la base étudiante 30 minutes
		let bCheckExistsBeforAdd = false;
		let bDebug = false;
		if(bDebug===true)console.log("%c[Session.add()].................................. Start", APP_DEBUG_STYLE);
		if(bDebug===true)console.log("%cSession.add() so you wanna add a session %o to database", APP_DEBUG_STYLE, oSession);
		let db=App.Cfg.dbase;
		if(GM_config.get("checksessionalreadyexists") === true) {
			//console.info(`%cRemark: i NEED to check existence before adding it to db`, APP_DEBUG_STYLE);
			bCheckExistsBeforAdd = true;
		}
		if(bDebug===true)console.log("%cSession.add() will search if session %o is already in database", APP_DEBUG_STYLE, oSession);
		if (oSession.id.length > 0){ 
			if(bCheckExistsBeforAdd === true && Session.exists(oSession.id) === true){
				if(bDebug===true)console.info(`%cSession.add() session id:${oSession.id} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
				return;
			}
		}else{
			if(bCheckExistsBeforAdd === true && Session.exists(oSession.cid) === true){
				if(bDebug===true)console.info(`%cSession.add() session cid:${oSession.cid} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
				return;
		}}
		if(bCheckExistsBeforAdd === false){
			if(bDebug===true)console.info(`%cSession.add() you have choose not to verify if session exist in database before adding it so !`, APP_DEBUG_STYLE);
		}
		//console.log('%c[Session.add] have check id: %s', APP_DEBUG_STYLE, oSession.id);
		//console.log('%c[Session.add] have check cid: %d', APP_DEBUG_STYLE, oSession.cid)
		
		
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
		
		// because change ot type in june 2021
		if(oSession.type.toLowerCase() === 'presentation'){
			oSession.type = 'soutenance';
		}
		
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
				if(bDebug===true)console.log("%c[Session.add()]This is a defense nothing to do specially for now", APP_DEBUG_STYLE);
				oSession.funding = OC_FUNDED;
				oSession.path = "n/a (defense)";
			} else {// this is not a defense
				//console.log(`%cThis is NOT a defense we have to check if students with id:${oSession.who_id}  is in database and eventually add it`, APP_DEBUG_STYLE)
				//var bOldStudent = Student.exists(oSession.who_id);
				if (Student.exists(oSession.who_id) === false){// have to update database
				
					console.warn('%c[Session.add()]Student %s[%s] not in Db, will updating student db by fetching students list from dashboard',
						 APP_WARN_STYLE,
						 oSession.who_name,
						 oSession.who_id);
					
					// prevent multiple request at same time wait 30 minutes between to update of student database
					/*
					if(bDebug === true)console.log('%c[Session.add()]Last Update of Student BDD was at %s so %i min ago',
						APP_DEBUG_STYLE, 
						Meta.getStudentListUpd(),
						dayjs(Meta.getStudentListUpd()).diff(dayjs(),'m'));
					*/
					// verifer la date de la derniere mise à jour
					if(dayjs(Meta.getStudentListUpd()).diff(dayjs(),'m') < -iRefreshStudentDataBaseTreshold){
						//const _uuid = (()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16)))()// https://gist.github.com/selfish/fef2c0ba6cdfe07af76e64cecd74888b
						//console.log('%cASYNC FUNCTION Student.getAll()%s START', APP_ERROR_STYLE, _uuid);
						if(bDebug === true)console.log('%c[Session.add()]Last Update of Student BDD was %i min ago which was more than treshold for update:%i, so will start to do a full update of student base', 
							APP_DEBUG_STYLE, 
							dayjs(Meta.getStudentListUpd()).diff(dayjs(),'m'),
							iRefreshStudentDataBaseTreshold,
							);
						await Student.getAll();
						//console.log('%cASYNC FUNCTION Student.getAll():%s END', APP_ERROR_STYLE, _uuid);
						if(bDebug === true)console.log('%c[Session.add()]Student database updated set lastupdate value to:%s', APP_DEBUG_STYLE, dayjs().toISOString());
						// puisque j'ai fait une maj je dois forcément reconstituer le cache qui a pu changer (étudiants, modificiation sur les financement...)
						

						
						
						if(bDebug === true)console.log('%c[Session.add()]Delete cache of student', APP_DEBUG_STYLE);
						Meta.setStudentListUpd(dayjs().toISOString()); 
					}else{
						console.log('%c[Session.add()]last Update of database DB was less than %i min ago so will not update it', APP_DEBUG_STYLE, iRefreshStudentDataBaseTreshold);
						// NOTE STT je pourrais ne pas lancer la fonction et attendre le prochain if mais dans ce cas là je vais me prendre un warn
						if(bDebug === true)console.log('%c[Session.add()]student %s[%s] not exists, bd was updated less than %i, i have to manually create student',
							APP_DEBUG_STYLE, oSession.who_name, oSession.who_id, iRefreshStudentDataBaseTreshold);
						/*if (oSession.who_id !== '10335525'){
							var dummy = Student; // to play with var
							var o = Student.exists(oSession.who_id);
							 debugger;
						}*/
						await Student.createManually(oSession.who_id, oSession.who_name, oSession.when);
						// NOTE STT experimental : remove it from the cache else we re ask for create student next time
						
						// Attention cf la document Student.m_findById fait reference à la fonction mémorisée 
						// https://planttheidea.github.io/moize/#haskey
						
						if(
							moize.default.isMoized(Student.m_findById) &&
							Student.m_findById.has([oSession.who_id, null])
						){
							//console.log('avant est ce que la clé est enregistrée %o ', Student.m_findById.has([oSession.who_id, null]));
							//console.log('	liste des clés %o ', Student.m_findById.keys());
							if(bDebug === true)console.log('%c[Session.add()]student %s[%s] is in cache have to delete it', APP_DEBUG_STYLE, oSession.who_name, oSession.who_id);
							Student.m_findById.remove([oSession.who_id, null]); 
							if(bDebug === true)console.log('%c[Session.add()]student %s[%s] removed from the m_findById function cache', APP_DEBUG_STYLE, oSession.who_name, oSession.who_id);
							//console.log('apres est ce que la clé est enregistrée %o ', Student.m_findById.has([oSession.who_id, null]));
							//console.log('	 liste des clés %o ', Student.m_findById.keys());
						}
					}
					//var bPass2 = Student.exists(oSession.who_id, oSession.when);
					console.log("%c[Student.add()] précédemment notre étudiant %s[%s]  n'existait pas existe t'il maintenant ?", APP_DEBUG_STYLE, oSession.who_name, oSession.who_id);
					console.log("%c[Student.add()] la réponse est :%o", APP_DEBUG_STYLE, Student.exists(oSession.who_id, oSession.when));
					
					if(Student.exists(oSession.who_id, oSession.when) == false){// still not exists, have to add student manually
						console.warn(`%c[Session.add()] Student ${oSession.who_name}[${oSession.who_id}] which exists at ${oSession.when} still not exit in Db, have to manually create him/her`, APP_WARN_STYLE);
						
						await Student.createManually(oSession.who_id, oSession.who_name, oSession.when);
						// remove it from the cache else we re ask for create student next time
						if(
							moize.default.isMoized(Student.m_findById) &&
							Student.m_findById.has([oSession.who_id, oSession.when])
						){
							//console.log('avant est ce que la clé est enregistrée %o ', Student.m_findById.has([oSession.who_id, oSession.when]));
							//console.log('	liste des clés %o ', Student.m_findById.keys());
							Student.m_findById.remove([oSession.who_id, oSession.when]);
							if(bDebug === true)console.log('%c[Session.add()]student %s removed from the m_findById function cache', APP_DEBUG_STYLE, oSession.who_id);
							//console.log('apres est ce que la clé est enregistrée %o ', Student.m_findById.has([oSession.who_id, oSession.when]));
							//console.log('	liste des clés %o ', Student.m_findById.keys());
						}
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
		if(oSession.cid === undefined){
			if(bDebug === true)console.log("%c[Session.add()] need to calculate a cid]", APP_DEBUG_STYLE);
			oSession.cid = Session.getHashId(oSession.when, oSession.who_id);
		}
		if(bDebug === true)console.log("%cSession.add() calculated id:%s", APP_DEBUG_STYLE, oSession.cid);
		// check if cid is known in refs table
		_r = Ref.getByKey(oSession.cid, 2, Ref.TYPE.SESSIONID_DATEREFID);
		if(_r !== undefined){
			if(bDebug === true)console.log("%cSession.add() I've found a ref %d by using key (%s)%d", APP_DEBUG_STYLE, _r.key1, typeof oSession.cid, oSession.cid);
			oSession.id = _r.key1.toString(); 
		}
		
		//console.log("%cSession.add() final object is %o", APP_DEBUG_STYLE, oSession);
		
		Session._save(oSession);
		if(bDebug===true)console.log("%c[Session.add()].................................. End", APP_DEBUG_STYLE);
	};
	// save session in db
	static _save = function(oSession){
		var dDebug=false;
		Session._checkObject(oSession);
		// Since 202106 Canceled sessions have no level
		if(oSession.lvl == ''){
			oSession.lvl = '2';
		}
		// convert session to integer
		oSession.lvl.lvl = parseInt(oSession.lvl.lvl,10);
			
		if(bDebug===true)console.log(`%c[Session._save()] saving session id:${oSession.id} of ${oSession.who_name}[cid:${oSession.cid}](${oSession.who_id}) at ${oSession.when} to DB`, APP_DEBUG_STYLE);
		//console.log("%cSaving session %o to DB", APP_DEBUG_STYLE, oSession);
		let db=App.Cfg.dbase;
		db.get(Session.tbl_name).push(JSON.parse(JSON.stringify(oSession))).write();
	};
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
		var bDebug=false;
		if(bDebug===true)console.log(`%c[Session.exist()] will search existence of session id:(${typeof sessionId})${sessionId} in database`, APP_DEBUG_STYLE);
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
		//console.log(`%c[findById()] Will search session id:(${typeof sessionId})${sessionId} in database`, APP_DEBUG_STYLE);
		// NOTE STT je pourrais eviter un search id = string et cid = number
		var _r = db.get(Session.tbl_name).find({id: sessionId}).value();
		if (_r === undefined){
			//console.log(`%c[findById()]Id not found, so will search session by cid:(${typeof sessionId})${sessionId} in database`, APP_DEBUG_STYLE);
			_r = db.get(Session.tbl_name).find({cid: sessionId}).value();
			return _r;
		}
		return _r;
	};
	

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
	}; 
	
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
     * 	sId is the value of who_id of a session
     * return int
     * 
     * sample Session.getHashId()
     * 
     * test
     * 	d_Session.getHashId(d_dayjs('2021-06-30T14:00:00+0000').toISOString(),'')
     */
    
    static getHashId = function(sDate, sId){
		if(sDate instanceof dayjs){
			sDate = sDate.toISOString();
		}
		if(typeof sId === 'number'){
			sId = sId.toString(10);
		}
		assert (
			typeof sDate ==='string' && typeof sId ==='string',
			"getId need two string",
			TypeError
		);
		//console.log('%c[Session.getHashId()] sDate:%o, sId:%o = %d', APP_DEBUG_STYLE, sDate, sId, cyrb53(sDate+sId));
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
		let bDebug = true;
		if(bDebug === true)console.log('%cparseRow() Row is %o',APP_DEBUG_STYLE, oRow);
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
	
	/*
	 * Collect Data from API
	 */
	static getSessionsFromAPI = async function(dtFrom,dtTo){
		let bDebug = false;
		let iMaxLoop = 999; // security prevent too much recursive call
		let iLoop = 0;     // current loop
		let bBrowse = true;
		let iIndexStart = 0;
		let iMaxOfItems = 20; // /!\ OC limite le nombre d'éléments retournés à 20
		
		if(typeof dtFrom === 'string'){
			dtFrom = dayjs(dtFrom);
		}
		assert(
			dtFrom instanceof dayjs === true,
			'dtFrom must be a string or a dayjs object.',
			TypeError
		);
		
		if(typeof dtTo === 'string'){
			dtTo = dayjs(dtTo);
		}
		assert(
			dtTo instanceof dayjs === true,
			'dtTo must be a string or a dayjs object.',
			TypeError
		);
		
		// -> check in private database session-history-cache the value of date from to accelerate page 
		let _r = History.getSameOrNearestSessionIndex(dtTo); // as we go from present to past in history
		if (_r !== undefined && typeof _r === 'number' && _r > iIndexStart){
			iIndexStart = _r; // advance to that index
		}
		// ProgressBar
		// calculer l'écart en jour derniere session et premiere session demandée, rapporter sur la duréee et calculer un pourcentage
		var _iDaysToProcess = dtTo.diff(dtFrom,'d') + 1; 
		NProgress.start();
		
		while(bBrowse === true){
			//console.log(`iRecurse > iMaxRecurse ? ${iRecurse} > ${iMaxRecurse} = ${iRecurse > iMaxRecurse}`,APP_LOG_STYLE);
			if (iLoop > iMaxLoop) {
				console.error("%c[Session.getSessionsFromAPI()] EMERGENCY EXIT LOOP", APP_ERROR_STYLE);
				break; // emergency exit
			}
			iLoop+=1;
			// ~~ Start of collect for the period
			var iIndexEnd = iIndexStart + (iMaxOfItems - 1);
			var aSessions = await Api.getHistorySession([],iIndexStart, iIndexEnd);
			
			if(aSessions === null){
				throw new Error('Api.getHistorySession is null');
			}
			
			var oSessions = JSON.parse(aSessions);
			if(oSessions.errors){
				Object.entries(oSession.errors).forEach(i => console.log('%cApi.getHistorySession send us some errors : %s', APP_WARN_STYLE, i[1].message))
				throw new Error('Api.getHistorySession send us some errors ');
			}
			if(bDebug === true)console.log('%cgetSessionsFromAPI() Sessions are %o',APP_DEBUG_STYLE, oSessions);
			iIndexStart = iIndexEnd+1;
			// ~~ is the last Element too late ?
			oSession = Session.parseRowFromApi(oSessions[oSessions.length-1]);
			
			console.log('%c[Session.getSessionsFromAPI()]La dernière session récuperée par api date de:%s et nous collectons les sessions entre %s et %s',
			APP_DEBUG_STYLE, 
			dayjs(oSession.when).format('DD/MM/YYYY'), 
			dayjs(dtFrom).format('DD/MM/YYYY'), 
			dayjs(dtTo).format('DD/MM/YYYY'));
			
			if(bDebug === true)console.log('%cgetSessionsFromAPI() last session of loaded page is %o',APP_DEBUG_STYLE, oSession);
			console.log('%c[Session.getSessionsFromAPI()] compare last session date %s avec la date de début %s est ce antérieur  %o',
			APP_DEBUG_STYLE, 
			dayjs(oSession.when).format('DD/MM/YYYY'), 
			dayjs(dtFrom).format('DD/MM/YYYY'),
			dayjs(oSession.when).isBefore(dtFrom));
			if(dayjs(oSession.when).isBefore(dtFrom) === true){
				bBrowse = false;
				if(bDebug === true)console.log('%cgetSessionsFromAPI() last session is before start date of parsing %s STOP browsing....', APP_DEBUG_STYLE, dayjs(oSession.dtFrom).format('DD/MM/YYYY'));
				// ~~ set HistoryIndex
				// set or update session history cache
				// set first element of page index
				History.setSessionIndex(oSession.when, iIndexStart);
			}
			/*
			console.log('%c[Session.getSessionsFromAPI()] compare last session date %s avec la date de fin %s est ce postérieur  %o',
			APP_DEBUG_STYLE, 
			dayjs(oSession.when).format('DD/MM/YYYY'), 
			dayjs(dtTo).format('DD/MM/YYYY'), 
			dayjs(oSession.when).isAfter(dtTo));
			if(dayjs(oSession.when).isAfter(dtTo) === true){
				bBrowse = false;
				if(bDebug === true)console.log('%cgetSessionsFromAPI() last session is after stop date %s STOP browsing....', APP_DEBUG_STYLE, dayjs(oSession.dtTo).format('DD/MM/YYYY'));
			}
			*/
			// ~~ treat data ?
			// filter on oSessions
			// exemple dans le debugger temp1.filter( o => d_dayjs(o.sessionDate).isBetween(d_dayjs('20210708'), d_dayjs('20210709'), 'day','[]') )
			
			let oSessionsFinal = oSessions.filter( o => dayjs(o.sessionDate).isBetween(dtFrom, dtTo, 'day','[]') )
			if(bDebug === true)console.log('%cgetSessionsFromAPI() Filtered on date Sessions are %o',APP_DEBUG_STYLE, oSessionsFinal);
			// ~~ save them
			// https://gist.github.com/selfish/fef2c0ba6cdfe07af76e64cecd74888b
			//const _uuid = (()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16)))()
			//console.log('%cASYNC FUNCTION oSessionsFinal.forEach id: %s START', APP_ERROR_STYLE, _uuid);
			//https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
			for (const o of oSessionsFinal) {
				oSession = Session.parseRowFromApi(o);
				if(bDebug === true)console.log('%cgetSessionsFromAPI()  will call Session.add() on %o', APP_DEBUG_STYLE, oSession);
				const _r = await Session.add(oSession);  
				
				// calculer l'écart en jour derniere session et premiere session demandée, rapporter sur la duréee et calculer un pourcentage
				// ne pas oublier que l'on est en inverse sur la date donc on traite le 29 avant le 28
				var _iDaysProcessed = dayjs(dtTo).diff(oSession.when,'d') + 1; // calcul en jours 30-29 = 1 et je veux que ce soit deux
				NProgress.set(_iDaysProcessed/_iDaysToProcess);// — sets a percentage 
				}
			//console.log('%cASYNC FUNCTION oSessionsFinal.forEach id: %s END', APP_ERROR_STYLE, _uuid);
			iIndexStart = iIndexEnd+1;
		}
		
		NProgress.done();
		await toastOk(`Collecte des sessions du ${dtFrom.format('DD/MM/YYYY')} au ${dtTo.format('DD/MM/YYYY')} terminée`);
	} 
	
	/*
	 * Collect Data from API
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
	 
	static parseRowFromApi = function(oSession){
		bDebug=false
		if(bDebug === true)console.log('%cparseRowFromApi() oSession is %o',APP_DEBUG_STYLE, oSession);
		let oDBSession ={};
		oDBSession.id = ''; // must be a string
		oDBSession.who_id = oSession.recipient.id;
		// who_id must be a string
		if(typeof oDBSession.who_id == 'number'){
			oDBSession.who_id = oDBSession.who_id.toString(10);
		}
		oDBSession.who_name = oSession.recipient.displayableName;
		/* ~~ state merci openclassrooms d'avoir deux gestions des états différents :( */
		if(oSession.status === OC_API_SESSION_STATUS_0){
			oDBSession.status = OC_STATUS_0;
		}
		if(oSession.status === OC_API_SESSION_STATUS_1){
			oDBSession.status = OC_STATUS_1;
		}
		if(oSession.status === OC_API_SESSION_STATUS_2){ // jamais pu tester donc ...
			oDBSession.status = OC_STATUS_2;
		}
		if(oSession.status === OC_API_SESSION_STATUS_3){
			oDBSession.status = OC_STATUS_3_M; // OC_STATUS_3_F
		}
		// oDBSession.status = oSession.status; // status : "completed"
		if(oDBSession.status === undefined) oDBSession.status = oSession.status;
		
		oDBSession.type = oSession.type; //type: "mentoring"
		if (oDBSession.type.toLowerCase() === 'mentoring') oDBSession.type = "mentorat"
		
		oDBSession.lvl = oSession.projectLevel;
		if(oDBSession.lvl == null){
			oDBSession.lvl = '';
		}
		// date convert from "2021-06-28T12:45:00+0000" to "2021-06-28T12:45:00.000Z"
		oDBSession.when = dayjs(oSession.sessionDate).toISOString();
		oDBSession.path = null;
		oDBSession.funding = null;
		oDBSession.cid = Session.getHashId(oDBSession.when, oDBSession.who_id);
		return oDBSession;
	}  
}

export default Session;
