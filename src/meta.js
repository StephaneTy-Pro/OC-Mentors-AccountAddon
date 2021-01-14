/**
 * 
 */

import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	} from './constants.js';
import App from './index.js';

/*
 * Factory function
 */
var fMeta = function(){
	
	const TBL_NAME = 'meta';
	
	const setVersion = function(sVersion){
		return App.Cfg.dbase.get('meta').find({'key':'dbVersion'}).assign({value:sVersion}).write();
	}
	
	const getVersion = function(){
		let _r = App.Cfg.dbase.get('meta').find({'key':'dbVersion'}).value
		return typeof _r === "undefined" ? -1 : _r.value;
	}


	return Object.freeze({
		getVersion,
		setVersion,
		tbl_name: TBL_NAME,
 	});
  
}

const Meta = fMeta();
export default Meta;
