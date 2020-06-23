// ==UserScript==
// @name         Facturier
// @namespace    http://tampermonkey.net/
// @version      0.4.0002
// @description  try to take over the world!
// @author       Stéphane TORCHY
// @updateURL    https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/billing.js
// @downloadURL  https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/billing.js
// @match        https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest

// STT scripts
// @require      https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/docready.js

// @require      //https://cdnjs.cloudflare.com/ajax/libs/systemjs/2.1.1/system.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js
// @require      https://unpkg.com/lowdb@0.17/dist/low.min.js
// @require      https://unpkg.com/lowdb@0.17/dist/LocalStorage.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/locale/fr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/isBetween.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/isSameOrBefore.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/isSameOrAfter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/customParseFormat.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/localeData.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/draggabilly/2.2.0/draggabilly.pkgd.min.js
// GM_Config
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js

// tingle (NOTESTThave to put it on my github) sinon https://cdn.jsdelivr.net/npm/tingle.js@0.15.3/dist/tingle.min.js
// require      //https://raw.githubusercontent.com/robinparisi/tingle/master/dist/tingle.min.css
// require      //https://raw.githubusercontent.com/robinparisi/tingle/master/dist/tingle.min.js

// sweetalert 2

// uhtml - https://github.com/WebReflection/uhtml#readme
// require     https://unpkg.com/uhtml

// toastify
// @require     https://cdn.jsdelivr.net/npm/toastify-js@1.8.0/src/toastify.min.js
// @resource    toastifycss https://raw.githubusercontent.com/apvarun/toastify-js/master/src/toastify.css

//
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js

// @require     https://cdn.jsdelivr.net/npm/simple-datatables@latest
// @resource    simpledatatablecss https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css

// reqqueue https://reqqueue.github.soncodi.com/ Sequential request queue for Node.js and browsers
// require     https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/reqqueue.js
// buha         https://flouthoc.github.io/buha.js/ Browser based Strictly ordered Task Queue for Sync/Async Javascript Functions
// require     https://raw.githubusercontent.com/flouthoc/buha.js/master/buha.js
// require      https://raw.githubusercontent.com/Bartozzz/queue-promise/development/dist/index.js
// require      https://raw.githubusercontent.com/savokiss/queue/master/src/index.js
// require     https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/p-queue.js

/*
 * History
 * 0.3 Première version publique
 * 0.3.0001 Correction d"un bug sur les dates
 * 0.4 ajout de la mention dont X soutenances plutot que X soutenances
 *         + ajout de la fonctionnalité sur les périodes
 *         + le popup de selection de date incrémente automatiquement la date de fin de 1 mois si on change la date de début
 *         + nettoyage de code
 *         BUG sur la facturation prise en compte des noshow sur tous les étudiants
 *         BUG sur la prise en compte des dates
 * 0.4.0001 Correction des libellés de boutons (menu)
 * 0.4.0002 Oubli d'une trace deboggage
 * TODO
 * BUG hugo a diagnostiqué un bug en mise à jour des étudiants sur le financement dans le popup orange
 * popup qui vient dire que tout c'est bien passé suite à la collecte des données de session ( A FAIRE)
 */


// ==/UserScript==

