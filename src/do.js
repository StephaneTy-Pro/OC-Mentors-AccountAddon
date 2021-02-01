/**
 * 
 */
 
import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE, APP_PERF_STYLE,
	APP_NAME, APP_AUTHOR,
	SESSION_DONE,SESSION_CANCEL, SESSION_CANCEL_LATE, SESSION_STUDENT_AWAY,
	BILL_AUTOFUNDED, BILL_FUNDED, BILL_OTHER,
	TYPE_SESSION, TYPE_DEFENSE, TYPE_COACHING,
	OC_STATUS_0, OC_STATUS_1, OC_STATUS_2, OC_STATUS_3_M
	} from './constants.js';
import { _fetch, getKey, convertRowToDate } from './utils.js';
import {
	popupDateSelector,
	toastOk,
	tableSelector
	} from './components.js';
import Accounting from './accounting.js';
import Core from './core.js';
import History from './history.js'
import GMC from "./gmc.polyfills.js";
import Session from './sessions.js';
import Student from './students.js';
import Archive from './archives.js';
import List from './lists.js';
import { workday_count } from './date.lib.js';
import PDF from './pdf.js';
import Dbase from './dbase.js';

/**
 * 
 */ 
var about = async function(){
	var sHtml ="";
	// src https://ishadeed.com/article/css-variables-inline-styles/
	// a tester pour placer le about content au centre , mais ce n'est pas nécessaire car à priori c'est déjà le cas
	sHtml+='<style>div.about_content {background-color: #fed9ff;/*width: 600px;*/height: var(--heigth, 80%);overflow-x: hidden;overflow-y: auto;text-align: left;padding: 20px;}</style>';
	sHtml+='<div class="about_content" style="--heigth: 600px;">';
	sHtml+='<div class="about_content__wrapper">';
	const response = await GMC.XHR({
		method: 'GET',
		url: 'https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/README.md',
		responseType: 'text/html',
		//binary: true,
		headers: {
			"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
		},
	});

  
	var md = response.responseText;

	var converter = new showdown.Converter();
	var html = converter.makeHtml(md);

	sHtml+=html;
	sHtml+="</div>";
	sHtml+="</div>";

	Swal.fire({
		title: `<strong>A propos de ${APP_NAME}</strong>`,
		icon: 'info',
		html: sHtml,
		showCloseButton: true,
		//showCancelButton: true,
		focusConfirm: false,
		position: 'center-start',
		grow: 'fullscreen',
	});
}
/**
 * 
 */
var addCbox = function(){
	var sPath ="table.crud-list tbody"
	var sessions = document.querySelector(sPath)// le All me retourne aussi le tableau des étudiants
	var bChecked = false;
	//console.log(`the sessions are ${sessions}`);
	if (sessions.querySelector("[type=checkbox]") === null) {
		for (const el of sessions.children) {
			//console.log(el.children[0].innerText)
			var id = getKey(el.children[0]);
			var inputElem = document.createElement('input');
			inputElem.type = "checkbox";
			inputElem.name = "name";
			inputElem.value = id;
			inputElem.id = "id";
			//console.log(el);
			//console.log(id);
			bChecked = Session.exists(id);
			//console.log(`is the session with id ${id} in db ? ${bChecked}`);
			if (bChecked === true) inputElem.checked = true;
			var td = document.createElement('td');
			td.style = "text-align: center";
			td.appendChild(inputElem);
			el.appendChild(td);
		}
		// ajout d'une case selectionner tout
		sPath ="table.crud-list thead tr";
		var el = document.querySelector(sPath)
		inputElem = document.createElement('input');
		inputElem.type = "checkbox";
		inputElem.name = "name";
		inputElem.value = "value";
		inputElem.id = "id";
		inputElem.onclick = function (){document.querySelectorAll("tbody input[type=checkbox]").forEach( e => e.checked = !e.checked);}
		inputElem.style = "visibility: hidden;"
		var label = document.createElement('label');
		label.innerText = "in DB";
		label.style="display:block;";
		label.onMouseOver="this.style.cursor=pointer;";
		label.onMouseOut="this.style.cursor=auto;";
		label.appendChild(inputElem);
		td = document.createElement('td');
		td.style = "text-align: center";
		//td.appendChild(inputElem);
		td.appendChild(label);//td.appendChild(inputElem);
		el.appendChild(td);
	} else {
		var _t = sessions.querySelectorAll("[type=checkbox]"); // NOTESTT could be CPU Consumer ? so by precaution define it here
		var i = _t.length, aChkBox = new Array(i);for(; i--; aChkBox[i] = _t[i]); // NOTESTT those two lines are more optimized than ? var aChkBox = Array.prototype.slice.call(_t)
		for(var v in aChkBox){
			bChecked = Session.exists(aChkBox[v].value);
			//console.log(`is the session with id ${aChkBox[v].value} in db ? ${bChecked}`);
			if (bChecked === true){
				aChkBox[v].checked = true;
			} else {
				aChkBox[v].checked = false;
			}
		}
	}
}
    /**
     * 
     */
    /*var hiChecked = async function(){
        var sPath = "table.crud-list tbody input:checked"
        var cb = document.querySelectorAll(sPath);
        for (var i = 0; i < cb.length; i+=1) {
            var oEl = cb[i].parentElement.parentElement;
            var me = parseTable(oEl);
            //console.log(`Wanna add a new checkbox content ${me.id}`);
            await addSessionsToDbase(me);
        }
        Swal.fire({
            position: 'top-end',
            icon: 'info',
            toast: true,
            title: "Collecte des sessions cochées\nCollecte terminée",
            showConfirmButton: false,
            timer: 1500
        });
    } */ 
 
/**
 * 
 */
var billInDetails = async function(){
	
	var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
	let _r = List.getListDetailBill(dtFrom,dtTo);
	let sHtml="";
	sHtml += "<table>";
	sHtml+="<thead>";
	sHtml+="<tr><th>Quand</th><th>Qui</th><th>Financé ?</th><th>Type</th><th>Niveau</th><th>Ancien Mode ?</th><th>Statut</th><th>PU HT</th><th>Cumul</th></tr>";
	sHtml+="<thead>";
	sHtml+="<tbody>";

	for (let _i = 0; _i < _r.length; _i += 1) {
		sHtml+="<tr>";
		sHtml+=`<td>${dayjs(_r[_i].when).format("DD/MM/YYYY à HH:mm:ss")}</td>`;
		sHtml+=`<td>${_r[_i].who_name}</td><td>${_r[_i].funding }</td>`;
		sType = _r[_i].type ;
		if (_r[_i].path != undefined && _r[_i].path.toLowerCase() === '158-trouvez-lemploi-qui-vous-correspond' && _r[_i].type !== 'soutenance') sType = "Coaching";
		sHtml+=`<td>${sType}</td><td>${_r[_i].lvl}</td>`;
		sHtml+=`<td>${_r[_i].oldMode === true ? "Oui" : "Non" }</td>`;
		sHtml+=`<td>${_r[_i].status}</td>`;
		sHtml+=`<td>${_r[_i].iPu}</td><td>${_r[_i].iCumul}€</td>`;
		sHtml+="</tr>";
	}
	sHtml+="</tbody>";
	sHtml+="</table>";

	Swal.fire({
		title: `<strong>Liste détaillées des sessions du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
		icon: 'info',
		html: sHtml,
		showCloseButton: true,
		//showCancelButton: true,
		focusConfirm: false,
		position: 'center-start',
		grow: 'fullscreen',
		onOpen: (el) => {
			var myTable = el.querySelector("table");
			var dataTable = new simpleDatatables.DataTable(myTable);
		},
	});

}  
/*
 * 
 * name: collectAuto
 * @param
 * @return
 * 
 */
var collectAuto = async function (){

	var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
	//console.log(`wanna fetch history between ${dtFrom.format()} and ${dtTo.format()} searching in page ${pg} of history`);
	// check if first line is after start of parsing date data
	// don't load next page if date of last line is before start date of data
	let iRecurse = 0;
	let iMaxRecurse = GM_config.get('maxfetchpg');
	let bBrowse = true;
	var res = {};
	let data = [];
	let pg=1;
	
	// -> check in private database session-history-cache the value of date from to accelerate page 
	let _r = History.getSameOrNearestSessionPage(dtTo); // as we go from present to past in history
	if (_r !== undefined && _r.page > pg){
		pg = _r.page; // advance to that page
	}
	
	while(bBrowse){
		//console.log(`iRecurse > iMaxRecurse ? ${iRecurse} > ${iMaxRecurse} = ${iRecurse > iMaxRecurse}`,APP_LOG_STYLE);
		if (iRecurse > iMaxRecurse) {
			console.warn("%cEMERGENCY EXIT LOOP",APP_WARN_STYLE);
			break; // emergency exit
		}
		try {
			res = await _historyFetch(dtFrom, dtTo, pg, data);
		}catch(e){
			console.error(`%c IRRECOVERABLE ERROR ... ${e}, will exit !!!! `, APP_ERROR_STYLE);
			throw new Error(); // exit js https://stackoverflow.com/questions/550574/how-to-terminate-the-script-in-javascript
		} 
		//console.dir(res);console.log(res.length);
		//Si la dernière ligne du tableau est plus récente que la date de bébut arrête
		if(res.length>0 && dayjs(res[res.length-1].when).isSameOrBefore(dtFrom) === true){
			bBrowse = false;
		}
		
		pg+=1
		iRecurse+=1
	}

	GM_addStyle('.ldBar path.mainline{stroke-width:10;stroke:#09f;stroke-linecap:round}');
	GM_addStyle('.ldBar path.baseline{stroke-width:14;stroke:#f1f2f3;stroke-linecap:round;filter:url(#custom-shadow)}');
	let sHtml = '<div id="pbar" class="ldBar label-center" data-value="0" data-path="M0 0 L200 0 L200 1"></div>';
	
	// voir ici si on peut mettre directement dans le div le code pour ne pas avoir de progression, lors du set (equivalent de false dans le set)
	/* https://loading.io/progress/
	 * data-duration	bar animation duration.
data-transition-in	animate the bar for entering transition, when value is set by data-value.
	 */
	
	var cb = res.length
	
	Swal.fire({
		title: 'Traitement en cours!',
		html: sHtml,
		confirmButtonText: 'Lovely!',
		onBeforeOpen: function(modal){
			//console.log('on before open.');
			//console.log(document.getElementById('pbar'));
			var bar = new ldBar("#pbar");
			//console.log(bar);
		},
		onRender: function(modal){
			//console.log('onRender');   
			//console.log(document.getElementById('pbar'));
		},
		onOpen: async function(modal){
			//console.log('onOpen');
			//console.log(document.getElementById('pbar'));
			var bar = document.getElementById('pbar').ldBar;
			for(var i in res){
				if(dayjs(res[i].when).isBefore(dtFrom, "day") === true){
					break;
				}
				if(dayjs(res[i].when).isAfter(dtTo, "day") === true){
					bar.set( (i / cb) * 100, false);
					//await sleep(1);// pause need here else no count was shown NOTESTT je pense qu'il s'agit plus d'un probleme de plugin qui s'update pas en temps réel mais avec animation
					continue;
				}
				if(dayjs(res[i].when).isBetween(dtFrom, dtTo, 'day','[]')){
					await Session.add(res[i]);
					bar.set( (i / cb) * 100, false);
					//await sleep(1);// pause need here else no count was shown
				}
			}
			bar.set(100, false);
			Swal.getTitle().innerText = "Traitement terminé !"
		},
		onClose: function(modal){
			//console.log(".....onClose");
		},
		onAfterClose: function(modal){
			//console.log("......onAfterClose");
		},
		onDestroy: function(modal){
			//console.log(".......onDestroy");
		}, 
	});

/*
	for(var i in res){
		if(dayjs(res[i].when).isBefore(dtFrom, "day") === true){
			Swal.fire({
				position: 'top-end',
				icon: 'info',
				toast: true,
				title: "Collecte des sessions\nCollecte terminée",
				showConfirmButton: false,
				timer: 1500
			});
			//console.log("BEFORE START");
			//console.log(`session with id ${res[i].id} date: ${dayjs(res[i].when).format("DD/MM/YYYY")} is before ${dtFrom.format("DD/MM/YYYY")} don't add it to database but continue parsing`);
			break; // if current data date is before end of filtered period STOP (rember that we are in antichronological order)
			//continue;
		}
		if(dayjs(res[i].when).isAfter(dtTo, "day") === true){ //NOTE STT be careful about hours exemple : session with id 514515 date: 2020-05-31T23:00:00+02:00 is after 2020-05-31T00:00:00+02:00 don't add it to database but continue parsing === true
			//console.log("NOT AFTER END");
			//console.log(`session with id ${res[i].id} date: ${dayjs(res[i].when).format()} is after ${dtTo.format()} don't add it to database but continue parsing === ${dayjs(res[i].when).isAfter(dtTo)}`);
			continue;    // if current data date is not after start of filtered period CONTNUE (rember that we are in antichronological order)
		}
		if(dayjs(res[i].when).isBetween(dtFrom, dtTo, 'day','[]')){
			//console.log(`session with id ${res[i].id} date: ${dayjs(res[i].when).format("DD/MM/YYYY")} is between ${dtFrom.format("DD/MM/YYY")} ${dtTo.format("DD/MM/YYYY")} add it to database`);
			await Session.add(res[i]);
		}
	}
*/
	addCbox(); // addCbox on
	//toastOk("Collecte automatique terminée");
}

