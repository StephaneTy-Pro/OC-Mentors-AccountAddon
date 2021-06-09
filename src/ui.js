/**
 * 
 */
 
import {APP_DEBUG_STYLE} from './constants.js';
import './polyfills.js';
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
		if(GM_config.get('hackheaderzindex') === true){
			FpsTracker.start('animation-target'); // mettre le fps tracker dans la fonction ne sert à rien, puisque l'écran se gèle tout au plus je pourrais assortir ce point rouge d'un affichage oui ou non en configuration
		}
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
		//GM_addStyle('.flex > * { margin: 0 10px; }');
		GM_addStyle('.flex > * { margin: 2px 1px; }');
		GM_addStyle('.flex > :first-child { margin-left: 0; }');
		GM_addStyle('.flex > :last-child { margin-right: 0; }');
		GM_addStyle('.panel {display: flex; justify-content: center;z-index:999}');
		GM_addStyle('.menuBar {border-top: 1px solid; padding: 10px; font-size: 1rem; pointer-events: inherit;position: relative;top:0px;  flex-flow: row wrap;/*align-content: space-between;justify-content: space-between;*/}');
		GM_addStyle('.draggable {background: transparent;border-radius: 10px;padding: 20px;}');
		GM_addStyle('.draggable.is-pointer-down {background: #09F;}');
		GM_addStyle('.draggable.is-dragging { opacity: 0.7; }');
		GM_addStyle('.handle {background: #555;background: hsla(0, 0%, 0%, 0.4);width: 20px;height: 20px; border-radius: 10px;}');
		/* https://stackoverflow.com/questions/29732575/how-to-specify-line-breaks-in-a-multi-line-flexbox-layout */
		GM_addStyle('.flex > :nth-last-child(2) {page-break-after: always; /* CSS 2.1 syntax */break-after: always; /* New syntax */}');
		/* FPS */
		GM_addStyle('#animation-target {width: 10px;height: 5px;background-color:coral;border-radius: 25%;}');


		// create menu bar
		var div = document.createElement('div');
		var subDiv = document.createElement('div');
		subDiv.classList.add('handle');
		div.appendChild(subDiv);
		div.classList.add('panel', 'menuBar', 'flex', 'draggable');
		document.body.appendFirst(div);
		//addButton('getStudents', getStudents, {},div);
		//UI.addButton('addCbox', addCbox, {},div);
		UI.addButton('collectChecked', collectChecked, {},div);
		UI.addButton('CollectAuto', collectAuto, {}, div);
		UI.addButton('showBill', showBill, {},div);
		//addButton('HideCookies', hideCookies, {},div);
		//addButton('Fetch', fetchG, {},div);
		UI.addButton('billInDetails', billInDetails, {},div);
		UI.addButton('PDF', pdf, {}, div);
		UI.addButton('SList', Student.showList, {}, div);
		UI.addButton('DbgMode', debugMode, {}, div);
		UI.addButton('statistics', statistics, {}, div);
		UI.addButton('Database', mgtDbase, {}, div);
		//if(STT_VERSION) {UI.addButton('Sandbox', popup_students, {}, div);} // STT_VERSION is modified by build script in FALSE or TRUE
		if(STT_VERSION) {UI.addButton('Sandbox', sandbox, {}, div);} // STT_VERSION is modified by build script in FALSE or TRUE
		UI.addButton('about', about, {},div);
		/* just a little anchor for all pop*/
		let el = document.createElement('div'), elStyle = el.style;
		el.id = "sttPlaceHolder";
		let cssObj = {position: 'absolute', bottom: '7%', left:'4%', 'z-index': 999, 'display' :'hidden'};
		//div.appendChild(el);
		// ajoute cet élément avant la fin
		document.body.insertAdjacentElement('beforeend', el)
		Object.keys(cssObj).forEach(key => elStyle[key] = cssObj[key]);
		/* FPS Tracker */
		if(GM_config.get('hackheaderzindex') === true){
		var fpstracker = document.createElement('div');
			fpstracker.id = "animation-target";
			div.appendChild(fpstracker);
		}
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
