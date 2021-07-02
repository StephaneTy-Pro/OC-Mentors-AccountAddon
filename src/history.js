/**
 * Ceci est la seconde version de cette librairie post 202106
 */
  
import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	} from './constants.js';
import App from './index.js';
import { assert } from './utils.js';
import { isEmptyFunction } from './helpers';

/* Singleton Proxy for db function*/
const _HistoryDb = (function fHistoryDb() {
    const TBL_NAME = 'history_session_cache'; 
    const VERBOSE = false;
    const DBCreateTable = function() {
		if(VERBOSE === true) console.log("%cDb dont' contain table history_session_cache table, will create it", APP_DEBUG_STYLE);
        App.Cfg.dbase.assign({history_session_cache:[]}).write();
    };
    const DBTableExists = function() {
		if( App.Cfg.dbase.get(TBL_NAME).value() === undefined){
			return false;
		}
		return true;
    };
    
    const DBFindInTable = function(oValue){
		if(DBTableExists === false){
			throw new Error("%c_HistoryDb:DBFindInTable() failed reason : table is not defined", APP_DEBUG_STYLE); 
		}
		if(VERBOSE === true) console.log('%c_HistoryDb:DBFindInTable()  Request is App.Cfg.dbase.get("%s").find(%o).value()',APP_DEBUG_STYLE, TBL_NAME, oValue) ;
		let _r = App.Cfg.dbase.get(TBL_NAME)
		.find(oValue)
		.value();
		return _r
	};
	
	const DBGetAll = function(){
		if(DBTableExists === false){
			throw new Error("%c_HistoryDb:DBGetAll() failed reason : table is not defined", APP_DEBUG_STYLE); 
		}
		if(VERBOSE === true) console.log('%c_HistoryDb:DBGetAll()  Request is App.Cfg.dbase.get("%s").value()',APP_DEBUG_STYLE, TBL_NAME) ;
		let _r = App.Cfg.dbase.get(TBL_NAME)
		.value();
		return _r
	}
    
    const DBInsertInTable = function(oValue){
		if(DBTableExists === false){
			DBCreateTable();
		}
		if(VERBOSE === true) console.log("%c_HistoryDb:DBInsertInTable table:%s data:%o)", APP_DEBUG_STYLE, TBL_NAME, oValue);
		let _r = App.Cfg.dbase.get(TBL_NAME)
		.push(oValue)
		.write();
		return _r;
    };
    /*
     * oFind : what to find
     * oAssign : what is the new value
     */
    const DBUpdateInTable = function(oFind, oAssign) {
		if(DBTableExists === false){
			throw new Error("%c_HistoryDb:DBUpdateInTable() failed reason : table is not defined", APP_DEBUG_STYLE);
		}
		let _r = App.Cfg.dbase.get(TBL_NAME)
		.find(oFind)
		.assign(oAssign)
		.write();
		return _r;
    };
    // if filter === empty -> remove all
    const DBRemoveInTable = function(fn_filter = {} ) {
		if(DBTableExists === false){
			throw new Error("%c_HistoryDb:DBRemove() failed reason : table is not defined", APP_DEBUG_STYLE);
		}
		if(VERBOSE === true) console.log("%c_HistoryDb:DBRemove with filter", APP_DEBUG_STYLE);
		if(isEmptyFunction(fn_filter)===true) console.log("%c_HistoryDb:DBRemove /!\ filter is empty", APP_DEBUG_STYLE);
		
		//console.log(fn_filter.toString().length);
		//console.log(isEmptyFunction(fn_filter));
		
		/* just for simulate delete 
		let _res = App.Cfg.dbase.get(TBL_NAME)
		.filter( fn_filter )
		.value();
		console.log("%cSimulate REMOVE result in deletion of: %o", APP_DEBUG_STYLE, _res);
		*/
		
		
		let _r = App.Cfg.dbase.get(TBL_NAME)
		.remove( fn_filter )
		.write();
		return _r;
    };
    /* deprecated ... use DBRemove () without params instead ; */
    const DBResetTable = function() {
		if(VERBOSE === true) console.log("%c_History:DBResetTable", APP_DEBUG_STYLE);
		let _r = App.Cfg.dbase.get(TBL_NAME).remove().write();
		return _r;
	};
    return {

		find:    DBFindInTable,
		getAll:  DBGetAll,
        insert:  DBInsertInTable,
		remove:  DBRemoveInTable,
        reset:   DBResetTable,
        update:  DBUpdateInTable
    };
})();
/*
_HistoryDb.delete();
 * /

/*
 * Factory function
 */
