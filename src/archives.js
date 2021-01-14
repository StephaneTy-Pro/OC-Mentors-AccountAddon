/**
 * 
 */
 
import {
	APP_DEBUG_STYLE,
	 } from './constants.js';
import App from './index.js'; 

class Archive {
	
	
	static tbl_name = 'f_archives'; // private field prefixed with # are not currently supported 
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
    static add = async function(oArchive){
        let db=App.Cfg.dbase; 
        let now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
        let needle = {id:oArchive[0].to.format('YYYYMM'), data:oArchive, created_at:oArchive[0].now}
        console.log(`%cWill create archive for id ${oArchive[0].to.format('YYYYMM')} (YYYYMM)`, APP_DEBUG_STYLE);
        db.get(Archive.tbl_name).push(JSON.parse(JSON.stringify(needle))).write();
     }	
	/*
     Id in form of YYYYMM
     */
    static exists = function(needle){
        let db=App.Cfg.dbase; 
        let _r = db.get(Archive.tbl_name).find({id: needle}).value();
        if (_r === undefined){
             return false;
         }else {
             return true;
         }
    }
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
    static get = function(needle){
        let db=App.Cfg.dbase;
        var _r = db.get(Archive.tbl_name).find({id: needle}).value();
        if (_r === undefined){
            throw Error('Erreur qui ne devrait jamais arriver en Archive.get');
            return false;
         }else {
             console.log(`%cWill use archive for id ${needle} (YYYYMM)`, APP_DEBUG_STYLE);
             return _r;
         }
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
	 */
	static delete = function(dtFrom=null, dtTo=null){
		let db=App.Cfg.dbase; 
		if (typeof dtFrom === 'string'){ dtFrom = dtFrom.format("YYYY-MM-DD"); }
		if (typeof dtTo === 'string'){ dtTo = dtTo.format("YYYY-MM-DD"); }
		
		if(dtFrom === null && dtTo == null){
			console.log(`%cWanna suppress ALL Archives from DB `, APP_DEBUG_STYLE);
			db.get(Archive.tbl_name).remove().write(); // suppress all from archives
			return;
		}
		if(dtTo == null){
			db.get(Archive.tbl_name).remove( function(o){return dayjs(o.id,'YYYYMM').isBefore(dtTo), 'month'} ).write();
			return;
		}
		if(dtFrom == null){
			db.get(Archive.tbl_name).remove( function(o){return dayjs(o.id,'YYYYMM').isAfter(dtFrom, 'month')} ).write();
			return;
		}
		//console.log(`%cWanna suppress Archives from DB before/between ${dtFrom.format('DD/MM/YYYY')} and/or until ${dtTo.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		db.get(Archive.tbl_name).remove( function(o){return dayjs(o.id,'YYYYMM').isBetween(dtFrom, dtTo, 'month','[]')} ).write();
	}        
	
}

export default Archive;
