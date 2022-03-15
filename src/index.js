/*
 * 
2020-07-15  Ajout de fonctionnalité sur le pdf  <pwyll@Pwyll>
* 

2020-09-01  Unknown  <pwyll@Pwyll>

 * Modification d'un bug sur la collecte automatique avec gestion de l'historique
2021-04-27
	* OC a modifié la classe de detection de l'avatar
	* 	.MuiAvatar-img -> .dom-services-4-MuiAvatar-img
*/

/**
 * A FAIRE
 * 
 * 
 * AJouter
 * 
 * <a href="" class="dom-services-3-MuiButtonBase-root dom-services-3-MuiTab-root dom-services-3-dom-services73 dom-services-3-MuiTab-textColorInherit" style="
    margin-left: auto;
"><span class="dom-services-3-MuiTab-wrapper">En base de donnée (21/24)</span><span class="dom-services-3-MuiTouchRipple-root"></span></a>
* 
* Dans le panel pour avoir par exemple le total d'element de la base de donnée
* 
* Puis sur la ligne du tableau ajouter le nombre d'enregistrement stocké dans la page, proposer de cocher toute la page
* je pense que la with minimum doit etre la sommes des autres, et que le td suivant doit etre en flex avec la formule magique : https://medium.com/@iamryanyu/how-to-align-last-flex-item-to-right-73512e4e5912
*   soit un td à 700px min, puis un autre en flex a envion 200
*  un clic sur ce td permet de cocher toutes les cases de la grille, pour valider il faut encore cliquer sur collectchecked
*   collect auto va disparaitre un moment, il faut que je capture le bearer et que je l'utilise pour mes propres requetes api pour pouvoir télécharger des informations
* 
* 
* projet a regarder scoop bucket dans v chat alextwothousand/sccop-bucket
* ça permet de découvrir 0x0.st
* ainsi que sqls
* 
* deno a aussi un super ouveau packager packup 
* 
* // le bandeau A compléter se cible comme suit
* le premier div de main content est vide et le second et le bon
*   $('#mainContent > :not(div:empty')
* il y a 4 enfants, virer les vides est impossible les div ne sont pas vides
* $('#mainContent > :not(div:empty)').children()[2]
*/



import { domReady, readFile, getKey } from './utils.js';
import { debounce } from './helpers.js';
import { APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE, 
	OC_DASHBOARDCSSMAINDATASELECTOR
	} from './constants.js';
import UI from './ui.js';
import { 
	appmenu,
	opencfg,
} from "./gmc.lib.js" ; 

import{
	addCbox,
	addOneCbox,
	about,
	patchSessionHistoryLineUI,
} from './do.js';

import{
	semverCompare,
	getFileExtension,
} from './utils.js';

import Performance from './gm_perf.js';
import Meta from './meta.js';
import Dbase from './dbase.js';

// vendor

import fetchInject from './vendor/fetch-inject/fetch-inject.js';
import arrive from './vendor/arrive/arrive.js';

// utiles juste pour pouvoir etre exportés dans unsafe.window
import Student 			from './students.js';
import Session 			from './sessions.js';
import Archive 			from './archives.js';
import History 			from './history.js';
import StudentHistory 	from './students_history.js';
import View 			from './views.js';
import Ref 				from './refs.js';
import Api				from './api.openclassrooms.js';

import SandBox_Google	from './sbox_google_sh.js'; // testing sheetrock in a sandbox


