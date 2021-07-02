/**
 * 
 */
 
import {
	APP_DEBUG_STYLE, 
	APP_ERROR_STYLE 
} from './constants.js';
import './polyfills.js';
import { waitForRetry } from './helpers.js';
import{
	about,
	addCbox,
	billInDetails,
	collectAuto,
	collectChecked,
	debugMode,
	pdf,
	mgtDbase,
	razDbase,
	sandbox,
	showBill,
	statistics,
} from './do.js';

import Student from './students.js';
/*
import {
	popup_students,
	
} from './sandbox.js';
*/ 
class UI {
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	static init = function(){
		console.log('%cin initUI',APP_DEBUG_STYLE);
		UI.build();
		var draggie = new Draggabilly('.draggable', {handle: '.handle'});
		/* plus utilisé
		if(GM_config.get('hackheaderzindex') === true){
			FpsTracker.start('animation-target'); // mettre le fps tracker dans la fonction ne sert à rien, puisque l'écran se gèle tout au plus je pourrais assortir ce point rouge d'un affichage oui ou non en configuration
		}
		*/
	};

	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	static build = function(){
		// NOTE: check with new Promise function
		console.log('%c in buildUI','background-color:green;color:white');
		// bonne pratique ? https://piccalil.li/quick-tip/flow-utility/
		GM_addStyle(`
.flow > * + * {
  margin-top: var(--flow-space, 1em);
}
		`);
		//GM_addStyle('.flex > * { margin: 0 10px; }');
		//GM_addStyle('.flex > * { margin: 2px 1px; }');
		//GM_addStyle('.flex > :first-child { margin-left: 0; }');
		//GM_addStyle('.flex > :last-child { margin-right: 0; }');
		GM_addStyle('.panel {/* because of stacking context : https://stackoverflow.com/questions/5218927/z-index-not-working-with-fixed-positioning */position: relative;z-index: 666; /*seems that 4 is good*/}');
		//GM_addStyle('.menuBar {border-top: 1px solid; padding: 10px; font-size: 1rem; pointer-events: inherit;position: relative;top:0px;  flex-flow: row wrap;/*align-content: space-between;justify-content: space-between;*/}');
		GM_addStyle('.menuBar {padding:7px;/*for handler*/font-size: 1rem; pointer-events: inherit;}');
		GM_addStyle('.draggable {background: transparent;border-radius: 10px;padding: 20px;}');
		GM_addStyle('.draggable.is-pointer-down {background: #09F;}');
		GM_addStyle('.draggable.is-dragging { opacity: 0.7; }');
		GM_addStyle('.handle {background: #555;background: hsla(0, 0%, 0%, 0.4);width: 20px;height: 20px; border-radius: 10px; position: relative; top:10px; left:-10px;}');
		/* https://stackoverflow.com/questions/29732575/how-to-specify-line-breaks-in-a-multi-line-flexbox-layout */
		//GM_addStyle('.flex > :nth-last-child(2) {page-break-after: always; /* CSS 2.1 syntax */break-after: always; /* New syntax */}');
		/* FPS */
		//GM_addStyle('#animation-target {width: 10px;height: 5px;background-color:coral;border-radius: 25%;}');
		// nouvelle barre de menu https://smolcss.dev/#smol-document-styles 
		GM_addStyle(`
.menuBar{
/*Smol Responsive CSS Grid*/
--min: 15ch;
--gap: 1rem;
display: grid;
grid-gap: var(--gap);
/* min() with 100% prevents overflow
in extra narrow spaces */
grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min)), 1fr)); /* 20 px is size of handle*/ 
}
		`);

		// create menu bar
		var elMenu = document.createElement('div');
		var elHandle = document.createElement('div');
		elHandle.classList.add('handle');
		elMenu.appendChild(elHandle);
		elMenu.classList.add('panel', 'draggable');
		//document.body.appendFirst(elMenu);
		/* en date de juin 2021 ajoute cet élément en second apres la
		 *  barre de menu soit en dernier apres ,#mainContentWithHeader
		 * le seul soucis c'est que ça génère des bugs en chaine
		 * un probleme avec arrive
		 * un probleme avec la barre qui n'est plus draggable
		 * le plus simple sera je crois de le mettre en fin de doc
		 * et de le remonter en haut de la page en modifiant le style top a moins la hauteur de la page
		 * 
		 * */
			/* try to achieve it 5*1 sec */
		/*
			waitForRetry(
				()=>document.querySelector('#mainContentWithHeader') !== null,
				//()=>document.querySelector('#mainContentWithHeader').insertAdjacentElement('beforeend', elMenu),
				//()=>document.querySelector('#mainContentWithHeader').insertBefore(elMenu, document.querySelector('#mainContentWithHeader').children[1]), // permet d'avoir le menu en dessous de la barre de menu
				()=>document.querySelector('#mainContentWithHeader').firstChild.insertAdjacentElement('beforeend', elMenu), // permet d'avoir le menu en dessous de la barre de menu mais fixed 
				1000,
				5
			);
		try {
			document.querySelector('draggable');
		}
		catch (e){
			console.error("%c#mainContentWithHeader not found FACTURIER UI could'nt be shown right place", APP_ERROR_STYLE); 
			document.body.appendFirst(elMenu);
		}
		*/
		document.body.insertAdjacentElement('beforeend', elMenu);
		elMenu.setAttribute('style', `top:-${document.body.offsetHeight - elMenu.offsetHeight}px`); // set it to top
		
		var elMenuContent = document.createElement('div');
		elMenuContent.classList.add('menuBar');
		elMenu.appendChild(elMenuContent);
		//addButton('getStudents', getStudents, {},div);
		//UI.addButton('addCbox', addCbox, {},div);
		UI.addButton('collectChecked', collectChecked, {}, elMenuContent);
		UI.addButton('CollectAuto', collectAuto, {}, elMenuContent);
		UI.addButton('showBill', showBill, {}, elMenuContent);
		//addButton('HideCookies', hideCookies, {},div);
		//addButton('Fetch', fetchG, {},div);
		UI.addButton('billInDetails', billInDetails, {}, elMenuContent);
		UI.addButton('PDF', pdf, {}, elMenuContent);
		UI.addButton('SList', Student.showList, {}, elMenuContent);
		UI.addButton('DbgMode', debugMode, {}, elMenuContent);
		UI.addButton('statistics', statistics, {}, elMenuContent);
		UI.addButton('Database', mgtDbase, {}, elMenuContent);
		if(STT_VERSION) {
			UI.addButton('Sandbox', sandbox, {}, elMenuContent);
		} // STT_VERSION is modified by build script in FALSE or TRUE
		UI.addButton('about', about, {},elMenuContent);
		/* just a little anchor for all pop*/
		let el = document.createElement('div'), elStyle = el.style;
		el.id = "sttPlaceHolder";
		let cssObj = {position: 'absolute', bottom: '7%', left:'4%', 'z-index': 999, 'display' :'hidden'};
		//div.appendChild(el);
		// ajoute cet élément avant la fin
		document.body.insertAdjacentElement('beforeend', el);
		Object.keys(cssObj).forEach(key => elStyle[key] = cssObj[key]);
		/* FPS Tracker */
		/*
		if(GM_config.get('hackheaderzindex') === true){
		var fpstracker = document.createElement('div');
			fpstracker.id = "animation-target";
			elMenu.appendChild(fpstracker);
		}
		*/
    };

