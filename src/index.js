/*
 * 
2020-07-15  Ajout de fonctionnalité sur le pdf  <pwyll@Pwyll>
* 

2020-09-01  Unknown  <pwyll@Pwyll>

 * Modification d'un bug sur la collecte automatique avec gestion de l'historique

*/




import { domReady, readFile } from './utils.js'
import {APP_DEBUG_STYLE} from './constants.js';
import UI from './ui.js';
import { 
	appmenu,
	opencfg,
} from "./gmc.lib.js" ; 

import{
	addCbox,
} from './do.js';

import{
	semverCompare,
} from './utils.js';

import Performance from './gm_perf.js';
import Dbase from './dbase.js';

// vendor

import fetchInject from './vendor/fetch-inject/fetch-inject.js';
import arrive from './vendor/arrive/arrive.js';

// utiles juste pour pouvoir etre exportés dans unstafe.window
import Student from './students.js';
import Session from './sessions.js';
import Archive from './archives.js';
import History from './history.js';
import StudentHistory from './students_history.js';


const Facturier = {
	
	Cfg: {
		dbase: null,
	},
	// request animation frame id
	raf:null,

	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
    start: async function () {
		await domReady();
		const bSupport = Facturier.checkSupport(); //TODO better use it
		console.log(`%cAre all functions supported ? : ${bSupport}`,APP_DEBUG_STYLE);
		// when avatar is loaded start application
		if (document.querySelector(".MuiAvatar-img") === null){ 
			console.log(`%c All condition not met, waiting element '.MuiAvatar-img' `, APP_DEBUG_STYLE); 
			document.arrive(".MuiAvatar-img", Facturier._warmup); 
		} else { 
			console.log(`%c All condition already met go`, APP_DEBUG_STYLE);
			Facturier._warmup(); 
		}
	},
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	
	checkSupport: function(){
		return true;
	},
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	
	_warmup : function(){
		// 'this' refers to the newly created element
		console.log("%c in _warmup",APP_DEBUG_STYLE);
		document.unbindArrive(Facturier._warmup);
		if(GM === undefined){
			console.log("%cI am not in a tamper env");
			Facturier._userscriptless();
		} else {
			console.log(`%cTamper environment detected the version is ${GM.info.version}`,APP_DEBUG_STYLE);
		}
		// chargement des CSS de jspanel
		GM_addStyle( GM_getResourceText("jspanelcss") );
		GM_addStyle( GM_getResourceText("toastifycss") );
		GM_addStyle( GM_getResourceText("simpledatatablecss") );
		GM_addStyle( GM_getResourceText("loading_barcss") );
		/* SPECTRE CSS */
		// fonctionne mal avec le thème oc GM_addStyle( GM_getResourceText("spectrecss") );
		GM_config.init(appmenu);
		GM_registerMenuCommand('OC Facturier - configure', opencfg);
		/* hacks */
		if(GM_config.get('hackheaderzindex') === true){
			document.getElementById('header').style.zIndex = 0; // because z index is 1000 in oc rules
		}
		/* set size of content */
		//GM_addStyle('.swal2-content{font-size:'+GM_config.get('sizeofcontentlist')+'}');
		GM_addStyle('.swal2-title{font-size:1.275em)'); // set by default to 1.875em by CSS of SWAL
		Facturier._main();
	},
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * This function is used when i'm not in a UserScript env (no tampermonkey...)
	 */
		
	_userscriptless(){
		console.log(`%cIm'not in a Tamper environment so i need to load js scripts`,APP_DEBUG_STYLE);
	},
	
	_main : function(){
		console.log('​​​%cMainLoaded​​​',APP_DEBUG_STYLE);
		Performance.paintTiming();
		Performance.longTaskTiming();
		let adapter = new LocalStorage('db');
		var db = low(adapter);
		db.defaults({ students: [], sessions: [], f_archives:[], history_session_cache:[], meta:[], students_history:[], }).write();
		Facturier.Cfg.dbase = db;
		/* dayjs extension */
		dayjs.extend(dayjs_plugin_isSameOrAfter);
		dayjs.extend(dayjs_plugin_isSameOrBefore);
		dayjs.extend(dayjs_plugin_isBetween);
		dayjs.extend(dayjs_plugin_localeData);
		dayjs.extend(dayjs_plugin_localeData);
		dayjs.extend(dayjs_plugin_customParseFormat);
		//dayjs.extend(dayjs_locale_fr);
		// https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/localeData.min.js
		if (document.querySelector(".panel.menuBar.flex.draggable") === null){
			UI.init();
		}
	   if(GM_config.get("alwaysaddcbox") === true){
		   addCbox();
		} // add checkbox to element in history
		dayjs.locale('fr');
		//// Patch to add new tbl
		if( db.get("meta").value() === undefined) {
			console.log("%cDb dont' contain meta table create it", APP_DEBUG_STYLE);
			db.assign({meta:[]}).write();
		}
		// verification
		//console.log("CHECK", db.get('meta.dbVersion').value());
		//console.log("2", db.get('meta').find({'key':'dbVersion'}).value().value);
		let sDbVersion = db.get('meta').find({'key':'dbVersion'}).value().value;
		if(sDbVersion === undefined){
			console.log(db.get("meta").value());
			console.log("%cDb dont' contain dbVersion field in meta table create it", APP_DEBUG_STYLE);
			//db.get('meta').push({dbVersion:'1.0.1'}).write();
			//db.set('meta.dbVersion','1.0.0').write(); // set Dbase using Lodash shorthand syntax => fonctionne pas, ne semble pas sauvegardé en base cf stpckage local du navigateur
			db.get('meta').push({'key':'dbVersion','value':'1.0.0'}).write();
			sDbVersion = db.get('meta').find({'key':'dbVersion'}).value().value;
		 }
		//// check Database version (need corresponding app version)
		if (semverCompare(GM.info.script.version, sDbVersion) == 1 ){ // version of script is superior of version of db
			console.log(`%cDB is in version: ${db.get("meta").value().dbVersion} need to go to version ${GM.info.script.version}`, APP_DEBUG_STYLE);
			//// dbUpdate();
			Dbase.update(GM.info.script.version);
		}
		
		fetchInject(['https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js']).then( async function (e) {console.log('apline js fetched',e)} );

		
		
		
		if (GM_config.get("use_custom_css") === true) {
			let sDependencies = GM_config.get("custom_css_url");
			/*
			fetchInject(['https://raw.githubusercontent.com/brettz9/load-stylesheets/master/dist/index-umd.min.js'])
				.then( async function (e) {
					console.log(e); 
					await (async () => {
						const stylesheetElements = await loadStylesheets([
				'https://min.gitcdn.link/repo/StephaneTy-Pro/OC-Mentors-AccountAddon/master/skins/skin_1.css',
			]);
					console.log( stylesheetElements );
				})();

			});
			*/
			
			//console.log(sDependencies, typeof(sDependencies));
			let rDependencies = sDependencies.split(','); // always return one element even if separator not found
			//console.log(rDependencies, typeof(rDependencies));
			
			if (rDependencies.length !== 0){
				console.log(`%cWanna inject Custom CSS from URL:${rDependencies}`, APP_DEBUG_STYLE);
				fetchInject([rDependencies]).then(() => {
					console.log(`%cCustom CSS from URL:${rDependencies} loaded`, APP_DEBUG_STYLE);
				})
				.catch(err => console.log(`%cError detected when loading dependencies ${err}`, APP_ERROR_STYLE));
			} else {
				let sData = GM_config.get("custom_css_data")
				if (sData.length() > 0){
					console.log(`%cNeed to inject a custom css in application content is ${sData}`, APP_DEBUG_STYLE);
					// https://stackoverflow.com/questions/311052/setting-css-pseudo-class-rules-from-javascript/14106897
					// note stt pas testé
					const styleTag = document.createElement("style");
					styleTag.innerHTML = sData;
					document.head.insertAdjacentElement('beforeend', styleTag);
					
					
				}
			}
		}   
	   //ici toute l'idée est de verifier que le fichier d'install contient src ou dist ... s'il contient source alors, on doit utiliser en sus les ressources locales
	   //sinon on est sur la version livrée et donc on a tout déjà dans le script de base qui a été build
	   //probleme avec CORS
	   // visiblement en tout cas sur chrome l'url n'est pas bien prise en compte par le paramètre du script @update et @download semblent sans incidences sur ce que l'on trouve dans l'onglet paramètres
		if (GM.info.script.downloadURL === "http://localhost:8000/dist/app-facturier.iife.js") {
			 console.log("%cALERTE .... version locale !!!!!! ", "background-color:coral;color:white");
			/* exportation des fonctions requises */
			unsafeWindow.Facturier = {libs:[],cfg:{dbase:null},klass:[]}
			unsafeWindow.Facturier.cfg.dbase = Facturier.Cfg.dbase; // const dbase = unsafeWindow.Facturier.cfg.dbase
			unsafeWindow.Facturier.libs.push({id:'fetchInject',ptr:fetchInject});
			unsafeWindow.Facturier.libs.push({id:'dayjs',ptr:dayjs});  // unsafeWindow.Facturier.libs.find(o => o.id == 'dayjs').ptr pour le retrouver
			unsafeWindow.Facturier.klass.push({id:'Student',ptr:Student}); // const Student = unsafeWindow.Facturier.klass.find(o => o.id == 'Student').ptr student is not imported so couln't use it without import
			unsafeWindow.Facturier.klass.push({id:'Session',ptr:Session});
			unsafeWindow.Facturier.klass.push({id:'Archive',ptr:Archive});
			unsafeWindow.Facturier.klass.push({id:'History',ptr:History});
			unsafeWindow.Facturier.klass.push({id:'StudentHistory',ptr:StudentHistory});
			console.log("%cImportants values are exported in unsafeWindow.Facturier", APP_DEBUG_STYLE);    
			
			//Facturier.overrideDebug();
			console.log("%c test readfile", APP_DEBUG_STYLE);
			readFile('file:////media/pwyll/USB120Go/DevStt/UserScripts/SttAddon/src/update_data_base.js', function(_res){console.log(_res);}); 
			  
			Facturier.loadDependencies();
		} else {
			console.log(`%c GM.info.script.downloadURL url : ${GM.info.script.downloadURL}`, APP_DEBUG_STYLE);
		}		
	
	},
	
	loadDependencies : function(){
	   let rDependencies = [];
	   //rDependencies.push("http://localhost:8000/src/dummy.js");
	   rDependencies.push("http://localhost:8000/src/branch01/sandbox.js");
	   rDependencies.push("http://localhost:8000/src/branch01/sandbox.css");
	   fetchInject(rDependencies).then(() => {
		  console.log(`dependencies ${rDependencies} loaded`);
	   })
	},
	
	/*
	 */
	dbUpdate : function(){
		console.log("%c Need to update DB", APP_DEBUG_STYLE);
		if ( semverCompare(GM.info.script.version, '1.00.0006') == 0 ){
			console.log("%c Need to update DB to version '1.00.0006'", APP_DEBUG_STYLE);
			Dbase.update('1.00.0006');
		}
	}, 
	// https://dmitripavlutin.com/catch-the-xmlhttp-request-in-plain-javascript/
	overrideDebug : function(){
		var open = window.XMLHttpRequest.prototype.open,
		  send = window.XMLHttpRequest.prototype.send;

		function openReplacement(method, url, async, user, password) {
		  this._url = url;
		  return open.apply(this, arguments);
		}

		function sendReplacement(data) {
		  if(this.onreadystatechange) {
			this._onreadystatechange = this.onreadystatechange;
		  }
		  /**
		   * PLACE HERE YOUR CODE WHEN REQUEST IS SENT  
		   */
		 console.log(`%c Request sent : ${data}`, APP_DEBUG_STYLE);  
		   
		  this.onreadystatechange = onReadyStateChangeReplacement;
		  return send.apply(this, arguments);
		}

		function onReadyStateChangeReplacement() {
		  /**
		   * PLACE HERE YOUR CODE FOR READYSTATECHANGE
		   */
		   console.log(`%c Ready state changed to: ${this.readyState}`,APP_DEBUG_STYLE);  
		   
		  if(this._onreadystatechange) {
			return this._onreadystatechange.apply(this, arguments);
		  }
		}

		window.XMLHttpRequest.prototype.open = openReplacement;
		window.XMLHttpRequest.prototype.send = sendReplacement;	
	},
}
if (window.Facturier !== undefined){
	window.Facturier.start();
} else {
	Facturier.start();
}
export default Facturier;
export * from './constants.js';