const Facturier = {
	
	Cfg: {
		dbase: null,
	},
	// request animation frame id
	raf:null,
	
	// SINCE 20210630
	
	 cssMainDataSelector: OC_DASHBOARDCSSMAINDATASELECTOR, // before 'table[id*="session"]
	 
	// menu
	ID_MENU_FORCE_LOADING: null,
	ID_MENU_FORCE_ADDTOLEFTMENU: null,
	ID_MENU_FORCE_BAR_ON_TOP: null,

    // visiblemenet l'element donc je me servait pour définir si l'application était chargée ou non est chargée deux fois
    // je suis donc contraint de définir une variable pour supprimer le double chargement
	//_isWarmingUp: false,
	_isStarted: false,
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	 
    start: async function () {
		console.log(`%cIn start check Facturier._isStarted: ${Facturier._isStarted}`,APP_DEBUG_STYLE);
		if(Facturier._isStarted === true){ return;}
		await domReady();
		const bSupport = Facturier.checkSupport(); //TODO better use it
		console.log(`%cAre all functions supported ? : ${bSupport}`,APP_DEBUG_STYLE);
		// when avatar is loaded start application
		// var sCSSObserved = '.dom-services-4-MuiAvatar-img'; // was .MuiAvatar-img before
		var sCSSObserved = 'header [class*=MuiAvatar-img]'; // was .dom-services-4-MuiAvatar-img before
		if (document.querySelector(sCSSObserved) === null){ 
			console.log(`%c All condition not met, waiting element '${sCSSObserved}' `, APP_DEBUG_STYLE); 
			document.arrive(sCSSObserved, Facturier._warmup); 
			/* hack */
			Facturier.ID_MENU_FORCE_LOADING = GM_registerMenuCommand('force - loading', Facturier._warmup);
			Facturier.ID_MENU_FORCE_ADDTOLEFTMENU = GM_registerMenuCommand('force - populate menuleft', Facturier._addLinkToMenu);
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
		//console.log("%c in _warmup chek if already started :%o",APP_DEBUG_STYLE, Facturier._isStarted);
		document.unbindArrive(Facturier._warmup);
		if(Facturier._isStarted === true){ 
			// on ne devrait pas arriver là mais pourtant ça arrive merci oc de tout charger en double
			return;
			//throw Error('already started, something is wrong');
		}		

		Facturier._isStarted = true; // application have started
		GM_unregisterMenuCommand(Facturier.ID_MENU_FORCE_LOADING);
		// -- seem not to be used GM_disableMenuCommand('force - loading');
		if(GM === undefined){
			console.log("%cI am not in a tamper env", APP_DEBUG_STYLE);
			Facturier._userscriptless();
		} else {
			console.log(`%cTamper environment detected the version is ${GM.info.version}`,APP_DEBUG_STYLE);
		}
		// chargement des CSS additionnels
		GM_addStyle( GM_getResourceText("jspanelcss") );
		GM_addStyle( GM_getResourceText("toastifycss") );
		GM_addStyle( GM_getResourceText("simpledatatablecss") );
		GM_addStyle( GM_getResourceText("loading_barcss") );
		/* progressbar */
		GM_addStyle( GM_getResourceText("nprogress_css") );
		/* SPECTRE CSS */
		// fonctionne mal avec le thème oc GM_addStyle( GM_getResourceText("spectrecss") );
		GM_config.init(appmenu);
		GM_registerMenuCommand('collectauto', opencfg, "a");
		GM_registerMenuCommand('configure', opencfg, "a");
		/* mettre la barre en haut */
			
		Facturier.ID_MENU_FORCE_BAR_ON_TOP = 
			GM_registerMenuCommand('Menu Bar on Top', 
				function(){document.querySelector(".panel.draggable").scrollIntoView()});
		//GM_registerMenuCommand('force - cbox', Facturier._forceCbox);
		/* hacks */
		if(GM_config.get('hackheaderzindex') === true){
			document.getElementById('header').style.zIndex = 0; // because z index is 1000 in oc rules
		}
		/* set size of content */
		//GM_addStyle('.swal2-content{font-size:'+GM_config.get('sizeofcontentlist')+'}');
		GM_addStyle('.swal2-title{font-size:1.275em}'); // set by default to 1.875em by CSS of SWAL
		/* 
		 * solution de contournement depuis le 01/06/2021 attente du 
		 * chargement de l'historique sinon le tableau de l'historique
		 * des sessions n'est pas disponible
		 */
		 
		// perte du style du bouton
		
		GM_addStyle(`
		.button {
			display: inline-flex;
			-webkit-box-align: center;
			align-items: center;
			-webkist-box-pack: center;
			justify-content: center;
			text-decoration: none;
			cursor: pointer;
			font-weight: 700;
		}
		.button--primary{
			font-family: "Montserrat";
			font-size: .875rem;
			font-weight: 700;
			text-align: center;
			line-height: 1.5rem;
			border-radius: 4px;
			border-width: 1px;
			border-style: solid;
			outline: none;
			padding: 8px 16px;
			text-transform: uppercase;
			position: relative;
			overflow: hidden;
			color: #fff;
			background-color: #7451eb;
			border-color: #7451eb;
			box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.2);
		}
		.button--primary:hover{
			color: #fff;
			background-color: #7451eb;
			border-color: #7451eb;
			box-shadow: 0 6px 6px 0 rgba(0,0,0,0.26),0 10px 20px 0 rgba(0,0,0,0.19);
		}
		.button--primary:active{
			color: #fff;
			background-color: #7451eb;
			border-color: #7451eb;
			-webkistbox-shadow: none;
			box-shadow: none;
		}
		.button--primary:after{
			content: '';
			position: 'absolute';
			top: 50%;
			left: 50%;
			width: 5px;
			height: 5px;
			background-color: #fff;
			opacity: 0;
			border-radius: 100%;
			-webkit-transform:scale(1,1) translate(-50%);
			transform:scale(1,1) translate(-50%);
			-webkit-transform-origin: 50% 50%;
			transform-origin: 50% 50%;
		}
		.button--primary:disabled{
			color: #545454;
			background-color: #d2d2d2;
			border-color: #d2d2d2;
			-webkit-box-shadow: none;
			box-shadow: none;
		}`);  
		 
		 
		//var sCSSObserved = 'table#sessions_2'; // was .dom-services-4-MuiAvatar-img before
		//var sCSSObserved = 'table#sessions_2 tbody tr > td > div > div+p'; // was .dom-services-4-MuiAvatar-img before
		//var sCSSObserved = 'table[id*="sessions"] tbody tr > td > div > div+p';
		var sCSSObserved = Facturier.cssMainDataSelector;
		if (document.querySelector(sCSSObserved) === null){ 
			console.log(`%c All condition not met, waiting element '${sCSSObserved}' `, APP_DEBUG_STYLE); 
			document.arrive(sCSSObserved, Facturier._main); 
		} else { 
			console.log(`%c All condition already met go`, APP_DEBUG_STYLE);
			Facturier._main(); 
		}
		
		
		//Facturier._main();
	},
	// this fonction force the
	_forceCbox: function(){
		Facturier._applyInjectionForSessionsHistory()
	},
	
	/** 
	 * on href change detection
	 * https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
	 * 
	 * NOTESTT changed to pathname change because of #param which sometimes follow href
	 */
	pathname: document.location.pathname,
	
	/*
	 * must return STRING else detection will failed
	 */
	_getOCMainClass: function(){
		try {
			//const _sOCMainCntClass = document.querySelector('#mainContentWithHeader')[0].firstChild.classList.value; // fonctionne mal
			//const _sOCMainCntClass = document.querySelector('table[id*="session"]').classList.value; 
			const _sOCMainCntClass = document.querySelector(Facturier.cssMainDataSelector).classList.value; 
			/*
			Update de l'interface OC, les classes du type "dom-services-1-dom-services2" deviennent du type "webapp-0-webapp5".
			const _aOCMainSrvId = _sOCMainCntClass.match(/dom-services-(\d)/);
			if(_aOCMainSrvId.length == 2)
				return `dom-services-${_aOCMainSrvId[1]}`;
			throw new Error("_aOCMainSrvId.length must be 2");
			*/
			const _aOCMainSrvId = _sOCMainCntClass.match(/webapp-(\d)/);
			if(_aOCMainSrvId.length == 2)
				return `webapp-${_aOCMainSrvId[1]}`;
			throw new Error("_aOCMainSrvId.length must be 2");
		} catch (error) {
			console.error("%cError in _getOCMainClass():%s", APP_ERROR_STYLE, error);
			return '';
		}
	},
	/** Hack for OC **/
	_sOCMainSrvClassName: '',
	_eventMonitor: function(){
		//unsafeWindow.onload = function() {
			var
				bodyList = document.querySelector("body")
				,observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						/*
						console.group("%cMutation Observer", APP_DEBUG_STYLE);
						console.log("%c mutation is %o", APP_DEBUG_STYLE, mutation);
						console.log("%c mutation type ...........: %s", APP_DEBUG_STYLE, mutation);
						console.log("%c target mutation nodeName.: %o", APP_DEBUG_STYLE, mutation.target.nodeName);
						console.log("%c target mutation id.......: %o", APP_DEBUG_STYLE, mutation.target.id);
						console.log("%c target mutation class....: %o", APP_DEBUG_STYLE, mutation.target.classList);
						
						// certaines insertion se faisant a posteriori il faut que je puisse detecter quand elles se font
						
						const getTypeOfElement = function(oNode){
							if (typeof oNode === 'undefined') return null;
							if (oNode.children[0]){
								if (oNode.children[0].children[0]){
									if (oNode.children[0].children[0].querySelector('p') !== null){
										return oNode.children[0].children[0].querySelector('p').innerText;
									} else { console.log('oNode.children[0].children[0] %o', oNode.children[0].children[0]); }
								} else { console.log('oNode.children[0] :%o', oNode.children[0]); }
							} else { console.log('oNode :%o', oNode); }
							
							if (oNode.children[0]){
								if (oNode.children[0].querySelector('p')!== null){
									console.log('je suis dans une insertion partielle :%o', oNode);
									return oNode.children[0].querySelector('p').innerText;
								}
							}
							

						}
						
						console.log("%c target is ....: %o", APP_DEBUG_STYLE, getTypeOfElement(mutation.addedNodes[0]));
						console.groupEnd();
						*/
	
						// use classList.contains() or className ===
						//if(mutation.target.classList.contains('dom-services-3-MuiTouchRipple-root')){ // click on next page wich target '<span class="dom-services-3-MuiTouchRipple-root"></span>'
						if(mutation.target.classList.contains(`${Facturier._sOCMainSrvClassName}-MuiTouchRipple-root`)){ // click on next page wich target '<span class="dom-services-3-MuiTouchRipple-root"></span>'
							//console.log("%cPaging on table was modified", APP_DEBUG_STYLE);
						}
						if(mutation.target.nodeName === 'TBODY' && mutation.target.parentElement.nodeName === 'TABLE'){
							/*
							console.log("%cTable data changed (TBODy,TABLE)",APP_DEBUG_STYLE);
							console.log("%c=============> Changed data : %o", APP_DEBUG_STYLE,mutation);
							*/
							debounce(Facturier._applyInjectionOnPathNameMutation());
						}
		

						if(mutation.target.nodeName === 'OL'){// since 20211001
							debounce(Facturier._applyInjectionOnPathNameMutation());
						}
						const addCboxIfNeeded = function(oNode){
							if (typeof oNode === 'undefined') return null;
							// si je suis dans une insertion partielle je dois ajouter une cbox
							if (
								oNode.nodeName === 'A' &&
								oNode.children[0].querySelector('p')!== null &&
								oNode.children[0].querySelector('p').innerText.toUpperCase().trim() == 'SOUTENANCE'
								)
								{	
									//console.log("%c When found a SOUTENANCE, mannually have to add a cbox to node : %o", APP_DEBUG_STYLE, oNode);
									debounce(addOneCbox(oNode));
									Facturier._lastMutation = dayjs().valueOf();
							}
						}
						addCboxIfNeeded(mutation.addedNodes[0]);
						/* Since 20210623 
						 * if button < is mutated 
						 * parent is a li contained in an ul himself second child of a div with first child is the table
						 * je ne peux pas regarder son label car c'est un svg
						 * eventuellement je peux comparer 
						 * .children[0].firstElementChild.innerHTML à '<path d=\"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z\"></path>'
						 * qui est la représentation de <
						 * */
						if(mutation.target.nodeName === 'BUTTON' && 
							mutation.target.parentElement.parentElement.parentElement.firstElementChild.nodeName === 'TABLE'){
							/*
							console.log("%cTable data changed (BUTTON, TABLE)",APP_DEBUG_STYLE);
							console.log("%c=============> Changed data : %o", APP_DEBUG_STYLE,mutation);
							*/
							debounce(Facturier._applyInjectionOnPathNameMutation());
						}
						
						if(mutation.target.ariaLabel === 'Page précédente'){
							//console.log("%cPaging < was modified", APP_DEBUG_STYLE);
						}
						// $('.dom-services-3-dom-services101') a priori permet de lister tous les elements du tableau quelle que soit la catégorie de sessions aléatoire ???
						// regarder aussi <button class="dom-services-3-MuiButtonBase-root dom-services-3-MuiButton-root dom-services-3-MuiButton-text dom-services-3-dom-services144" tabindex="0" type="button" aria-label="Page précédente"><span class="dom-services-3-MuiButton-label"><svg class="dom-services-3-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg></span><span class="dom-services-3-MuiTouchRipple-root"></span></button>
						if (Facturier.pathname != document.location.pathname) {
							Facturier.pathname = document.location.pathname;
							/* Changed ! your code here */
							//console.log("%cpathname has changed", APP_DEBUG_STYLE);
							debounce(Facturier._applyInjectionOnPathNameMutation());
							
						}
					});
				});
			var config = {
				childList: true,
				subtree: true
			};
			observer.observe(bodyList, config);
		//};
	},
	
	_applyInjectionOnPathNameMutation:function(){
		let bStop = false;
		if(bStop === false && document.location.pathname.match(/\/sessions$/)){
			bStop = true;
			//console.log("%cgestion des sessions", APP_DEBUG_STYLE);
			Facturier._applyInjectionForSessionsToComplete();
		}
		if(bStop === false && document.location.pathname.match(/\/booked-mentorship-sessions$/)){
			bStop = true;
			//console.log("%cgestion des sessions futures"), APP_DEBUG_STYLE;
			Facturier._applyInjectionForSessionsBooked();
			}
		if(bStop === false && document.location.pathname.match(/\/mentorship-sessions-history$/)){
			bStop = true;
			//console.log("%cgestion de l'historique des sessions", APP_DEBUG_STYLE);
			//console.log("%cTODO: supprimer l'option de configuration alwaysaddcbox", APP_DEBUG_STYLE);
			//if(GM_config.get("alwaysaddcbox") === true){
					Facturier._applyInjectionForSessionsHistory();
				//} // add checkbox to element in history
			}
		if (bStop === false){
			console.log("%cUnknow Route so could't guess what to do", APP_ERROR_STYLE);
		}
	
	},
	
	_lastMutation: 0, // timestamp in milliseconds //.unix() if in seconds
	_applyInjectionForSessionsToComplete:function(){
		// have to clean or hide the header
		if(document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`) !== null){
			document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`).style.display="none";
		}
		// have to monkey patch buttons to call another windo
		//var btns = Array.from(document.querySelectorAll('table[id*="session"] tbody a[href*=sessions]'));
		// all elements are in an a element first then into div for column
		// so catching a a => get the button himself
		console.log("%cWill Patch All Buttons corresponding to this CSS PATH %s",APP_DEBUG_STYLE, `${Facturier.cssMainDataSelector} a a[href*=sessions]`); 
		var btns = Array.from(document.querySelectorAll(`${Facturier.cssMainDataSelector} a a[href*=sessions]`));
		/*btns.forEach(btn => btn.onclick = function(event) {
				console.log("click");
				// ajout d'un element dans la table references
				Ref.add(1,2,'sessionId_dateRefId');
				event.stopPropagation();
				event.preventDefault(); // sera important pour pouvoir traiter moi meme à la main apres le click https://medium.com/@jacobwarduk/how-to-correctly-use-preventdefault-stoppropagation-or-return-false-on-events-6c4e3f31aedb
			});
		}*/
		var _handler;
		// tester la mise en place d'un overlay qui permet de savoir si c'est patché ou pas
		btns.forEach( function(btn){
			console.log("%cWill Patch Button %o",APP_DEBUG_STYLE, btn);  
			//let oBtnText = btn.querySelector('div+div+div+div'); // 4eme colonne
			//oBtnText.innerText = ".:"+oBtnText.innerText+":."; // show it was patched
			btn.innerText = ".:"+btn.innerText+":."; // show it was patched
			//console.log('btns trapped');
			btn.addEventListener('click', _handler = function(e){
				e.stopPropagation();
				e.preventDefault(); // must be as soon as possible
				var oLine = btn.parentElement.parentElement.parentElement; // tjhe full row which contain data
				var sDateTime = oLine.children[1].querySelector('time').getAttribute('datetime').trim(); 
				//var sWhen = oLine.children[1].querySelector('time').dateTime.trim();
				var sWho_id = getKey(oLine.children[2],-2);
				// extract the key
				var sHref = oLine.children[3].querySelector("a").getAttribute("href-sav"); //cf. ci dessous pour voir que j'ai attribué cet attribut pour sauvegarder le href
				var _t1 = (sHref || "/").split("/");
				var sSessionId = _t1[_t1.length-1];
				var sWhen = dayjs(sDateTime).toISOString()
				var iHash = Session.getHashId(sWhen, sWho_id);
				let iSessionId = parseInt(sSessionId, 10);
				// Save Data to Db
				// check if exist
				let bExistsSessionId = Ref.exists(iSessionId, 1, Ref.TYPE.SESSIONID_DATEREFID);
				let bExistsHashId    = Ref.exists(iHash, 2, Ref.TYPE.SESSIONID_DATEREFID);
				
				if(bExistsSessionId){
					if(!bExistsHashId){
						console.log(`[SESSIONID_DATEREFID] iSessionId ${iSessionId} est connu mais pas iHash${iHash}`);
						Ref.updKey2(iSessionId, iHash, Ref.TYPE.SESSIONID_DATEREFID);
					}
					// nothing to do
				} 
				if(bExistsHashId){
					if(!bExistsSessionId){
						console.log(`[SESSIONID_DATEREFID] iHash${iHash} est connu mais pas iSessionId ${iSessionId}`);
						Ref.updKey1(iSessionId, iHash, Ref.TYPE.SESSIONID_DATEREFID);
					}
					// nothing to do
				}
				if( !bExistsSessionId && !bExistsHashId ){
					console.log(`[SESSIONID_DATEREFID] iHash${iHash} et iSessionId ${iSessionId} sont INconnus`);
					Ref.add(iSessionId, iHash, Ref.TYPE.SESSIONID_DATEREFID);
				}
				// resend event to element for bubbling to href with a kind of trigger event ?
				window.open(sHref, "blank").focus();
			});
			//ne semble pas nécessaire mais bon par sécurité je pourrais enlever cet attibut et créer le mien pour stocker la valeur
			//
			btn.setAttribute('href-sav' , btn.getAttribute("href"));
			btn.removeAttribute("href");
		});
	},
	
	_applyInjectionForSessionsBooked:function(){
		// have to clean or hide the header
		if(document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`) !== null){
			document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`).style.display="none";
		}
	},
	/*
	 *  (int) iDelayBetweenTwoMutations : default 100 ms of delay between to mutation on dom
	 */
	_applyInjectionForSessionsHistory:function(iDelayBetweenTwoMutations=100){
		//console.log('%c[index._applyInjectionForSessionsHistory()] Le panel de gestion des sessions en historique a été activé, la dernière mutation date de %i',APP_DEBUG_STYLE, Facturier._lastMutation);
		if(document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`) !== null){
			document.querySelector(`${Facturier.cssMainDataSelector} .Facturier__cbox_all`).style.display="block";
		}
		//if(GM_config.get("alwaysaddcbox") === true){ // cette option doit disparaitre
		// as each mutation is registred, prevent too many mutation on same times
		if(dayjs().valueOf()-Facturier._lastMutation < iDelayBetweenTwoMutations){
			/*console.log('%c[index._applyInjectionForSessionsHistory()] Traitement abandonnée le dernier refresh date de %o ms et le minimum est de %o ms',
			  APP_DEBUG_STYLE,
			  dayjs().valueOf() - Facturier._lastMutation,
			  iDelayBetweenTwoMutations);
			 */
			return;
		}
		addCbox();
		Facturier._lastMutation = dayjs().valueOf();
		//console.log('%c[index._applyInjectionForSessionsHistory()] maj de la dernière mutation à %o',APP_DEBUG_STYLE, Facturier._lastMutation);
		//} // add checkbox to element in history
	},
	
	_addHeader: function(){
		/* set main SrvClassName*/
		if (Facturier._sOCMainSrvClassName.length === 0){
			Facturier._sOCMainSrvClassName = Facturier._getOCMainClass();
		}
		
		if (Facturier._sOCMainSrvClassName.length === 0){
			console.error('%c[index._addHeader()] _sOCMainSrvClassName is still unknow', APP_ERROR_STYLE);
			//console.log("[index._addHeader()]check this %o", document.querySelector('table[id*="session"]'));
			console.log("[index._addHeader()]check this %o", document.querySelector(Facturier.cssMainDataSelector));
		}
/*  NOTESTT: Obsolete 20220111
		let sElement = `
<a href="" class="${Facturier._sOCMainSrvClassName}-MuiButtonBase-root
 ${Facturier._sOCMainSrvClassName}-MuiTab-root
 ${Facturier._sOCMainSrvClassName}-dom-services73
 ${Facturier._sOCMainSrvClassName}-MuiTab-textColorInherit"
 style="margin-left: auto;">
 <span class="${Facturier._sOCMainSrvClassName}-MuiTab-wrapper">En base de donnée (21/24)</span>
 <span class="${Facturier._sOCMainSrvClassName}-MuiTouchRipple-root"></span></a>
`;
*/
		//selectionner les elements non vides enfants direct pour trouver les "onglets" historique...
		let aDom = document.querySelector('#mainContent > :not(div:empty)').children;
		// la barre contenant le pseudo menu se trouve avant la ligne section
		let i = 0;
		for(i=aDom.length-1;i>=0;i--){
			console.log(i, aDom[i].nodeName)
			if(aDom[i].nodeName === 'SECTION')break;
		}
		if(i === 0){
			console.error('IRRECOVERABLE ERROR element <section> not found');
			return;
		}
		i = i - 1; // celui avant la section
		// chercher le conteneur du menu
		//    aDom[2].firstChild.lastChild.firstChild
		// ou aDom[2].querySelector('a').parentElement
		/* before 20220111
		const oPanelSelectorContainer = aDom[i].querySelector('a').parentElement;
		const oRefCSS = aDom[i].querySelector('a[aria-selected=false]');
		*/
		const oBase = document.querySelector('#mainContent[class*="webapp"]'); // note STT devenu inutile
		//const oPanelSelectorContainer = oBase.querySelector('a').parentElement;
		//const oRefCSS = oBase.querySelector('a[aria-selected=false]');
		
		const oPanelSelectorContainer = document.querySelector('[role="tablist"]'); // le conteneur du selecteur d'onglet
		
		
		// ici il faut s'assurer que l'on ait chargé le panel
		
		var handleElementShown=function(oElem){
			const oPanelSelectorContainer = document.querySelector('[role="tablist"]');
			let oSpan_1 = document.createElement('span');
			oSpan_1.innerText = "Facturier v."+GM.info.script.version;
			//oSpan_1.classList.add(`${Facturier._sOCMainSrvClassName}-MuiTab-wrapper`);
			
			// dans la version avant celle du 20220314 on passait par des sous elements
			//oSpan_1.classList.add(...oElem.children[0].classList);
			// depuis la version 20220314 prendre 
			oSpan_1.classList.add(...oElem.classList);	
			oSpan_1.classList.add('Facturier__header');
			if(oElem.children.length>1){ // since 20220130 - semble ne plus etre tout le temps présent
				let oSpan_2 = document.createElement('span');
				//oSpan_2.classList.add(`${Facturier._sOCMainSrvClassName}-MuiTouchRipple-root`);
				oSpan_2.classList.add(...oElem.children[1].classList);
				oSpan_2.classList.add('Facturier__header');
			}
			let oRoot = document.createElement('a');
			oRoot.onclick = about;
			//oRoot.alt = "tout séléctionner";
			oRoot.classList.add(...oElem.classList);
			oRoot.classList.add('Facturier__header');
			oRoot.appendChild(oSpan_1);
			if(oElem.children.length>1){ // since 20220130 - semble ne plus etre tout le temps présent
				oRoot.appendChild(oSpan_2);
			}
			oRoot.style = 'margin-left: auto'; // magic property to pull it (flex element)right	
			oPanelSelectorContainer.appendChild(oRoot);
		}
		
		var observer = new MutationObserver(function (mutations, me) {
		  // `mutations` is an array of mutations that occurred
		  // `me` is the MutationObserver instance
		  const oRefCSS = oPanelSelectorContainer.querySelector('a[aria-selected=false]');
		  if (oRefCSS.children) {
			handleElementShown(oRefCSS);
			me.disconnect(); // stop observing
			return;
		  }
		});

		// start observing
		observer.observe(document, {
		  childList: true,
		  subtree: true
		});		
		
		
		return;
		//anciennement
		const oRefCSS = oPanelSelectorContainer.querySelector('a[aria-selected=false]'); // le css d'un onglet non sélectionné
		
		let oSpan_1 = document.createElement('span');
		oSpan_1.innerText = "Facturier v."+GM.info.script.version;
		//oSpan_1.classList.add(`${Facturier._sOCMainSrvClassName}-MuiTab-wrapper`);
		oSpan_1.classList.add(...oRefCSS.children[0].classList);
		oSpan_1.classList.add('Facturier__header');
		/*let _handler;
		oSpan_1.addEventListener('click', _handler = function(e){
			document.querySelectorAll("tbody input[type=checkbox]").forEach( e => e.checked = !e.checked );
		});*/
		let oSpan_2 = document.createElement('span');
		//oSpan_2.classList.add(`${Facturier._sOCMainSrvClassName}-MuiTouchRipple-root`);
		oSpan_2.classList.add(...oRefCSS.children[1].classList);
		oSpan_2.classList.add('Facturier__header');
		let oRoot = document.createElement('a');
		oRoot.onclick = about;
		//oRoot.alt = "tout séléctionner";
		oRoot.classList.add(...oRefCSS.classList);
		oRoot.classList.add('Facturier__header');
		oRoot.appendChild(oSpan_1);
		oRoot.appendChild(oSpan_2);
		// copy from precedent ? need to detect unactive one
		//oRoot.classList.add(`${Facturier._sOCMainSrvClassName}-MuiButtonBase-root`);
		//oRoot.classList.add(`${Facturier._sOCMainSrvClassName}-MuiTab-root`);
		// oRoot.classList.add('dom-services-3-dom-services73');
		//oRoot.classList.add(`${Facturier._sOCMainSrvClassName}-MuiTab-textColorInherit`);
/*
let sStyle=`
font-size: 1rem;
max-width: 280px;
font-family: Montserrat;
font-weight: 400;
line-height: 1.625rem;
text-transform: inherit;
`;
*/
		//oRoot.style = sStyle+'margin-left: auto'; // magic property to pull it (flex element)right
		oRoot.style = 'margin-left: auto'; // magic property to pull it (flex element)right
		//aDom[2].appendChild(oRoot);
		//aDom[1].querySelector('div:nth-child(2) > div').appendChild(oRoot); contient le text Sessions et le bouton créer pour créer une session
		
		/* pour être OC résilient il faudrait chercher parmi aDom tout ce qui contient muiTabs*/
		/* classList.toString().match(/MuiTabs/) */
		/*
		let _z;
		for(var i of aDom){
			//console.log([...i.children]);
			//[...i.children].map( e => console.log(e.classList.toString()));
			let _z2 = [...i.children].find( e => e.classList.toString().match(/MuiTabs/));
			_z = (_z2 !== undefined) ? _z2 : _z;
			//console.log(_z);
		}
		
		//aDom[2].querySelector('div:nth-child(2) > div').appendChild(oRoot);
		_z.appendChild(oRoot);
		*/
		oPanelSelectorContainer.appendChild(oRoot);
	},
	
	/*
	 * 
	 * 
	 * autre option pour la partie facturation 
<thead style="
    display: block;
"><tr style="
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    flex-direction: row;
    background-color: #fff;
"><td>Facturier 1.12</td><td style="
    font-size: 1rem;
    max-width: 280px;
    font-family: Montserrat;
    font-weight: 400;
    line-height: 1.625rem;
    text-transform: inherit;
    margin-left: auto;
">Fact.(o/n)</td></tr>
</thead>
	 * 
	 */
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * This function is used when i'm not in a UserScript env (no tampermonkey...)
	 */
		
	_userscriptless(){
		console.log(`%cIm'not in a Tamper environment so i need to load js scripts`, APP_DEBUG_STYLE);
	},
	
	_main : function(){
		console.log('​​​%c[index._main()]MainLoaded​​​',APP_DEBUG_STYLE);
		document.unbindArrive(Facturier._main);
		
		// Attention avec l'ordre des choses, ici on lance trop vite l'event monitor puisque la base est pas encore théoriquement connectée		
		Facturier._eventMonitor();
if(STT_VERSION) { 
		Performance.paintTiming();
		Performance.longTaskTiming();
}
		
		let adapter = new LocalStorage('db');
		var db = low(adapter);
		db.defaults({ students: [], sessions: [], f_archives:[], history_session_cache:[], meta:[], refs:[], students_history:[], }).write();
		Facturier.Cfg.dbase = db;

		/* dayjs extension */
		dayjs.extend(dayjs_plugin_isSameOrAfter);
		dayjs.extend(dayjs_plugin_isSameOrBefore);
		dayjs.extend(dayjs_plugin_isBetween);
		dayjs.extend(dayjs_plugin_localeData);
		dayjs.extend(dayjs_plugin_customParseFormat);
		dayjs.locale('fr');
		
		// checks -- must be after db init
		Ref.checkSupport();
		Meta.checkSupport();
		
		//Monitor
		/*
		if(GM_config.get('userid') != 0){
			Api.forge(GM_config.get('userid')); // pour le bien devrait sortir de la configuration
			//Api.getPendingSessionFrom(dayjs());
		} else {
			console.log("%cVotre numéro d'utilisateur openclassrooms n'a pas ete renseigné dans la configuration vous ne pourrez pas utiliser la collecte automatique d'information", APP_ERROR_STYLE);
		}
		* */
		
		//Api.forge(7688561); // pour le bien devrait sortir de la configuration
		//Api.getPendingSessionFrom(dayjs());
		
		
		//dayjs.extend(dayjs_locale_fr);
		// https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/localeData.min.js
		if (document.querySelector(".panel.menuBar.flex.draggable") === null){
			UI.init();
		}
				
		// patch current UI
		// 1-
		Facturier._addHeader();
		// 2-
		Facturier._applyInjectionOnPathNameMutation();
		
		// 3 - Add element on menu
		//// Select all element with no role only one
		
		// le menu s'affiche plus tard ça ne va pas fonctionner aussi simplement
		// TODO corriger la partie svg qui ne s'affiche pas quand bien meme elle est presente
		console.log(`%cWait for side menu to add element to it`, APP_DEBUG_STYLE);
		sCSSObserved = 'nav:not([role])'
		document.arrive(sCSSObserved, Facturier._addLinkToMenu);
		
		//// Patch to add new tbl
		/*
		if( db.get("meta").value() === undefined) {
			console.log("%cDb dont' contain meta table create it", APP_DEBUG_STYLE);
			db.assign({meta:[]}).write();
		}
		*/
		// DB Management
		//check Database version (need corresponding app version)
		//console.log("%cCheck DB version to find anyupdate to do", APP_DEBUG_STYLE);
		let sDbVersion = Meta.getDbVersion();
		if (semverCompare(GM.info.script.version, sDbVersion) == 1 ){ // version of script is superior of version of db
			console.log(`%cDB is in version: ${Meta.getDbVersion()} need to go to version ${GM.info.script.version}`, APP_DEBUG_STYLE);
			//// dbUpdate();
			Dbase.update(GM.info.script.version);
		}
		// will serve in next version
		fetchInject(
			['https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js']
		).then( async function (e) {
			console.log('%cALPINE js fetched', APP_DEBUG_STYLE)
			}
		);

		// inject
		fetchInject(
			[
			'https://unpkg.com/htmx.org@1.1.0',
			'https://unpkg.com/htmx.org@1.1.0/dist/ext/debug.js'
			]
		).then( async function (e) {
			//console.log('%cHTMX fetched', APP_DEBUG_STYLE);
			
			//htmx.logAll();
			/*
			htmx.defineExtension('get-dirty', {
				onEvent: function (name, evt) {
				if (name === "htmx:configRequest") {
					console.log("%cPatched htmx htmx:configRequest", APP_DEBUG_STYLE);
					//evt.detail.headers['Content-Type'] = "application/json";
					}
				
				if (name === "htmx:loadstart") {
					console.log("%cPatched htmx htmx:loadstart", APP_DEBUG_STYLE);
					xhr.addEventListener("abort", function(){console.log("Patched Abort", APP_WARN_STYLE)});
					xhr.abort();
					}
				},
				
			});
			
			htmx.defineExtension('stt-get', {
				onEvent: function (name, evt) {
					if (name === "htmx:afterProcessNode") {
						console.log("%cExtension 'stt-get' htmx htmx:afterProcessNode", APP_WARN_STYLE);
						//evt.detail.headers['Content-Type'] = "application/json";
					
					}
				
					if (name === "htmx:beforeRequest") { 
						console.log("%cExtension 'stt-get' htmx htmx:beforeRequest", APP_WARN_STYLE);
						htmx.ajax('GET', 'http://127.0.0.1/views/dummy.html', '#myDiv');
					}
				}
			});
			*/
			
			// htmx broker
			htmx.on("htmx:configRequest", function(evt){
				//console.log("%cBroker htmx:configRequest event received", APP_DEBUG_STYLE);
			});
			htmx.on("htmx:beforeRequest", function(evt){
				//console.log("%cBroker htmx:beforeRequest event received", APP_DEBUG_STYLE);
				/*
				 * i first try to use xhr.abort() but it won't works 
				 * think it was already started
				 */
				if (evt.detail.pathInfo.finalPath 
					&& getFileExtension(evt.detail.pathInfo.finalPath) 
					!== "html"){
					//console.log("%cIntercept path without .html need to route it to function", APP_DEBUG_STYLE);
					//console.log(`%cWanna load ${evt.detail.pathInfo.finalPath}`, APP_DEBUG_STYLE);
					evt.detail.xhr.addEventListener("abort", function(){/*console.log("%cGLOBAL Patched Abort Function used()", APP_WARN_STYLE)*/}); // trace
					evt.detail.xhr.onloadstart = function(e){
							this.abort();
							//console.log("%cGLOBAL Patched onloadstart is set", APP_DEBUG_STYLE);
							} // patch on load start to autocancel
					let sHtml = View.load(evt.detail.pathInfo.finalPath);
					let oTarget = evt.detail.target
					
					// if target a node
					
					//console.log(evt.detail);
					//console.log(evt.detail.elt.getAttribute('hx-select'));
					
					var sTargetSelect = evt.detail.elt.getAttribute('hx-select');
					
					if(sTargetSelect){
						let oDom = new DOMParser().parseFromString(sHtml, "text/html"); 
						oNode = oDom.querySelector(sTargetSelect);
						if(oNode){
							//console.log(`%cfound not ${sTargetSelect} in data received from calling ${evt.detail.pathInfo.finalPath}`, APP_DEBUG_STYLE);
							sHtml = oNode.outerHTML;
						} else
						{
							console.log(`%cWanna select target ${sTargetSelect} in data received from calling ${evt.detail.pathInfo.finalPath} but this node could'nt be found so return the whole string`, APP_ERROR_STYLE);
						}
					}
					
					//console.log(sHtml);
					/*
					 * appendFromHtmlStr
					 *  sHtml {string}  HTML to add
					 *  oDom  {object}  Node to add HTML to
					 *  return {object} Last inserted child
					 */
					 var appendFromHtmlStr = function(sHtml, oDom){
							var  range = document.createRange();
							var  fragment = range.createContextualFragment(sHtml);
							//console.log(fragment);
							for (var  i = fragment.childNodes.length - 1; i >= 0; i--) {
								var child = fragment.childNodes[i];
								oDom.appendChild(child);
								//console.log("appending to dom");
								htmx.process(child);
							}
							return oDom.lastChild;
						}
					appendFromHtmlStr(sHtml, evt.detail.target);
				}
			});
			
			htmx.on('htmx:xhr:loadstart' , function(evt){
				//console.log("%cBroker htmx:xhr:loadstart event received", APP_DEBUG_STYLE);
				// ne contient aucune reference sur xhr
			});

		}); // end of htmx injection
		
		// inject
		fetchInject(
			['https://cdn.jsdelivr.net/npm/sweetalert2@10']
		).then( async function (e) {
			console.log('%cSweetAlert fetched', APP_DEBUG_STYLE)
			}
		);
		
		
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
			let aDependencies = sDependencies.split(','); // always return one element even if separator not found
			//console.log(rDependencies, typeof(rDependencies));
			
			if (aDependencies.length !== 0){
				console.log(`%cWanna inject Custom CSS from URL:${aDependencies}`, APP_DEBUG_STYLE);
				fetchInject(aDependencies).then(() => {
					console.log(`%cCustom CSS from URL:${aDependencies} loaded`, APP_DEBUG_STYLE);
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

		/* exportation des fonctions requises pour dbgmode*/
		unsafeWindow.Facturier = {libs:[],cfg:{dbase:null},klass:[]}
		unsafeWindow.Facturier.cfg.dbase = Facturier.Cfg.dbase; // const dbase = unsafeWindow.Facturier.cfg.dbase
		unsafeWindow.Facturier.libs.push({id:'fetchInject',ptr:fetchInject});
		unsafeWindow.Facturier.libs.push({id:'dayjs',ptr:dayjs});  // unsafeWindow.Facturier.libs.find(o => o.id == 'dayjs').ptr pour le retrouver
		unsafeWindow.Facturier.klass.push({id:'Student',ptr:Student}); // const Student = unsafeWindow.Facturier.klass.find(o => o.id == 'Student').ptr student is not imported so couln't use it without import
		unsafeWindow.Facturier.klass.push({id:'Session',ptr:Session});
		unsafeWindow.Facturier.klass.push({id:'Archive',ptr:Archive});
		unsafeWindow.Facturier.klass.push({id:'History',ptr:History});
		unsafeWindow.Facturier.klass.push({id:'StudentHistory',ptr:StudentHistory});
		unsafeWindow.Facturier.klass.push({id:'Ref',ptr:Ref});
		// -- not mentionned but needed for some functions in views
		unsafeWindow.Facturier.klass.push({id:'Dbase',ptr:Dbase});
		unsafeWindow.Facturier.klass.push({id:'Meta',ptr:Meta});
		unsafeWindow.Facturier.klass.push({id:'Ref',ptr:Ref});
		unsafeWindow.Facturier.klass.push({id:'Api',ptr:Api});
		//console.log("%cImportants values are exported in unsafeWindow.Facturier", APP_DEBUG_STYLE);   
		
		// libs
		unsafeWindow.Facturier.libs.push({id:'NProgress',ptr:NProgress});// unsafeWindow.Facturier.libs.find(o => o.id == 'NProgress').ptr pour le retrouver
		SandBox_Google.test_1();
		unsafeWindow.Facturier.klass.push({id:'SandBox_Google',ptr:SandBox_Google});// unsafeWindow.Facturier.libs.find(o => o.id == 'NProgress').ptr pour le retrouver
		
		
		
		
		//
if(STT_VERSION) {    
		document.body.appendChild(document.createElement('div')).innerHTML='<iframe id="temoin" style="display:none"></iframe>'; 
		console.groupCollapsed('liste de variable de la page');
		Object.keys(window).filter(a=>!(a in window.frames[window.frames.length-1])).sort().forEach((a,i)=>console.log(i,a,window[a])); 
		document.body.removeChild(document.querySelector('#temoin').parentNode); 
		console.groupEnd();
}
		//
		
		
		unsafeWindow.Facturier.libs.push({id:'Moise',ptr:moize});// unsafeWindow.Facturier.libs.find(o => o.id == 'NProgress').ptr pour le retrouver
		 
		// ici toute l'idée est de verifier que le fichier d'install contient src ou dist ... s'il contient source alors, on doit utiliser en sus les ressources locales
		// sinon on est sur la version livrée et donc on a tout déjà dans le script de base qui a été build
		// probleme avec CORS
		// visiblement en tout cas sur chrome l'url n'est pas bien prise en compte par le paramètre du script
		// @update et @download semblent sans incidences sur ce que l'on trouve dans l'onglet paramètres
		// dit autrement le positionner à la main dans l'éditeur de script permet de déclencher ce mode local sans toutefois 
		// changer le paramètre dans le header ce qui est bien preatique
		
		if (GM.info.script.downloadURL === "http://localhost:8000/dist/app-facturier.iife.js") {
			 console.log("%cALERTE .... version locale !!!!!! ", "background-color:coral;color:white");
			//Facturier.overrideDebug();
			console.log("%c test readfile", APP_DEBUG_STYLE);
			readFile('file:////media/pwyll/USB120Go/DevStt/UserScripts/SttAddon/src/update_data_base.js', function(_res){console.log(_res);}); 
			Facturier.loadDependencies();
		} else {
			console.log(`%c GM.info.script.downloadURL url : ${GM.info.script.downloadURL}`, APP_DEBUG_STYLE);
		}		
	
	},
	// add an option to oc menu to show hide the bar
	_addLinkToMenu: function(){
		console.log(`%cSide menu will be added`, APP_DEBUG_STYLE);
		document.unbindArrive(Facturier._addLinkToMenu);
		
		// provisoire eviter double chargement
		
		if (document.querySelector("ul.Facturier__Menu-header") !== null){
			console.log(`%cDirty Check no double launch`, APP_DEBUG_STYLE);
			return ;
		}
		
		
		try{
			let oMenu = document.querySelectorAll('nav:not([role])')[0];
			// clone last li node from ul child list
			let oCloneLI = oMenu.children[0].lastChild.cloneNode(true); // li element contain an a element
			oCloneLI.firstChild.innerText = "Facturier";
			elMenu = document.querySelector('.panel.draggable');//.setAttribute('style','display:show')
			// https://stackoverflow.com/questions/5003867/how-to-call-javascript-function-instead-of-href-in-html/25649344
			// https://stackoverflow.com/questions/33533010/how-to-make-an-anchor-tags-href-invoke-an-anonymous-function
			oCloneLI.firstChild.href = "javascript::void(0);";
			oCloneLI.firstChild.onclick = function(e){ e.preventDefault();e.stopPropagation();elMenu = document.querySelector('.panel.draggable');elMenu.style.display = (elMenu.style.display != 'block') ? 'block' : 'none';};
			// ajouter les sous elements non copies avec le clone ... le svg et les deux span
			let el =  oMenu.children[0].lastChild.firstChild; // pointe sur le <a href"">
			oCloneLI.firstChild.appendChild(el.children[0].cloneNode(true)); // to have path which is a subnode
			oCloneLI.firstChild.appendChild(el.children[1].cloneNode(false));
			oCloneLI.firstChild.appendChild(el.children[2].cloneNode(false));
			//oMenu.appendChild(oClone);
			/*
			let oCloneUL = oMenu.children[0].cloneNode(true);
			while( oCloneUL.hasChildNodes() ){
				oCloneUL.removeChild(oCloneUL.lastChild);
			}
			* */
			let oCloneUL = oMenu.children[0].cloneNode(false);
			oCloneUL.appendChild(oCloneLI);
			oCloneUL.classList.add('Facturier__Menu-header');
			oMenu.appendChild(oCloneUL);
			console.log(`%cSide menu will added`, APP_DEBUG_STYLE);
		} catch(e){console.log('%cInjecting menu encounter an error: %o',APP_ERROR_STYLE, e)};
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
	

}
if (window.Facturier !== undefined){
	window.Facturier.start();
} else {
	Facturier.start();
}
export default Facturier;
export * from './constants.js';