    static addButton = function (text, onclick, cssObj, el) {
		el = el || document.body;
		cssObj = cssObj || {position: 'absolute', bottom: '7%', left:'4%', 'z-index': 3};
		let button = document.createElement('button'), btnStyle = button.style
		button.classList.add('button--primary', 'button');
		el.appendChild(button);
		button.innerHTML = text;
		button.onclick = onclick;
		//btnStyle.position = 'absolute';
		Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
		return button;
    };
	
}

 // https://stackoverflow.com/questions/4787431/check-fps-in-js
 // https://github.com/darsain/fpsmeter/ génial mais too much pour moi ici
 // voir aussi https://github.com/pailhead/three-fps-counter qui utilise un bout de code de https://github.com/mrdoob/stats.js/
 

export class FpsTracker {
	
	static start = function (id) {
	   const element = document.getElementById(id);

	   const moveTo = (xCoord) =>
	   (element.style.transform = `translateX(${xCoord}px)`);

	   let xCoord = 0;
	   const delta = 7;

	   const slideRight = (timestamp) => {
		   moveTo(xCoord);
		   xCoord += delta;

		   if (xCoord > 100) {
			   requestAnimationFrame(slideLeft);
		   } else {
			   requestAnimationFrame(slideRight);
		   }
	   };

	   const slideLeft = (timestamp) => {
		   moveTo(xCoord);
		   xCoord -= delta;

		   if (xCoord < -100) {
			   requestAnimationFrame(slideRight);
		   } else {
			   requestAnimationFrame(slideLeft);
		   }
	   };

	   return requestAnimationFrame(slideRight);
   };
   
   static stop = function(animationId){
	   window.cancelAnimationFrame(animationId);

   }    
};

export default UI;
