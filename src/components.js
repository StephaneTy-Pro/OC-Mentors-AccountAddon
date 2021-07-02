import {sleep} from './utils.js'
 
 
 /**
     * popupDateSelector
     * dtFrom : dayjs
     * dtTo : dayjs
     * bMonthAdjustment : for toggle month aligned to selected from endofmonth
     * TODO : check format of data before
     */

    var popupDateSelector = async function(dtFrom=null,dtTo=null, bMonthAdjustment = true){
        var sHtml="";
        sHtml+="<style>";
        sHtml+='form {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}';
        sHtml+='form input {background: #fff;border: 1px solid #9c9c9c;}';
        sHtml+='form button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}';
        sHtml+='form button:hover {background: gold;}';
        sHtml+='form label {padding: 0.5em 0.5em 0.5em 0;}';
        sHtml+='form input {padding: 0.7em;margin-bottom: 0.5rem;}';
        sHtml+='form input:focus {outline: 3px solid gold;}';
        sHtml+='@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}form label {text-align: right;grid-column: 1 / 2;}form input, form button {grid-column: 2 / 3;}}';
        sHtml+="</style>";
        sHtml+='<form class="form1" action="">';
        sHtml+='<label for="dtFrom" class="date">Date de début</label>';
        if (dtFrom){
            sHtml+='<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31" value="'+dayjs(dtFrom).format("YYYY-MM-DD")+'">';
        } else {
            sHtml+='<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31">';
        }
        sHtml+='<label for="dtTo" class="date">Date de fin</label>';
        if (dtFrom){
            sHtml+='<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31" value="'+dayjs(dtTo).format("YYYY-MM-DD")+'">';
        } else {
            sHtml+='<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31">';
        }
        //sHtml+='<button>Submit</button>';
        sHtml+='</form>';

        const { value: formValues } = await Swal.fire({
            title: "<strong>Choix de la période</strong>",
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'top-start',
            grow: 'row',
            footer: 'Choisissez la période pour la sélection des temps facturés',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                //console.log("%cPreconfirm popup", "color:coral")
                return [
                    document.getElementById('dtFrom').value,
                    document.getElementById('dtTo').value
                ]
            },
            onRender: (e) => {
                //console.log("%conRender popup", "color:coral")
            },
            onOpen: (el) => {
				// :NOTESTT remove event need to know the function so i need to specify _handler = function instead of a labmda
                if (bMonthAdjustment===true)
                    el.querySelector('#dtFrom').addEventListener('change', _handler = function(){document.getElementById('dtTo').value = dayjs(document.getElementById('dtFrom').value).endOf('month').format("YYYY-MM-DD");})
                //console.log("%conOpen popup", "color:coral")
            },
            onClose: (el) => {
                if (bMonthAdjustment===true)
                    el.querySelector('#dtFrom').removeEventListener("change", _handler);
                 //console.log("%conClose popup", "color:coral")
            },
            onAfterClose: (el) => {
                 //console.log("%conAfterClose popup", "color:coral")
            },
            onDestroy: (el) => {
                 //console.log("%conDestroy popup", "color:coral")
            },

        });
        //console.log("%cI HAVE THE VALUES", "color:coral");

        //console.log("%cPopup date selector will return :"+formValues[0]+","+formValues[1],"color:coral");

        dtFrom = dayjs(formValues[0]);
        dtTo = dayjs(formValues[1]);

        await sleep(250); //NOTESTT this timer is need else popup don't really disappear tryout 500

        //console.log("%cPopup date selector will return :"+dtFrom+","+dtTo,"color:coral");
        //console.log(dtFrom);
        //console.log(dtTo);

        return [dtFrom,dtTo];
    }
    
	/* 
	 * helper for popup toast ok 
	 * (string) text to display
	 **/
	var toastOk = async function(text){
		 await Swal.fire({
			position: 'top-end',
			icon: 'success',
			title: text,
			showConfirmButton: false,
			timer: 1500
		})
	}
	
	/*
	 * helper for table selection
	 * 
	 */ 
	var tableSelector = async function(
		sTitle="sans titre",
		sActionDescription = "Choisissez ce que vous allez faire sur les tables de la base de donnée"
	){

		GM_addStyle(".form_addon {display: grid;padding: 1em;background: #f9f9f9;border: 1px solid #c1c1c1;margin: 2rem auto 0 auto;max-width: 600px;padding: 1em;}");
		GM_addStyle(".form_addon input {background: #fff;border: 1px solid #9c9c9c;}");
		GM_addStyle(".form_addon button {background: lightgrey;padding: 0.7em;width: 100%;border: 0;}");
		GM_addStyle(".form_addon button:hover {background: gold;}");
		GM_addStyle(".form_addon label {padding: 0.5em 0.5em 0.5em 0;}");
		GM_addStyle(".form_addon input {padding: 0.7em;margin-bottom: 0.5rem;}");
		GM_addStyle(".form_addon input:focus {outline: 3px solid gold;}");
		GM_addStyle("@media (min-width: 400px) {.form_addon {grid-template-columns: 200px 1fr;grid-gap: 16px;} .form_addon label {text-align: right;grid-column: 1 / 2;} .form_addon input, .form_addon button {grid-column: 2 / 3;}}");

        var sHtml="";
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
        
        let bTblStudents = false;
        let bTblSessions = false;
        let bTblArchives = false;
        let bTblHistorySessionCache = false;

        const { value: formValues } = await Swal.fire({
            title: `<strong>${sTitle}</strong>`,
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'top-start',
            grow: 'row',
            footer: `${sActionDescription}`,
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
                    el.querySelector('#radio1').addEventListener('change', _hanlder = function(){
                        console.log(document.getElementById('radio1').checked);
                        let _b = document.getElementById('radio1').checked;
                        document.getElementById('dtFrom').disabled = ! _b
                        document.getElementById('dtTo').disabled = ! _b
                    })
                    el.querySelector('#radio2').addEventListener('change', _hanlder = function(){
                        let _b = document.getElementById('radio1').checked;
                        document.getElementById('dtFrom').disabled = ! _b
                        document.getElementById('dtTo').disabled = ! _b
                    })
                el.querySelector('#dtFrom').addEventListener('change', _hanlder = function(){
					document.getElementById('dtTo').value =
					 dayjs(document.getElementById('dtFrom').value)
					.endOf('month').format("YYYY-MM-DD");
					})
                //console.log("%conOpen popup", "color:coral")
            },
            onClose: (el) => {
                    el.querySelector('#radio1').removeEventListener("change", _hanlder);
                    el.querySelector('#radio2').removeEventListener("change", _hanlder);
                    el.querySelector('#dtFrom').removeEventListener("change", _hanlder);
                 //console.log("%conClose popup", "color:coral")
            },

        });
        bTblStudents = formValues[0];
        bTblSessions = formValues[1];
        bTblArchives = formValues[2];
        bTblHistorySessionCache = formValues[3];
	return {
		bStudents: bTblStudents,
		bSessions: bTblSessions,
		bArchives: bTblArchives,
		bHistorySessionCache: bTblHistorySessionCache,
		}
	}
    
export {
	popupDateSelector,
	toastOk,
	tableSelector,
}
