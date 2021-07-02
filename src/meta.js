/**
 * 
 */

import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	} from './constants.js';
import App from './index.js';
import { assert } from './utils.js';

/*
 * Factory function
 */
var fMeta = function(){
	
	const TBL_NAME = 'meta';
	
	const setDbVersion = function(sVersion){
		assert(
			typeof sVersion === 'string',
			'You must provide a string.',
			TypeError
		);
		return App.Cfg.dbase.get(Meta.tbl_name).find({'key':'dbVersion'}).assign({value:sVersion}).write().value;
	}
	
	const getDbVersion = function(){
		let _r = App.Cfg.dbase.get(Meta.tbl_name).find({'key':'dbVersion'}).value()
		return typeof _r === "undefined" ? -1 : _r.value;
	}
	/*
	 * 
	 * d_dbase.get('meta').find({key: 'dbVersion'}).remove( (item) => true).write();
	 * pourquoi pas plutot 
	 * d_dbase.assign({meta: []}).write();
	 */
	const reset = function(){
		 return App.Cfg.dbase.get('meta').remove( (item) => true).write();
	}
	
	const delDbVersion = function(){
		console.log("%c resetDbVersion NE FONCTIONNE PAS", APP_ERROR_STYLE)
		return App.Cfg.dbase.get('meta').find({key: 'dbVersion'}).remove( (item) => true).write();
	}
	
	// Because update all student is a long process
	
	const setStudentListUpd = function(sValue){
		assert(
			typeof sValue === 'string',
			'You must provide a string.',
			TypeError
		);
		return App.Cfg.dbase.get(Meta.tbl_name).find({'key':'studentLstUpd'}).assign({value:sValue}).write().value;
	}
	
	const getStudentListUpd = function(){
		let _r = App.Cfg.dbase.get(Meta.tbl_name).find({'key':'studentLstUpd'}).value()
		return typeof _r === "undefined" ? -1 : _r.value;
	}

	const checkSupport = function(){
		if( App.Cfg.dbase.get("meta").value() === undefined) {
			console.log("%cDb dont' contain meta table create it", APP_DEBUG_STYLE);
			App.Cfg.dbase.assign({meta:[]}).write();
		}
		if( getDbVersion() == -1){
			App.Cfg.dbase.get('meta').push({'key':'dbVersion','value':'1.0.0'})
			.write();
		}
		if( getStudentListUpd() == -1){
			App.Cfg.dbase.get('meta').push({'key':'studentLstUpd','value':dayjs('19701006').toISOString()})
			.write();
		}
	}


	return Object.freeze({
		checkSupport,
		getDbVersion,
		setDbVersion,
		delDbVersion,
		setStudentListUpd,
		getStudentListUpd,
		tbl_name: TBL_NAME,
 	});
  
}

const Meta = fMeta();
export default Meta;