/*
 * 
 * name: collectChecked
 * @param none
 * @return none
 * 
 */    
var collectChecked = async function(){
	var sPath = "table.crud-list tbody input:checked"
	var cb = document.querySelectorAll(sPath);
	// show progressbar 
	// working with https://codepen.io/stephane_ty/pen/LYNjvew?editors=1111
	// voir aussi https://codepen.io/loadingio/pen/yLNOWPq
	// voir aussi https://codepen.io/loadingio/pen/vYOGwLO
	//let sHtml = '<div id="container" style="margin: 20px;width: 400px;height: 8px;position: relative;"></div>';
	/* custom css for stroke */
	GM_addStyle('.ldBar path.mainline{stroke-width:10;stroke:#09f;stroke-linecap:round}');
	GM_addStyle('.ldBar path.baseline{stroke-width:14;stroke:#f1f2f3;stroke-linecap:round;filter:url(#custom-shadow)}');
	let sHtml = '<div id="pbar" class="ldBar label-center" data-value="0" data-path="M0 0 L200 0 L200 1"></div>';
	
	Swal.fire({
		title: 'Traitement en cours!',
		html: sHtml,
		confirmButtonText: 'Lovely!',
		onBeforeOpen: function(modal){
			//console.log('on before open.');
			//console.log(document.getElementById('pbar'));
			var bar = new ldBar("#pbar");
			//console.log(bar);
		},
		onRender: function(modal){
			//console.log('onRender');   
			//console.log(document.getElementById('pbar'));
		},
		onOpen: async function(modal){
			//console.log('onOpen');
			//console.log(document.getElementById('pbar'));
			var bar = document.getElementById('pbar').ldBar;
			for (var i = 0; i < cb.length; i+=1) {
				var oEl = cb[i].parentElement.parentElement;
				var me = Session.parseTable(oEl);
				//console.log(`Wanna add a new checkbox content ${me.id}`);
				await Session.add(me);
				bar.set( (i / cb.length) * 100, false);
				//await sleep(1);// pause need here else no count was shown
			}
			bar.set(100, false);
			if(Swal.getTitle()){//could have been closed
				Swal.getTitle().innerText = "Traitement terminé !";
			}
		},
		onClose: function(modal){
			//console.log(".....onClose");
		},
		onAfterClose: function(modal){
			//console.log("......onAfterClose");
		},
		onDestroy: function(modal){
			//console.log(".......onDestroy");
		}, 
	});
	/* mettre cette fonction casse tout le systeme ... SWAL global je suppose */
	//toastOk("Collecte des sessions cochées\nterminée");
}  
	  
/*
 * 
 * name: debugMode
 * @param none
 * @return none
 * 
 * Give access to a console
 * 
 */

var debugMode = function(){
	/*
	unsafeWindow.Session = Session;
	unsafeWindow.Student = Student;
	unsafeWindow.Archive = Archive;
	unsafeWindow.History = History;
	unsafeWindow.PDFLib = PDFLib;
	*/
	const d_dbase = unsafeWindow.Facturier.cfg.dbase;
	const d_dayjs   = unsafeWindow.Facturier.libs.find(o => o.id == 'dayjs').ptr
	const d_fetchInject   = unsafeWindow.Facturier.libs.find(o => o.id == 'fetchInject').ptr
	const d_Session = unsafeWindow.Facturier.klass.find(o => o.id == 'Session').ptr;
	const d_Student = unsafeWindow.Facturier.klass.find(o => o.id == 'Student').ptr;
	const d_History = unsafeWindow.Facturier.klass.find(o => o.id == 'History').ptr;
	const d_Archive = unsafeWindow.Facturier.klass.find(o => o.id == 'Archive').ptr;
	const d_StudentHistory = unsafeWindow.Facturier.klass.find(o => o.id == 'StudentHistory').ptr;
	console.log(`%cd_dbase, d_dayjs, d_Session, d_Student, d_History, d_Archive, d_StudentHistory are exported`,APP_DEBUG_STYLE);
	console.log("%cfor examples write all code after $>",APP_DEBUG_STYLE);
	console.group("%cd_dbase", APP_DEBUG_STYLE);
	console.log("example : get last session in db $>d_dbase.get(d_Session.tbl_name).last().value();");
	console.log("          get first student in db $>d_dbase.get(d_Student.tbl_name).first().value()");
	console.log("          or d_dbase.get(d_Student.tbl_name).get(0).value()");
	console.log("          get all sessions grouped by month/yyyy in db $>d_dbase.get(d_Session.tbl_name).groupBy( v => d_dayjs(v.when).format('MM/YYYY')).value()");
	console.log("          get all table $> d_dbase.value()");
	console.groupEnd();
	console.group("%cd_fetchInject", APP_DEBUG_STYLE);
	console.log("same as fetchInject libs : https://habd.as/code/fetch-inject/");
	console.groupEnd();
	console.group("%cd_dayjs", APP_DEBUG_STYLE);
	console.log("same as dayjs libs");
	console.groupEnd();
	console.group("%cd_Student", APP_DEBUG_STYLE);
	console.log("find a student by id ¤ d_Student.findById(STUDENT_ID, (DATE) ); // date is optionnal");
	console.groupEnd();
	console.group("%cd_Session", APP_DEBUG_STYLE);
	console.log("get a list of session ¤ d_Session.getBetween('2020-08-01','2020-08-31')");
	console.log("delete a session by id ¤ d_Session.deleteById(SESSION_ID);");
	console.groupEnd();
	console.group("%cSome combinated example", APP_DEBUG_STYLE);
	console.log("Delete last saved session :  d_Session.deleteById( d_dbase.get(d_Session.tbl_name).last().value().id ); ");
	console.log("Find all session between 01/08/2020 and 31/08/2020 :  d_dbase.get(d_Session.tbl_name).filter( v => d_dayjs(v.when).isSameOrBefore('20200831', 'day') && d_dayjs(v.when).isSameOrAfter('20200801', 'day')).value(); ");
	console.groupEnd();
	debugger;
}      

