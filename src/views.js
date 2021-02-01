/**
 * 
 */

/*
 * Factory function
 */
 import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE
	} from './constants.js';
import {default as view_1} from './views/dummy.js'
import {default as export_table} from './views/export_table.js'
import {LZString} from './vendor/lz-string/lz-string.js'; 
 
/* model factory Eliott https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1 
 * voir aussi https://gist.github.com/YozhEzhi/fe587368283c79eabc6d4a98a79de9fd
 * */ 
/* const createView = ({id, path, file, ptr}) => ({
	id,
	path,
	file,
	ptr,
	getPtr(){
		return this.ptr;
	}
}) 
*/
/* Model es 5 Dinero */

const createView = function(id,path,file,ptr) {
	return Object.assign({
		id:id,
		path:path,
		file:file,
		ptr:ptr,
		getPtr: function(){
			return this.ptr
		}
	});
}
 
var fView = function(){
	
	var views = [
		{id:'/views/test-swal-sauvegarde', path:'views', file:'test-swal-sauvegarde', ptr:export_table}
	];
	
	/*
	 * 
	 * sView: {string} a path reference to a view
	 */
	var load = function(sView){
		
		// search view pointer

		oCurView = views.find(o => o.id == sView);
		if(oCurView === undefined){
			console.log(`%cError view ${sView} could't be found`, APP_ERROR_STYLE)
		}
		oCurView = oCurView.ptr;

		// cherche la vue et la charge
		
		//let sHtmlPacked = export_table.data;
		let sHtmlPacked = oCurView.data;
		//Let sHtmlUnpacked = view_1[view_1.format]
		
		// https://css-tricks.com/snippets/javascript/inject-html-from-a-string-of-html/
		// https://grrr.tech/posts/create-dom-node-from-html-string/
		// https://github.com/bigskysoftware/htmx/issues/247
		//let sHtmlUnpacked = LZString['decompressFromEncodedURIComponent'](sHtmlPacked)
		let sHtmlUnpacked = LZString[oCurView.method](sHtmlPacked)
		//console.dir(sHtmlUnpacked)
		//let oDocumentFragment = range.createContextualFragment(sHtmlUnpacked)
		//console.dir(oDocumentFragment);
		
		
		return sHtmlUnpacked;
	}
	
	return Object.freeze({
		load
 	});
  
}

const View = fView();
export default View;
