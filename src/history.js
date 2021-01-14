/**
 *
 */
  
import {APP_DEBUG_STYLE } from './constants.js';
import App from './index.js';


class History {

	static tbl_name = 'history_session_cache'; // private field prefixed with # are not currently supported 

	/**
	 * ID IS INTEGER !!!!!! 
	 */
	static getSessionPage = function(dtTo){
		if(dtTo.get('day') < dtTo.daysInMonth()){ dtTo = dtTo.endOf('month');}
		console.log(`%cSearch in history session cache data for id: ${dtTo.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		let db=App.Cfg.dbase; 
		if(!db.has(History.tbl_name).value()){
			throw Error(`DB ${History.db_name} NOT FOUND`);
			return -1;
		}
		let _r = db.get(History.tbl_name).find({id: +dtTo.format('YYYYMMDD')}).value(); // NOTESTT ID IS INTEGER
		 if (_r === undefined){
			 return -1;
		 }else {
			 return _r;
		 }		
	};
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */

	static getNearestSessionPage = function(dtTo){
		if(dtTo.get('day') < dtTo.daysInMonth()){ dtTo = dtTo.endOf('month');}
		console.log(`%cSearch in history session cache NEAREST cached data for id: ${dtTo.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		let db=App.Cfg.dbase; 
		if(!db.has(History.tbl_name).value()){
			throw Error(`DB ${History.db_name} NOT FOUND`);
			return -1;
		}
		/* merci à https://1loc.dev/ for max , j'aurais pu aussi prendre la version reduce*/
		let _iBaseDay = +dtTo.format('YYYYMMDD'); // + => convert to integer
		//let _r = db.get(History.tbl_name).value().map( i =>  +i.id - _iBaseDay); // renvoie la difference en jour entre la date stockée et la date recherchée
		let _r = db.get(History.tbl_name).value().map( i =>  +i.id - _iBaseDay).filter( i => i> 0); // renvoie la difference en jour entre la date stockée et la date recherchée supérieurs à 0
		/* si 0 alors min va me sortir le plus éloigné */
		const min = arr => Math.min(...arr); // clone de la fonction min qui prend désormais en charge un array et plus une liste
		let _needle = min(_r) + _iBaseDay;
		console.log(`%cNearest data in history session cache is data with id: ${dtTo.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		_r = db.get(History.tbl_name).find({id: _needle}).value()
		 if (_r === undefined){
			 return -1;
		 }else {
			 return _r;
		 }		
	};
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	
	static getSameOrNearestSessionPage = function(dtTo){
		let _r = History.getSessionPage(dtTo);
		if (_r === -1){
			_r = History.getNearestSessionPage(dtTo);
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
	 */
	static delete = function(dtFrom=null, dtTo=null){
		let db=App.Cfg.dbase; 
		if (typeof dtFrom === 'string'){ dtFrom = dtFrom.format("YYYY-MM-DD"); }
		if (typeof dtTo === 'string'){ dtTo = dtTo.format("YYYY-MM-DD"); }
		
		if(dtFrom === null && dtTo == null){
			db.get(History.tbl_name).remove().write(); // suppress all from history
			console.log(`%cWanna suppress ALL History from DB`, APP_DEBUG_STYLE);
			return;
		}
		if(dtTo == null){
			db.get(History.tbl_name).remove( function(o){return dayjs(o.id,'YYYYMMDD').isBefore(dtTo), 'day'} ).write();
			return;
		}
		if(dtFrom == null){
			db.get(History.tbl_name).remove( function(o){return dayjs(o.id,'YYYYMMDD').isAfter(dtFrom, 'day')} ).write();
			return;
		}
		db.get(History.tbl_name).remove( function(o){return dayjs(o.id,'YYYYMMDD').isBetween(dtFrom, dtTo, 'day','[]')} ).write();
	} 	
	
	static addOrUpdateSessionPage = function(page=1,dtTo=dayjs('1970-10-06')){
		if(History.getSessionPage(dtTo) == -1){
			History.addSessionPage(page, dtTo);
		} else {
			History.updateSessionPage(page, dtTo);
		}
	};
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 *  BE CARREFUL date is a STRING after conversion and i nee an int
	 */
	static updateSessionPage = function(page=1,dtTo=dayjs('1970-10-06')){
		let db=App.Cfg.dbase; 
		//console.log(`updateSessionPage page ${page} for date ${dtTo.format('DD/MM/YYYY')}`);
		let _r = History.getSessionPage(dtTo);
		if( _r == -1 ){
			throw Error('session page not found in history');
			return -1;
		}
		db.get(History.tbl_name)
		.find({id: +dtTo.format('YYYYMMDD')})
		.assign({ page: page})
		.write();
	};
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 *  BE CARREFUL date is a STRING after conversion and i nee an int
	 */
	static addSessionPage = function(page=1,dtTo=dayjs('1970-10-06')){
		let db=App.Cfg.dbase; 
		//console.log(`addSessionPage page ${page} for date ${dtTo.format('DD/MM/YYYY')}`);
		db.get(History.tbl_name)
		.push(JSON.parse(JSON.stringify({id: +dtTo.format('YYYYMMDD'),page:page})))
		.write();
	};
};


export default History;