/*
 * 
 * name: inconnu
 * @param
 * @return
 * 
 */


    var _historyFetch = async function(dtFrom,dtTo,pg=1,data=[]){

        Swal.fire({
            position: 'top-end',
            icon: 'info',
            toast: true,
            title: "Collecte des sessions de l'historique\ndu "+dtFrom.format("DD/MM/YYYY")+" au "+dtTo.format("DD/MM/YYYY")+" \npage : "+pg+"\ncela peut prendre du temps...",
            showConfirmButton: false,
            timer: 3000
        });
        
        let oDom = null
        try {
			oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history?page=${pg}`, "table.crud-list tbody");
		} catch(e){console.error(`%c _historyFetch : ${e}`, APP_ERROR_STYLE);}
        /* Cette ligne est très sensible il arrive que la page se charge mal ce qui fait tout crasher oDom étant null*/
        if(oDom === null){
            throw (new Error(`Something went wrong could'nt collect anything from ${dtFrom.format('DD/MM/YYYY')} to ${dtTo.format('DD/MM/YYYY')} working on history page:${pg}.... try to navigate forward and backward or click some buttons to change url`));
        }
        // manage history
		let _from = convertRowToDate(oDom);
		let _to = convertRowToDate(oDom, -1);
		if (_from.get("month") != _to.get("month")) { /// est ce que l'on change de mois
		//let _z = _from.endOf("month");
		let _z = _to.endOf("month"); // la fin du mois de la période se trouve sur cette page
			History.addOrUpdateSessionPage(pg, _z);
		}
		if (_to.isAfter(dtTo, "day") === true) {
			console.log(`%cOptimization: oldest (last) data from page are at :${_to.format("DD/MM/YYYY")}, don't analyze what was before end date of extraction ${dtTo.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
			return data;
		} 
      
        /*
        if(convertRowToDate(oDom,-1).isAfter(dtTo,'day')===true) {
            console.log(`%cOptimization: oldest (last) data from page are at :${convertRowToDate(oDom, -1).format("DD/MM/YYYY")}, don't analyze what was before end date of extraction ${dtTo.format("DD/MM/YYYY")}`, APP_DEBUG_STYLE);
            return data;
        }*/
        for(var i = 0; i<oDom.children.length; i+=1){
            var row = oDom.children[i];
            //if first line is

            //if last line is
            //console.log(row);
            var me = Session.parseTable(row);
            //console.log(me);
            //data = _.merge(me, data); // Object.assign(data, me) ?  -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
            data.push(me);
        }
        return data;
    }      
    
	/**
	 * 
	 */
    var pdf = function(){
        const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

        async function modifyPdf() {
            // Fetch an existing PDF document
            const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

            // Load a PDFDocument from the existing PDF bytes
            const pdfDoc = await PDFDocument.load(existingPdfBytes)

            // Embed the Helvetica font
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

            // Get the first page of the document
            const pages = pdfDoc.getPages()
            const firstPage = pages[0]

            // Get the width and height of the first page
            const { width, height } = firstPage.getSize()

            // Draw a string of text diagonally across the first page
            firstPage.drawText('This text was added with JavaScript!', {
                x: 5,
                y: height / 2 + 300,
                size: 50,
                font: helveticaFont,
                color: rgb(0.95, 0.1, 0.1),
                rotate: degrees(-45),
            })

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const pdfBytes = await pdfDoc.save()

            // Trigger the browser to download the PDF document
            download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
        }

        // -- create

        async function createPdf() {
            const pdfDoc = await PDFDocument.create()
            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

            const page = pdfDoc.addPage()
            const { width, height } = page.getSize()
            const fontSize = 30
            page.drawText('Creating PDFs in JavaScript is awesome!', {
                x: 50,
                y: height - 4 * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0.53, 0.71),
            })

            const pdfBytes = await pdfDoc.save()
            download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
            }

		 async function createPdf2() {
			 
			var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));

			let _r = List.getListDetailBill(dtFrom,dtTo); 
         			 
			const pdfDoc = await PDFDocument.create()
			const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

			const page = pdfDoc.addPage()
			const { width, height } = page.getSize()
			const fontSize = 30
			page.drawText(`Prestations en détail \n\n du ${dtFrom.format('DD/MM/YYYY')} au ${dtTo.format('DD/MM/YYYY')}`, {
				x: 50,
				y: height /2 - fontSize,
				size: fontSize,
				font: timesRomanFont,
				color: rgb(116/255, 81/255, 235/255) // couleur bouton OC
			})
			let font_size = 12;
			let line_space = 1.25;
			let curPage = pdfDoc.addPage();

			//curPage.font_size = font_size;
			curPage.setFontSize(font_size);
			curPage.line_space = line_space;
			curPage.font = timesRomanFont;
			
			let curLine = 1;
			let iSizeOfFooter = 20;
			let iBottomPg = line_space * font_size + iSizeOfFooter;
			let iCurrentHeigth = height / 2;
			/* fonction qui tente de calculer un bon ratio ... je ne sais pas pourquoi je dois mettre 1.25 mais bon ... */
			const lorem_width = function(width2) {
				const needle = "LOrEm ipsum DOLor sit aMet, conSEc/tetUr 25 porttitor. ";
				return width2 * 1.0925 * (timesRomanFont.widthOfTextAtSize(needle, font_size) / needle.length);
			};
			//let _iWidth = [0, lorem_width(18), lorem_width(38), lorem_width(17), lorem_width(5), lorem_width(7), lorem_width(5), lorem_width(7)]; // le décompte de lettre sauf 2 eme colonne est le bon
			let _iStrMaxLength = [0, 18 , 36, 10, 13, 8, 5, 7];
			let _iWidth = [_iStrMaxLength[0], 
				lorem_width(_iStrMaxLength[1]),
				lorem_width(_iStrMaxLength[2]),
				lorem_width(_iStrMaxLength[3]),
				lorem_width(_iStrMaxLength[4]),
				lorem_width(_iStrMaxLength[5]),
				lorem_width(_iStrMaxLength[6]),
				lorem_width(_iStrMaxLength[7])]; // permet d"aérer mais le décompte de lettre n'est plus bon
			// j'ai 3 méthodes :  timesRomanFont.widthOfTextAtSize(string,int) ; timesRomanFont.heightAtSize(int) ; timesRomanFont.sizeAtHeight(int)

			let iLineHeigth = page.lineHeight;
			let iXStart = 25;
			for (let _l = 1; _l < _r.length; _l += 1) {
				iCurrentHeigth = height - line_space * font_size * curLine;
				// does i need to change page ?
				if (iCurrentHeigth < iBottomPg) {
					curLine = 1;
					curPage = pdfDoc.addPage();
					curPage.font = timesRomanFont;
					curPage.setFontSize(font_size);
					curPage.line_space = line_space;
					
					iCurrentHeigth = height - line_space * font_size * curLine;
					
				}
				// does i need to show header
				if(curLine === 1){
					let aHeader = ["","Quand","Qui","Financé","Type-Niv.","Statut","Pu","Cumul"];
					let iCurX = iXStart;
					curPage.moveTo( iCurX, iCurrentHeigth);
					for(let _i = 1; _i<aHeader.length; _i+=1){
						curPage.drawText(aHeader[_i], {x:iCurX});
						iCurX+=_iWidth[_i];
					}
					curLine += 1;
					iCurrentHeigth = height - line_space * font_size * curLine;
				}
				let iCurX = iXStart;
				curPage.drawText(dayjs(_r[_l].when).format("DD/MM/YYYY à HH:mm"), {
					font: timesRomanFont,
					size: font_size,
					y: iCurrentHeigth,
					x: iCurX,
					lineHeight: iLineHeigth
				});
				iCurX+=_iWidth[1];
				/* Col 3 idx 2*/
				curPage.drawText(_r[_l].who_name.trim().slice(0, _iStrMaxLength[2]), { 
					font: timesRomanFont,
					size: font_size,
					y: iCurrentHeigth,
					x: iCurX,
					lineHeight: iLineHeigth
				});
				iCurX+=_iWidth[2];
				/* Col 4 idx 3*/
				let sFunding = _r[_l].funding.trim().slice(0, _iStrMaxLength[3]);
				if ( _r[_l].funding === "auto-financé") {sFunding = "Au. Fin."}
				if ( _r[_l].funding === "financé par un tiers") {sFunding = "Fin."}
				curPage.drawText(sFunding, {
					font: timesRomanFont,
					size: font_size,
					y: iCurrentHeigth,
					x: iCurX,
					lineHeight: iLineHeigth
				});
				iCurX+=_iWidth[3];
				/* Col 5 idx 4*/
				let sType = _r[_l].type;
				if (_r[_l].path != void 0 && _r[_l].path.toLowerCase() === "158-trouvez-lemploi-qui-vous-correspond" && _r[_l].type !== "soutenance"){
					sType = "Coaching";
				}
				let sCol5 = `${sType.trim().slice(0, _iStrMaxLength[4] -2 )}-${_r[_l].lvl.toString()}`;
				//let sCol5 = sType.trim().slice(0, _iStrMaxLength[4]+'-'+_r[_l].toString()
				curPage.drawText(sCol5, {
					font: timesRomanFont,
					size: font_size,
					y: iCurrentHeigth,
					x: iCurX,
					lineHeight: iLineHeigth
				});
				iCurX+=_iWidth[4];
				let sStatus = _r[_l].status;
				if ( _r[_l].status === "étudiant absent") {sStatus = "absent"}
				if ( _r[_l].status === "étudiante absente") {sStatus = "absente"}
				if ( _r[_l].status === "annulée tardivement") {sStatus = "an. tard."}
				curPage.drawText(sStatus, {
					font: timesRomanFont,
					size: font_size,
					y: iCurrentHeigth,
					x: iCurX,
					lineHeight: iLineHeigth
				});
				iCurX+=_iWidth[5];
				curPage.drawText(_r[_l].iPu.toString(), {
					font: timesRomanFont,
					size: font_size,
					y: iCurrentHeigth,
					x: iCurX,
					lineHeight: iLineHeigth
				});
				iCurX+=_iWidth[6];
				curPage.drawText(_r[_l].iCumul.toString(), {
					font: timesRomanFont,
					size: font_size,
					y: iCurrentHeigth,
					x: iCurX,
					lineHeight: iLineHeigth
				});

			curLine += 1;
			}
			// afficher le détail
			var data = await Accounting.calculateBill(dtFrom, dtTo);
			const oMeta = data.get(0, 0, 0, 0);
			const iCurrentMaxLevel = oMeta.maxLevel;
			const dtNewMode = Core.getOldModeDate();
			const aPu_before = Accounting.getPriceList(dtNewMode.subtract(1,'day'));
			const aPu_after = Accounting.getPriceList(dtNewMode);
			var _l=1; // counter for level of billing
			const bShowEmptyLines = false; // display empty lines on 
			
			var _aSessionType = [TYPE_SESSION, TYPE_DEFENSE, TYPE_COACHING];
			var _aSessionTypeStr = ["Sessions", "Soutenance", "Coaching"];
			
			var _aSessionQuality = [0, 1, 2, 3];
			var _aSessionQualityStr = ["Réalisée", "Annulée", "Annulée tardivement", "Etudiant(e) absent(e)"];			

			var _aFunding = [BILL_AUTOFUNDED, BILL_FUNDED, BILL_OTHER];
			var _aFundingStr = ["Autofinancés", "Financés", "Autres"];
			
			curLine = 1;
			curPage = pdfDoc.addPage();
			let aHeader2 = ["","Quand","Qui","Nb", "Pu","Cumul"];
			let _iStrMaxLength2 = [0, 18 , 50, 3, 5, 7];
			let _iWidth2 = [_iStrMaxLength[0], 
				lorem_width(_iStrMaxLength[1]),
				lorem_width(_iStrMaxLength[2]),
				lorem_width(_iStrMaxLength[3]),
				lorem_width(_iStrMaxLength[4]),
				lorem_width(_iStrMaxLength[5])]; // permet d"aérer mais le décompte de lettre n'est plus bon
			let sHeader=""; // used to store next header string	
			for(_iSessionType = 0, _iSessionTypeLength=_aSessionType.length;_iSessionType < _iSessionTypeLength; _iSessionType+=1){
				while (_l <= iCurrentMaxLevel) {
					//iCurrentHeigth = height - line_space * font_size * curLine;
					[curLine,curPage] = PDF.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
					iCurrentHeigth = height - line_space * font_size * curLine;
					for(_iSessionQuality = 0, _iSessionQualityLength=_aSessionQuality.length;_iSessionQuality < _iSessionQualityLength; _iSessionQuality+=1){
						for(_iFunding = 0, _iFundingLength=_aFunding.length;_iFunding < _iFundingLength; _iFunding+=1){
							// list des autofunded
							//_i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_AUTOFUNDED, _l);
							_i0 = data.get(_aSessionType[_iSessionType], _aSessionQuality[_iSessionQuality], _aFunding[_iFunding], _l);
							if (typeof _i0 === 'undefined' && bShowEmptyLines === false){
								 continue;
							}
							_i0.data = _i0.data.reverse(); // voir si je ne le classe pas plutôt par dates;
							//show header
							let iCurX = iXStart;
							sHeader = `${_aSessionTypeStr[_iSessionType]} de Niveau ${_l} Etudiants ${_aFundingStr[_iFunding]}`;
							curPage.moveTo( iCurX, iCurrentHeigth);
							curPage.drawText(sHeader, {
								font: timesRomanFont,
								size: font_size+4,
								y: iCurrentHeigth,
								x: iCurX,
								lineHeight: iLineHeigth
								});
							iCurX+= 15; // prefer not to go to far
							curLine += 1;
							[curLine,curPage] = PDF.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
							iCurrentHeigth = height - line_space * font_size * curLine;
							//show sub header
							curPage.moveTo( iCurX, iCurrentHeigth);
							curPage.drawText(_aSessionQualityStr[_iSessionQuality], {
								font: timesRomanFont,
								size: font_size+2,
								y: iCurrentHeigth,
								x: iCurX,
								lineHeight: iLineHeigth
								});
							iCurX+= 15; // prefer not to go to far
							curLine += 1;
							[curLine,curPage] = PDF.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
							iCurrentHeigth = height - line_space * font_size * curLine;
							//list 
							if (typeof _i0 === 'undefined'){
								curPage.drawText(`désolé pas de résultat pour cette section au niveau de facturation (${_l})`, {
									font: timesRomanFont,
									size: font_size,
									y: iCurrentHeigth,
									x: iCurX,
									lineHeight: iLineHeigth
									});
								//_l+=1; // loop
								curLine += 1;
								[curLine,curPage] = PDF.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
								iCurrentHeigth = height - line_space * font_size * curLine;
								continue;
							}
							// header of list
							let iCurSubX = iCurX;
							let iCumul = 0;
							curPage.moveTo( iCurX, iCurrentHeigth);
							for(let _i = 1; _i<aHeader2.length; _i+=1){
								curPage.drawText(aHeader2[_i], {
									font: timesRomanFont,
									size: font_size+2,
									y: iCurrentHeigth,
									x: iCurSubX,
									lineHeight: iLineHeigth
								});
								iCurSubX+=_iWidth2[_i];
							}
							curLine += 1;
							[curLine,curPage] = PDF.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
							iCurrentHeigth = height - line_space * font_size * curLine;
							iCurSubX = iCurX;
							// data
							for(var _k = 0, _length = _i0.data.length; _k < _length; _k+=1){
								iCurSubX = iCurX;
								curPage.drawText(dayjs(_i0.data[_k].when).format("DD/MM/YYYY à HH:mm"), {
									font: timesRomanFont,
									size: font_size,
									y: iCurrentHeigth,
									x: iCurSubX,
									lineHeight: iLineHeigth
								});
								iCurSubX+=_iWidth2[1];
								curPage.drawText(_i0.data[_k].who_name.trim().slice(0, _iStrMaxLength2[1]), { 
									font: timesRomanFont,
									size: font_size,
									y: iCurrentHeigth,
									x: iCurSubX,
									lineHeight: iLineHeigth
								});
								//iCurrentHeigth = height - line_space * font_size * curLine;
								iCurSubX+=_iWidth2[2];

								curPage.drawText( (_k+1).toString(), { 
									font: timesRomanFont,
									size: font_size,
									y: iCurrentHeigth,
									x: iCurSubX,
									lineHeight: iLineHeigth
								});
								//iCurrentHeigth = height - line_space * font_size * curLine;
								iCurSubX+=_iWidth2[3];
								
								//_i0 = data.get(TYPE_SESSION, SESSION_DONE, BILL_AUTOFUNDED, _l);
								if (Core.isInOldMode(dayjs(_i0.data[_k].when))) {
									//iPu = +_i0.data[_k].lvl > 0 ? aPu_before[_l][iType][iStatus][iFunding] : 0 ;
									iPu = +_i0.data[_k].lvl > 0 ? aPu_before[_l][_aSessionType[_iSessionType]][_aSessionQuality[_iSessionQuality]][_aFunding[_iFunding]] : 0 ;
								} else {
									//iPu = +_i0.data[_k].lvl > 0 ? aPu_after[_l][iType][iStatus][iFunding]  : 0 ;
									iPu = +_i0.data[_k].lvl > 0 ? aPu_after[_l][_aSessionType[_iSessionType]][_aSessionQuality[_iSessionQuality]][_aFunding[_iFunding]]  : 0 ;
								}
								curPage.drawText(iPu.toString(), { 
									font: timesRomanFont,
									size: font_size,
									y: iCurrentHeigth,
									x: iCurSubX,
									lineHeight: iLineHeigth
								});
								iCurSubX+=_iWidth2[4];
								iCumul += iPu;
								// Cumul
								curPage.drawText(iCumul.toString(), { 
									font: timesRomanFont,
									size: font_size,
									y: iCurrentHeigth,
									x: iCurSubX,
									lineHeight: iLineHeigth
								});
								
								//iCurSubX+=_iWidth2[4];
								// next line
								curLine += 1;
								[curLine,curPage] = PDF.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
								iCurrentHeigth = height - line_space * font_size * curLine;
							}// next data
						}//next funding
					}// next quality
				_l+=1; // level loop
				curLine += 1;
				[curLine,curPage] = PDF.changePgIfNeeded(iCurrentHeigth, iBottomPg, curLine, pdfDoc);
				iCurrentHeigth = height - line_space * font_size * curLine;
				}
			_l = 1; // reset loop level
			}// next type
			// pied de page
			PDF.addFooter(pdfDoc, `Généré avec Facturier version ${Core.getAppVersion()}`);  
			const pdfBytes = await pdfDoc.save();
			download(pdfBytes, `prestations_facturees_detail_${dtFrom.format('YYYYMMDD')}-${dtTo.format('YYYYMMDD')}.pdf`, "application/pdf");
		  }
  
    createPdf2();
    }
    
