import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	OC_FUNDED, 
	} from './constants.js';
import App from './index.js';
import Core from './core.js';
import Student from './students.js';
import {extractDate, getKey} from './utils.js';

class Session {

	static tbl_name = 'sessions'; // private field prefixed with # are not currently supported 
	/*
	 * An session element in db contain :
	 *   path: the path of the student when doing the session
	 */
	static add = async function(oSession){
		//var db=sttctx.dbase; // TODO Change this to less ugly
		//console.info(`%cWorking on Session id:${oSession.id} of ${oSession.who_name} at ${oSession.when}`, APP_DEBUG_STYLE);
		let db=App.Cfg.dbase;
		if(GM_config.get("checksessionalreadyexists") === true) {
			//console.info(`%cRemark: i NEED to check existence before adding it to db`, APP_DEBUG_STYLE);
			var bCheckExistsBeforAdd = true;
		}
		if(bCheckExistsBeforAdd === true && Session.exists(oSession.id) === true){
			//console.info(`%cSession id:${oSession.id} already present in database table sessions, skip it!`, APP_DEBUG_STYLE);
			return;
		}
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
			console.log(`%cWe are in old mode`, APP_DEBUG_STYLE);
			oSession.funding = OC_FUNDED;
			if (oSession.type.toLowerCase() === 'soutenance'){
				console.log(`%cThis is a defense, we DON't need to add the path to the session`, APP_DEBUG_STYLE);
				oSession.path = "this ia a defense no need for path";
			} else {
				oSession.path = "old mode no need for path";
			}
		} else {
			//console.log(`%cWhich type is the session ${oSession.type.toLowerCase()}`, APP_DEBUG_STYLE)
			if (oSession.type.toLowerCase() === 'soutenance'){// type defense = nothing to do, they always be funding
				console.log("%cThis is a defense nothing to do specially for now", APP_DEBUG_STYLE);
				oSession.funding = OC_FUNDED;
			} else {// this is not a defense
				//console.log(`%cThis is NOT a defense we have to check if students with id:${oSession.who_id}  is in database and eventually add it`, APP_DEBUG_STYLE)
				//var bOldStudent = Student.exists(oSession.who_id);
				if (Student.exists(oSession.who_id) === false){// have to update database
					//console.warn(`%cStudent {oSession.who_id} not in Db, will updating student db by fetching students list from dashboard`, APP_WARN_STYLE);
					await Student.getAll();
					//var bPass2 = Student.exists(oSession.who_id, oSession.when);
					if(Student.exists(oSession.who_id, oSession.when) == false){// still not exists, have to add student manually
						console.warn(`%cStudent {oSession.who_id} which exists at ${oSession.when} still not exit in Db, have to manually create him/her`, APP_DEBUG_STYLE);
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
		console.log(`%cSaving session id:${oSession.id} of ${oSession.who_name}(${oSession.who_id}) at ${oSession.when} to DB`, APP_DEBUG_STYLE);
		db.get(Session.tbl_name).push(JSON.parse(JSON.stringify(oSession))).write();
		//}
	};
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	static exists = function(sessionId){
		 let db=App.Cfg.dbase;
        console.log(`%cWill search existence of session id:${sessionId} in database`, APP_DEBUG_STYLE);
        var r = db.get(Session.tbl_name).find({id: sessionId}).value();
        if (r === undefined){
             return false;
         }else {
             return true;
         }
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
     */
    static parseTable= function(oEl){
        //console.log(`parseTable `); console.dir(oEl);
        var sWhen =oEl.children[0].children[0].innerText;
        var sId = getKey(oEl.children[0]);
        //var sWho = oEl.children[1].children[0].innerText; //--> NAME
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
}

export default Session;
