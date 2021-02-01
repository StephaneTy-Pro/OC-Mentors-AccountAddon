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


	return Object.freeze({
		getDbVersion,
		setDbVersion,
		delDbVersion,
		tbl_name: TBL_NAME,
 	});
  
}

const Meta = fMeta();
export default Meta;