var fHistory = function(){
	
	const TBL_NAME = 'history_session_cache'; // be careful to user either exported property (min) or constant (maj)

	const checkSupport = function(){
		let bDebug = true;
		if( App.Cfg.dbase.get("history_session_cache").value() === undefined) {
			if(bDebug) console.log("%cDb dont' contain history_session_cache table create it", APP_DEBUG_STYLE);
			App.Cfg.dbase.assign({history_session_cache:[]}).write();
		}
	}
	
	const _exists = function(dtDate){
		let bDebug = true;
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		let _r = _HistoryDb.find({id: +dtDate.format('YYYYMMDD')});
		if(bDebug) console.log(`%cHistory:_exists ${dtDate.format('YYYYMMDD')} in db ? ${_r === undefined ? false : true}`,APP_DEBUG_STYLE);
		return _r === undefined ? false : true;
	}

	/*
	 *  Get the session index (number in list of data returned by api)
	 *  for a date of session
	 */
	
	const _getSessionIndex = function(dtDate){
		let bDebug = true;
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		if(dtDate.get('day') < dtDate.daysInMonth()){ dtDate = dtDate.endOf('month'); }
		if(bDebug === true) console.log(`%cSearch in history session cache data for id: ${dtDate.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		if ( _exists(dtDate) === true){
			_r = _HistoryDb.find({id: +dtDate.format('YYYYMMDD')});
			if (typeof _r.index !== undefined){
				return _r.index;
			} 
			throw new Error("_getSessionIndex() failed reason : property index is unknown"); 
		}
		return -1;
	};
	/*
	 *  Because we don't store all page, i must have a function to guess
	 * by default the nearest page
	 */
	const _getNearestSessionIndex = function(dtDate){
		let bDebug = false;
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		//if(dtDate.get('day') < dtDate.daysInMonth()){ dtDate = dtDate.endOf('month');}
		if(bDebug === true)console.log(`%cSearch in history session cache NEAREST cached data for id: ${dtDate.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		/* merci à https://1loc.dev/ for max , j'aurais pu aussi prendre la version reduce*/
		let _iBaseDay = +dtDate.format('YYYYMMDD'); // + => convert to integer
		let _r = _HistoryDb.getAll();
		if(_r.length === 0){
			if(bDebug === true)  console.log('%cHistory session cache is empty', APP_DEBUG_STYLE);
			return -1;
		}
		_r = _r.map( i =>  +i.id - _iBaseDay).filter( i => i > 0); // renvoie la difference en jour entre la date stockée et la date recherchée supérieurs à 0
		/* si 0 alors min va me sortir le plus éloigné */
		const min = arr => Math.min(...arr); // clone de la fonction min qui prend désormais en charge un array et plus une liste
		if(_r.length == 0){
			if(bDebug === true)  console.log('%cAll indexes  %o are later than your date:%s', APP_DEBUG_STYLE, _HistoryDb.getAll(), dtDate.format('DD/MM/YYYY'));
			return -1
		}
		let _needle = min(_r) + _iBaseDay;
		if(bDebug === true)  console.log('%cNearest data in history session cache is data with id: %o', APP_DEBUG_STYLE, _needle);
		if ( _exists(_needle) === true){
			_r = _HistoryDb.find({id: +_needle.format('YYYYMMDD')});
			if (typeof _r.index !== undefined){
				return _r.index;
			} 
			throw new Error("[History._getNearestSessionIndex()] failed reason : property index is unknown"); 
		}
		return -1;
	};
	
	/*
	 * Either i could found the index of data 
	 * 	or the nearest index to start
	 * 		{@datetime} dtDate
	 * 		return (int) 
	 */ 
	const getSameOrNearestSessionIndex = function(dtDate){
		let _r = _getSessionIndex(dtDate);
		if (_r === -1){
			_r = _getNearestSessionIndex(dtDate);
		}
		return _r;
	};
	/*
	 * 
	 * name: remove
	 * @param dtFrom dayjs format date from
	 * @param dtTo dayjs format date to
	 * @return
	 * 
	 * Delete elements form DB
	 * 
	 * dayjs could be string, the will be translated to dayjs but be carreful with format entry
	 */
	const remove = function(dtFrom=null, dtTo=null){
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom); }
		if (typeof dtTo === 'string'){ dtTo = dayjs(dtTo); }
		
		let fn_filter = function(){}
		/*dayjs must parse string for conversion , as id are int
		 * must convert them
		 */
		if(dtFrom !== null && dtTo !== null){
			fn_filter =  function(o){return dayjs((o.id).toString(10)).isBetween(dtFrom, dtTo, 'day','[]')};
		}
		if(dtFrom == null && dtTo !== null ){
			fn_filter = function(o){return dayjs((o.id).toString(10)).isBefore(dtTo, 'day')};
		}
		if(dtFrom != null && dtTo == null){
			fn_filter = function(o){return dayjs((o.id).toString(10)).isAfter(dtFrom, 'day')};
		}
		
		/* just for simulate delete 
		let _res = App.Cfg.dbase.get(TBL_NAME)
		.filter( fn_filter )
		.value();
		console.log("%cSimulate REMOVE result in deletion of: %o", APP_DEBUG_STYLE, _res);
		*/
		
		// a verifier mais sans paramètre ça semble ne pas fonctionner (il ne supprime pas tout, c'estpour ça que le reset existe encore)
		
		return _HistoryDb.remove( fn_filter );
	}
	
	const reset = function(){
		return _HistoryDb.reset();
	}
	/*
	 * 
	 * name: setSessionIndex
	 * @param {date} dtDate the date of the index to store
	 * @param {int}  index the index of data to browse
	 * @return
	 *  BE CARREFUL date is a STRING after conversion and i nee an int
	 */
	const setSessionIndex = function(dtDate, index=0){
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		if(dtDate.get('day') < dtDate.daysInMonth()){ dtDate = dtDate.endOf('month'); }
		let _r = _getSessionIndex(dtDate)
		if(_r == -1){
			_r = _HistoryDb.insert({id: +dtDate.format('YYYYMMDD'),index:index});
		}else{
			_r = _HistoryDb.update({id: +dtDate.format('YYYYMMDD')},{index:index});
		} 
		
		return _r;
	}; 

	return Object.freeze({
		tbl_name: TBL_NAME,
		//getSessionIndex: getSessionIndex,
		getSameOrNearestSessionIndex: getSameOrNearestSessionIndex,
		remove: remove,
		reset: reset,
		setSessionIndex: setSessionIndex,
 	});
  
};

const History = fHistory();
export default History;