(function() {
    'use strict';

    /* compatibility
     * from https://greasyfork.org/en/scripts/20423-patchouli/code
     * define
     *
     *     GMC.xhr()
     *     GMC.setValue()
     *     GMC.getValue()
     */
    var GMC = {
        async XHR(details) {
            const xhr = window.GM_xmlhttpRequest || (GM ? GM.xmlHttpRequest : null);
            if (!xhr) {
                return Promise.reject();
            }
            return new Promise((resolve, reject) => {
                Object.assign(details, {
                    onabort: reject,
                    onerror: reject,
                    onload: resolve,
                    ontimeout: reject,
                });
                xhr(details);
            });
        },
        async getValue(name, failv = null) {
            if (window.GM_getValue) {
                return Promise.resolve(GM_getValue(name) || failv);
            } else {
                return (await GM.getValue(name)) || failv;
            }
        },
        async setValue(name, value) {
            if (window.GM_setValue) {
                GM_setValue(name, value);
            } else {
                GM.setValue(name, value);
            }
        },
    };

    // -------------------------------------- VARS

    const aMonthFrench = [{month:'janvier',id:'01'},{month:'février',id:'02'},{month:'mars',id:'03'},{month:'avril',id:'04'},{month:'mai',id:'05'},{month:'juin',id:'06'},{month:'juillet',id:'07'},{month:'août',id:'08'},{month:'septembre',id:'09'},{month:'octobre',id:'10'},{month:'novembre',id:'11'},{month:'décembre',id:'12'}]
    const appName = "OC-Addons";
    const author = "Stéphane TORCHY";

    const sAutoFunded = "Auto-financé"; // in oc
    const sFunded = "Financé par un tiers" ; // in oc


    //const buhaRunner = buha(); // keep a queue
    //const q = new ReqQueue(false);
    //const q = new Queue(1)
    //const queue = new PQueue({concurrency: 1});

    //var inUpdateDb = false;

    // Function wrapping code.
    // fn - reference to function.
    // context - what you want "this" to be.
    // params - array of parameters to pass to function.
    var wrapFunction = function(fn, context, params) {
        return function() {
            fn.apply(context, params);
        };
    }


    //----------------------------- Helpers
    var collectChecked = async function(){
        var sPath = "table.crud-list tbody input:checked"
        var cb = document.querySelectorAll(sPath);
        for (var i = 0; i < cb.length; i+=1) {
            var oEl = cb[i].parentElement.parentElement;
            var me = parseTable(oEl);
            //console.log(me);
            console.log(`Wanna add a new checkbox content ${me.id}`);
            //buhaRunner.push(() =>{addSessionsToDbase(me);console.log("queue activated playing"+me.id)}); // need a queue for stacking demands because
            //q.add(() =>{addSessionsToDbase(me);;console.log("queue activated playing"+me.id);}); //requueue
            //q.push(() =>{addSessionsToDbase(me);}); //savokiss_queue
            //addSessionsToDbase(me); // charge à moi de gérer correctement une queue provisoire
            await addSessionsToDbase(me);
            /*(async () => {
                await queue.add(() => addSessionsToDbase(me));
                console.log("queue activated playing"+me.id)
            });*/
        }
    }
    /*
     * extract date from string dd mmmm yyyy à hh:mm
     */
    var extractDate = function(sWhen){
        //var _t = sWhen.split(' ');
        var _t = sWhen.trim().split(' '); // NOTESTT: parfois la date est précédée d'un espace je dois donc compresser la chaine sinon j'ai trop d'élements dans le tableau
        var oMonth = {month:'void',id:'void'}
            try {
                oMonth = _.find( aMonthFrench, ['month', _t[1]]);
            } catch(e) { throw Error('Erreur qui ne devrait jamais arriver en conversion de date :'+e.stack||e );}
        return `${_t[2]}-${oMonth.id}-${_t[0]}T${_t[4]}`; // correspond plus ou moins au format std day js YYYY-MM-DDTHH:MM
    }

     //----------------------------- Helpers Sessions

    /*
     * Parse an HTML TABLE to extract
     * a session
     * return a session object
     */
    var parseTable= function(oEl){
        //console.log(`parseTable `); console.dir(oEl);
        var sWhen =oEl.children[0].children[0].innerText;
        var sId = getKey(oEl.children[0]);
        var sWho = oEl.children[1].children[0].innerText; //--> NAME
        var iWho = getKey(oEl.children[1],-2); // key is not the last but the pre last :=> -2
        var sStatus = oEl.children[2].innerText.toLowerCase();
        var sType = (oEl.children[3].children.length) ? oEl.children[3].children[0].innerText.toLowerCase() : 'session';
        var sLvl = -1;
        /* sometimes level is not present */
        if (oEl.children[4].children.length > 0 ) {
			sLvl = oEl.children[4].children[0].innerText;
		}
        //console.log(`clé: ${sId}, étudiant: ${sWho}, quand: ${sWhen}, statut: ${sStatus}, type:${sType}, lvl:${sLvl}`);
        sWhen = extractDate(sWhen);
        var me = {id:sId, when:sWhen, who_id:iWho, who_name:sWho, status: sStatus, type:sType, lvl:sLvl}
        return me;
    }
    /*
     * get a param from an url by exploding the path
     *   return by default last element of path because index is by default set to -1
     */
    var getKey = function(el,idx=-1){
        try {
            var _t1 = (el.children[0].href || "/").split("/");
            return _t1[_t1.length+idx];
        } catch(e) { throw Error('Erreur qui ne devrait jamais arriver en getkey :'+e.stack||e );}
    }


    var IsSessionInDb = function(iSessionId){
        var db=sttctx.dbase; // TODO Change this to less ugly
        var r = db.get('sessions').find({id: iSessionId}).value();
        if (r === undefined){
             return false;
         }else {
             return true;
         }
    }
    /*
     * check if something is in old mode
     * by checking the date parameters is before the changing date 01/06/2020
     */
    var isInOldMode = function(date){
        var dtDate = null;
        if (typeof date === 'string'){
            dtDate = dayjs(date);
        } else {
            dtDate = date;
        }
        try {
            return dtDate.isBefore(dayjs("2020-06-01")); // STT note that : dayjs("2020-06-01").isBefore("2020-06-01") return false
        } catch(e) { throw Error('Erreur qui ne devrait jamais arriver en IsInOldMode (probablement un probleme sur la conversion de la date en objet dayjs:'+e.stack||e );}
    }
    //----------------------------- Helpers Students


    const addStudentToDb = function(sStudentId,sStudentFullName="noname",sStudentPath="nopath",sStudentFundedBy="unkonw",created){
        var db=sttctx.dbase; // TODO Change this to less ugly
        var now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
        let me = {id:sStudentId,fullname:sStudentFullName,path:sStudentPath,fundedby:sStudentFundedBy,created:now}
        db.get('students').push(JSON.parse(JSON.stringify(me))).write();
    }

    const IsStudentInDb = function(iStudentId){
        var db=sttctx.dbase; // TODO Change this to less ugly
        var r = db.get('students').find({id: iStudentId}).value()
         if (r === undefined){
             return false;
         }else {
             return true;
         }
    }
    /*
     * Return funded mode of student
     */
    var studentGetFunded = function(iStudentId){
        var db=sttctx.dbase; // TODO Change this to less ugly
        //console.log("Searching ....",iStudentId);
        var r = db.get('students').find({id: iStudentId}).value()
        //console.log(r);
         if (r == undefined){
             throw Error('IRRECOVERABLE ERROR STUDENTS NOT IN DB:');
         }else {
             return r.fundedby;
         }
    }

    /*
     * return true if student is "autofinancé"
     */
    const IsStudentAutoFunded = function(iStudentId){
        //console.log("l'étudiant est"+studentGetFunded(iStudentId).toLowerCase());
        return studentGetFunded(iStudentId).toLowerCase() === "auto-financé"
    }

    var createStudentsManually = async function(sStudentId,sStudentName,sSessionDate){
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
        sHtml+='<label for="student_id" class="name">Reference</label>';
        sHtml+='<input id="student_id" type="text" value="'+sStudentId+'">';
        sHtml+='<label for="student_name" class="name">Name</label>';
        sHtml+='<input id="student_name" type="text" value="'+sStudentName+'">';
        sHtml+='<label for="fundedby">Autofinancé</label>';
        sHtml+='<input id="fundedby" type="checkbox" value="autofunded">';
        sHtml+='<label for="student_path">Parcours</label>';
        sHtml+='<input id="student_path" type="text">';
        sHtml+='<label for="session_date">Date</label>';
        sHtml+='<input id="session_date" type="date" max="2030-12-31" min="2010-12-31" value="'+dayjs(sSessionDate).format("YYYY-MM-DD")+'">';
        //sHtml+='<button>Submit</button>';
        sHtml+='</form>';

        const { value: formValues } = await Swal.fire({
            title: "<strong>Ajout d'un étudiant en mode manuel</strong>",
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'top-start',
            grow: 'row',
            footer: `votre étudiant(e) ${sStudentName} n'a pas été trouvé`,
            preConfirm: () => {
                return [
                    document.getElementById('student_id').value,
                    document.getElementById('student_name').value,
                    document.getElementById('student_path').value,
                    document.getElementById('fundedby').checked, // true mean autofunded
                    document.getElementById('session_date').value,
                ]
            }
        });


        if(formValues){
            var sFundedBy = "";
            if(formValues[3] === true){
                sFundedBy = sAutoFunded;
            } else {
                sFundedBy = sFunded;
            }


            addStudentToDb(formValues[0],formValues[1],formValues[2],sFundedBy,formValues[4])
        }


    }

    var addSessionsToDbase = async function(oSession){
        var db=sttctx.dbase; // TODO Change this to less ugly
        var bCheckExistsBeforAdd = true;
        // Before and After 01/06
        if (isInOldMode(dayjs(oSession.when))){
            oSession.isFunded = true;
        } else {
            if (oSession.type.toLowerCase() === 'soutenance'){
                //console.log("this is a defense nothing to do specially for now");
                oSession.isFunded = true; // default
            } else {
                var bOldStudent = IsStudentInDb(oSession.who_id)
                console.log("is student in db ?", bOldStudent)
                if (bOldStudent == false){
                    // have to update database
                    console.warn("%ci'm updating db .... could'nt do anything else","color:magenta");
                    await getStudents();
                    var bPass2 = IsStudentInDb(oSession.who_id);
                    if(bPass2 == false){
                        // have to add student manually
                        return createStudentsManually(oSession.who_id, oSession.who_name, oSession.when);
                    }
                }
                // check date of session
                console.log("will check fund mode");
                    oSession.isFunded = !(IsStudentAutoFunded(oSession.who_id));
                }

            }
        // because of Difference between AF and not AF
        console.log("is student funded ?", oSession.isFunded)

        if(bCheckExistsBeforAdd){
            if (IsSessionInDb(oSession.id) == false){
                db.get('sessions').push(JSON.parse(JSON.stringify(oSession))).write();
            } else {
                console.info(`${oSession.who_sname} at ${oSession.when} already present in database table sessions`);
            }
        } else {
            db.get('sessions').push(JSON.parse(JSON.stringify(oSession))).write();
        }
    }
    /*
     * browse dashboard of students to get financial mode*/
    var getFinancialMode = async function(id){
        const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${id}/dashboard`, ".mentorshipStudent__details > p");
        //console.log("oDom",oDom.innerText);
        return oDom.innerText;
    }
    // -- fetch
    /* TODO add a cursor for waiting */
    var _fetch = async function(sUrl="", sPath="", bAll=false){
        /*setTimeout(function() {
            Toastify({
                text: `Collecte des info liées à l'url : ${sUrl}`,
                gravity: "top",
                position: 'right',
                close: true,
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }).showToast();
        }, 3000);*/
        console.info(`%c_fetch() waiting return from ${sUrl}`,'background-color:green,color:white');
        const response = await GMC.XHR({
            method: 'GET',
            url: sUrl,
            responseType: 'text/html',
            //binary: true,
            headers: {
                "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            },
        });
        //console.log("_fetch() proceed domparser");
        let domparser = new DOMParser();
        /*
        response.responseXML.body is malformed so i need responseText
        responseText add \n, need to proceed a [string].replace(/\\n/mg,"\n")
        */
        let doc = domparser.parseFromString(response.responseText.replace(/\n/mg,""), "text/html");
        var oDom = {}
        if (bAll===true){
            oDom = doc.querySelectorAll(sPath);
        } else {
            oDom = doc.querySelector(sPath); // need only first
        }
        return oDom;
    }

    var sandBox = async function(){
        //fetchG()
        let data = []
        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
        historyFetch( dtFrom, dtTo, 1, data);
    }

    
    /*
     *
     * pg = current page of history
     */
    var historyFetch = async function (dtFrom,dtTo,pg,data=[]){

        //console.log(`wanna fetch history between ${dtFrom.format()} and ${dtTo.format()} searching in page ${pg} of history`);

        Swal.fire({
            position: 'top-end',
            icon: 'info',
            toast: true,
            title: "Collecte des sessions dans l'historique page : "+pg+"...\ncela peut prendre du temps",
            showConfirmButton: false,
            timer: 1500
        });

        let f_dtFrom = dayjs(dtFrom).subtract(1, 'day');
        let f_dtTo = dayjs(dtTo).add(1, 'day');

        const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history?page=${pg}`, "table.crud-list tbody");
        // check if first line is after start of parsing date data
       
        // don't load next page if date of last line is before start date of data
        let iRecurse = 0;
        let iMaxRecurse = 10;
        let dtFirstRowDate = convertRowToDate(oDom,0)
        let bBrowse = true
        var res = {}
        while(bBrowse){
            if (iRecurse > iMaxRecurse) {
                console.warn("%cEMERGENCY EXIT LOOP","color:orange");
                break; // emergency exit
            }
            pg+=1
            res = await _historyFetch(dtFrom, dtTo, pg, data)
            //console.dir(res);console.log(res.length);
            //Si la dernière ligne du tableau est plus récente que la date de bébut arrête
            if(res.length>0 && dayjs(res[res.length-1].when).isSameOrBefore(dtFrom) === true){
                bBrowse = false;
            }
            iRecurse+=1
        }

        console.dir(res)

        for(var i in res){
            //console.log(res[i]);
            if(dayjs(res[i].when).isBefore(dtFrom, "day") === true){
                Swal.fire({
                    position: 'top-end',
                    icon: 'info',
                    toast: true,
                    title: "Collecte des sessions\nCollete terminée",
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
                await addSessionsToDbase(res[i]);
            }
        }
    }

    var convertRowToDate =  function(oDom, index=0){
         if (index === -1) {
            index = oDom.children.length-1
        }
        console.log(`index is ${index}`);
        var sRowDate = oDom.children[index].children[0].innerText;
        console.log(`sRowDate is ${sRowDate}`);
        let f_sRowDate = extractDate(sRowDate);
        //console.log(`utilise la date extraite de la chaine : ${f_sRowDate} pour trouver la date `);
        var dtRowDate = dayjs(f_sRowDate); // -- trop simpliste n'intègre pas l'été/hiver
        return dtRowDate;
    }

    var _historyFetch = async function(dtFrom,dtTo,pg=1,data=[]){
        Swal.fire({
            position: 'top-end',
            icon: 'info',
            toast: true,
            title: "Collecte des sessions de l'historique\ndu "+dtFrom.format("DD/MM/YYYY")+" au "+dtTo.format("DD/MM/YYYY")+" \npage : "+pg+"\ncela peut prendre du temps...",
            showConfirmButton: false,
            timer: 3000
        });
        const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history?page=${pg}`, "table.crud-list tbody");
        if(convertRowToDate(oDom,-1).isSameOrAfter(dtTo)===true) {

            console.dir(oDom[oDom.children.length-1]);
            console.log("optimisation ne charge pas ce n'est pas encore arrivé");
            return data;
        }
        for(var i = 0; i<oDom.children.length; i+=1){
            var row = oDom.children[i];
            //if first line is

            //if last line is
            //console.log(row);
            var me = parseTable(row);
            //console.log(me);
            //data = _.merge(me, data); // Object.assign(data, me) ?  -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
            data.push(me);
        }
        return data;
    }



    //----------------------------- Actions
    var addCbox = function(){
        var sPath ="table.crud-list tbody"
        var sessions = document.querySelector(sPath)// le All me retourne aussi le tableau des étudiants
        console.log(`the sessions are ${sessions}`);
        for (const el of sessions.children) {
            //console.log(el.children[0].innerText)
            var inputElem = document.createElement('input');
            inputElem.type = "checkbox";
            inputElem.name = "name";
            inputElem.value = "value";
            inputElem.id = "id";
            //console.log(el);
            var id = getKey(el.children[0]);
            //console.log(id);
            var bChecked = IsSessionInDb(id);
            console.log(`is the session with id ${id} in db ? ${bChecked}`);
            if (bChecked === true) inputElem.checked = true;
            var td = document.createElement('td');
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
        td = document.createElement('td');
        td.appendChild(inputElem);
        el.appendChild(td);
    }

    //var getStudents = async function(e,ctx){
    const getStudents = async (e,ctx) => { // mode JS2020
        var bForceUpdate = false; //TODO temporary
        ctx = ctx || sttctx; // TODO Change this to less ugly
        //console.log(ctx)
        //var data = []// [{id:null,path:null}]
        var sPath ="table.crud-list tbody"
        var aStudents = document.querySelectorAll(sPath)[1];
        var now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
        var db=ctx.dbase;
        // --
        Swal.fire({
            position: 'top-end',
            icon: 'info',
            toast: true,
            title: 'mise à jour de la base de donnée des étudiants...\ncela peut prendre du temps',
            showConfirmButton: false,
            timer: 1000
        })
        //console.log(now);
        for (const el of aStudents.children) {
            //console.log(el.children[0].innerText);
            //console.log(`Processing...${el.children[0].innerText}`);
            /*
            setTimeout(function() {
                    Toastify({
                        text: `Collecte les données de l'étudiant : ${el.children[0].innerText}`,
                        gravity: "top",
                        position: 'right',
                        close: true,
                        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }).showToast();
                }, 300);
            */
            var sStudentId = getKey(el.children[0],-2);
            var sStudentFullName = el.children[0].innerText;
            var sStudentPath = "non défini";
            if(el.children[1].firstElementChild){ // sometimes there is no info of path for a students in OC table
                sStudentPath = el.children[1].firstElementChild.href.split("/").pop();
            }
            var res = db.get('students').find({id: sStudentId}).value();
            if(res && bForceUpdate===false){
                    console.log(`${sStudentFullName}(uniquid:${sStudentId}) already present in database created at ${res.created}`)
            } else {
                let sStudentFundedBy = await getFinancialMode(sStudentId);
                console.log(`Financial Mode of student ${sStudentFullName}(id${sStudentId}) is ${sStudentFundedBy}`);
                //setTimeout(function() {
                    Toastify({
                        text: `Ajoute l'étudiant : ${sStudentFullName}(${sStudentFundedBy}) en base`,
                        gravity: "top",
                        position: 'right',
                        close: true,
                        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }).showToast();
                //}, 500);
                //let me = {id:sStudentId,fullname:sStudentFullName,path:sStudentPath,fundedby:sStudentFundedBy,created:now}
                //data.push(me);
                //db.get('students').push(JSON.parse(JSON.stringify(me))).write();
                addStudentToDb(sStudentId, sStudentFullName, sStudentPath, sStudentFundedBy, now)
            }


        }
    }

    var showStudentsList = function(){
        var db=sttctx.dbase; // TODO Change this to less ugly
        let r = db.get('students').value();
        //console.log(r);

        var sHtml = '<table>';
        sHtml+= '<caption>Liste des étudiant</caption>';
        sHtml+= '<thead>';
        sHtml+= '<tr>';
        sHtml+= `<th>Nom</th><th>Parcours</th><th>Financé</th><th>date de création</th>`;
        sHtml+= '</tr>';
        sHtml+= '</thead>';
        sHtml+= '<tbody>';
        for(var idx in r){
            sHtml+= '<tr>';
            sHtml+= `<td>${r[idx].fullname}</td><td>${r[idx].path}</td><td>${r[idx].fundedby}</td><td>${r[idx].created}</td>`;
            sHtml+= '</tr>';
        }
        sHtml+= '</tbody>';
        sHtml+= '</table>';

        Swal.fire({
            title: '<strong>Liste des Etudiants</strong>',
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            focusConfirm: false,
            position: 'top-start',
            grow: 'fullscreen',
            onOpen: (el) => {
                var myTable = el.querySelector("table");
                var dataTable = new simpleDatatables.DataTable(myTable);
            },
        });
    }



    var showBill = async function(){
        var db=sttctx.dbase; // TODO Change this to less ugly
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

       
        var [dt1,dt2] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
        var dtFrom = dayjs(dt1).subtract(1, 'day');
        var dtTo = dayjs(dt2).add(1, 'day');
        //var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isBefore(dtTo) && dayjs(v.when).isAfter(dtFrom));

        var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isSameOrBefore(dt2,'day') && dayjs(v.when).isSameOrAfter(dt1,'day'));

         if(dtFrom.add(1,'day').isBefore(dayjs("2020-06-01"))){
             billPhase1(dtFiltered,dt1.format("DD/MM/YYYY"),dt2.format("DD/MM/YYYY"));
         } else {
             billPhase2(dtFiltered,dt1.format("DD/MM/YYYY"),dt2.format("DD/MM/YYYY"));
         }
    }

    var billPhase1 = function(r,from,to){
        console.log('billPhase1');
        var iPrice1=30,iPrice2=35,iPrice3=40,iPrice4=50;
        var l10 = r.filter( v => v.lvl == 1 && v.status === 'réalisée');
        var l11 = r.filter( v => v.lvl == 1 && v.status === 'annulée');
        var l12 = r.filter( v => v.lvl == 1 && v.status === 'annulée tardivement');
        var l13 = r.filter( v => v.lvl == 1 && v.status === 'étudiant absent');
        //
        var l20 = r.filter( v => v.lvl == 2 && v.status === 'réalisée');
        var l21 = r.filter( v => v.lvl == 2 && v.status === 'annulée');
        var l22 = r.filter( v => v.lvl == 2 && v.status === 'annulée tardivement');
        var l23 = r.filter( v => v.lvl == 2 && v.status === 'étudiant absent');
        //
        var l30 = r.filter( v => v.lvl == 3 && v.status === 'réalisée');
        var l31 = r.filter( v => v.lvl == 3 && v.status === 'annulée');
        var l32 = r.filter( v => v.lvl == 3 && v.status === 'annulée tardivement');
        var l33 = r.filter( v => v.lvl == 3 && v.status === 'étudiant absent');
        //
        var l40 = r.filter( v => v.lvl == 4 && v.status === 'réalisée') ||0 ;
        var l41 = r.filter( v => v.lvl == 4 && v.status === 'annulée') || 0;
        var l42 = r.filter( v => v.lvl == 4 && v.status === 'annulée tardivement') || 0;
        var l43 = r.filter( v => v.lvl == 4 && v.status === 'étudiant absent') || 0;
        //
        var t10 = l10.reduce( (ac,cv,i,a) => ac+iPrice1 ,0);
        var t11 = l11.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t12 = l12.reduce( (ac,cv,i,a) => ac+iPrice1 ,0);
        var t13 = l13.reduce( (ac,cv,i,a) => ac+iPrice1/2 ,0);
        //
        var t20 = l20.reduce( (ac,cv,i,a) => ac+iPrice2 ,0);
        var t21 = l21.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t22 = l22.reduce( (ac,cv,i,a) => ac+iPrice2 ,0);
        var t23 = l23.reduce( (ac,cv,i,a) => ac+iPrice2/2 ,0);
        //
        var t30 = l30.reduce( (ac,cv,i,a) => ac+iPrice3 ,0);
        var t31 = l31.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t32 = l32.reduce( (ac,cv,i,a) => ac+iPrice3 ,0);
        var t33 = l33.reduce( (ac,cv,i,a) => ac+iPrice3/2 ,0);
        //
        var t40 = l40.reduce( (ac,cv,i,a) => ac+iPrice4 ,0);
        var t41 = l41.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t42 = l42.reduce( (ac,cv,i,a) => ac+iPrice4 ,0);
        var t43 = l43.reduce( (ac,cv,i,a) => ac+iPrice4/2 ,0);

        // var soutenance
        var soutenances = r.filter( v => v.type.toLowerCase() === 'soutenance') || 0;

        var sHtml = '<table>';
        sHtml+= '<caption>Sessions de mentorat</caption>';
        sHtml+= '<thead>';
        sHtml+= '<tr>';
        sHtml+= `<th>Type de session</th><th>Nombre de sessions</th><th>Montant unitaire (HT)</th><th>Montant à facturer (HT)</th>`;
        sHtml+= '</tr>';
        sHtml+= '</thead>';
        sHtml+= '<tbody>';
        sHtml+= '<tr>';
        sHtml+= `<td>Sessions de groupe</td><td>${l40.value().length+l42.value().length}</td><td>${iPrice4}</td><td>${t40+t42}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 1</td><td>${l10.value().length+l12.value().length}</td><td>${iPrice1}</td><td>${t10+t12}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 2</td><td>${l20.value().length+l22.value().length}</td><td>${iPrice2}</td><td>${t20+t22}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 3</td><td>${l30.value().length+l32.value().length}</td><td>${iPrice3}</td><td>${t30+t32}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tbody>';
        sHtml+= '<tfoot>';
        sHtml+= '<tr>';
        sHtml+= `<td>Total</td><td>${l40.value().length+l10.value().length+l20.value().length+l30.value().length+l42.value().length+l12.value().length+l22.value().length+l32.value().length}</td><td></td><td>${t10+t20+t30+t40+t12+t22+t32+t42}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tfoot>';
        sHtml+= '</table>'
        sHtml+= '<table>';
        sHtml+= '<caption>Sessions de mentorat(No-Show)</caption>';
        sHtml+= '<thead>';
        sHtml+= '<tr>';
        sHtml+= `<th>No-Show</th><th>Nombre de sessions</th><th>Montant unitaire (HT)</th><th>Montant à facturer (HT)</th>`;
        sHtml+= '</tr>';
        sHtml+= '</thead>';
        sHtml+= '<tbody>';
        sHtml+= '<tr>';
        sHtml+= `<td>Sessions de groupe</td><td>${l43.value().length}</td><td>${iPrice4/2}</td><td>${t43}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 1</td><td>${l13.value().length}</td><td>${iPrice1/2}</td><td>${t13}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 2</td><td>${l23.value().length}</td><td>${iPrice2/2}</td><td>${t23}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 3</td><td>${l33.value().length}</td><td>${iPrice3/2}</td><td>${t33}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tbody>';
        sHtml+= '<tfoot>';
        sHtml+= '<tr>';
        sHtml+= `<td>Total</td><td>${l43.value().length+l13.value().length+l23.value().length+l33.value().length}</td><td></td><td>${t13+t23+t33+t43}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tfoot>';
        sHtml+= '</table>';
        sHtml+= `<p>Vous avez avez également annulé ${l41.value().length+l11.value().length+l21.value().length+l31.value().length} sessions sur un total de ${r.value().length} sessions </p>`
        sHtml+= `<p>Par ailleurs, le total des sessions inclut ${soutenances.value().length} soutenances</p>`

        /* */
        let sessionsWithoutStatus = r.filter( v => (v.status !== 'étudiant absent') && (v.status !== 'annulée') && (v.status !== 'annulée tardivement') && (v.status !== 'réalisée'))

        if(sessionsWithoutStatus.value().length!=0){
           sHtml+= `<p>ATTENTION vous avez ${sessionsWithoutStatus.value().length} session(s) sans statut ou dont le statut n'est pas reconnu (donc non comptabilisé(es), plus d'info dans le log js</p>`;
           console.log("Session sans statut");
           console.dir(sessionsWithoutStatus.value());
        }
        let sessionsWithoutLevel = r.filter( v => (v.lvl !== "1") && (v.lvl !== "2") && (v.lvl !== "3") && (v.lvl !== "4"))
        if(sessionsWithoutLevel.value().length!=0){
            sHtml+= `<p>ATTENTION vous avez ${sessionsWithoutLevel.value().length} session(s) sans niveau ou dont le niveau n'est pas reconnu (donc non comptabilisé(es), plus d'info dans le log js</p>` ;
            console.log("Sessions sans niveau");
            console.dir(sessionsWithoutLevel.value());
        }

        Swal.fire({
            title: '<strong>Liste des formations tarifées</strong>',
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'center-start',
            grow: 'column',
        });
    }
    var billPhase2 = function(r, from, to){

        console.log(`wanna bill for date from ${from} to ${to}`);
        console.log(r);

        var iPrice1=30,iPrice2=35,iPrice3=40,iPrice4=50;
        var l10 = r.filter( v => v.lvl == 1 && v.status === 'réalisée' && v.isFunded === true);
        var l11 = r.filter( v => v.lvl == 1 && v.status === 'annulée' && v.isFunded === true);
        var l12 = r.filter( v => v.lvl == 1 && v.status === 'annulée tardivement' && v.isFunded === true);
        var l13 = r.filter( v => v.lvl == 1 && v.status === 'étudiant absent' && v.isFunded === true);

        var l14 = r.filter( v => v.lvl == 1 && v.status === 'réalisée' && v.isFunded === false);
        var l15 = r.filter( v => v.lvl == 1 && v.status === 'annulée' && v.isFunded === false);
        var l16 = r.filter( v => v.lvl == 1 && v.status === 'annulée tardivement' && v.isFunded === false);
        var l17 = r.filter( v => v.lvl == 1 && v.status === 'étudiant absent' && v.isFunded === false);

        //
        var l20 = r.filter( v => v.lvl == 2 && v.status === 'réalisée' && v.isFunded === true);
        var l21 = r.filter( v => v.lvl == 2 && v.status === 'annulée' && v.isFunded === true);
        var l22 = r.filter( v => v.lvl == 2 && v.status === 'annulée tardivement' && v.isFunded === true);
        var l23 = r.filter( v => v.lvl == 2 && v.status === 'étudiant absent' && v.isFunded === true);

        var l24 = r.filter( v => v.lvl == 2 && v.status === 'réalisée' && v.isFunded === false);
        var l25 = r.filter( v => v.lvl == 2 && v.status === 'annulée' && v.isFunded === false);
        var l26 = r.filter( v => v.lvl == 2 && v.status === 'annulée tardivement' && v.isFunded === false);
        var l27 = r.filter( v => v.lvl == 2 && v.status === 'étudiant absent' && v.isFunded === false);
        //
        var l30 = r.filter( v => v.lvl == 3 && v.status === 'réalisée' && v.isFunded === true);
        var l31 = r.filter( v => v.lvl == 3 && v.status === 'annulée' && v.isFunded === true);
        var l32 = r.filter( v => v.lvl == 3 && v.status === 'annulée tardivement' && v.isFunded === true);
        var l33 = r.filter( v => v.lvl == 3 && v.status === 'étudiant absent' && v.isFunded === true);

        var l34 = r.filter( v => v.lvl == 3 && v.status === 'réalisée' && v.isFunded === false);
        var l35 = r.filter( v => v.lvl == 3 && v.status === 'annulée' && v.isFunded === false);
        var l36 = r.filter( v => v.lvl == 3 && v.status === 'annulée tardivement' && v.isFunded === false);
        var l37 = r.filter( v => v.lvl == 3 && v.status === 'étudiant absent' && v.isFunded === false);
        //
        var l40 = r.filter( v => v.lvl == 4 && v.status === 'réalisée' && v.isFunded === true) ||0 ;
        var l41 = r.filter( v => v.lvl == 4 && v.status === 'annulée' && v.isFunded === true) || 0;
        var l42 = r.filter( v => v.lvl == 4 && v.status === 'annulée tardivement' && v.isFunded === true) || 0;
        var l43 = r.filter( v => v.lvl == 4 && v.status === 'étudiant absent' && v.isFunded === true) || 0;

        var l44 = r.filter( v => v.lvl == 4 && v.status === 'réalisée' && v.isFunded === false) ||0 ;
        var l45 = r.filter( v => v.lvl == 4 && v.status === 'annulée' && v.isFunded === false) || 0;
        var l46 = r.filter( v => v.lvl == 4 && v.status === 'annulée tardivement' && v.isFunded === false) || 0;
        var l47 = r.filter( v => v.lvl == 4 && v.status === 'étudiant absent' && v.isFunded === false) || 0;

        // en AF il n’y a plus que le absent au bout de 10mn qui est rémunré sion c’est no show pas payé. annulé tardiement n’est plus payé pour les AF (modifié)
        //
        var t10 = l10.reduce( (ac,cv,i,a) => ac+iPrice1 ,0);   // réalisé
        var t11 = l11.reduce( (ac,cv,i,a) => ac+0 ,0);         // annulé
        var t12 = l12.reduce( (ac,cv,i,a) => ac+iPrice1 ,0);   // annulé tardivement
        var t13 = l13.reduce( (ac,cv,i,a) => ac+iPrice1/2 ,0); // absent

        var t14 = l14.reduce( (ac,cv,i,a) => ac+iPrice1/2 ,0);
        var t15 = l15.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t16 = l16.reduce( (ac,cv,i,a) => ac+0 ,0); // var t16 = l16.reduce( (ac,cv,i,a) => ac+iPrice1/2 ,0);
        var t17 = l17.reduce( (ac,cv,i,a) => ac+iPrice1/4 ,0);
        //
        var t20 = l20.reduce( (ac,cv,i,a) => ac+iPrice2 ,0);
        var t21 = l21.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t22 = l22.reduce( (ac,cv,i,a) => ac+iPrice2 ,0);
        var t23 = l23.reduce( (ac,cv,i,a) => ac+iPrice2/2 ,0);

        var t24 = l24.reduce( (ac,cv,i,a) => ac+iPrice2/2 ,0);
        var t25 = l25.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t26 = l26.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t27 = l27.reduce( (ac,cv,i,a) => ac+iPrice2/4 ,0);
        //
        var t30 = l30.reduce( (ac,cv,i,a) => ac+iPrice3 ,0);
        var t31 = l31.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t32 = l32.reduce( (ac,cv,i,a) => ac+iPrice3 ,0);
        var t33 = l33.reduce( (ac,cv,i,a) => ac+iPrice3/2 ,0);

        var t34 = l34.reduce( (ac,cv,i,a) => ac+iPrice3/2 ,0);
        var t35 = l35.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t36 = l36.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t37 = l37.reduce( (ac,cv,i,a) => ac+iPrice3/4 ,0);
        //
        var t40 = l40.reduce( (ac,cv,i,a) => ac+iPrice4 ,0);
        var t41 = l41.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t42 = l42.reduce( (ac,cv,i,a) => ac+iPrice4 ,0);
        var t43 = l43.reduce( (ac,cv,i,a) => ac+iPrice4/2 ,0);

        var t44 = l44.reduce( (ac,cv,i,a) => ac+iPrice4/2 ,0);
        var t45 = l45.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t46 = l46.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t47 = l47.reduce( (ac,cv,i,a) => ac+iPrice4/4 ,0);

        // var soutenance
        var def = r.filter( v => v.type.toLowerCase() === 'soutenance') || 0;
        var d10 = def.filter( v => v.lvl == 1 && v.status === 'réalisée' && v.isFunded === true);
        var d11 = def.filter( v => v.lvl == 1 && v.status === 'annulée' && v.isFunded === true);
        var d12 = def.filter( v => v.lvl == 1 && v.status === 'annulée tardivement' && v.isFunded === true);
        var d13 = def.filter( v => v.lvl == 1 && v.status === 'étudiant absent' && v.isFunded === true);
/*
        var l14 = r.filter( v => v.lvl == 1 && v.status === 'réalisée' && v.isFunded === false);
        var l15 = r.filter( v => v.lvl == 1 && v.status === 'annulée' && v.isFunded === false);
        var l16 = r.filter( v => v.lvl == 1 && v.status === 'annulée tardivement' && v.isFunded === false);
        var l17 = r.filter( v => v.lvl == 1 && v.status === 'étudiant absent' && v.isFunded === false);
*/
        //
        var d20 = def.filter( v => v.lvl == 2 && v.status === 'réalisée' && v.isFunded === true);
        var d21 = def.filter( v => v.lvl == 2 && v.status === 'annulée' && v.isFunded === true);
        var d22 = def.filter( v => v.lvl == 2 && v.status === 'annulée tardivement' && v.isFunded === true);
        var d23 = def.filter( v => v.lvl == 2 && v.status === 'étudiant absent' && v.isFunded === true);
/*
        var l24 = r.filter( v => v.lvl == 2 && v.status === 'réalisée' && v.isFunded === false);
        var l25 = r.filter( v => v.lvl == 2 && v.status === 'annulée' && v.isFunded === false);
        var l26 = r.filter( v => v.lvl == 2 && v.status === 'annulée tardivement' && v.isFunded === false);
        var l27 = r.filter( v => v.lvl == 2 && v.status === 'étudiant absent' && v.isFunded === false);
*/
        //
        var d30 = def.filter( v => v.lvl == 3 && v.status === 'réalisée' && v.isFunded === true);
        var d31 = def.filter( v => v.lvl == 3 && v.status === 'annulée' && v.isFunded === true);
        var d32 = def.filter( v => v.lvl == 3 && v.status === 'annulée tardivement' && v.isFunded === true);
        var d33 = def.filter( v => v.lvl == 3 && v.status === 'étudiant absent' && v.isFunded === true);
/*
        var l34 = r.filter( v => v.lvl == 3 && v.status === 'réalisée' && v.isFunded === false);
        var l35 = r.filter( v => v.lvl == 3 && v.status === 'annulée' && v.isFunded === false);
        var l36 = r.filter( v => v.lvl == 3 && v.status === 'annulée tardivement' && v.isFunded === false);
        var l37 = r.filter( v => v.lvl == 3 && v.status === 'étudiant absent' && v.isFunded === false);
*/
        //
        var d40 = def.filter( v => v.lvl == 4 && v.status === 'réalisée' && v.isFunded === true) ||0 ;
        var d41 = def.filter( v => v.lvl == 4 && v.status === 'annulée' && v.isFunded === true) || 0;
        var d42 = def.filter( v => v.lvl == 4 && v.status === 'annulée tardivement' && v.isFunded === true) || 0;
        var d43 = def.filter( v => v.lvl == 4 && v.status === 'étudiant absent' && v.isFunded === true) || 0;
/*
        var l44 = r.filter( v => v.lvl == 4 && v.status === 'réalisée' && v.isFunded === false) ||0 ;
        var l45 = r.filter( v => v.lvl == 4 && v.status === 'annulée' && v.isFunded === false) || 0;
        var l46 = r.filter( v => v.lvl == 4 && v.status === 'annulée tardivement' && v.isFunded === false) || 0;
        var l47 = r.filter( v => v.lvl == 4 && v.status === 'étudiant absent' && v.isFunded === false) || 0;
*/
        var df10 = d10.reduce( (ac,cv,i,a) => ac+iPrice1 ,0);
        var df11 = d11.reduce( (ac,cv,i,a) => ac+0 ,0);
        var df12 = d12.reduce( (ac,cv,i,a) => ac+iPrice1 ,0);
        var df13 = d13.reduce( (ac,cv,i,a) => ac+iPrice1/2 ,0);
/*
        var 14 = l14.reduce( (ac,cv,i,a) => ac+iPrice1/2 ,0);
        var t15 = l15.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t16 = l16.reduce( (ac,cv,i,a) => ac+iPrice1/2 ,0);
        var t17 = l17.reduce( (ac,cv,i,a) => ac+iPrice1/4 ,0);
*/        //
        var df20 = d20.reduce( (ac,cv,i,a) => ac+iPrice2 ,0);
        var df21 = d21.reduce( (ac,cv,i,a) => ac+0 ,0);
        var df22 = d22.reduce( (ac,cv,i,a) => ac+iPrice2 ,0);
        var df23 = d23.reduce( (ac,cv,i,a) => ac+iPrice2/2 ,0);
/*
        var t24 = l24.reduce( (ac,cv,i,a) => ac+iPrice2/2 ,0);
        var t25 = l25.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t26 = l26.reduce( (ac,cv,i,a) => ac+iPrice2/2 ,0);
        var t27 = l27.reduce( (ac,cv,i,a) => ac+iPrice2/4 ,0);
*/        //
        var df30 = d30.reduce( (ac,cv,i,a) => ac+iPrice3 ,0);
        var df31 = d31.reduce( (ac,cv,i,a) => ac+0 ,0);
        var df32 = d32.reduce( (ac,cv,i,a) => ac+iPrice3 ,0);
        var df33 = d33.reduce( (ac,cv,i,a) => ac+iPrice3/2 ,0);
/*
        var t34 = l34.reduce( (ac,cv,i,a) => ac+iPrice3/2 ,0);
        var t35 = l35.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t36 = l36.reduce( (ac,cv,i,a) => ac+iPrice3/2 ,0);
        var t37 = l37.reduce( (ac,cv,i,a) => ac+iPrice3/4 ,0);
*/        //
        var df40 = d40.reduce( (ac,cv,i,a) => ac+iPrice4 ,0);
        var df41 = d41.reduce( (ac,cv,i,a) => ac+0 ,0);
        var df42 = d42.reduce( (ac,cv,i,a) => ac+iPrice4 ,0);
        var df43 = d43.reduce( (ac,cv,i,a) => ac+iPrice4/2 ,0);
/*
        var t44 = l44.reduce( (ac,cv,i,a) => ac+iPrice4/2 ,0);
        var t45 = l45.reduce( (ac,cv,i,a) => ac+0 ,0);
        var t46 = l46.reduce( (ac,cv,i,a) => ac+iPrice4/2 ,0);
        var t47 = l47.reduce( (ac,cv,i,a) => ac+iPrice4/4 ,0);
*/

        /* https://www.w3.org/WAI/tutorials/tables/multi-level/ */
        var sHtml ="";
        sHtml+= "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";

        sHtml+= '<div class="wrapper">';
        sHtml+= '<table>';
        sHtml+= '<caption>Sessions de mentorat</caption>';
        sHtml+= '<thead>';
        sHtml+= '<tr>';
        sHtml+= '<th rowspan="2"></th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th>';
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>`;
        sHtml+= `<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>`;
        sHtml+= '</tr>';
        sHtml+= '</thead>';
        sHtml+= '<tbody>';
        sHtml+= '<tr>';
        sHtml+= `<td>Sessions de groupe</td><td>${l40.value().length+l42.value().length}</td><td>${iPrice4}</td><td>${t40+t42}€</td>`;
        sHtml+= `<td>${l44.value().length+l46.value().length}</td><td>${iPrice4/2}</td><td>${t44+t46}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 1</td><td>${l10.value().length+l12.value().length}</td><td>${iPrice1}</td><td>${t10+t12}€</td>`;
        sHtml+= `<td>${l14.value().length+l16.value().length}</td><td>${iPrice1/2}</td><td>${t14+t16}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 2</td><td>${l20.value().length+l22.value().length}</td><td>${iPrice2}</td><td>${t20+t22}€</td>`;
        sHtml+= `<td>${l24.value().length+l26.value().length}</td><td>${iPrice2/2}</td><td>${t24+t26}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 3</td><td>${l30.value().length+l32.value().length}</td><td>${iPrice3}</td><td>${t30+t32}€</td>`;
        sHtml+= `<td>${l34.value().length+l36.value().length}</td><td>${iPrice3/2}</td><td>${t34+t36}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tbody>';
        sHtml+= '<tfoot>';
        sHtml+= '<tr>';
        sHtml+= `<td>Total</td><td>${l40.value().length+l10.value().length+l20.value().length+l30.value().length+l42.value().length+l12.value().length+l22.value().length+l32.value().length}</td><td></td><td>${t10+t20+t30+t40+t12+t22+t32+t42}€</td>`;
        sHtml+= `<td>${l44.value().length+l14.value().length+l24.value().length+l34.value().length+l46.value().length+l16.value().length+l26.value().length+l36.value().length}</td><td></td><td>${t14+t24+t34+t44+t16+t26+t36+t46}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>Grand Total</td><td>${l40.value().length+l10.value().length+l20.value().length+l30.value().length+l42.value().length+l12.value().length+l22.value().length+l32.value().length+l44.value().length+l14.value().length+l24.value().length+l34.value().length+l46.value().length+l16.value().length+l26.value().length+l36.value().length}</td><td></td><td>${t10+t20+t30+t40+t12+t22+t32+t42+t14+t24+t34+t44+t16+t26+t36+t46}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tfoot>';
        sHtml+= '</table>'
        sHtml+= '<table>';
        sHtml+= '<caption>Sessions de mentorat (No-Show)</caption>';
        sHtml+= '<thead>';
        sHtml+= '<tr>';
        sHtml+= '<th rowspan="2"></th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th>';
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>`;
        sHtml+= `<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>`;
        sHtml+= '</tr>';
        sHtml+= '</thead>';
        sHtml+= '<tbody>';
        sHtml+= '<tr>';
        sHtml+= `<td>Sessions de groupe</td><td>${l43.value().length}</td><td>${iPrice4/2}</td><td>${t43}€</td>`;
        sHtml+= `<td>${l47.value().length}</td><td>${iPrice4/4}</td><td>${t47}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 1</td><td>${l13.value().length}</td><td>${iPrice1/2}</td><td>${t13}€</td>`;
        sHtml+= `</td><td>${l17.value().length}</td><td>${iPrice1/4}</td><td>${t17}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 2</td><td>${l23.value().length}</td><td>${iPrice2/2}</td><td>${t23}€</td>`;
        sHtml+= `<td>${l27.value().length}</td><td>${iPrice2/4}</td><td>${t27}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '<tr>';
        sHtml+= `<td>de Niveau d'expertise 3</td><td>${l33.value().length}</td><td>${iPrice3/2}</td><td>${t33}€</td>`;
        sHtml+= `<td>${l37.value().length}</td><td>${iPrice3/4}</td><td>${t37}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tbody>';
        sHtml+= '<tfoot>';
        sHtml+= '<tr>';
        sHtml+= `<td>Total</td><td>${l43.value().length+l13.value().length+l23.value().length+l33.value().length}</td><td></td><td>${t13+t23+t33+t43}€</td>`;
        sHtml+= '</tr>';
        sHtml+= '</tfoot>';
        sHtml+= '</table>';
        sHtml+= `<p>Vous avez avez également annulé ${l41.value().length+l11.value().length+l21.value().length+l31.value().length+l45.value().length+l15.value().length+l25.value().length+l35.value().length} sessions</p>`
        sHtml+= `<p>le total des sessions inclut ${def.value().length} soutenances pour un total de ${df10+df11+df12+df13+df20+df21+df22+df23+df30+df31+df32+df33+df40+df41+df42+df43} €</p>`


        Swal.fire({
            title: `<strong>Liste des formations tarifées du ${from} au ${to}</strong>`,
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'center-start',
            grow: 'fullscreen',
        });
    }

    var razDbase = async function(){
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
        sHtml+='<label for="students" class="cbox">Suppression des étudiants</label>';
        sHtml+='<input id="students" type="checkbox" value="del_students_true" checked>';
        sHtml+='<label for="sessions" class="cbox">Suppression des sessions</label>';
        sHtml+='<input id="sessions" type="checkbox" value="del_sessions_true" checked>';
        sHtml+='<label for="radio1">filtrer la date</label>';
        sHtml+='<input type="radio" id="radio1" name="date_filter" value="false" checked>';
        sHtml+='<label for="radio2">ne pas filtrer</label>';
        sHtml+='<input type="radio" id="radio2" name="date_filter" value="true">';

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
                console.dir(r);
                return [
                    document.getElementById('students').checked,
                    document.getElementById('sessions').checked,
                    radioValue,
                ]
            }

        });


        let bRAZStudents = formValues[0];
        let bRAZSessions = formValues[1];
        //console.log("radio result is " + formValues[2]);

        console.log(`wanna raz students ? ${bRAZStudents}, wanna raz sessions ? ${bRAZSessions}`);

        var db = sttctx.dbase; // TODO Change this to less ugly
        //const newState = {}
        var newState = {};
        if (bRAZStudents === true &&
            bRAZSessions === true ){
            setTimeout(function() {
                Toastify({
                    text: `Suppression de la base \ndes étudiants \net des sessions`,
                    gravity: "top",
                    position: 'right',
                    close: true,
                    backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }).showToast();
            }, 500);
            db.setState(newState);
            db.defaults({ students: [] , pricing: [], sessions: [] }).write();
            return
        }
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
            db.get('students').remove().write(); // suppress all from students

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
            db.get('sessions').remove().write(); // suppress all from sessions
        }
    }

    var billInDetails = async function(){
        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
        //var dtFrom = dayjs(dt1).subtract(1, 'day');
        //var dtTo = dayjs(dt2).add(1, 'day');
        var db = sttctx.dbase; // TODO Change this to less ugly
        // classer par date
        var r = db.get('sessions')
         .filter(v => dayjs(v.when).isSameOrBefore(dtTo,"day") && dayjs(v.when).isSameOrAfter(dtFrom, "day"))
         .sortBy(function (o){return dayjs(o.when).valueOf()})
         //.reverse()
         .value();

        console.dir(r);

        var sHtml ="";
        sHtml += "<table>";

         var iPrice1=30,iPrice2=35,iPrice3=40,iPrice4=50;
         var aPrice = [0,iPrice1,iPrice2,iPrice3,iPrice4];

        sHtml+="<thead>";
        sHtml+="<tr><th>Quand</th><th>Qui</th><th>Financé ?</th><th>Ancien Mode ?</th><th>PU HT</th><th>Statut</th><th>PU (corrigé) HT</th><th>Cumul</th></tr>";
        sHtml+="<thead>";
        sHtml+="<tbody>";

        var iCumul = 0
        for(var i in r){
            var sWhen = dayjs(r[i].when).format("DD/MM/YYYY à HH:mm:ss");
            var iPu = r[i].isFunded === true ? aPrice[r[i].lvl] : aPrice[r[i].lvl] * 0.5;
            var iFPu = 0;
            var bOldMode = true;
            if(isInOldMode(dayjs(r[i].when))){
                if (r[i].status === "réalisée" || r[i].status === "annulée tardivement"){
                    iFPu = iPu;
                } else {
                    if (r[i].status === "étudiant absent"  ){
                        iFPu = iPu * 0.5;
                    }
                }
            } else {
                bOldMode = false
                if (r[i].status === "réalisée"){
                    iFPu = iPu;
                } else {
                    if (r[i].status === "étudiant absent" || r[i].status === "annulée tardivement" ){
                        iFPu = iPu * 0.5;
                    }
                }
            }
            //console.log(r[i]);
            iCumul+=iFPu;
            sHtml+="<tr>";
            sHtml+=`<td>${sWhen}</td><td>${r[i].who_name}</td><td>${r[i].isFunded === true ? "Oui" : "Non" }</td><td>${bOldMode === true ? "Oui" : "Non" }</td><td>${iPu}</td><td>${r[i].status}</td><td>${iFPu}</td><td>${iCumul}€</td>`
            sHtml+="</tr>";
        }
        sHtml+="<tbody>";
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
    var about = function(){
        var sHtml ="";



        Swal.fire({
            title: `<strong>A propos de ${appName}</strong>`,
            icon: 'info',
            html: sHtml,
            showCloseButton: true,
            //showCancelButton: true,
            focusConfirm: false,
            position: 'center-start',
            grow: 'fullscreen',
        });
    }

    //----------------------------- UI
      var debugMode = function(){
        debugger;
    }

    var initUI = function(){
        console.log('%c in initUI','background-color:green;color:white');
        buildUI();
        var draggie = new Draggabilly('.draggable', {handle: '.handle'});

    }

    var buildUI = function(){
        // NOTE: check with new Promise function
        console.log('%c in buildUI','background-color:green;color:white');
        GM_addStyle('.flex > * { margin: 0 10px; }');
        GM_addStyle('.flex > :first-child { margin-left: 0; }');
        GM_addStyle('.flex > :last-child { margin-right: 0; }');
        GM_addStyle('.panel {display: flex; justify-content: center;z-index:999}');
        GM_addStyle('.menuBar {border-top: 1px solid; padding: 10px; font-size: 1rem; pointer-events: inherit;position: relative;top:0px;}');
        GM_addStyle('.draggable {background: transparent;border-radius: 10px;padding: 20px;}');
        GM_addStyle('.draggable.is-pointer-down {background: #09F;}');
        GM_addStyle('.draggable.is-dragging { opacity: 0.7; }');
        GM_addStyle('.handle {background: #555;background: hsla(0, 0%, 0%, 0.4);width: 20px;height: 20px; border-radius: 10px;}');

        // create menu bar
        var div = document.createElement('div');
        var subDiv = document.createElement('div');
        subDiv.classList.add('handle');
        div.appendChild(subDiv);
        div.classList.add('panel', 'menuBar', 'flex', 'draggable');
        document.body.appendFirst(div);
        addButton('getStudents', getStudents, {},div);
        addButton('addCbox', addCbox, {},div);
        addButton('collectChecked', collectChecked, {},div);
        addButton('CollectAuto', sandBox, {}, div);
        addButton('showBill', showBill, {},div);
        //addButton('HideCookies', hideCookies, {},div);
        //addButton('Fetch', fetchG, {},div);
        addButton('billInDetails', billInDetails, {},div);
        addButton('RAZ', razDbase, {},div);
        addButton('SList', showStudentsList, {}, div);
        
        //addButton('DbgMode', debugMode, {}, div);
        addButton('about', about, {},div);
    }

    var addButton = function (text, onclick, cssObj,el) {
        el = el || document.body;
        cssObj = cssObj || {position: 'absolute', bottom: '7%', left:'4%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        button.classList.add('button--primary', 'button');
        el.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        //btnStyle.position = 'absolute'
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
        return button
    }

    var popupDateSelector = async function(dtFrom=null,dtTo=null){

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
            preConfirm: () => {
                return [
                    document.getElementById('dtFrom').value,
                    document.getElementById('dtTo').value
                ]
            },
            onRender: (e) => {
                //console.dir(e);
            },
            onOpen: (el) => {
                el.querySelector('#dtFrom').addEventListener('change', function(){document.getElementById('dtTo').value = dayjs(document.getElementById('dtFrom').value).endOf('month').format("YYYY-MM-DD");})
            },
            onClose: (el) => {
                el.querySelector('#dtFrom').removeEventListener("change");
            }

        });
       

        dtFrom = dayjs(formValues[0]);
        dtTo = dayjs(formValues[1]);

        return [dtFrom,dtTo];
    }


    // ----------------------------- EntryPoint

    // when avatar if loaded start application
    document.arrive(".MuiAvatar-img", function() {
        // 'this' refers to the newly created element
        console.log("%cinSetup","background-color:green;color:white");
        // chargement des CSS de jspnael
        GM_addStyle( GM_getResourceText("jspanelcss") );
        GM_addStyle( GM_getResourceText("toastifycss") );
        GM_addStyle( GM_getResourceText("simpledatatablecss") );
        GM_registerMenuCommand('OC Facturier - configure', opencfg);
        /* hacks */
        if(GM_config.get('hackheaderzindex') === true){
            document.getElementById('header').style.zIndex = 0; // because z index is 1000 in oc rules
        }
        /* set size of content */
        GM_addStyle('.swal2-content{font-size:'+GM_config.get('sizeofcontentlist')+'}');
        main();
    });

   var main = function(){
       console.log('%cMainLoaded','background-color:green;color:white');
       var adapter = new LocalStorage('db');
       var db = low(adapter);
       db.defaults({ students: [] , pricing: [], sessions: [] }).write()
       var ctx = {dbase:db}
       //console.log(ctx)
       //window['sttctx'] = ctx ; // just for playing with functions
       window.sttctx = ctx
       /* dayjs extension */
       dayjs.extend(dayjs_plugin_isSameOrAfter);
       dayjs.extend(dayjs_plugin_isSameOrBefore);
       dayjs.extend(dayjs_plugin_isBetween);
       dayjs.extend(dayjs_plugin_localeData);
       dayjs.extend(dayjs_plugin_customParseFormat);
       //dayjs.extend(dayjs_locale_fr);
       // https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/localeData.min.js
        if (document.querySelector(".panel.menuBar.flex.draggable") === null){
            initUI();
        }
       if(GM_config.get("alwaysaddcbox") === true){addCbox();} // add checkbox to element in history
   }


    // Your code here...

   // ----------------------------------------------------------- Tampermonkey Menu
    const windowcss = '#OCAddonsCfg {background-color: lightblue;} #OCAddonsCfg .reset_holder {float: left; position: relative; bottom: -1em;} #OCAddonsCfg .saveclose_buttons {margin: .7em;}';
    const iframecss = 'height: 16.7em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';
    const dbgcss    = 'position: absolute;top: 5px; left: 5px; right: 5px; bottom: 5px;padding: 10px;overflow-y: auto;display: none;background: rgba(250, 250, 250, 0.3);border: 3px solid #888;font: 14px Consolas,Monaco,Monospace;color: #ddd;z-index: 500';

    function opencfg()
    {
        GM_config.open();
        OCAddonsCfg.style = iframecss;
    }

    GM_config.init(
        {
            id: 'OCAddonsCfg',
            title: 'Configuration du module',
            fields:
            {
                billdate:
                {
                    section: ['Facturation', 'date'],
                    label: 'date de facturation',
                    labelPos: 'left',
                    title: 'dd/mm/yyyy', // Add a tooltip (hover over text)
                    type: 'textarea',
                },

                sizeofcontentlist:{
                    label: 'taille de la police des listes',
                    labelPos: 'left',
                    type: 'input',
                    default: '1em;',
                },

                alwaysaddcbox:{
                    label: 'Toujours ajouter les checkbox',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },


                defaultcomment:
                {
                    section: ['Global', 'pamètres généraux'],
                    label: 'commentaire par défaut',
                    labelPos: 'left',
                    'title': 'Merci de ne saisir que du markdown!', // Add a tooltip (hover over text)
                    type: 'textarea',
                    default: '**Avis global & verdict sur le travail de l\'étudiant:**\n \
\n> Le travail correspond aux attentes sur le projet à savoir\n \n> - [x] Lorem\n \
\n**Avis sur les livrables:**\n \n**Avis sur la présentation:**\n \n- Lorem\n \
\n**Avis sur la compréhension et la réalisation du projet:**\n  \n- Lorem\n \
\n**Points positifs:**\n \n- Lorem\n \
\n**Axes d\'amélioration:**\n \n- Lorem\n',
                },

                'hidecookies':{
                    label: 'hidecookies',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },


                'usesignature':
                {
                    section: ['Signature', 'tweaks signature'],
                    label: 'utiliser une signature',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },
                signature: {
                    label: 'signature',
                    labelPos: 'left',
                    type: 'input',
                    default: 'Anonymous',
                },
                'hackheaderzindex':
                {
                    section: ['Cache', 'option pour la sauvegarde'],
                    label: 'changer le zindex du bandeau haut',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },
                support: {
                    section: ['', 'Support'],
                    label: 'almaceleste.github.io',
                    title: 'more info on almaceleste.github.io',
                    type: 'button',
                    click: () => {
                        GM_openInTab('https://almaceleste.github.io', {
                            active: true,
                            insert: true,
                            setParent: true
                        });
                    }
                },
            },
            css: windowcss,
            events:
            {
                save: function() {
                    GM_config.close();
                }
            },
        });
})();



// ------ MISC
// found in stackoverflow to add an element first waiting full implementation of appendFirst in DOM
HTMLElement.prototype.appendFirst=function(childNode){
    if(this.firstChild)this.insertBefore(childNode,this.firstChild);
    else this.appendChild(childNode);
};