/*
 * 
 * name: inconnu
 * @param
 * @return
 * 
 */
    
    var mgtDbase = async function(){
		// twostep swal
		//import_db =  JSON.stringify(unsafeWindow.Facturier.cfg.dbase.getState())
		//export_db =  JSON.parse(JSON.stringify(unsafeWindow.Facturier.cfg.dbase.getState()))
		GM_addStyle('.formgrid{font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;}');
		/* CSS compressed with : https://csscompressor.com/*/
		GM_addStyle(".swal2-styled[type=button]{background-color:#3085d6;border-radius:.75em;color:#fff;font-size:1.0625em;border-left-color:#3085d6;border-right-color:#3085d6;display:inline-block}.formgrid{display:grid;grid-template-columns:1fr 1em 1fr;grid-gap:.3em .6em;grid-auto-flow:dense;align-items:center}input,output,textarea,select,button{grid-column:2 / 4;width:auto;margin:0}legend{font-size:1.2em;width:100%;border-bottom:1px dotted #99c}fieldset{max-width:40em;padding:4px;margin:2em auto;border:0 none}");
		/* modelized here https://codepen.io/stephane_ty/pen/mdVzWpQ */
		let sHtml="";
		sHtml+="<legend>Que voulez vous faire ?</legend>";
		sHtml+="<fieldset>"
		sHtml+='<div class="formgrid">';
		sHtml+='Epurer<button id="answer1" data-action="raz" class="swal2-styled" type="button">RAZ</button>';  
		sHtml+='Sauvegarder toute la base<button id="answer2" data-action="export" class="swal2-styled" type="button">Sauvegarder</button>';
		sHtml+='Charger toute la base<button id="answer3" data-action="import" class="swal2-styled" type="button">Charger</button>'; 
if(STT_VERSION) {     
		sHtml+=`Exporter les tables
    <button class="swal2-styled" type="button"
    	hx-get="http://127.0.0.1:8000/views/test-swal-sauvegarde.html"
        hx-target="#sttPlaceHolder"
        hx-include="[name='email']"
        hx-swap="innerHTML"> Exporter
    </button>
		`;   
		}   
		sHtml+=`Exporter les tables
    <button class="swal2-styled" type="button"
    	hx-get="/views/test-swal-sauvegarde"
		hx-select="body"
        hx-target="#sttPlaceHolder"
        hx-include="[name='email']"
        hx-swap="innerHTML"> Exporter
    </button>
		`; 
		sHtml+="</fieldset>";
		sHtml+="</div>";

		
		// Be carreful about two arguments function ine removeEventListener_handler

		const { value: formValues } = await Swal.fire({
			title: 'Gestion de la base de donnée',
			html: sHtml,
			focusConfirm: false,
			preConfirm: () => {
			  return [
				document.getElementById('answer1').value,
				document.getElementById('answer2').value
			  ]
			},
			//deprecated onOpen: (el) => {
			didOpen: (el) => {
				console.log("%conOpen popup", "color:coral");
				// include all js needed
				
				// process htmx
				htmx.process(document.querySelector('.swal2-container'));
				console.log("%cHtmx Process done", "color:coral");
				/* Sending that to index.js (~ BUS BROKER)
				 * document.body.addEventListener('htmx:beforeRequest', function(detail) {
					
					console.log("HTMX event received...");
					console.dir(detail);
					console.dir(detail.elt);
					console.dir(detail.xhr);
					console.dir(detail.target);
					console.dir(detail.requestConfig);
					
				});
				*/
				
				/* generic addEventListener with handler functions src : https://gomakethings.com/event-delegation-and-multiple-selectors-with-vanilla-js/*/
				el.querySelector('.formgrid').addEventListener('click', _handler = function(e){
					const raz_action    = function(evt){ if(evt.target.matches('button[data-action="raz"]')){Swal.close(); razDbase();} return;};
					const save_action = function(evt){ if(evt.target.matches('button[data-action="export"]')){Swal.close();save_database();} return;};
					const load_action = function(evt){ if(evt.target.matches('button[data-action="import"]')){Swal.close();load_database();} return;};
					/* action it */
					raz_action(e);
					save_action(e);
					load_action(e);
				});
			},
			onClose: (el) => {
                el.querySelector('.formgrid').removeEventListener("click", _handler);
                console.log("%conClose popup", "color:coral")
            },
		});

		if (formValues) {
			Swal.fire(JSON.stringify(formValues))
		}
		
	}
	
	
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	var save_database = async function(){
		/* SRC: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server */
		let sExport = Dbase.save();
		console.log(`%cWanna save : ${sExport}`, APP_DEBUG_STYLE);
		let now = dayjs();
		
		let sHtml="";
		//sHtml+=`<a id="download" href="data:text/plain;charset=utf-8,${encodeURIComponent(sExport)}" download="export_${now.format('YYYYMMDD')}.json" style="display:none"></a>`;
		sHtml+=`<a id="download" href="data:text/plain;charset=utf-8,${encodeURIComponent(sExport)}" download="save_${now.format('YYYYMMDD')}.json">save_${now.format('YYYYMMDD')}.json</a>`;
		//sHtml+=`<p>téléchargement de export_${now.format('YYYYMMDD')}.json en cours....</p>`;
		
		Swal.fire({
			title: 'Sauvegarde de la base de donnée',
			html: sHtml,
			focusConfirm: false,
			onOpen: (el) => {el.querySelector('#download').click();},
			onClose: (el) => {},
		});
	}
	var export_database_v2 = async function(){
		
		oTableList = await tableSelector("Export des données");
		console.log(oTableList);
		
		// -- selection du mode d'export CSV ou JSON
		
		// -- export de la ou des tables choisies
		
		let _TableName = Student.tbl_name; // TEMPORARY
		
		console.log(`%cWanna export ${_TableName}`, APP_DEBUG_STYLE);
		let sExport = Dbase.exportTblToCSV(_TableName);
		
		console.log(`%cWanna export : ${sExport}`, APP_DEBUG_STYLE);
		let now = dayjs();
		
		let sHtml="";
		sHtml+=`<a id="download" href="data:text/plain;charset=utf-8,${encodeURIComponent(sExport)}" download="export_${now.format('YYYYMMDD')}.json" style="display:none"></a>`;
		sHtml+=`<a id="download" href="data:text/plain;charset=utf-8,${encodeURIComponent(sExport)}" download="export_${now.format('YYYYMMDD')}.csv">export_${now.format('YYYYMMDD')}.csv</a>`;
		//sHtml+=`<p>téléchargement de export_${now.format('YYYYMMDD')}.json en cours....</p>`;
		
		Swal.fire({
			title: 'Export de la table ou des table suivante: AAAAAAAAAAAAAA',
			html: sHtml,
			focusConfirm: false,
			onOpen: (el) => {el.querySelector('#download').click();},
			onClose: (el) => {},
		});
		
		
		return
	}
	/*
	 * SWAL2 source and 
	 * add https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
	 * add https://www.webdeveloper.com/d/261923-how-to-use-javascript-in-html-to-read-txt-file-and-display-it/10
	 * https://50linesofco.de/post/2019-07-05-reading-local-files-with-javascript
	 * add https://stackoverflow.com/questions/37425002/how-to-load-the-contents-of-a-local-text-file-by-name-using-javascript-and-html
	 *  to add progress bar
	 * https://usefulangle.com/post/193/javascript-read-local-file
	 * 
	 * voir egalement ici : https://stackoverflow.com/questions/42108782/firefox-webextensions-get-local-files-content-by-path/44516256#44516256
	 * c'était sur un autre sujet (tampermonkey et local files) mais .....
	 */
	var load_database = async function(){
		console.log(`%cWanna load DATABASE`, APP_DEBUG_STYLE);
		const { value: file } = await Swal.fire({
		  title: 'Selection de la sauvegarde (json)',
		  input: 'file',
		  inputAttributes: {
			'accept': '.json',
			'aria-label': 'Upload your database'
		  }
		})

		if (file) {
		  const reader = new FileReader()
		  reader.onload = (e) => {
			Dbase.import(e.target.result);
			addCbox();
			toastOk("Chargement de la base terminé");
		  }
		  reader.readAsText(file)
		}
}
    
    /**
     * 
     */
	var razDbase = async function(){
		
		GM_addStyle(".form_addon {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}");
		GM_addStyle(".form_addon input {background: #fff;border: 1px solid #9c9c9c;}");
		GM_addStyle(".form_addon button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}");
		GM_addStyle(".form_addon button:hover {background: gold;}");
		GM_addStyle(".form_addon label {padding: 0.5em 0.5em 0.5em 0;}");
		GM_addStyle(".form_addon input {padding: 0.7em;margin-bottom: 0.5rem;}");
		GM_addStyle(".form_addon input:focus {outline: 3px solid gold;}");
		GM_addStyle("@media (min-width: 400px) {.form_addon {grid-template-columns: 200px 1fr;grid-gap: 16px;} .form_addon label {text-align: right;grid-column: 1 / 2;} .form_addon input, .form_addon button {grid-column: 2 / 3;}}");

        var sHtml="";
        //sHtml+="<style>";
        //sHtml+='form {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}';
        //sHtml+='form input {background: #fff;border: 1px solid #9c9c9c;}';
        //sHtml+='form button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}';
        //sHtml+='form button:hover {background: gold;}';
        //sHtml+='form label {padding: 0.5em 0.5em 0.5em 0;}';
        //sHtml+='form input {padding: 0.7em;margin-bottom: 0.5rem;}';
        //sHtml+='form input:focus {outline: 3px solid gold;}';
        //sHtml+='@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}label {text-align: right;grid-column: 1 / 2;}input,button {grid-column: 2 / 3;}}';
        //sHtml+="</style>";
        sHtml+='<form id="RAZ" class="form_addon" action="">';
        sHtml+='<label for="students" class="cbox">Etudiants</label>';
        sHtml+='<input id="students" type="checkbox" value="del_students_true" checked>';
        sHtml+='<label for="sessions" class="cbox">Sessions</label>';
        sHtml+='<input id="sessions" type="checkbox" value="del_sessions_true" checked>';
        sHtml+='<label for="archives" class="cbox">Archives : factures</label>';
        sHtml+='<input id="archives" type="checkbox" value="del_archives_true" checked>';
        sHtml+='<label for="history_cache" class="cbox">Signet historique</label>';
        sHtml+='<input id="history_cache" type="checkbox" value="del_history_cache_true" checked>';        
        sHtml+='<label for="radio1">filtrer la date</label>';
        sHtml+='<input type="radio" id="radio1" name="date_filter" value="false" checked>';
        sHtml+='<label for="radio2">ne pas filtrer</label>';
        sHtml+='<input type="radio" id="radio2" name="date_filter" value="true">';
        sHtml+='<label for="dtFrom" class="date">Date de début</label>';
        sHtml+='<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31">';
        sHtml+='<label for="dtTo" class="date">Date de fin</label>';
        sHtml+='<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31">';
        sHtml+='<!-- Switch -->';
		sHtml+='<input type="checkbox" class="switch" name="s1" id="s1">';
		sHtml+='<label for="s1">Switch</label>';

        //sHtml+='<button>Submit</button>';
        sHtml+='</form>';

        const { value: formValues } = await Swal.fire({
            title: "<strong>RAZ des données</strong>",
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'top-start',
            grow: 'row',
            footer: 'Choisissez ce que vous allez supprimer de la base de donnée',
            preConfirm: () => {
                let r = document.getElementsByName('date_filter');
                let radioValue = "notfound"
                for(var i in r){
                    if(r[i].checked === true) radioValue = r[i].value;
                }
                
                console.log(document.getElementById('s1'));
                
                return [
                    document.getElementById('students').checked,
                    document.getElementById('sessions').checked,
                    document.getElementById('archives').checked,
                    document.getElementById('history_cache').checked,
                    document.getElementById('dtFrom').disabled === true ? null : document.getElementById('dtFrom').value,
                    document.getElementById('dtTo').disabled === true ? null : document.getElementById('dtTo').value,
                    radioValue,
                ]
            },
            onOpen: (el) => {
                    el.querySelector('#radio1').addEventListener('change', function(){
                        console.log(document.getElementById('radio1').checked);
                        let _b = document.getElementById('radio1').checked;
                        document.getElementById('dtFrom').disabled = ! _b
                        document.getElementById('dtTo').disabled = ! _b
                    })
                    el.querySelector('#radio2').addEventListener('change', function(){
                        let _b = document.getElementById('radio1').checked;
                        document.getElementById('dtFrom').disabled = ! _b
                        document.getElementById('dtTo').disabled = ! _b
                    })
                el.querySelector('#dtFrom').addEventListener('change', function(){document.getElementById('dtTo').value = dayjs(document.getElementById('dtFrom').value).endOf('month').format("YYYY-MM-DD");})
                //console.log("%conOpen popup", "color:coral")
            },
            onClose: (el) => {
                    el.querySelector('#radio1').removeEventListener("change");
                    el.querySelector('#radio2').removeEventListener("change");
                    el.querySelector('#dtFrom').removeEventListener("change");
                 //console.log("%conClose popup", "color:coral")
            },

        });


        let bRAZStudents = formValues[0];
        let bRAZSessions = formValues[1];
        let bRAZArchives = formValues[2];
        let bRAZHistorySessionCache = formValues[3];
        //console.log("radio result is " + formValues[2]);

        console.log(`%cWanna raz students ? ${bRAZStudents}, wanna raz sessions ? ${bRAZSessions}, wanna raz archives ? ${bRAZArchives}` , APP_DEBUG_STYLE);

        let dtFrom = formValues[4] ? dayjs(formValues[4]) : null;
        let dtTo = formValues[5] ? dayjs(formValues[5]) : null;

        if (bRAZStudents === true){
            setTimeout(function() {
                Toastify({
                    text: `Suppression de la base des étudiants`,
                    gravity: "top",
                    position: 'right',
                    close: true,
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }).showToast();
            }, 500);
            Student.delete(dtFrom,dtTo);

        }
        if (bRAZSessions === true){
            setTimeout(function() {
                Toastify({
                    text: `Suppression de la base des sessions`,
                    gravity: "top",
                    position: 'right',
                    close: true,
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }).showToast();
            }, 500);
            Session.delete(dtFrom, dtTo);
            /* update cbox */
            addCbox();
        }
        if (bRAZArchives === true){
            setTimeout(function() {
                Toastify({
                    text: `Suppression de la base des archives (financières)`,
                    gravity: "top",
                    position: 'right',
                    close: true,
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }).showToast();
            }, 500);
			Archive.delete(dtFrom, dtTo);
        }
        if (bRAZHistorySessionCache === true){
            setTimeout(function() {
                Toastify({
                    text: `Suppression de la base du cache des historique de session`,
                    gravity: "top",
                    position: 'right',
                    close: true,
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }).showToast();
            }, 500);
            History.delete(dtFrom, dtTo);
        }        
        
    }     
	/**
	 * 
	 */
	var showBill = async function(){
        var sHtml="";
        sHtml+="<style>";
        sHtml+='form {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}';
        sHtml+='form input {background: #fff;border: 1px solid #9c9c9c;}';
        sHtml+='form button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}';
        sHtml+='form button:hover {background: gold;}';
        sHtml+='form label {padding: 0.5em 0.5em 0.5em 0;}';
        sHtml+='form input {padding: 0.7em;margin-bottom: 0.5rem;}';
        sHtml+='form input:focus {outline: 3px solid gold;}';
        sHtml+='@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}label {text-align: right;grid-column: 1 / 2;}input,button {grid-column: 2 / 3;}}';
        sHtml+="</style>";
        sHtml+='<form class="form1" action="">';
        sHtml+='<label for="dd" class="date">Date de début</label>';
        sHtml+='<input id="dd" type="date" max="2030-12-31" min="2010-12-31">';
        sHtml+='<label for="df" class="date">Date de fin</label>';
        sHtml+='<input id="df" type="date" max="2030-12-31" min="2010-12-31">';
        //sHtml+='<button>Submit</button>';
        sHtml+='</form>';
        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
        //var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isBefore(dtTo) && dayjs(v.when).isAfter(dtFrom));

        /*
        var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isSameOrBefore(dtTo,'day') && dayjs(v.when).isSameOrAfter(dtFrom,'day'));

         if(Core.isInOldMode(dtFrom)){
             billPhase1(dtFiltered,dtFrom,dtTo);
         } else {
             billPhase2(dtFiltered,dtFrom,dtTo);
         }
         */
         var data = await Accounting.calculateBill(dtFrom, dtTo);
         if(Core.isInOldMode(dtFrom)){
             showBillPhase1(dtFrom, dtTo, data);
         } else {
             showBillPhase2(dtFrom, dtTo, data);
         }
    }
    
    /*
     * dtFrom : dayjs format
     * dtTo : dayjs format
     * r : array of data
     */
    var showBillPhase1Old = function (dtFrom, dtTo,r){
        var sHtml ="";
        var _ref = null;
        var iTotQ = 0
        var iTotM = 0
        var aTable = [[4,"Groupe"],[1,"Niveau 1"],[2,"Niveau 2"],[3,"Niveau 3"]]
        var iCurrentMaxLevel = r[0].max_level; /* could be different from the global OC_MAX_LEVEL (depending on when data was saved */
        /* https://www.w3.org/WAI/tutorials/tables/multi-level/ */
        sHtml+= "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
        sHtml+='<div class="wrapper">';
        sHtml+='<table>';
        sHtml+='<caption>Sessions de mentorat</caption>';
        sHtml+='<thead>';
        sHtml+='<tr>';
        sHtml+='<th>Type</th><th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+="</tr>";
        sHtml+='</thead>';
        sHtml+='<tbody>';
        // /!\ defenses are already counted in sessions
        for (var k in aTable){
            sHtml+='<tr>';
            sHtml+="<td>"+aTable[k][1]+"</td>";
            _ref = r[aTable[k][0]].sessions; // used by commons elements like pu for now
            let _q1 = _ref.number[0];
            let _q2 = _ref.number[4];
            let _m1 = _q1 * _ref.pu[0];
            let _m2 = _q2 * _ref.pu[4];
            iTotQ+= _q1+_q2;
            iTotM+= _m1+_m2;
            sHtml+=`<td>${_q1 +_q2 }</td><td>${(_ref.pu[0] + _ref.pu[4] )/2}</td><td>${_m1 + _m2}€</td>`;
            sHtml+="</tr>";
        }
        sHtml+='</tbody>';
        sHtml+='<tfoot>';
        sHtml+='<tr>';
        sHtml+="<td>Total</td>";
        sHtml+=`<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='</tr>';
        sHtml+='</tfoot>';
        sHtml+='</table>'
        var iTotQG = iTotQ;
        var iTotMG = iTotM;
        iTotQ = 0
        iTotM = 0
        sHtml+='<table>';
        sHtml+='<caption>Sessions de mentorat (NoShow)</caption>';
        sHtml+='<thead>';
        sHtml+='<tr>';
        sHtml+='<th>Type</th><th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+="</tr>";
        sHtml+='</thead>';
        sHtml+='<tbody>';
        for (k in aTable){
            sHtml+='<tr>';
            sHtml+="<td>"+aTable[k][1]+"</td>";
            _ref = r[aTable[k][0]].sessions; // used by commons elments like pu for now
            let _q1 = _ref.number[2] +_ref.number[3];
            let _q2 = _ref.number[6]+_ref.number[7];
            let _m1 = _q1 * (_ref.pu[2]+_ref.pu[3])/2;
            let _m2 = _q2 * (_ref.pu[6]+_ref.pu[7])/2;
            iTotQ+= _q1+_q2;
            iTotM+= _m1+_m2;
            sHtml+=`<td>${_q1+_q2}</td><td>${(_ref.pu[2]+_ref.pu[3]+_ref.pu[6]+_ref.pu[7])/4}</td><td>${_m1+_m2}€</td>`;
            sHtml+="</tr>";

        }

        sHtml+='</tbody>';
        sHtml+='<tfoot>';
        sHtml+='<tr>';
        sHtml+="<td>Total</td>";
        sHtml+=`<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='</tr>';
        sHtml+='</tfoot>';
        sHtml+='</table>'

        iTotQG += iTotQ;
        iTotMG += iTotM;

        var iCanceledSessions = 0;
        // sessions
        var iTotalSessions = 0;
        var iTotalHtSessions = 0;
        // defenses
        var iTotalDefenses = 0;
        var iTotalHtDefenses = 0;
        var _l = 1;
        while( _l <= iCurrentMaxLevel){
            iCanceledSessions += r[_l].sessions.number[1];
            iCanceledSessions += r[_l].sessions.number[5];
            for (let _i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too
                let _t = r[_l].sessions.number[_i];
                //console.log(`je vais ajouter ${_t} sessions`);
                iTotalSessions += _t;
                iTotalHtSessions += _t * r[_l].sessions.pu[_i];
                _t = r[_l].defenses.number[_i];
                iTotalDefenses += _t;
                iTotalHtDefenses += _t * r[_l].defenses.pu[_i];
            }
            _l+=1
        }
        let iError = r[0].errors[0].total_errors;
        iTotalSessions += iError

        sHtml+= `<p>Ces ${iTotalSessions} session(s) se répartissent en ${iTotQG -iTotQ} session(s) de mentorat (${iTotMG -iTotM}€)`
        sHtml+= `, ${iTotQ} NoShows (${iTotM}€)`
        if(iError == 0){
			sHtml+=`et ${iCanceledSessions} session(s) annulée(s) (${0}€) </p>`;
		} else {
			sHtml+=`, ${iCanceledSessions} session(s) annulée(s) (${0}€) ainsi que ${iError} session(s) en anomalie (cf 1.)`;
		}
        sHtml+= `<br >Sur le total de ${iTotalSessions} session(s) (${iTotalHtSessions}€) `;
        sHtml+= `vous avez réalisé ${iTotalDefenses} soutenance(s) (${iTotalHtDefenses}€)</p>`;

		if (iError > 0) {
		  let oError = r[0].errors[0];
          sHtml+= `(1) Attention, il y a ${iError} session(s) qui présente(nt) une anomalie c'est peut être normal : exemple un étudiant qui n'a plus de parcours associé au moment de la collecte de session`;
          sHtml+= `, pour plus d'information regarder du côté de la console (en 'warn')</p>`;
		  console.warn("Sessions en anomalie");
		  console.warn(`il y a ${oError.total_errors} erreurs relevées , notez qu'il y a ${oError.total_filtered} ennregistrements filtrés(lvl,...)  sur ${oError.total} enregistrements dans la période, le total des erreurs devrait donc être de ${oError.control} erreurs`);
		  console.warn("détail");
		  console.warn(`${r[0].errors[1].data.length} erreurs de type ${r[0].errors[1].type} data are`, r[0].errors[1].data);
		  console.warn(`${r[0].errors[2].data.length} erreurs de type ${r[0].errors[2].type} data are`, r[0].errors[2].data);
		  console.warn(`${r[0].errors[3].data.length} erreurs de type ${r[0].errors[3].type} data are`, r[0].errors[3].data);
		}
		
		sHtml+=`<p>Soit un total général à facturer de ${iTotalHtSessions}€`;    
		
        Swal.fire({
            title: `<strong>Liste des formations tarifées du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
            //icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'center-start',
            grow: 'fullscreen',
        });

    }
    /*
     * dtFrom : dayjs format
     * dtTo : dayjs format
     * r : array of data
     */
var showBillPhase1 = function (dtFrom, dtTo, data){
	
	const oMeta = data.get(0,0,0,0);
	//const iCurrentMaxLevel = oMeta.maxLevel; /* could be different from the global OC_MAX_LEVEL (depending on when data was saved */
	const iCurrentMaxLevel = 4; /* could be different from the global OC_MAX_LEVEL (depending on when data was saved */
	
	var sHtml ="";
	var _ref = null;
	var iTotQ = 0;
	var iTotM = 0;
	var iTotG = 0;
	var aTable = [[4,"Groupe"],[1,"Niveau 1"],[2,"Niveau 2"],[3,"Niveau 3"]];
	var t0=0, t1=0;
	var bShowEmptyLine = false;
	var _0=0, _1=0, _2=0;
	var _q0=0, _q1=0, _q2=0;
	var _m0=0, _m1=0, _m2=0;
	var _qa =0, _qf =0, _qo=0;
	var _pa =0, _pf =0, _po=0;
	var _ma =0, _mf =0, _mo=0;
	var _l=1; /* keep tracks on loop be careful !!! */
	data.toConsole();
	/* Go -- */
	/* https://www.w3.org/WAI/tutorials/tables/multi-level/ */
	sHtml+= "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
	sHtml+='<div class="wrapper">';
	sHtml+='<table>';
	sHtml+='<thead>';
	sHtml+='<tr>';
	sHtml+='<th>Type</th><th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
	sHtml+="</tr>";
	sHtml+='</thead>';
	sHtml+='<tbody>';
	sHtml+='<tr>';
	sHtml+='<th colspan="4" class="pseudoheader" scope="colgroup">Sessions de Mentorat</th>';
	sHtml+='</tr>';
	var t0 = performance.now();
	while(_l <= iCurrentMaxLevel){
		
		_i0 = data.get(TYPE_SESSION,  SESSION_DONE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_DONE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_DONE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : réalisées</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}

		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées tard.</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : étudiant abs.</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}

		_l+=1; // Next Level
	}
	var t1 = performance.now();console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE); // avant optimisation
	sHtml+='<tr>';
	sHtml+="<td>Total</td>";
	sHtml+=`<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='</tr>';
	iTotG+= iTotM;
	
	// -- Soutenances
	iTotQ = 0
	iTotM = 0
	sHtml+='<tr>';
	sHtml+='<th colspan="4" class="pseudoheader" scope="colgroup">Sessions de Soutenance</th>';
	sHtml+='</tr>';
	
	_l = 1; // reset loop
	var t0 = performance.now();
	while(_l <= iCurrentMaxLevel){
		
		_i0 = data.get(TYPE_DEFENSE,  SESSION_DONE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_DONE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_DEFENSE,  SESSION_DONE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : réalisées</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}

		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées tard.</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : étudiant abs.</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}

		_l+=1; // Next Level
	}
	var t1 = performance.now();console.log("%cCalculate second array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE); // avant optimisation
	sHtml+='<tr>';
	sHtml+="<td>Total</td>";
	sHtml+=`<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='</tr>';
	iTotG+= iTotM;
	
	// -- Coaching
	iTotQ = 0
	iTotM = 0
	sHtml+='<tr>';
	sHtml+='<th colspan="4" class="pseudoheader" scope="colgroup">Sessions de Coaching</th>';
	sHtml+='</tr>';
	
	_l = 1; // reset loop
	var t0 = performance.now();
	while(_l <= iCurrentMaxLevel){
		
		_i0 = data.get(TYPE_COACHING,  SESSION_DONE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_DONE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_COACHING,  SESSION_DONE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : réalisées</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}

		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées tard.</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQ+= _qa;
			iTotQ+= _qf;
			iTotQ+= _qo;
			iTotM+= _ma;
			iTotM+= _mf;
			iTotM+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : étudiant abs.</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${ _pf }</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}

		_l+=1; // Next Level
	}
	var t1 = performance.now();console.log("%cCalculate third array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE); // avant optimisation
	sHtml+='<tr>';
	sHtml+="<td>Total</td>";
	sHtml+=`<td>${iTotQ}</td><td></td><td>${iTotM}€</td>`;
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='</tr>';
	iTotG+= iTotM;
	sHtml+='<tr>';
	sHtml+='<th colspan="4" class="pseudoheader" scope="colgroup">Total Général</th>';
	sHtml+='</tr>';
	sHtml+=`<td colspan="3"></td><td>${iTotG}€</td>`;
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='</tr>';
	//sHtml+='</tfoot>';
	//sHtml+='</table>';
	
	sHtml+='</tbody>';
	sHtml+='<tfoot>';
    sHtml+='</tfoot>';
	sHtml+='</table>';
	
	sHtml+=`<p>Soit un total général à facturer de ${iTotG}€`;    
	
	Swal.fire({
		title: `<strong>Liste des formations tarifées du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
		//icon: 'info',
		html: sHtml,
		showCloseButton: true,
		//showCancelButton: true,
		focusConfirm: false,
		position: 'center-start',
		grow: 'fullscreen',
	});

}    
var showBillPhase2 = function (dtFrom, dtTo, data){
	console.log("%cEnter computation bill", APP_DEBUG_STYLE);
	const bShowEmptyLine = false; //TODO add a configuration option
	var sHtml = "";
	var iTotQa = 0;
	var iTotQf = 0;
	var iTotQo = 0;
	var iTotMa = 0
	var iTotMf = 0;
	var iTotMo = 0;
	var iTotGQa = 0
	var iTotGQf = 0;
	var iTotGQo = 0;
	var iTotGMa = 0
	var iTotGMf = 0;
	var iTotGMo = 0;
	const oMeta = data.get(0,0,0,0);
	const iCurrentMaxLevel = oMeta.maxLevel; /* could be different from the global OC_MAX_LEVEL (depending on when data was saved */

	/* temp */
	var _0=0, _1=0, _2=0;
	var _q0=0, _q1=0, _q2=0;
	var _m0=0, _m1=0, _m2=0;
	var _qa =0, _qf =0, _qo=0;
	var _pa =0, _pf =0, _po=0;
	var _ma =0, _mf =0, _mo=0;
	var _l=1; /* keep tracks on loop be careful !!! */
	//data.toConsole();
	/* Go -- */
	/* https://www.w3.org/WAI/tutorials/tables/multi-level/ */
	sHtml+= "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
	sHtml+='<div class="wrapper">';
	sHtml+='<table>';
	sHtml+='<thead>';
	sHtml+='<tr>';
	sHtml+='<th rowspan="2">Type</th><th colspan="3" scope="colgroup">Auto Financés</th><th colspan="3" scope="colgroup">Financés</th><th colspan="3" scope="colgroup">Autres</th><th colspan="2" scope="colgroup">Total</th>';
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="prix unitaire">Pu.</abbt>(<abbr title="hors taxes">HT</abbr>)</th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
	sHtml+='<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="prix unitaire">Pu.</abbt>(<abbr title="hors taxes">HT</abbr>)</th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
	sHtml+='<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="prix unitaire">Pu.</abbt>(<abbr title="hors taxes">HT</abbr>)</th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
	sHtml+='<th><abbr title="nombre">Nb.</abbr></th><th><abbr title="montant">Mt.</abbt>(<abbr title="hors taxes">HT</abbr>)</th>';
	sHtml+="</tr>";
	sHtml+='</thead>';
	sHtml+='<tbody>';
	sHtml+='<tr>';
	sHtml+='<th colspan="12" class="pseudoheader" scope="colgroup">Sessions de mentorat</th>';
	sHtml+='</tr>';
	// /!\ defenses are already counted in sessions
	var t0 = performance.now();
	while(_l <= iCurrentMaxLevel){
		_i0 = data.get(TYPE_SESSION,  SESSION_DONE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_DONE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_DONE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa + _qf + _qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : réalisées</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées tard.</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount; 
		_i0 = data.get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number;  
		_mo = _i0 === undefined ? 0 : _i0.amount;  
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : étud. absent</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_l+=1; // Next Level
	}
	var t1 = performance.now();console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE); // avant optimisation
	sHtml+='<tr>';
	sHtml+="<td>Total</td>";
	sHtml+=`<td>${iTotQa}</td><td></td><td>${iTotMa}€</td>`;
	sHtml+=`<td>${iTotQf}</td><td></td><td>${iTotMf}€</td>`;
	sHtml+=`<td>${iTotQo}</td><td></td><td>${iTotMo}€</td>`;
	sHtml+=`<td>${iTotQa+iTotQf+iTotQo}</td><td>${iTotMa+iTotMf+iTotMo}€</td>`;
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='</tr>';
	//sHtml+='</tfoot>';
	//sHtml+='</table>';
	iTotGQa += iTotQa;
	iTotGQf += iTotQf;
	iTotGQo += iTotQo;
	iTotGMa += iTotMa;
	iTotGMf += iTotMf;
	iTotGMo += iTotMo;
	
	// -- Soutenances
	iTotQa = 0
	iTotQf = 0;
	iTotQo = 0;
	iTotMa = 0
	iTotMf = 0;
	iTotMo = 0;
	sHtml+='<tr>';
	sHtml+='<th colspan="12" class="pseudoheader" scope="colgroup">Sessions de Soutenance</th>';
	sHtml+='</tr>';
	
	_l = 1; // reset loop
	while(_l <= iCurrentMaxLevel){
		_i0 = data.get(TYPE_DEFENSE,  SESSION_DONE, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_DONE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_DONE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : réalisées</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées tard.</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : étud. absent</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_l+=1; // Next Level
	}
	sHtml+='<tr>';
	sHtml+="<td>Total</td>";
	sHtml+=`<td>${iTotQa}</td><td></td><td>${iTotMa}€</td>`;
	sHtml+=`<td>${iTotQf}</td><td></td><td>${iTotMf}€</td>`;
	sHtml+=`<td>${iTotQo}</td><td></td><td>${iTotMo}€</td>`;
	sHtml+=`<td>${iTotQa+iTotQf+iTotQo}</td><td>${iTotMa+iTotMf+iTotMo}€</td>`;
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='</tr>';
	iTotGQa += iTotQa;
	iTotGQf += iTotQf;
	iTotGQo += iTotQo;
	iTotGMa += iTotMa;
	iTotGMf += iTotMf;
	iTotGMo += iTotMo;
	// -- Coaching
	iTotQa = 0
	iTotQf = 0;
	iTotQo = 0;
	iTotMa = 0
	iTotMf = 0;
	iTotMo = 0;
	sHtml+='<tr>';
	sHtml+='<th colspan="12" class="pseudoheader" scope="colgroup">Sessions de Coaching</th>';
	sHtml+='</tr>';
	
	var _l = 1; // reset loop
	while(_l <= iCurrentMaxLevel){
		_i0 = data.get(TYPE_COACHING,  SESSION_DONE, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_DONE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_DONE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : réalisées</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : annulées tard.</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_i0 = data.get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);   
		_qa = _i0 === undefined ? 0 : _i0.number; 
		_ma = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
		_qf = _i0 === undefined ? 0 : _i0.number; 
		_mf = _i0 === undefined ? 0 : _i0.amount;
		_i0 = data.get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
		_qo = _i0 === undefined ? 0 : _i0.number; 
		_mo = _i0 === undefined ? 0 : _i0.amount;
		_pa = _qa > 0 ? _ma / _qa : _ma;
		_pf = _qf > 0 ? _mf / _qf : _mf;
		_po = _qo > 0 ? _mo / _qo : _mo;
		if (bShowEmptyLine === true || (_qa+_qf+_qo) > 0){
			iTotQa+= _qa;
			iTotQf+= _qf;
			iTotQo+= _qo;
			iTotMa+= _ma;
			iTotMf+= _mf;
			iTotMo+= _mo;
			sHtml+='<tr>';
			sHtml+=`<td>Niveau ${_l} : étud. absent</td>`;
			sHtml+=`<td>${_qa}</td><td>${_pa}</td><td>${_ma}€</td>`;
			sHtml+=`<td>${_qf}</td><td>${_pf}</td><td>${_mf}€</td>`;
			sHtml+=`<td>${_qo}</td><td>${_po}</td><td>${_mo}€</td>`;
			sHtml+=`<td>${_qa + _qf +_qo}</td><td>${_ma + _mf + _mo}€</td>`;
			sHtml+="</tr>";
		}
		
		_l+=1; // Next Level
	}
	
	iTotGQa += iTotQa;
	iTotGQf += iTotQf;
	iTotGQo += iTotQo;
	iTotGMa += iTotMa;
	iTotGMf += iTotMf;
	iTotGMo += iTotMo;
	
	//sHtml+='</tbody>';
	//sHtml+='<tfoot>';
	sHtml+='<tr>';
	sHtml+="<td>Total</td>";
	sHtml+=`<td>${iTotQa}</td><td></td><td>${iTotMa}€</td>`;
	sHtml+=`<td>${iTotQf}</td><td></td><td>${iTotMf}€</td>`;
	sHtml+=`<td>${iTotQo}</td><td></td><td>${iTotMo}€</td>`;
	sHtml+=`<td>${iTotQa+iTotQf+iTotQo}</td><td>${iTotMa+iTotMf+iTotMo}€</td>`;
	sHtml+='</tr>';
	sHtml+='<tr>';
	sHtml+='</tr>';
	//sHtml+='</tfoot>';
	//sHtml+='</table>';
	
	sHtml+='</tbody>';
	sHtml+='<tfoot>';
    sHtml+='</tfoot>';
	sHtml+='</table>';
	
/*
	let iError = data[0].errors[0].total_errors;
	if(iError > 0){
		let oError = data[0].errors[0];
		console.log(oError);
		sHtml+= `<p>Attention, il y a ${iError} session(s) qui présente(nt) une anomalie c'est peut être normal : exemple un étudiant qui n'a plus de parcours associé au moment de la collecte de session`;
		sHtml+= `, pour plus d'information regarder du côté de la console (en 'warn')</p>`;
		console.warn('Sessions en anomalie');
		console.warn(`il y a ${oError.total_errors} erreurs relevées , notez qu'il y a ${oError.total_filtered} ennregistrements filtrés(lvl,...)  sur ${oError.total} enregistrements dans la période, le total des erreurs devrait donc être de ${oError.control} erreurs`);
		console.warn('détail');
		console.warn(`${data[0].errors[1].data.length} erreurs de type ${data[0].errors[1].type} data are`,data[0].errors[1].data);
		console.warn(`${data[0].errors[2].data.length} erreurs de type ${data[0].errors[2].type} data are`,data[0].errors[2].data);
		console.warn(`${data[0].errors[3].data.length} erreurs de type ${data[0].errors[3].type} data are`,data[0].errors[3].data);
	}
	* */
	// Bonus for AF
	var iTotG = 0;      
	var sAFOK = "";
	let iFlatFeeNumber = oMeta.flatFee.length  
	for(var t=0; t < iFlatFeeNumber; t+=1){
		iTotG+=30
		sAFOK+= oMeta.flatFee[t].who_name+", ";
	}
	if( iFlatFeeNumber > 1){
		sHtml+= `<p class="flat_fee">Calcul du forfait "autofinancé". Ce mois ci ${iFlatFeeNumber} étudiants ont eu au moins une session il s'agit de : ${sAFOK.slice(0, -1)}`;
	} else {
		sHtml+= `<p class="flat_fee">Calcul du forfait "autofinancé". Ce mois ci ${iFlatFeeNumber} étudiant a eu au moins une session il s'agit de : ${sAFOK.slice(0, -1)}`;
	}
	sHtml+= `. Le forfait est donc de ${iTotG}€</p>`;        
	sHtml+=`<p>Soit un total général à facturer de ${iTotGMa+iTotGMf+iTotGMo+iTotG}€</p>`;  
  


	
	Swal.fire({
		title: `<strong>Liste des formations tarifées du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
		//icon: 'info',
		html: sHtml,
		showCloseButton: true,
		//showCancelButton: true,
		focusConfirm: false,
		position: 'center-start',
		grow: 'fullscreen',
	});
	
}

 
/**
 *
 */


 var statistics = async function(){
	var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'),false);
	if (dtFrom === null || dtTo===null){
		console.log("%cError need date from, date to" , APP_ERROR_STYLE);
		throw new Error(); // exit js https://stackoverflow.com/questions/550574/how-to-terminate-the-script-in-javascript
	}
	const aData = List.getListStatistic(dtFrom,dtTo);
	let sHtml="";
	let aHtml=new Array(22);
	let aTot = Array.apply(null, Array(22)).map(Number.prototype.valueOf, 0); // create à empty array of 20 zero
	let dtCurFrom = dtFrom.clone();
	let dtCurTo = dtCurFrom.endOf("month");
	let sSuffix = "";
	aHtml[0] = `<thead><tr><th>Sessions</th>`;
	aHtml[1] = `<tbody><tr><td>Sessions</td>`;
	aHtml[2] = `<tr class="header"><td>Montant</td>`;
	aHtml[3] = `<tr><td>Nb.`;
	aHtml[4] = `<tr><td>Pu`;
	aHtml[5] = `<tr class="header"><td>Soutenances</td>`;
	aHtml[6] = `<tr><td>Montant</td>`;
	aHtml[7] = `<tr><td>Nb.`;
	aHtml[8] = `<tr><td>Pu`;
	aHtml[9] = `<tr class="header"><td>Coaching</td>`;
	aHtml[10] = `<tr><td>Montant</td>`;
	aHtml[11] = `<tr><td>Nb.`;
	aHtml[12] = `<tr><td>Pu`;
	aHtml[13] = `<tr class="header"><td>Bonus</td>`;
	aHtml[14] = `<tr><td>Bonus AF</td>`;
	aHtml[15] = `<tr><td>Total Général</td>`;
	aHtml[16] = `<tr class="header"><td>KPI</td>`;
	aHtml[17] = `<tr><td>NbJrs</td>`;
	aHtml[18] = `<tr><td>TJM</td>`;
	aHtml[19] = `<tr><td>Nb hrs</td>`;
	aHtml[20] = `<tr><td>THM</td>`;
	aHtml[21] = `<tr><td>Nb hrs (p.)</td>`;
	aHtml[22] = `<tr><td>THM (p)</td>`;
	for (var _m = 0; _m < aData.length; _m += 1) {
		aTot[2]+= aData[_m].sessions.total;
		aTot[3]+= (aData[_m].sessions.nb - aData[_m].sessions.nbc);
		aTot[4]+= aData[_m].sessions.pu;
		aTot[6]+= aData[_m].defenses.total;
		aTot[7]+= (aData[_m].defenses.nb - aData[_m].defenses.nbc);
		aTot[8]+= aData[_m].defenses.pu;
		aTot[10]+= aData[_m].coaches.total;
		aTot[11]+= (aData[_m].coaches.nb - aData[_m].coaches.nbc);
		aTot[12]+= aData[_m].coaches.pu;
		aTot[14]+= aData[_m].bonus;
		let _iTotG = aData[_m].sessions.total + aData[_m].defenses.total + aData[_m].coaches.total + aData[_m].bonus;
		aTot[15]+= _iTotG;
		aTot[16]+= aData[_m].kpi.jrs;
		aTot[18]+= aData[_m].kpi.hrs;
		aTot[20]+= aData[_m].kpi.hrsp;
		if (aData.length == 1)
			sSuffix = "</tr>";
		if (_m === aData.length - 1 && aData.length > 1) {
			if (dtCurTo.isAfter(dtTo, "day")) {
				aTot[2]-= aData[_m].sessions.total;
				aTot[3]-= (aData[_m].sessions.nb - aData[_m].sessions.nbc);
				aTot[4]-= aData[_m].sessions.pu;
				aTot[6]-= aData[_m].defenses.total;
				aTot[7]-= (aData[_m].defenses.nb - aData[_m].defenses.nbc);
				aTot[8]-= aData[_m].defenses.pu;
				aTot[10]-= aData[_m].coaches.total;
				aTot[11]-= (aData[_m].coaches.nb - aData[_m].coaches.nbc);
				aTot[12]-= aData[_m].coaches.pu;
				aTot[14]-= aData[_m].bonus;
				aTot[15]-= _iTotG;
				aTot[16]-= aData[_m].kpi.jrs;
				aTot[18]-= aData[_m].kpi.hrs;
				aTot[20]-= aData[_m].kpi.hrsp;
				aHtml[0]+= `<td>Total(moy)</td><td>${dayjs(aData[_m].header.dtTo).format("MMMM")}</td></thead></tr>`;
				aHtml[1]+= `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
				aHtml[2]+= `<td>${aTot[2]} (${(aTot[2] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].sessions.total}</td></tr>`;
				aHtml[3]+= `<td>${aTot[3]} (${(aTot[3] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].sessions.nb} (${aData[_m].sessions.nbc})</td></tr>`;
				aHtml[4]+= `<td> n/a (${(aTot[4] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].sessions.pu.toFixed(2)}</td></tr>`;
				aHtml[5]+= `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
				aHtml[6]+= `<td>${aTot[6]} (${(aTot[6] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].defenses.total}</td></tr>`;
				aHtml[7]+= `<td>${aTot[7]} (${(aTot[7] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].defenses.nb} (${aData[_m].defenses.nbc})</td></tr>`;
				aHtml[8]+= `<td> n/a (${(aTot[8] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].defenses.pu.toFixed(2)}</td></tr>`;
				aHtml[9]+= `<td>&nbsp;</td>${sSuffix}`;
				aHtml[10]+= `<td>${aTot[10]} (${(aTot[10] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].coaches.total}</td></tr>`;
				aHtml[11]+= `<td>${aTot[11]} (${(aTot[11] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].coaches.nb} (${aData[_m].coaches.nbc})</td></tr>`;
				aHtml[12]+= `<td> n/a (${(aTot[12] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].coaches.pu.toFixed(2)}</td></tr>`;
				aHtml[13]+= `<td>&nbsp;</td></tr>`;
				aHtml[14]+= `<td>${aTot[14]} (${(aTot[14] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].bonus}</td></tr>`;
				aHtml[15]+= `<td>${aTot[15]} (${(aTot[15] / (aData.length - 1)).toFixed(2)})</td><td>${_iTotG}</td></tr>`;
				aHtml[16]+= `<td>&nbsp;</td></tr>`;
				aHtml[17]+= `<td>${aTot[16]} (${(aTot[16] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].kpi.jrs}</td></tr>`;
				aHtml[18]+= `<td> n/a (${(aTot[15] / aTot[16]).toFixed(2)})</td><td>${(_iTotG/aData[_m].kpi.jrs).toFixed(2)}</td></tr>`;
				aHtml[19]+= `<td>${aTot[18]} (${(aTot[18] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].kpi.hrs.toFixed(2)}</td></tr>`;
				aHtml[20]+= `<td> n/a  (${(aTot[15] / aTot[18]).toFixed(2)})</td><td>${(_iTotG/aData[_m].kpi.hrs).toFixed(2)}</td></tr>`;
				aHtml[21]+= `<td>${aTot[20].toFixed(2)} (${(aTot[20] / (aData.length - 1)).toFixed(2)})</td><td>${aData[_m].kpi.hrsp.toFixed(2)}</td></tr>`;
				aHtml[22]+= `<td> n/a  (${(aTot[15] / aTot[20]).toFixed(2)})</td><td>${(_iTotG/aData[_m].kpi.hrsp).toFixed(2)}</td></tr>`;
			} else {
				aHtml[0]+= `<td>${dayjs(aData[_m].header.dtTo).format("MMMM")}</td><td>Tot.</td></thead></tr>`;
				aHtml[1]+= `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
				aHtml[2]+= `<td>${aData[_m].sessions.total}</td><td>${aTot[2]} (${(aTot[2] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[3]+= `<td>${aData[_m].sessions.nb} (${aData[_m].sessions.nbc})</td><td>${aTot[3]} (${(aTot[3] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[4]+= `<td>${aData[_m].sessions.pu.toFixed(2)}</td><td> n/a (${(aTot[4] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[5]+= `<td>&nbsp;</td><td>&nbsp;</td></tr>`;
				aHtml[6]+= `<td>${aData[_m].defenses.total}</td><td>${aTot[6]} (${(aTot[6] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[7]+= `<td>${aData[_m].defenses.nb} (${aData[_m].defenses.nbc})</td><td>${aTot[7]} (${(aTot[7] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[8]+= `<td>${aData[_m].defenses.pu.toFixed(2)}</td><td> n/a (${(aTot[8] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[9]+= `<td>&nbsp;</td>${sSuffix}`;
				aHtml[10]+= `<td>${aData[_m].coaches.total}</td><td>${aTot[10]} (${(aTot[10] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[11]+= `<td>${aData[_m].coaches.nb} (${aData[_m].coaches.nbc})</td><td>${aTot[11]} (${(aTot[11] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[12]+= `<td>${aData[_m].coaches.pu.toFixed(2)}</td><td> n/a (${(aTot[12] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[13]+= `<td>&nbsp;</td></tr>`;
				aHtml[14]+= `<td>${aData[_m].bonus}</td><td>${aTot[14]} (${(aTot[14] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[15]+= `<td>${_iTotG}</td><td>${aTot[15]} (${(aTot[15] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[16]+= `<td>&nbsp;</td></tr>`;
				aHtml[17]+= `<td>${aData[_m].kpi.jrs}</td><td>${aTot[16]} (${(aTot[16] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[18]+= `<td>${(_iTotG/aData[_m].kpi.jrs).toFixed(2)}</td><td> n/a (${(aTot[15] / aTot[16]).toFixed(2)})</td></tr>`;
				aHtml[19]+= `<td>${aData[_m].kpi.hrs.toFixed(2)}</td><td>${aTot[18]} (${(aTot[18] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[20]+= `<td>${(_iTotG/aData[_m].kpi.hrs).toFixed(2)}</td><td> n/a  (${(aTot[15] / aTot[18]).toFixed(2)})</td></tr>`;
				aHtml[21]+= `<td>${aData[_m].kpi.hrsp.toFixed(2)}</td><td>${aTot[20].toFixed(2)} (${(aTot[20] / aData.length).toFixed(2)})</td></tr>`;
				aHtml[22]+= `<td>${(_iTotG/aData[_m].kpi.hrsp).toFixed(2)}</td><td> n/a  (${(aTot[15] / aTot[20]).toFixed(2)})</td></tr>`;
			}
		} else {
			aHtml[0]+= `<td>${dayjs(aData[_m].header.dtTo).format("MMMM")}</td>${sSuffix}`;
			aHtml[1]+= `<td>&nbsp;</td>${sSuffix}`;
			aHtml[2]+= `<td>${aData[_m].sessions.total}</td>${sSuffix}`;
			aHtml[3]+= `<td>${aData[_m].sessions.nb} (${aData[_m].sessions.nbc})</td>${sSuffix}`;
			aHtml[4]+= `<td>${aData[_m].sessions.pu.toFixed(2)}</td>${sSuffix}`;
			aHtml[5]+= `<td>&nbsp;</td>${sSuffix}`;
			aHtml[6]+= `<td>${aData[_m].defenses.total}</td>${sSuffix}`;
			aHtml[7]+= `<td>${aData[_m].defenses.nb} (${aData[_m].defenses.nbc})</td>${sSuffix}`;
			aHtml[8]+= `<td>${aData[_m].defenses.pu.toFixed(2)}</td>${sSuffix}`;
			aHtml[9]+= `<td>&nbsp;</td>${sSuffix}`;
			aHtml[10]+= `<td>${aData[_m].coaches.total}</td>${sSuffix}`;
			aHtml[11]+= `<td>${aData[_m].coaches.nb} (${aData[_m].coaches.nbc})</td>${sSuffix}`;
			aHtml[12]+= `<td>${aData[_m].coaches.pu.toFixed(2)}</td>${sSuffix}`;
			aHtml[13]+= `<td>&nbsp;</td>${sSuffix}`;
			aHtml[14]+= `<td>${aData[_m].bonus}</td>${sSuffix}`;
			aHtml[15]+= `<td>${_iTotG}</td>${sSuffix}`;
			aHtml[16]+= `<td>&nbsp;</td>${sSuffix}`;
			aHtml[17]+= `<td>${aData[_m].kpi.jrs}</td>${sSuffix}`;
			aHtml[18]+= `<td>${(_iTotG/aData[_m].kpi.jrs).toFixed(2)}</td>${sSuffix}`;
			aHtml[19]+= `<td>${aData[_m].kpi.hrs.toFixed(2)}</td>${sSuffix}`;
			aHtml[20]+= `<td>${(_iTotG/aData[_m].kpi.hrs).toFixed(2)}</td>${sSuffix}`;
			aHtml[21]+= `<td>${aData[_m].kpi.hrsp.toFixed(2)}</td>${sSuffix}`;
			aHtml[22]+= `<td>${(_iTotG/aData[_m].kpi.hrsp).toFixed(2)}</td>${sSuffix}`;
		}
		dtCurFrom = dtCurFrom.add(1, "month");
		dtCurTo = dtCurFrom.endOf("month");
	}
    sHtml = "<table>" + aHtml.join(" ") + `</tbody><tfoot><tr><td colspan=${aData.length + 1}>la valeur entre parenthèse fait reference aux annulés</td></tr></tfoot></table>`;
	
	Swal.fire({
		title: `<strong>Statistiques du ${dtFrom.format("DD/MM/YYYY")} au ${dtTo.format("DD/MM/YYYY")}</strong>`,
		icon: 'info',
		html: sHtml,
		showCloseButton: true,
		//showCancelButton: true,
		focusConfirm: false,
		position: 'center-start',
		grow: 'fullscreen',
		onOpen: (el) => {
		},
	});
	
}    
      
export {
	about,
	addCbox,
	billInDetails,
	collectAuto,
	collectChecked,
	debugMode,
	mgtDbase,
	pdf,
	razDbase,
	showBill,
	statistics,
}
