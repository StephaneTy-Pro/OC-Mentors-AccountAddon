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
        sHtml+='@media (min-width: 400px) {form {grid-template-columns: 200px 1fr;grid-gap: 16px;}label {text-align: right;grid-column: 1 / 2;}input,button {grid-column: 2 / 3;}}';
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
    
export {
	popupDateSelector,
	toastOk
}
