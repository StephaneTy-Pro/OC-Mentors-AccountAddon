// ==UserScript==
// @name         Facturier// ==UserScript==
// @name         Facturier
// @namespace    http://tampermonkey.net/
// @version      0.9
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

// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js
// @require      https://unpkg.com/lowdb@0.17/dist/low.min.js
// @require      https://unpkg.com/lowdb@0.17/dist/LocalStorage.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/locale/fr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/isBetween.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/isSameOrBefore.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/isSameOrAfter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/customParseFormat.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.29/plugin/localeData.min.js


// GM_Config
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js

// sweetalert 2
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.all.min.js

// draggabilly
// @require      https://cdnjs.cloudflare.com/ajax/libs/draggabilly/2.2.0/draggabilly.pkgd.min.js

// toastify
// @require     https://cdn.jsdelivr.net/npm/toastify-js@1.8.0/src/toastify.min.js
// @resource    toastifycss https://raw.githubusercontent.com/apvarun/toastify-js/master/src/toastify.css

//
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js

// simple-datatables
// @require     https://cdn.jsdelivr.net/npm/simple-datatables@latest
// @resource    simpledatatablecss https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css

//spectreCSS - dommage fonctionne mal avec le thème OC
// @resource    spectrecss https://unpkg.com/spectre.css/dist/spectre.min.css

// require https://raw.githubusercontent.com/anywhichway/nano-memoize/master/dist/nano-memoize.min.js
// @require https://cdn.jsdelivr.net/npm/moize@5.4.7/dist/moize.min.js

// @require https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/fetch-inject.umd.min.js
// require https://cdn.jsdelivr.net/npm/fetch-inject

// PARSER MKDOWN
// @require 	 https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js

// PDF https://pdf-lib.js.org/docs/api/
// @require      https://unpkg.com/pdf-lib@1.9.0/dist/pdf-lib.min.js
// @require      https://unpkg.com/downloadjs@1.4.7/download.js

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
 * 0.5 correction de la matrice de calcul après juin
 *     intégration du calcul du bonus af
 *     corrections diverses de texte (changements de mots principalement)
 *     nettoyage de quelques dépendances
 *     travail sur la fonction fetch history pour la simplifier
 *     UI changement de texte de la facture
 *     UI la case à cocher est renommée en "in DB"
 *     la fonctionn addCbox ne recrée pas toute les cbox à chaque fois on peut donc l'appeller apres la collecte automatique
 *     en création d'étudiant la liste des parcours (incomplète est proposée dans l'autocompletion
 *     correction d'un bug dans la facturation avant 06/2020 (mauvaise affectation de la catégorie des noshow : annulé tardivement qui étaient visuellement avec les sessions)
 *
 *     
 * 0.6
 *      Travail sur la pré facture : changement du code pour une meilleure performance et pour permettre la réalisation de stat mensuselle : créattion d'un module spécifique
 *      GROS BUG A CORRIGER le statut étudiante absente existe !!!!!!
 *      debut du travail sur le module de statistique
 * 0.7
 *      Suite module de statistiques
 *      Utilisation de memoize pour mettre en cache le tableau
 *      UI Suppression du bouton getstudents qui ne sert plus à rien car lancé en automatique si l'étudiant n'est pas trouvé dans la liste
 *      Correction du bug pour Antony (document.arrive non disponible... mise en place provisioire d'un event alternatif)
 * 0.7.0001
 *      Version pour corriger le bug d'antony (deuxieme essai)
 * 0.8
 *      Correction d'un bug sur l'affichage des prix unitaires
 *      Ajout de la possibilité en configuration de régler le temps de mise en cache dans le menu de configuration du "plugin"
 *      Ajout du read.me dans le about
 *      Correction du bug sur le mois dans les stat
 *      Corrections de bugs divers
 *      Nettoyage du code, mises en commentaires de console
 *      Ajout de la notion de canceled dans les statistiques
 *      Ajout du paramétrage du nombre d'heure nécessaire par type de session pour les stats
 *
 * 0.9
 *      Ajout du TJM en fonction du nombre de jours ouvrés (sans tenir compte de jours fériés)
 *      Début de l'archivage des données financières (pour accélérer les stat)
 *      Ajout de la possibilité de filtrer les données supprimées (financière pour le moment)
 *      Intégration du niveau X de données financières
 *      Ajout d'un "temoin d'inactivité"
 *      Optimisation
 *      Intégration d'un selecteur de date pour la RAZ
 *      Début de travail sur le PDF
 *
 ********* BUG visiblement j'ai du mal avec le fetch pour les pages historiques .... probleme de requetes trop nombreuses ?
 * TODO
 * BUG hugo a diagnostiqué un bug en mise à jour des étudiants sur le financement dans le popup orange ... note STT je présume qu'il s'agit d'un probleme dû à l'async car le console.log est bon lui et l'entrée en BDD également
 * popup qui vient dire que tout c'est bien passé suite à la collecte des données de session ( A FAIRE)
 * toaster .... passer sur une seule et unique librairie
 * paramètres de l'application à nettoyer
 *
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
    // OC
    const sAutoFunded = "Auto-financé"; // in oc
    const sFunded = "Financé par un tiers" ; // in oc
    const status_0 = "réalisée";
    const status_1 = "annulée";
    const status_2 = "annulée tardivement";
    const status_3_m = "étudiant absent";
    const status_3_f = "étudiante absente";
    const iMaxLevel = 6 // max facturation level (used when loop in financial array) 5 since june
    const iPrice1=30, iPrice2=35, iPrice3=40, iPrice4=45, iPrice5=50, iPrice6=55;

    // const Application
    const sCStylPerf = "background-color:blue;color:white";

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
        return `${_t[2]}-${oMonth.id}-${_t[0]}T${_t[4]}`; // NOTESTT correspond plus ou moins au format std day js YYYY-MM-DDTHH:MM
    }

     // ---------------------------- Helper Archives

     var addFinancialsArchiveToDbase = async function(oArchive){
        var db=sttctx.dbase; // TODO Change this to less ugly
        var now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
        let needle = {id:oArchive[0].to.format('YYYYMM'), data:oArchive, created_at:oArchive[0].now}
        console.log(`will create archive for id ${oArchive[0].to.format('YYYYMM')} (YYYYMM)`);
        db.get('f_archives').push(JSON.parse(JSON.stringify(needle))).write();
     }
     /*
     Id in form of YYYYMM
     */
    var IsFinancialsArchiveInDb = function(sId){
        var db=sttctx.dbase; // TODO Change this to less ugly
        var r = db.get('f_archives').find({id: sId}).value();
        if (r === undefined){
             return false;
         }else {
             return true;
         }
    }

    var getFinancialsArchive = function(sId){
        var db=sttctx.dbase; // TODO Change this to less ugly
        var r = db.get('f_archives').find({id: sId}).value();
        if (r === undefined){
            throw Error('Erreur qui ne devrait jamais arriver en getFinancialsArchive ');
            return false;
         }else {
             console.log(`will use archive for id ${sId} (YYYYMM)`);
             return r;
         }
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
        //var sStatus = oEl.children[2].innerText.toLowerCase();
        var sStatus = oEl.children[2].innerText.trim().toLowerCase(); // cause sometimes there were space in this string
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
        //console.log(`will search session ${iSessionId} in database`);
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
    // https://stackoverflow.com/questions/28425132/how-to-calculate-number-of-working-days-between-two-dates-in-javascript-using#28425663
    // ajout du plugin UTC pour la partie sans prise en compte des changements d'heure
    // NOTE STT 01/05/2021 est un samedi
    var workday_count = function (start,end) { // STT exemple 01/07/2020 au 31/07/2020
        /* la table qui suit est construite de la manière suivante
        si je suis un dimanche (0) du dimanche (indice dayjs.day = 0) au lundi (indice 1) il y a 1 jours -> sur la ligne 0, colonne 1 => 1
        ... du dimanche au vendredi , mais aussi au samedi il y a 5 jours et du dimanche au dimanche il y a 0 jours

        SRC https://openclassrooms.com/forum/sujet/calculer-le-nombre-de-jour-entre-deux-dates-33473 (avec décalage pour les indices
        faire un tableau sur papier pour aller plus vite (ligne et colonne sont les jours de la semaine en démarrant à dimanche,dimanche
        */
        let lookup=[
            [0, 1, 2, 3, 4, 5, 5],
            [5, 1, 2, 3, 4, 5, 5],
            [4, 5, 1, 2, 3, 4, 4],
            [3, 4, 5, 1, 2, 3, 3],
            [2, 3, 4, 5, 1, 2, 2],
            [1, 2, 3, 4, 5, 1, 1],
            [0, 1, 2, 3, 4, 5, 0]
        ];
        //console.log(Math.trunc(end.diff(start,'days')/7)*5);
        //console.log(start.day(), end.day());
        //console.log(lookup[start.day()][end.day()]);
        //console.dir(lookup);
        return  Math.trunc(end.diff(start,'days')/7)*5+lookup[start.day()][end.day()]; // get the total
    } //
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
             throw Error('IRRECOVERABLE ERROR STUDENT NOT IN DB:');
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
        let aPathList = ["non présent dans la liste","Chef de projet digital", "Chef de projet SI", "Développeur d'application - Frontend", "Développeur Web", "Expert en stratégie marketing et communication ", "Production de contenu web avec CMS et Content Marketing ","Tech lead"]
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
        sHtml+='<input id="student_path" name="student_path" type="text" list="student_path-list">';
        sHtml+='<datalist id="student_path-list">';
        for(var i in aPathList){
            sHtml+=`<option>${aPathList[i]}</option>`;
        }
        sHtml+='/<datalist>';

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
                //console.log("will check fund mode");
                oSession.isFunded = !(IsStudentAutoFunded(oSession.who_id));
                }

            }
        // because of Difference between AF and not AF
        //console.log("is student funded ?", oSession.isFunded)

        if(bCheckExistsBeforAdd){
            if (IsSessionInDb(oSession.id) == false){
                db.get('sessions').push(JSON.parse(JSON.stringify(oSession))).write();
            } else {
                console.info(`${oSession.who_name} at ${oSession.when} already present in database table sessions`);
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
        console.info("%c_fetch() waiting return from : "+sUrl,'background-color:green,color:white');
        const response = await GMC.XHR({
            method: 'GET',
            url: sUrl,
            responseType: 'text/html',
            //binary: true,
            headers: {
                "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            },
        });

        //
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

    }

    
    /*
     *
     * pg = current page of history
     */
    var historyFetch = async function (){

        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));


        //console.log(`wanna fetch history between ${dtFrom.format()} and ${dtTo.format()} searching in page ${pg} of history`);
        /*
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
        */
        // check if first line is after start of parsing date data
       
        // don't load next page if date of last line is before start date of data
        let iRecurse = 0;
        let iMaxRecurse = GM_config.get('maxfetchpg');
        //let dtFirstRowDate = convertRowToDate(oDom,0)
        let bBrowse = true
        var res = {}
        let data = []
        let pg=1
        while(bBrowse){
            console.log(`iRecurse > iMaxRecurse ? ${iRecurse} > ${iMaxRecurse} = ${iRecurse > iMaxRecurse}`);
            if (iRecurse > iMaxRecurse) {
                console.warn("%cEMERGENCY EXIT LOOP","color:orange");
                break; // emergency exit
            }
            
            res = await _historyFetch(dtFrom, dtTo, pg, data)
            //console.dir(res);console.log(res.length);
            //Si la dernière ligne du tableau est plus récente que la date de bébut arrête
            if(res.length>0 && dayjs(res[res.length-1].when).isSameOrBefore(dtFrom) === true){
                bBrowse = false;
            }
            pg+=1
            iRecurse+=1
        }

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
                await addSessionsToDbase(res[i]);
            }
        }

        addCbox(); // addCbox on
    }

    var convertRowToDate =  function(oDom, index=0){
         if (index === -1) {
            index = oDom.children.length-1
        }
        //console.log(`convertRowToDate:: index is ${index}`);
        var sRowDate = oDom.children[index].children[0].innerText;
        //console.log(`convertRowToDate:: sRowDate is ${sRowDate}`);
        let f_sRowDate = extractDate(sRowDate);
        //console.log(`convertRowToDate:: utilise la date extraite de la chaine : ${f_sRowDate} pour trouver la date `);
        var dtRowDate = dayjs(f_sRowDate); // -- trop simpliste n'intègre pas l'été/hiver
        //console.log(`convertRowToDate:: la date extraite est : ${dtRowDate} pour trouver la date `);
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
        let oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/dashboard/mentorship-sessions-history?page=${pg}`, "table.crud-list tbody");
        /* Cette ligne est très sensible il arrive que la page se charge mal ce qui fait tout crasher oDom étant null*/
        if(oDom === null){
            throw (new Error('Something went wrong .... try to navigate forward and backward or click some buttons to change url'));
        }
        if(convertRowToDate(oDom,-1).isAfter(dtTo,'day')===true) {
            console.log(`optimisation ne charge pas ce n'est pas encore arrivé`);
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
                bChecked = IsSessionInDb(id);
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
                bChecked = IsSessionInDb(aChkBox[v].value);
                //console.log(`is the session with id ${aChkBox[v].value} in db ? ${bChecked}`);
                if (bChecked === true){
                    aChkBox[v].checked = true;
                } else {
                    aChkBox[v].checked = false;
                }
            }
        }
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
        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
        //var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isBefore(dtTo) && dayjs(v.when).isAfter(dtFrom));

        /*
        var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isSameOrBefore(dtTo,'day') && dayjs(v.when).isSameOrAfter(dtFrom,'day'));

         if(isInOldMode(dtFrom)){
             billPhase1(dtFiltered,dtFrom,dtTo);
         } else {
             billPhase2(dtFiltered,dtFrom,dtTo);
         }
         */
         var data = calculateBill(dtFrom, dtTo);
         if(isInOldMode(dtFrom)){
             showBillPhase1(dtFrom, dtTo, data);
         } else {
             showBillPhase2(dtFrom, dtTo, data);
         }
    }

    /*
     * This function used memoized private version
     *
     */
    var calculateBill = function(dtFrom, dtTo){
        if (IsFinancialsArchiveInDb(dtTo.format('YYYYMM')) === true){
            console.log("%cUse Archived version of financials", "background-color:green;color: white");
            let r = getFinancialsArchive(dtTo.format('YYYYMM'));
            return r.data;
        }
         //aData.push(memoized(dtCurFrom.format("YYYY-MM-DD"), dtCurTo.format("YYYY-MM-DD")));
        //const memoized = nanomemoize(calculateBill,{maxAge:50000});
        //const memoized = moize.default(_calculateBill,{maxAge:500000,  onCacheAdd: function(c,o,m){console.log("cache add");console.dir(c.keys);/*console.dir(o);console.dir(m)*/;}, onCacheHit: function(){console.log("cache hit");}});

        // NOTESTT for a unknow reason object are not converted to same date (perhaps because of conversion to endofmoth so for cachine only use string keys
        // example : 0: Array [ "|\"2020-03-31T22:00:00.000Z\"|\"2020-04-29T22:00:00.000Z\"|" ]
        //1: Array [ "|\"2020-04-30T22:00:00.000Z\"|\"2020-05-30T22:00:00.000Z\"|" ]
        //2: Array [ "|\"2020-05-31T22:00:00.000Z\"|\"2020-06-29T22:00:00.000Z\"|" ]
        // 3: Array [ "|\"2020-05-31T22:00:00.000Z\"|\"2020-06-30T21:59:59.999Z\"|" ]
        //4: Array [ "|\"2020-04-30T22:00:00.000Z\"|\"2020-05-31T21:59:59.999Z\"|" ]
        //5: Array [ "|\"2020-03-31T22:00:00.000Z\"|\"2020-04-30T21:59:59.999Z\"|" ]
        //6: Array [ "|\"2020-02-29T23:00:00.000Z\"|\"2020-03-31T21:59:59.999Z\"|" ]
        //7: Array [ "|\"2020-01-31T23:00:00.000Z\"|\"2020-02-29T22:59:59.999Z\"|" ]
        //8: Array [ "|\"2019-12-31T23:00:00.000Z\"|\"2020-01-31T22:59:59.999Z\"|" ]
        if (typeof dtFrom !== 'string'){ dtFrom = dtFrom.format("YYYY-MM-DD");};
        if (typeof dtTo !== 'string'){ dtTo = dtTo.format("YYYY-MM-DD"); }



        return memoized(dtFrom, dtTo);
    }

    var _calculateBill = function (dtFrom, dtTo){

        //UIShowLoading();

        // cast to date type
        if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
        if (typeof dtTo === 'string'){ dtTo = dayjs(dtTo) }

        var t0 = performance.now();

        var db=sttctx.dbase; // TODO Change this to less ugly
        var r = db.get('sessions').filter(v => dayjs(v.when).isSameOrBefore(dtTo,'day') && dayjs(v.when).isSameOrAfter(dtFrom,'day'));
        var def = r.filter( v => v.type.toLowerCase() === 'soutenance') || 0;

        let aPrice = [0,iPrice1,iPrice2,iPrice3,iPrice4,iPrice5,iPrice6];
        let oErrors = []; // will keep errors found when filter
        // segments are the same in all the versions (pre or past) june 2020

        let aLvl = [];
        for(let _i = 1; _i <= iMaxLevel ; _i+=1){
          aLvl[_i] = [];
          aLvl[_i][0] = {session: null, defense: null };
          aLvl[_i][1] = {session: null, defense: null };
          aLvl[_i][2] = {session: null, defense: null };
          aLvl[_i][3] = {session: null, defense: null };

          aLvl[_i][4] = {session: null, defense: null };
          aLvl[_i][5] = {session: null, defense: null };
          aLvl[_i][6] = {session: null, defense: null };
          aLvl[_i][7] = {session: null, defense: null };

          aLvl[_i][0].session = r.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === true) ||0 ;
          aLvl[_i][1].session = r.filter( v => v.lvl == _i && v.status === status_1 && v.isFunded === true) ||0 ;
          aLvl[_i][2].session = r.filter( v => v.lvl == _i && v.status === status_2 && v.isFunded === true) ||0 ;
          aLvl[_i][3].session = r.filter( v => v.lvl == _i && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true) || 0 ;

          aLvl[_i][4].session = r.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === false) ||0 ;
          aLvl[_i][5].session = r.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === false) ||0 ;
          aLvl[_i][6].session = r.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === false) ||0 ;
          aLvl[_i][7].session = r.filter( v => v.lvl == _i && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false) || 0 ;

          aLvl[_i][0].defense = def.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === true) ||0 ;
          aLvl[_i][1].defense = def.filter( v => v.lvl == _i && v.status === status_1 && v.isFunded === true) ||0 ;
          aLvl[_i][2].defense = def.filter( v => v.lvl == _i && v.status === status_2 && v.isFunded === true) ||0 ;
          aLvl[_i][3].defense = def.filter( v => v.lvl == _i && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true) || 0 ;

          aLvl[_i][4].defense = def.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === false) ||0 ;
          aLvl[_i][5].defense = def.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === false) ||0 ;
          aLvl[_i][6].defense = def.filter( v => v.lvl == _i && v.status === status_0 && v.isFunded === false) ||0 ;
          aLvl[_i][7].defense = def.filter( v => v.lvl == _i && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false) || 0 ;
        }

        var t1 = performance.now();console.log("%cfiltering took " + (t0 - t1) + " milliseconds." ,sCStylPerf);

        //some element could be left
        oErrors.push({total:0});
        oErrors.push({type:"bad level", data:r.filter( v => v.lvl <1 || v.lvl > iMaxLevel)});
        oErrors.push({type:"bad status", data:r.filter( v => v.status !== status_0 && v.status !== status_1 && v.status !== status_2 && v.status !== status_3_m && v.status !== status_3_f)});
        oErrors.push({type:"bad funded", data:r.filter( v => v.isFunded !== false && v.isFunded !== true )});

        oErrors[0].total = oErrors[1].data.value().length + oErrors[2].data.value().length + oErrors[3].data.value().length

        var myArray = [];
        var now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');

        // ce mode de calcul a un risque majeur .... si on travaille à cheval sur deux mois, ou plus les périodes doivent être du 01 au .... et durer au plus un mois ou etre post 2020
        // au pire il faudra s'amuser à recalculer ligne à ligne
        var aPu=[];
        for(let _i = 1; _i <= iMaxLevel ; _i+=1){
            if(isInOldMode(dtFrom)){
                aPu[_i] = [aPrice[_i],0,aPrice[_i]/2,aPrice[_i]/2,aPrice[_i],0,aPrice[_i]/2,aPrice[_i]/2];
            } else {
                aPu[_i] = [aPrice[_i],0,0,aPrice[_i]/2,aPrice[_i]/2,0,0,aPrice[_i]/4];
            }
        }
        var t2 = performance.now();console.log("%cPU calculated took " + (t1 - t2) + " milliseconds." ,sCStylPerf);
        /*
         * because there is no level in bonus for autofunded, i couldn't do a post calculation on sessions or defenses element
         */
        var oSessionsAf = r.filter( v => v.type.toLowerCase() !== 'soutenance' && v.status === status_0 && v.isFunded === false);
        var _temp = oSessionsAf.groupBy( v => v.who_id);
        var oBonus = []
        for( var n in _temp.value()){
            oBonus.push({who_id:n,who_name:_temp.value()[n][0].who_name,sessions:_temp.value()[n].length}); // all elements of test.value()[n] must be the same name because of groupBy id
        }

        var t3 = performance.now();console.log("%cBonus took " + (t2 - t3) + " milliseconds." ,sCStylPerf);

        var aSNumbers = [];
        var aDNumbers = [];
        for(let _i = 1; _i <= iMaxLevel ; _i+=1){
            let _s = [];
            _s[0] = aLvl[_i][0].session.value().length;
            _s[1] = aLvl[_i][1].session.value().length;
            _s[2] = aLvl[_i][2].session.value().length;
            _s[3] = aLvl[_i][3].session.value().length;

            _s[4] = aLvl[_i][4].session.value().length;
            _s[5] = aLvl[_i][5].session.value().length;
            _s[6] = aLvl[_i][6].session.value().length;
            _s[7] = aLvl[_i][7].session.value().length;

            aSNumbers[_i] = [_s[0], _s[1], _s[2], _s[3], _s[4], _s[5], _s[6], _s[7]];

            let _d = [];
            _d[0] = aLvl[_i][0].defense.value().length;
            _d[1] = aLvl[_i][1].defense.value().length;
            _d[2] = aLvl[_i][2].defense.value().length;
            _d[3] = aLvl[_i][3].defense.value().length;

            _d[4] = aLvl[_i][4].defense.value().length;
            _d[5] = aLvl[_i][5].defense.value().length;
            _d[6] = aLvl[_i][6].defense.value().length;
            _d[7] = aLvl[_i][7].defense.value().length;

            aDNumbers[_i] = [_d[0], _d[1], _d[2], _d[3], _d[4], _d[5], _d[6], _d[7]];

        }
        var t4 = performance.now();console.log("%cPrecalc some vars took " + (t4 - t3) + " milliseconds." ,sCStylPerf);

        myArray.push({from:dtFrom,to:dtTo,created_at:now,errors:oErrors, bonus:oBonus, max_level:iMaxLevel});
        for(let _i = 1; _i <= iMaxLevel ; _i+=1){
            let _t = aLvl[_i]
            myArray.push({sessions:{data:[_t[0].session,_t[1].session,_t[2].session,_t[3].session,_t[4].session,_t[5].session,_t[6].session,_t[7].session],number:aSNumbers[_i],pu:aPu[_i]},
                          defenses:{data:[_t[0].defense,_t[1].defense,_t[2].defense,_t[3].defense,_t[4].defense,_t[5].defense,_t[6].defense,_t[7].defense],number:aDNumbers[_i],pu:aPu[_i]}});
        }

        var t5 = performance.now();console.log("%cMy array full storage took " + (t5 - t4) + " milliseconds.", sCStylPerf);

        //console.log("array final");
        //console.dir(myArray);

        // -- Archives financials

        if(dtTo.isBefore(dayjs())){
            console.log('will create archives');
            addFinancialsArchiveToDbase(myArray);
            console.log('archives created');
        }

        //UIHideLoading();
        return myArray;

    }
    /*
     * dtFrom : dayjs format
     * dtTo : dayjs format
     * r : array of data
     */
    var showBillPhase1 = function (dtFrom, dtTo,r){
        var sHtml ="";
        var _ref = null;
        var iTotQ = 0
        var iTotM = 0
        var aTable = [[4,"Groupe"],[1,"Niveau 1"],[2,"Niveau 2"],[3,"Niveau 3"]]
        var iCurrentMaxLevel = r[0].max_level; /* could be different from the global iMaxLevel (depending on when data was saved */
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
            _ref = r[aTable[k][0]].sessions; // used by commons elments like pu for now
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
        while( _l <= iMaxLevel){
            iCanceledSessions += r[_l].sessions.number[1];
            iCanceledSessions += r[_l].sessions.number[5];
            for (let _i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too
                let _t = r[_l].sessions.number[_i];
                console.log(`je vais ajouter ${_t} sessions`);
                iTotalSessions += _t;
                iTotalHtSessions += _t * r[_l].sessions.pu[_i];
                _t = r[_l].defenses.number[_i];
                iTotalDefenses += _t;
                iTotalHtDefenses += _t * r[_l].defenses.pu[_i];
            }
            _l+=1
        }
        let iError = r[0].errors[0].total;
        iTotalSessions += iError


        sHtml+= `<p>Ces ${iTotalSessions} session(s) se répartissent en ${iTotQG -iTotQ} session(s) de mentorat (${iTotMG -iTotM}€)`
        sHtml+= `, ${iTotQ} NoShows (${iTotM}€)`
        sHtml+= `${iCanceledSessions} session(s) annulée(s) (${0}€), ainsi que ${iError} session(s) en anomalie</p>`;
        sHtml+= `<p>Sur le total de ${iTotalSessions} session(s) (${iTotalHtSessions}€) `;
        sHtml+= `vous avez réalisé ${iTotalDefenses} soutenance(s) (${iTotalHtDefenses}€)</p>`;

        if(iError){
            sHtml+= `pour info il y a ${iError} session(s) qui présente(nt) une anomalie ceci devrait par contre être normal (c'est souvent un étudiant qui n'a plus de parcours associé au moment de la collecte)`;
            sHtml+= `cela se traduit par une erreur de type bad level pour plus d'information regarder du côté dela console (en 'warn')</p>`;
            console.warn('Sessions en anomalie');
            console.warn(r[0].errors);
            console.warn('détail');
            console.warn(`${r[0].errors[1].data.length} erreurs de type ${r[0].errors[1].type} data are`,r[0].errors[1].data);
            console.warn(`${r[0].errors[2].data.length} erreurs de type ${r[0].errors[2].type} data are`,r[0].errors[2].data);
            console.warn(`${r[0].errors[3].data.length} erreurs de type ${r[0].errors[3].type} data are`,r[0].errors[3].data);
        }
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
    *
    */

    var showBillPhase2 = function (dtFrom, dtTo,r){
        console.log("enter computation bill");
        var t0 = performance.now()

        // UIShowLoading();

        /*var dtFrom=dayjs("2020-06-01");
        var dtTo=dayjs("2020-06-30");
        var r = calculateBill(dtFrom, dtTo);
        console.log(r);
        */
        var sHtml ="";
        var _ref = null;
        var iTotQ1 = 0
        var iTotQ2 = 0;
        var iTotM1 = 0
        var iTotM2 = 0;
        var aTable = [[4,"Groupe"],[1,"Niveau 1"],[2,"Niveau 2"],[3,"Niveau 3"]];
        var iCurrentMaxLevel = r[0].max_level; /* could be different from the global iMaxLevel (depending on when data was saved */
        /* https://www.w3.org/WAI/tutorials/tables/multi-level/ */
        sHtml+= "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
        sHtml+='<div class="wrapper">';
        sHtml+='<table>';
        sHtml+='<caption>Sessions de mentorat (dont soutenances)</caption>';
        sHtml+='<thead>';
        sHtml+='<tr>';
        sHtml+='<th rowspan="2">Type</th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th>';
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+="</tr>";
        sHtml+='</thead>';
        sHtml+='<tbody>';

        // /!\ defenses are already counted in sessions
        var _l = 1;
        while( _l <= iMaxLevel){
            sHtml+='<tr>';
            sHtml+=`<td> Niveau ${_l}</td>`;
            let _ses = r[_l].sessions; // used by commons elments like pu for now
            let _def = r[_l].defenses;
            let _q1 = _ses.number[0]
            let _q2 = _ses.number[4]
            let _m1 = _q1 * _ses.pu[0];
            let _m2 = _q2 * _ses.pu[4];
            iTotQ1+= _q1;
            iTotQ2+= _q2;
            iTotM1+= _m1;
            iTotM2+= _m2;
            sHtml+=`<td>${_q1} (${_def.number[0]})</td><td>${_ses.pu[0]}</td><td>${_m1}€</td>`;
            sHtml+=`<td>${_q2} (${_def.number[4]})</td><td>${_ses.pu[4]}</td><td>${_m2}€</td>`;
            sHtml+=`<td>${_q1 + _q2} (${_def.number[0]+_def.number[4]})</td><td>${_m1 + _m2}€</td>`;
            sHtml+="</tr>";
            _l+=1
        }
        var t1 = performance.now();console.log("%cCalculate first array" + (t1 - t0) + " milliseconds.", sCStylPerf); // avant optimisation 1960 ms puis 434ms puis 429ms
        sHtml+='</tbody>';
        sHtml+='<tfoot>';
        sHtml+='<tr>';
        sHtml+="<td>Total</td>";
        sHtml+=`<td>${iTotQ1}</td><td></td><td>${iTotM1}€</td>`;
        sHtml+=`<td>${iTotQ2}</td><td></td><td>${iTotM2}€</td>`;
        sHtml+=`<td>${iTotQ1+iTotQ2}</td><td>${iTotM1+iTotM2}€</td>`;
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='</tr>';
        sHtml+='</tfoot>';
        sHtml+='</table>'

        //var t1 = performance.now();console.log("%cCalculate first html table took " + (t1 - t0) + " milliseconds.", sCStylPerf);

        var iTotQG = iTotQ1+iTotQ2;
        var iTotMG = iTotM1+iTotM2;
        iTotQ1 = 0
        iTotQ2 = 0;
        iTotM1 = 0
        iTotM2 = 0;
        sHtml+='<table>';
        sHtml+='<caption>Sessions de mentorat :NoShow (dont soutenances)</caption>';
        sHtml+='<thead>';
        sHtml+='<tr>';
        sHtml+='<th rowspan="2"></th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th><th colspan="2" scope="colgroup">Ensemble</th>';
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+="</tr>";
        sHtml+='</thead>';
        sHtml+='<tbody>';
        _l = 1;
        while( _l <= iMaxLevel){
            sHtml+='<tr>';
            sHtml+=`<td> Niveau ${_l}</td>`;
            let _ses = r[_l].sessions;
            let _def = r[_l].defenses;
            let _q1 = _ses.number[3]//.value().length;
            let _q2 = _ses.number[7]//.value().length;
            let _m1 = _q1 * _ses.pu[3];
            let _m2 = _q2 * _ses.pu[7];
            iTotQ1+= _q1;
            iTotQ2+= _q2;
            iTotM1+= _m1;
            iTotM2+= _m2;
            sHtml+=`<td>${_q1} (${_def.number[3]})</td><td>${_ses.pu[3]}</td><td>${_m1}€</td>`;
            sHtml+=`<td>${_q2} (${_def.number[7]})</td><td>${_ses.pu[7]}</td><td>${_m2}€</td>`;
            sHtml+=`<td>${_q1 + _q2}</td><td>${_m1 + _m2}€</td>`;
            sHtml+="</tr>";
            _l+=1
        }

        sHtml+='</tbody>';
        sHtml+='<tfoot>';
        sHtml+='<tr>';
        sHtml+="<td>Total</td>";
        sHtml+=`<td>${iTotQ1}</td><td></td><td>${iTotM1}€</td>`;
        sHtml+=`<td>${iTotQ2}</td><td></td><td>${iTotM2}€</td>`;
        sHtml+=`<td>${iTotQ1+iTotQ2}</td><td>${iTotM1+iTotM2}€</td>`;
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='</tr>';
        sHtml+='</tfoot>';
        sHtml+='</table>'

        var t2 = performance.now();console.log("%cCalculate second html table took " + (t2 - t1) + " milliseconds.", sCStylPerf); // without optim 1799ms after 308ms

        iTotQG += iTotQ1+iTotQ2;
        iTotMG += iTotM1+iTotM2;

        var iCanceledSessions = 0;
         // total of sessions
        var iTotalSessions = 0;
        var iTotalHtSessions = 0;
        var iTotalDefenses = 0;
        var iTotalHtDefenses = 0;
        _l = 1;
        while( _l <= iMaxLevel){
            iCanceledSessions += r[_l].sessions.number[1]//.value().length;
            iCanceledSessions += r[_l].sessions.number[2]//.value().length;
            iCanceledSessions += r[_l].sessions.number[5]//.value().length;
            iCanceledSessions += r[_l].sessions.number[6]//.value().length;
            for (let _i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too
                let _t = r[_l].sessions.number[_i];
                console.log(`je vais ajouter ${_t} sessions`);
                iTotalSessions += _t;
                iTotalHtSessions += _t * r[_l].sessions.pu[_i];
                _t = r[_l].defenses.number[_i];
                iTotalDefenses += _t;
                iTotalHtDefenses += _t * r[_l].defenses.pu[_i];
            }
            _l+=1
        }
        let iError = r[0].errors[0].total;
        iTotalSessions += iError

        sHtml+= `<p>Ces ${iTotalSessions} session(s) se répartissent en ${iTotQG -iTotQ1 - iTotQ2} session(s) de mentorat (${iTotMG -iTotM1 - iTotM2}€)`
        sHtml+= `, ${iTotQ1 + iTotQ2} NoShows (${iTotM1 + iTotM2}€)`
        sHtml+= ` et ${iCanceledSessions} session(s) annulée(s) (${0}€)</p>`;
        sHtml+= `<p>Sur le total de ${iTotalSessions} session(s) (${iTotalHtSessions}€) `;
        sHtml+= `vous avez réalisé ${iTotalDefenses} soutenance(s) (${iTotalHtDefenses}€)</p>`;

        if(iError){
            sHtml+= `pour info il y a ${iError} session(s) qui présente(nt) une anomalie ceci devrait par contre être normal (c'est souvent un étudiant qui n'a plus de parcours associé au moment de la collecte)`;
            sHtml+= `cela se traduit par une erreur de type bad level pour plus d'information regarder du côté dela console (en 'warn')</p>`;
            console.warn('Sessions en anomalie');
            console.warn(r[0].errors);
            console.warn('détail');
            console.warn(`${r[0].errors[1].data.length} erreurs de type ${r[0].errors[1].type} data are`,r[0].errors[1].data);
            console.warn(`${r[0].errors[2].data.length} erreurs de type ${r[0].errors[2].type} data are`,r[0].errors[2].data);
            console.warn(`${r[0].errors[3].data.length} erreurs de type ${r[0].errors[3].type} data are`,r[0].errors[3].data);
        }

        var t3 = performance.now();console.log("%cCalcuate bottom remark <p> took " + (t3 - t2) + " milliseconds.", sCStylPerf); // before optim 4658ms

        sHtml+="<table>";
        sHtml+='<caption>Sessions de mentorat Bonus AF</caption>';
        sHtml+="<thead>";
        sHtml+="<th>Qui</th><th>Nb Sessions</th><th>PU</th><th>Total</th>";
        sHtml+="</thead>";
        sHtml+="<tbody>";
        var iTotG = 0;
        for(var t in r[0].bonus){
            //sHtml+=`<tr><td>${oBonus[t].who_name}</td><td>${oBonus[t].sessions}/4</td><td>30</td><td>${(oBonus[t].session*1)*30/4} €</td></tr>`; //NOTE STT last column evaluated to NaN ... why ?
            var iTot = r[0].bonus[t].sessions > 4 ? r[0].bonus[t].sessions*30/5 : r[0].bonus[t].sessions*30/4;
            iTotG+=iTot
            sHtml+=`<tr><td>${r[0].bonus[t].who_name}</td><td>${r[0].bonus[t].sessions}/${r[0].bonus[t].sessions > 4 ? 5 : 4}</td><td>30</td><td>${iTot} €</td></tr>`;
        }
        sHtml+="</tbody>";
        sHtml+="<tfoot>";
        //sHtml+=`<tr>total</tr><tr colspan=3>${oBonus.reduce( (r,v,k) => r+v.sessions*30,0 )}</tr>`; // NOTE STT don't work because must be /4 or /5 dependings on total sessions per month per users
        sHtml+=`<tr><td>total</td><td></td><td></td><td>${iTotG} €</td></tr>`;
        sHtml+="</tfoot>";

        sHtml+="</table>";

        var t4 = performance.now();console.log("%cCalculate AF took " + (t4 - t3) + " milliseconds.", sCStylPerf);

        // close waiting popup
        var t5 = performance.now();console.log("%cCalculate html table took " + (t4 - t0) + " milliseconds.", sCStylPerf);
        //UIHideLoading();

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
        sHtml+='<label for="students" class="cbox">Suppr. des étudiants</label>';
        sHtml+='<input id="students" type="checkbox" value="del_students_true" checked>';
        sHtml+='<label for="sessions" class="cbox">Suppr. des sessions</label>';
        sHtml+='<input id="sessions" type="checkbox" value="del_sessions_true" checked>';
        sHtml+='<label for="archives" class="cbox">Suppr. des archives</label>';
        sHtml+='<input id="archives" type="checkbox" value="del_archives_true" checked>';
        sHtml+='<label for="radio1">filtrer la date</label>';
        sHtml+='<input type="radio" id="radio1" name="date_filter" value="false" checked>';
        sHtml+='<label for="radio2">ne pas filtrer</label>';
        sHtml+='<input type="radio" id="radio2" name="date_filter" value="true">';
        sHtml+='<label for="dtFrom" class="date">Date de début</label>';
        sHtml+='<input id="dtFrom" type="date" max="2030-12-31" min="2010-12-31">';
        sHtml+='<label for="dtTo" class="date">Date de fin</label>';
        sHtml+='<input id="dtTo" type="date" max="2030-12-31" min="2010-12-31">';

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
                return [
                    document.getElementById('students').checked,
                    document.getElementById('sessions').checked,
                    document.getElementById('archives').checked,
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
        //console.log("radio result is " + formValues[2]);

        console.log(`wanna raz students ? ${bRAZStudents}, wanna raz sessions ? ${bRAZSessions}, wanna raz archives ? ${bRAZArchives}`);

        var db = sttctx.dbase; // TODO Change this to less ugly
        //const newState = {}
        var newState = {};
        if (bRAZStudents === true &&
            bRAZSessions === true &&
            bRAZArchives === true){
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
            db.defaults({ students: [] , pricing: [], sessions: [], f_archives: [] }).write();
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
            if(formValues[3]===null){
                db.get('f_archives').remove().write(); // suppress all from archives
            } else {
                let dtFrom = dayjs(formValues[3]);
                let dtTo = dayjs(formValues[4]);
                var _iMaxIndex = dtTo.get('month')-dtFrom.get('month')+1;
                //if(_iMaxIndex == 0) _iMaxIndex = 1; /* when start and end month are same*/
                let _m =0;
                while(_m < _iMaxIndex){
                    console.log("delete for a month id :"+dtFrom.format('YYYYMM'));
                    db.get('f_archives').remove({id:dtFrom.format('YYYYMM')}).write();
                    dtFrom = dtFrom.add(1,'month');
                    _m+=1;
                }
            }
        }
    }

    var statistics1 = async function(){
        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'),false);
        // get month of first Date
        let dtCurFrom = dtFrom;
        let aData = []
        var t0 = performance.now();
        /* Collect all datas */
        while (dtCurFrom.isSameOrBefore(dtTo,'day')){
            let dtCurTo = dtCurFrom.endOf('month')
            aData.push(calculateBill(dtCurFrom, dtCurTo));
            //aData.push(calculateBill(dtCurFrom.format("YYYY-MM-DD"), dtCurTo.format("YYYY-MM-DD")));
            //console.log(`calculateBill(${dtCurFrom}, ${dtCurTo});`);
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        var t1 = performance.now();console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", sCStylPerf);
        var sHtml ="";
        var _iMaxIndex = dtTo.get('month')-dtFrom.get('month');
        sHtml += "<table>";
        sHtml+="<thead>";
        sHtml+="<tr><th>Origine</th>";
        var _m1=0
        while( _m1 <= _iMaxIndex){
            let _dt = dtFrom.add(_m1, 'month');
            sHtml+=`<th>${_dt.format("MMMM")}</th>`;
            _m1+=1
        }
        sHtml+="<th>Total</th><th>Moyenne</th></tr>";
        sHtml+="</thdead>";
        sHtml+="<tbody>";
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Sessions</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Sessions (Mt)</td>";
        let iTotalRow = 0;
        let _m = 0;
        let iTotal = 0;
        let aNbInMonth = [];
        let aNbDInMonth = [];
        let aNbMInMonth = [];
        let aAmInMonth = [];
        let aCanceledNbInMonth = [];
        let aCanceledNbDInMonth = [];
        let aCanceledNbMInMonth = [];
        dtCurFrom = dtFrom;
        while(_m <= _iMaxIndex){
            let _l = 1;
            aNbInMonth[_m] = 0;
            aNbDInMonth[_m] = 0;
            aNbMInMonth[_m] = 0;
            aCanceledNbInMonth[_m] = 0;
            aCanceledNbDInMonth[_m] = 0;
            aCanceledNbMInMonth[_m] = 0;
            while( _l < iMaxLevel){
                let _z = [...Array(8).keys()];
                //for (let _i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too NOTE STT JAAMIS de in pour des arrays, les types de clé sont faux _i sera une string et pas un int cf reco MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
                for (let _i=0; _i < _z.length; _i+=1 ){ // NOTESTT: ~ pythonic range ... could use _range too
                    iTotal+= aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
                    aNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
                    aNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
                    aNbMInMonth[_m] += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]);
                    // depending on date some sessions are canceled or not
                    if(isInOldMode(dtCurFrom)){
                        if ([1,5].includes(_i)) {
                            aCanceledNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
                            aCanceledNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
                            aCanceledNbMInMonth[_m] += aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i];
                        }
                    } else {
                        if ([1,2,5,6].includes(_i)) {
                            aCanceledNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
                            aCanceledNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
                            aCanceledNbMInMonth[_m] += aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i];
                        }
                    }
                }
            _l+=1
            }
            sHtml+=`<td>${iTotal}</td>`;
            aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        // -- Display nubmer of sessions
        sHtml+="<tr>";
        sHtml+="<td>Sessions (Nb)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${aNbInMonth[_m]-aCanceledNbInMonth[_m]}(${aNbInMonth[_m]})</td>`;
            iTotalRow+=aNbInMonth[_m]
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        // -- Display price of each sessions
        sHtml+="<tr>";
        sHtml+="<td>Sessions (PU)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        // NOTESTT: hint to show what are params aData[0][1].sessions.number.reduce((ac,v,k)=>console.log(ac,v,k))

        
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${(aAmInMonth[_m]/(aNbInMonth[_m]-aCanceledNbInMonth[_m])).toFixed(2)}</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";

        // -- coaching
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Mentorat</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Mentorat (Mt)</td>";
        _m = 0;
        iTotal = 0;
        aAmInMonth = [];
        while(_m <= _iMaxIndex){
            let _l = 1;
            while( _l < iMaxLevel){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    iTotal+= aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i] - (aData[_m][_l].defenses.number[_i] * aData[_m][_l].defenses.pu[_i]);
                    aAmInMonth[_m] = iTotal;
                }
            _l+=1
            }
            sHtml+=`<td>${iTotal}</td>`;
            _m+=1;
            iTotal = 0;
        }
        sHtml+="<tr>";
        sHtml+="<tr>";
        sHtml+="<td>Mentorat (Nb)</td>";
        iTotalRow = 0;
        _m = 0;
        iTotal = 0;
        aNbInMonth = [];
        //aAmInMonth = [];
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${aNbMInMonth[_m]-aCanceledNbMInMonth[_m]}(${aNbMInMonth[_m]})</td>`;
            //aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        sHtml+="<td>Mentorat (PU)</td>";
        _m = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${(aAmInMonth[_m]/(aNbMInMonth[_m]-aCanceledNbMInMonth[_m])).toFixed(2)}</td>`;
            aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        // -- defenses
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Soutenances</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Soutenances (Mt)</td>";
        iTotalRow = 0;
        _m = 0;
        iTotal = 0;
        aNbInMonth = [];
        aAmInMonth = [];
        
        while(_m <= _iMaxIndex){
            let _l = 1;
            aNbInMonth[_m] = 0;
            while( _l < iMaxLevel){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    iTotal+= aData[_m][_l].defenses.number[_i] * aData[_m][_l].defenses.pu[_i];
                    aNbInMonth[_m] += aData[_m][_l].defenses.number[_i];
                }
            _l+=1
            }
            sHtml+=`<td>${iTotal}</td>`;
            aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        sHtml+="<tr>";
        sHtml+="<td>Soutenances (Nb)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${aNbInMonth[_m]-aCanceledNbDInMonth[_m]}(${aNbInMonth[_m]})</td>`;
            iTotalRow+=aNbInMonth[_m]
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        sHtml+="<tr>";
        sHtml+="<td>Soutenances (PU)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        // help to show what are params aData[0][1].sessions.number.reduce((ac,v,k)=>console.log(ac,v,k))

        while(_m <= _iMaxIndex){
            sHtml+=`<td>${((aAmInMonth[_m]-aCanceledNbDInMonth[_m])/aNbInMonth[_m]).toFixed(2)}</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";

        // -- Bonus AF
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Bonus</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Bonus AF</td>";
        _m = 0;
        iTotal = 0
        let aAmBoInMonth = [];
        while(_m <= _iMaxIndex){
            let _z = aData[_m][0].bonus;
            aAmBoInMonth[_m] = 0
            for (let _i=0; _i < _z.length; _i+=1 ){
            //for(var t in aData[_m][0].bonus){
                //sHtml+=`<tr><td>${oBonus[t].who_name}</td><td>${oBonus[t].sessions}/4</td><td>30</td><td>${(oBonus[t].session*1)*30/4} €</td></tr>`; //NOTE STT last column evaluated to NaN ... why ?
                iTotal+= _z[_i].sessions > 4 ? _z[_i].sessions*30/5 : _z[_i].sessions*30/4;
            }
            sHtml+=`<td>${iTotal}</td>`;
            aAmBoInMonth[_m]=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+= "</tr>";
        // -- TJM
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">TJM</td></tr>`;
        // TJM
        // workday_count()
        sHtml+="<tr>";
        sHtml+="<td>Nb Jrs</td>";
        _m = 0;
        var _iTot = [];
        iTotalRow = 0
        dtCurFrom = dtFrom;
        aAmInMonth = [];
        dtCurFrom = dtFrom.clone();
        let dtCurTo = dtCurFrom.clone().endOf('month');
        let aWorkDays=[]
        while(_m <= _iMaxIndex){
            if(dtCurTo.isAfter(dtTo,'day')) dtCurTo = dtTo.clone(); // last not add a month
            sHtml+=`<td>${workday_count(dtCurFrom,dtCurTo)} jrs</td>`;
            aWorkDays[_m] = workday_count(dtCurFrom,dtCurTo);
            dtCurFrom = dtCurFrom.add(1, 'month');
            dtCurTo = dtCurTo.add(1, 'month');
            _m+=1
        }
        sHtml+="</tr>";

        sHtml+="<tr>";
        sHtml+="<td>TJM</td>";
        _m = 0;
        while(_m <= _iMaxIndex){
            iTotal = 0;
            let _l = 1;
            aAmInMonth[_m] = 0
            _iTot[_m] = 0;
            while( _l < iMaxLevel){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
                }
                _l+=1
            }
            sHtml+=`<td>${(aAmInMonth[_m]/aWorkDays[_m]).toFixed(2)} €</td>`;
            _m+=1
        }
        sHtml+="</tr>";

        sHtml+="<tr>";
        sHtml+="<td>THM (théorique)</td>";
        _m = 0;
        _iTot = [];
        iTotalRow = 0
        dtCurFrom = dtFrom;
        aAmInMonth = [];
        while(_m <= _iMaxIndex){
            iTotal = 0;
            let _l = 1;
            aAmInMonth[_m] = 0
             _iTot[_m] = 0;
            while( _l < iMaxLevel){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];

                    if(isInOldMode(dtCurFrom)){
                        iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45/60);
                    } else {
                        if ([4,5,6,7].includes(_i)) {
                            // AF 30 min
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (30/60);
                        }
                        if ([0,1,2,3].includes(_i)) {
                            //
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45/60);
                        }
                    }
                    iTotal+= aData[_m][_l].defenses.number[_i] * (45/60);
                    //console.log(`cumul :${_m},${_l},${_i} soit ${iTotal} h`);
                }
                _l+=1
            }
            console.log(`montant mensuel : ${aAmInMonth[_m]} + bonus ${aAmBoInMonth[_m]}/ Nb heures ${iTotal} = $((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)`);
            sHtml+=`<td>${((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)} €</td>`;
            iTotalRow+=iTotal
            _iTot[_m] = iTotal
            iTotal = 0;
            _m+=1
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        sHtml+="</tr>";

        sHtml+="<tr>";
        sHtml+="<td>Nb heures</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${( _iTot[_m]).toFixed(2)} h</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";

        sHtml+="<tr>";
        sHtml+="<td>THM (person.)</td>";
        _m = 0;
        _iTot = [];
        iTotalRow = 0
        dtCurFrom = dtFrom;
        aAmInMonth = [];
        while(_m <= _iMaxIndex){
            iTotal = 0;
            let _l = 1;
            aAmInMonth[_m] = 0
            _iTot[_m] = 0;
            while( _l < iMaxLevel){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];

                    if(isInOldMode(dtCurFrom)){
                        iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM")/60);

                    } else {
                        if ([4,5,6,7].includes(_i)) {
                            // AF 30 min
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsAfM")/60);
                        }
                        if ([0,1,2,3].includes(_i)) {
                            //
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM")/60);
                        }
                    }
                    iTotal+= aData[_m][_l].defenses.number[_i] * (GM_config.get("nbHrsD")/60);
                    //console.log(`cumul :${_m},${_l},${_i} soit ${iTotal} h`);
                }
                _l+=1
            }
            console.log(`montant mensuel : ${aAmInMonth[_m]} + bonus ${aAmBoInMonth[_m]}/ Nb heures ${iTotal} = $((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)`);
            sHtml+=`<td>${((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)} €</td>`;
            iTotalRow+=iTotal
            _iTot[_m] = iTotal
            iTotal = 0;
            _m+=1
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        sHtml+="</tr>";

        sHtml+="<tr>";
        sHtml+="<td>Nb heures</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${( _iTot[_m]).toFixed(2)} h</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";

        sHtml+="</tbody>";
        sHtml+="<tfoot>";
        sHtml+"<p>Attention le nombre entre parenthèse représente les sessions y compris les sessions annulées</p>";
        sHtml+="</tfoot>";
        sHtml+="</table>";
        //console.log("%cTemps total in " + (t2 - t0) + " milliseconds.", sCStylPerf);
        var t2 = performance.now();console.log("%cTime to show table :" + (t2 - t1) + " milliseconds.", sCStylPerf);
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

        //console.dir(r);

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
                if (r[i].status === "réalisée"){
                    iFPu = iPu;
                } else {
                    if (r[i].status === "étudiant absent" || r[i].status === "annulée tardivement" ){
                        iFPu = iPu * 0.5;
                    }
                }
            } else {
                bOldMode = false
                if (r[i].status === "réalisée"){
                    iFPu = iPu;
                } else {
                    if (r[i].status === "étudiant absent" ){
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
    var about = async function(){
        var sHtml ="";

        //sHtml+="dans l'idéal parse le read.me de github";

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

        createPdf();
    }

    //----------------------------- UI
      var debugMode = function(){
        debugger;
    }

    var initUI = function(){
        console.log('%c in initUI','background-color:green;color:white');
        buildUI();
        var draggie = new Draggabilly('.draggable', {handle: '.handle'});
        startFpsTracker('animation-target');

    }

    var buildUI = function(){
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
        addButton('addCbox', addCbox, {},div);
        addButton('collectChecked', collectChecked, {},div);
        addButton('CollectAuto', historyFetch, {}, div);
        addButton('showBill', showBill, {},div);
        //addButton('HideCookies', hideCookies, {},div);
        //addButton('Fetch', fetchG, {},div);
        addButton('billInDetails', billInDetails, {},div);
        addButton('RAZ', razDbase, {},div);
        addButton('SList', showStudentsList, {}, div);
        //addButton('DbgMode', debugMode, {}, div);
        //addButton('PDF', pdf, {}, div);
        addButton('statistics', statistics1, {}, div);
        addButton('about', about, {},div);
        /* FPS Tracker */
        //var _e = document.createElement('hr');
        //div.appendChild(_e);
        var fpstracker = document.createElement('div');
        fpstracker.id = "animation-target";
        div.appendChild(fpstracker);

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
    /*
     * bMonthAdjustment : for toggle month aligned to selected from endofmonth
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
                if (bMonthAdjustment===true)
                    el.querySelector('#dtFrom').addEventListener('change', function(){document.getElementById('dtTo').value = dayjs(document.getElementById('dtFrom').value).endOf('month').format("YYYY-MM-DD");})
                //console.log("%conOpen popup", "color:coral")
            },
            onClose: (el) => {
                if (bMonthAdjustment===true)
                    el.querySelector('#dtFrom').removeEventListener("change");
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
    /* https://www.sitepoint.com/delay-sleep-pause-wait/ */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /*
    https://css-tricks.com/considerations-styling-modal/
    https://codepen.io/aepicos/pen/eYJWEpG
    */
    var uiShowPleaseWait = function(){

        //https://csscompressor.com/ ou https://cssminifier.com/
        var sHtml = "";
        sHtml+="<style>";
        // src https://dabblet.com/gist/7708654
        sHtml+='.loading{border-bottom:6px solid rgba(0,0,0,.1);border-left:6px solid rgba(0,0,0,.1);border-right:6px solid rgba(0,0,0,.1);';
        sHtml+='border-top:6px solid rgba(0,0,0,.4);border-radius:100%;height:50px;width:50px;animation:rot .6s infinite linear}';
        sHtml+='@keyframes rot{from{transform:rotate(0deg)}to{transform:rotate(359deg)}';

        sHtml+='.modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)}';
        sHtml+="</style>";

        sHtml+='<div id="modal" aria-hidden="true" aria-labelledby="modalTitle" aria-describedby="modalDescription" role="dialog">';
        sHtml+='div class="loading"></div>BLIP</div>';

        if (document.querySelector("#pleaseWaitDialog") == null) {
            var modalLoading = $(document.body).append(sHtml);
        }
        //$("#pleaseWaitDialog").modal("show");
    }

    /* https://stackoverflow.com/questions/40365771/sweet-alert-dialog-with-spinner-in-angularjs */

    const UIShowLoading = function() {
        Swal.fire({
            title: 'Please Wait',
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: '#19191a',
            showConfirmButton: false,
            onOpen: ()=>{
                Swal.showLoading();
            }

            // timer: 3000,
            // timerProgressBar: true
        });
    };

    const UIHideLoading = function(){
        Swal.close();
    }





    // ----------------------------- EntryPoint

    /**
     * More accurately check the type of a JavaScript object
     * @param  {Object} obj The object
     * @return {String}     The object type
     * SRC https://github.com/cferdinandi/reef/blob/master/src/components/reef.js
     */
    var trueTypeOf = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    };
    _.trueTypeOf = trueTypeOf;
    // adapted from https://github.com/cferdinandi
    var checkSupport = function () {
        if (!window.DOMParser) return false;
        var parser = new DOMParser();
        try {
            parser.parseFromString('x', 'text/html');
        } catch(err) {
            return false;
        }
        return true;
        if(_.trueTypeOf(fetchInject) !== 'function'){
           console.log("%cWe Will have a problem because fetchInject isn't loaded","background-color:red;color:white");
        }
        if(_.trueTypeOf(document.arrive) !== 'function'){
            console.warn("%cWe have a problem document.arrive is not loaded, let's try another strategy for loading it","background-color:coral;color:white");
           fetchInject([
            'https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/arrive.min.js'
           ]).then(() => {
            console.log(`external arrive.min.js loaded`);
            document.arrive(".MuiAvatar-img", _warmup);
           })
        }
        // all is right
        return true;


    }
   
    var _warmup = function(){

        // 'this' refers to the newly created element
        console.log("%cinSetup","background-color:green;color:white");
        // chargement des CSS de jspnael
        GM_addStyle( GM_getResourceText("jspanelcss") );
        GM_addStyle( GM_getResourceText("toastifycss") );
        GM_addStyle( GM_getResourceText("simpledatatablecss") );
        /* SPECTRE CSS */
        // fonctionne mal avec le thème oc GM_addStyle( GM_getResourceText("spectrecss") );
        GM_registerMenuCommand('OC Facturier - configure', opencfg);
        /* hacks */
        if(GM_config.get('hackheaderzindex') === true){
            document.getElementById('header').style.zIndex = 0; // because z index is 1000 in oc rules
        }
        /* set size of content */
        GM_addStyle('.swal2-content{font-size:'+GM_config.get('sizeofcontentlist')+'}');
        GM_addStyle('.swal2-title{font-size:1.275em)'); // set by default to 1.875em by CSS of SWAL
        main();
    }

    const bSupport = checkSupport(); //TODO better use it
    console.log('%cAre all functions supported ?','background-color:green;color:white', bSupport);
    // when avatar if loaded start application
    document.arrive(".MuiAvatar-img", _warmup);


   var main = function(){
       console.log('​​​%cMainLoaded​​​','background-color:green;color:white');
       var adapter = new LocalStorage('db');
       var db = low(adapter);
       db.defaults({ students: [] , pricing: [], sessions: [], f_archives:[] }).write()
       var ctx = {dbase:db}
       //console.log(ctx)
       //window['sttctx'] = ctx ; // just for playing with functions
       window.sttctx = ctx
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
            initUI();
        }
       if(GM_config.get("alwaysaddcbox") === true){addCbox();} // add checkbox to element in history
       dayjs.locale('fr');
       /*
       ici toute l'idée est de verifier que le fichier d'install contient src ou dist ... s'il contient source alors, on doit utiliser en sus les ressources locales
       sinon on est sur la version livrée et donc on a tout déjà dans le script de base qui a été build
       */
       /*if(GM.info.script.downloadURL === "https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-DefenseAddOn/master/defense.js"){
           console.log("%cALERTE .... version locale !!!!!! ","background-color:coral;color:white");
           loadDependencies();
       }*/
   }

   var loadDependencies = function(){
       let rDependencies = [];
       rDependencies.push("http://localhost:8000/src/dummy.js");

       fetchInject(rDependencies).then(() => {
           console.log(`dependencies loaded`);
       })
   }

   // utility
   var FpsTracker = function(){

       // window.cancelAnimationFrame(requestID);
       /* voir avec ce qui a été fait ici https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe plus précisemment l'update de juin 2016 */
   }

   function startFpsTracker(id) {
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

       requestAnimationFrame(slideRight);
   }





   // CFG
   // ----------------------------------------------------------- Tampermonkey Menu
   const windowcss = '#OCAddonsCfg {background-color: lightblue;} #OCAddonsCfg .reset_holder {float: left; position: relative; bottom: -1em;} #OCAddonsCfg .saveclose_buttons {margin: .7em;}';
   const iframecss = 'height: 16.7em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';
   const dbgcss    = 'position: absolute;top: 5px; left: 5px; right: 5px; bottom: 5px;padding: 10px;overflow-y: auto;display: none;background: rgba(250, 250, 250, 0.3);border: 3px solid #888;font: 14px Consolas,Monaco,Monospace;color: #ddd;z-index: 500';


   GM_config.init(
        {
            id: 'OCAddonsCfg',
            title: 'Configuration du module',
            fields:
            {
                nbHrsAfM:{
                    section: ['Statistiques', 'paramètres'],
                    label: "Nombre de minutes pour une session AF",
                    labelPos: 'left',
                    type: 'input',
                    default: 30,
                },
                nbHrsfM:{
                    label: "Nombre de minutes pour une session financée",
                    labelPos: 'left',
                    type: 'input',
                    default: 45,
                },
                nbHrsD:{
                    label: "Nombre de minutes pour une session de soutenance",
                    labelPos: 'left',
                    type: 'input',
                    default: 45,
                },
                maxfetchpg:{
                    section: ['Application', 'optimisation'],
                    label: "Maximum de page recherchées dans l'historique",
                    labelPos: 'left',
                    type: 'input',
                    default: 1000,
                },

                datacachelifetime: {
                    label: "Temps de conservation des données dans le cache (en ms)",
                    labelPos: 'left',
                    type: 'input',
                    default: 120000,
                },
                sizeofcontentlist:{
                    section: ['Interface', 'thème'],
                    label: 'taille de la police des listes',
                    labelPos: 'left',
                    type: 'input',
                    default: '1em;',
                },

                alwaysaddcbox:{
                    section: ['Interface', 'gadget'],
                    label: 'Toujours ajouter les checkbox',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },
                'hackheaderzindex':{
                    label: 'changer le zindex du bandeau haut',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },
                support: {
                    section: ['', 'Support'],
                    label: 'StephaneTy-Pro.github.io',
                    title: 'more info on https://github.com/StephaneTy-Pro',
                    type: 'button',
                    click: () => {
                        GM_openInTab('https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon', {
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
    // memoize
    // isSerialized allow function to use object cf doc : isSerialized -> should the parameters be serialized instead of directly referenced
    const memoized = moize.default(_calculateBill,{maxAge:GM_config.get("datacachelifetime"),  isSerialized: true, onCacheAdd: function(c,o,m){console.log("cache add");console.dir(c.keys);/*console.dir(o);console.dir(m)*/;}, onCacheHit: function(){console.log("cache hit");}});


    function opencfg()
    {
        GM_config.open();
        OCAddonsCfg.style = iframecss;
    }

})();



// ------ MISC
// found in stackoverflow to add an element first waiting full implementation of appendFirst in DOM
HTMLElement.prototype.appendFirst=function(childNode){
    if(this.firstChild)this.insertBefore(childNode,this.firstChild);
    else this.appendChild(childNode);
};

// @namespace    http://tampermonkey.net/
// @version      0.8
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


// GM_Config
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js

// sweetalert 2
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9/dist/sweetalert2.all.min.js

// draggabilly
// @require      https://cdnjs.cloudflare.com/ajax/libs/draggabilly/2.2.0/draggabilly.pkgd.min.js

// toastify
// @require     https://cdn.jsdelivr.net/npm/toastify-js@1.8.0/src/toastify.min.js
// @resource    toastifycss https://raw.githubusercontent.com/apvarun/toastify-js/master/src/toastify.css

//
// @require     https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js

// simple-datatables
// @require     https://cdn.jsdelivr.net/npm/simple-datatables@latest
// @resource    simpledatatablecss https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css

//spectreCSS - dommage fonctionne mal avec le thème OC
// @resource    spectrecss https://unpkg.com/spectre.css/dist/spectre.min.css

// require https://raw.githubusercontent.com/anywhichway/nano-memoize/master/dist/nano-memoize.min.js
// @require https://cdn.jsdelivr.net/npm/moize@5.4.7/dist/moize.min.js

// @require https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/fetch-inject.umd.min.js
// require https://cdn.jsdelivr.net/npm/fetch-inject

// PARSER MKDOWN
// @require 	 https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js

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
 * 0.5 correction de la matrice de calcul après juin
 *     intégration du calcul du bonus af
 *     corrections diverses de texte (changements de mots principalement)
 *     nettoyage de quelques dépendances
 *     travail sur la fonction fetch history pour la simplifier
 *     UI changement de texte de la facture
 *     UI la case à cocher est renommée en "in DB"
 *     la fonctionn addCbox ne recrée pas toute les cbox à chaque fois on peut donc l'appeller apres la collecte automatique
 *     en création d'étudiant la liste des parcours (incomplète est proposée dans l'autocompletion
 *     correction d'un bug dans la facturation avant 06/2020 (mauvaise affectation de la catégorie des noshow : annulé tardivement qui étaient visuellement avec les sessions)
 *
 *     
 * 0.6
 *      Travail sur la pré facture : changement du code pour une meilleure performance et pour permettre la réalisation de stat mensuselle : créattion d'un module spécifique
 *      GROS BUG A CORRIGER le statut étudiante absente existe !!!!!!
 *      debut du travail sur le module de statistique
 * 0.7
 *      Suite module de statistiques
 *      Utilisation de memoize pour mettre en cache le tableau
 *      UI Suppression du bouton getstudents qui ne sert plus à rien car lancé en automatique si l'étudiant n'est pas trouvé dans la liste
 *      Correction du bug pour Antony (document.arrive non disponible... mise en place provisioire d'un event alternatif)
 * 0.7.0001
 *      Version pour corriger le bug d'antony (deuxieme essai)
 * 0.8
 *      Correction d'un bug sur l'affichage des prix unitaires
 *      Ajout de la possibilité en configuration de régler le temps de mise en cache dans le menu de configuration du "plugin"
 *      Ajout du read.me dans le about
 *      Correction du bug sur le mois dans les stat
 *      Corrections de bugs divers
 *      Nettoyage du code, mises en commentaires de console
 *      Ajout de la notion de canceled dans les statistiques
 *      Ajout du paramétrage du nombre d'heure nécessaire par type de session pour les stats
 *      TODO ? mettre en cache les requetes pour les page historique ?
 * TODO
 * BUG hugo a diagnostiqué un bug en mise à jour des étudiants sur le financement dans le popup orange ... note STT je présume qu'il s'agit d'un probleme dû à l'async car le console.log est bon lui et l'entrée en BDD également
 * popup qui vient dire que tout c'est bien passé suite à la collecte des données de session ( A FAIRE)
 * toaster .... passer sur une seule et unique librairie
 * paramètres de l'application à nettoyer
 *
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
    // OC
    const sAutoFunded = "Auto-financé"; // in oc
    const sFunded = "Financé par un tiers" ; // in oc
    const status_0 = "réalisée";
    const status_1 = "annulée";
    const status_2 = "annulée tardivement";
    const status_3_m = "étudiant absent";
    const status_3_f = "étudiante absente";

    // const Application
    const sCStylPerf = "background-color:blue;color:white";

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
            await addSessionsToDbase(me);
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
        return `${_t[2]}-${oMonth.id}-${_t[0]}T${_t[4]}`; // NOTESTT correspond plus ou moins au format std day js YYYY-MM-DDTHH:MM
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
             throw Error('IRRECOVERABLE ERROR STUDENT NOT IN DB:');
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
        let aPathList = ["non présent dans la liste","Chef de projet digital", "Chef de projet SI", "Développeur d'application - Frontend", "Développeur Web", "Expert en stratégie marketing et communication ", "Production de contenu web avec CMS et Content Marketing ","Tech lead"]
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
        sHtml+='<input id="student_path" name="student_path" type="text" list="student_path-list">';
        sHtml+='<datalist id="student_path-list">';
        for(var i in aPathList){
            sHtml+=`<option>${aPathList[i]}</option>`;
        }
        sHtml+='/<datalist>';

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
                //console.log("will check fund mode");
                oSession.isFunded = !(IsStudentAutoFunded(oSession.who_id));
                }

            }
        // because of Difference between AF and not AF
        //console.log("is student funded ?", oSession.isFunded)

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

    }

    
    /*
     *
     * pg = current page of history
     */
    var historyFetch = async function (){

        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));


        //console.log(`wanna fetch history between ${dtFrom.format()} and ${dtTo.format()} searching in page ${pg} of history`);
        /*
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
        */
        // check if first line is after start of parsing date data
       
        // don't load next page if date of last line is before start date of data
        let iRecurse = 0;
        let iMaxRecurse = GM_config.get('maxfetchpg');
        //let dtFirstRowDate = convertRowToDate(oDom,0)
        let bBrowse = true
        var res = {}
        let data = []
        let pg=1
        while(bBrowse){
            console.log(`iRecurse > iMaxRecurse ? ${iRecurse} > ${iMaxRecurse} = ${iRecurse > iMaxRecurse}`);
            if (iRecurse > iMaxRecurse) {
                console.warn("%cEMERGENCY EXIT LOOP","color:orange");
                break; // emergency exit
            }
            
            res = await _historyFetch(dtFrom, dtTo, pg, data)
            //console.dir(res);console.log(res.length);
            //Si la dernière ligne du tableau est plus récente que la date de bébut arrête
            if(res.length>0 && dayjs(res[res.length-1].when).isSameOrBefore(dtFrom) === true){
                bBrowse = false;
            }
            pg+=1
            iRecurse+=1
        }

        //console.dir(res)

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

        addCbox(); // addCbox onn
    }

    var convertRowToDate =  function(oDom, index=0){
         if (index === -1) {
            index = oDom.children.length-1
        }
        //console.log(`index is ${index}`);
        var sRowDate = oDom.children[index].children[0].innerText;
        //console.log(`sRowDate is ${sRowDate}`);
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
                bChecked = IsSessionInDb(id);
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
                bChecked = IsSessionInDb(aChkBox[v].value);
                //console.log(`is the session with id ${aChkBox[v].value} in db ? ${bChecked}`);
                if (bChecked === true){
                    aChkBox[v].checked = true;
                } else {
                    aChkBox[v].checked = false;
                }
            }
        }
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
        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'));
        //var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isBefore(dtTo) && dayjs(v.when).isAfter(dtFrom));

        /*
        var dtFiltered = db.get('sessions').filter(v => dayjs(v.when).isSameOrBefore(dtTo,'day') && dayjs(v.when).isSameOrAfter(dtFrom,'day'));

         if(isInOldMode(dtFrom)){
             billPhase1(dtFiltered,dtFrom,dtTo);
         } else {
             billPhase2(dtFiltered,dtFrom,dtTo);
         }
         */
         var data = calculateBill(dtFrom, dtTo);
         if(isInOldMode(dtFrom)){
             showBillPhase1(dtFrom, dtTo, data);
         } else {
             showBillPhase2(dtFrom, dtTo, data);
         }
    }

    /*
     * This function used memoized private version
     *
     */
    var calculateBill = function(dtFrom, dtTo){

         //aData.push(memoized(dtCurFrom.format("YYYY-MM-DD"), dtCurTo.format("YYYY-MM-DD")));
        //const memoized = nanomemoize(calculateBill,{maxAge:50000});
        //const memoized = moize.default(_calculateBill,{maxAge:500000,  onCacheAdd: function(c,o,m){console.log("cache add");console.dir(c.keys);/*console.dir(o);console.dir(m)*/;}, onCacheHit: function(){console.log("cache hit");}});

        // NOTESTT for a unknow reason object are not converted to same date (perhaps because of conversion to endofmoth so for cachine only use string keys
        // example : 0: Array [ "|\"2020-03-31T22:00:00.000Z\"|\"2020-04-29T22:00:00.000Z\"|" ]
        //1: Array [ "|\"2020-04-30T22:00:00.000Z\"|\"2020-05-30T22:00:00.000Z\"|" ]
        //2: Array [ "|\"2020-05-31T22:00:00.000Z\"|\"2020-06-29T22:00:00.000Z\"|" ]
        // 3: Array [ "|\"2020-05-31T22:00:00.000Z\"|\"2020-06-30T21:59:59.999Z\"|" ]
        //4: Array [ "|\"2020-04-30T22:00:00.000Z\"|\"2020-05-31T21:59:59.999Z\"|" ]
        //5: Array [ "|\"2020-03-31T22:00:00.000Z\"|\"2020-04-30T21:59:59.999Z\"|" ]
        //6: Array [ "|\"2020-02-29T23:00:00.000Z\"|\"2020-03-31T21:59:59.999Z\"|" ]
        //7: Array [ "|\"2020-01-31T23:00:00.000Z\"|\"2020-02-29T22:59:59.999Z\"|" ]
        //8: Array [ "|\"2019-12-31T23:00:00.000Z\"|\"2020-01-31T22:59:59.999Z\"|" ]
        if (typeof dtFrom !== 'string'){ dtFrom = dayjs(dtFrom).format("YYYY-MM-DD");};
        if (typeof dtTo !== 'string'){ dtTo = dayjs(dtTo).format("YYYY-MM-DD"); }

        return memoized(dtFrom, dtTo);
    }

    var _calculateBill = function (dtFrom, dtTo){

        //UIShowLoading();

        // cast to date type
        if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
        if (typeof dtTo === 'string'){ dtTo = dayjs(dtTo) }

        var t0 = performance.now();

        var db=sttctx.dbase; // TODO Change this to less ugly
        var r = db.get('sessions').filter(v => dayjs(v.when).isSameOrBefore(dtTo,'day') && dayjs(v.when).isSameOrAfter(dtFrom,'day'));
        var iPrice1=30,iPrice2=35,iPrice3=40,iPrice4=50;
        var aPrice = [0,iPrice1,iPrice2,iPrice3,iPrice4];
        // segments are the same in all the versions (pre or past) june 2020
        // lvl1
 		var l10 = r.filter( v => v.lvl == 1 && v.status === status_0 && v.isFunded === true);
        var l11 = r.filter( v => v.lvl == 1 && v.status === status_1 && v.isFunded === true);
        var l12 = r.filter( v => v.lvl == 1 && v.status === status_2 && v.isFunded === true);
        var l13 = r.filter( v => v.lvl == 1 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true);

        var l14 = r.filter( v => v.lvl == 1 && v.status === status_0 && v.isFunded === false);
        var l15 = r.filter( v => v.lvl == 1 && v.status === status_1 && v.isFunded === false);
        var l16 = r.filter( v => v.lvl == 1 && v.status === status_2 && v.isFunded === false);
        var l17 = r.filter( v => v.lvl == 1 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false);

        // lvl 2
        var l20 = r.filter( v => v.lvl == 2 && v.status === status_0 && v.isFunded === true);
        var l21 = r.filter( v => v.lvl == 2 && v.status === status_1 && v.isFunded === true);
        var l22 = r.filter( v => v.lvl == 2 && v.status === status_2 && v.isFunded === true);
        var l23 = r.filter( v => v.lvl == 2 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true);

        var l24 = r.filter( v => v.lvl == 2 && v.status === status_0 && v.isFunded === false);
        var l25 = r.filter( v => v.lvl == 2 && v.status === status_1 && v.isFunded === false);
        var l26 = r.filter( v => v.lvl == 2 && v.status === status_2 && v.isFunded === false);
        var l27 = r.filter( v => v.lvl == 2 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false);

        //lvl 3
        var l30 = r.filter( v => v.lvl == 3 && v.status === status_0 && v.isFunded === true);
        var l31 = r.filter( v => v.lvl == 3 && v.status === status_1 && v.isFunded === true);
        var l32 = r.filter( v => v.lvl == 3 && v.status === status_2 && v.isFunded === true);
        var l33 = r.filter( v => v.lvl == 3 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true);

        var l34 = r.filter( v => v.lvl == 3 && v.status === status_0 && v.isFunded === false);
        var l35 = r.filter( v => v.lvl == 3 && v.status === status_1 && v.isFunded === false);
        var l36 = r.filter( v => v.lvl == 3 && v.status === status_2 && v.isFunded === false);
        var l37 = r.filter( v => v.lvl == 3 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false);

        // lvl 4
        var l40 = r.filter( v => v.lvl == 4 && v.status === status_0 && v.isFunded === true) ||0 ;
        var l41 = r.filter( v => v.lvl == 4 && v.status === status_1 && v.isFunded === true) || 0;
        var l42 = r.filter( v => v.lvl == 4 && v.status === status_2 && v.isFunded === true) || 0;
        var l43 = r.filter( v => v.lvl == 4 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true) || 0;

        var l44 = r.filter( v => v.lvl == 4 && v.status === status_0 && v.isFunded === false) ||0 ;
        var l45 = r.filter( v => v.lvl == 4 && v.status === status_1 && v.isFunded === false) || 0;
        var l46 = r.filter( v => v.lvl == 4 && v.status === status_2 && v.isFunded === false) || 0;
        var l47 = r.filter( v => v.lvl == 4 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false) || 0;

        var t1 = performance.now();console.log("%cFilter session took " + (t1 - t0) + " milliseconds.",sCStylPerf);

        // var defense
        var def = r.filter( v => v.type.toLowerCase() === 'soutenance') || 0;
        var d10 = def.filter( v => v.lvl == 1 && v.status === status_0 && v.isFunded === true);
        var d11 = def.filter( v => v.lvl == 1 && v.status === status_1 && v.isFunded === true);
        var d12 = def.filter( v => v.lvl == 1 && v.status === status_2 && v.isFunded === true);
        var d13 = def.filter( v => v.lvl == 1 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true);
        // must be empty for the moment
        var d14 = def.filter( v => v.lvl == 1 && v.status === status_0 && v.isFunded === false);
        var d15 = def.filter( v => v.lvl == 1 && v.status === status_1 && v.isFunded === false);
        var d16 = def.filter( v => v.lvl == 1 && v.status === status_2 && v.isFunded === false);
        var d17 = def.filter( v => v.lvl == 1 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false);

        //
        var d20 = def.filter( v => v.lvl == 2 && v.status === status_0 && v.isFunded === true);
        var d21 = def.filter( v => v.lvl == 2 && v.status === status_1 && v.isFunded === true);
        var d22 = def.filter( v => v.lvl == 2 && v.status === status_2 && v.isFunded === true);
        var d23 = def.filter( v => v.lvl == 2 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true);
        // must be empty for the moment
        var d24 = def.filter( v => v.lvl == 2 && v.status === status_0 && v.isFunded === false);
        var d25 = def.filter( v => v.lvl == 2 && v.status === status_1 && v.isFunded === false);
        var d26 = def.filter( v => v.lvl == 2 && v.status === status_2 && v.isFunded === false);
        var d27 = def.filter( v => v.lvl == 2 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false);

        //
        var d30 = def.filter( v => v.lvl == 3 && v.status === status_0 && v.isFunded === true);
        var d31 = def.filter( v => v.lvl == 3 && v.status === status_1 && v.isFunded === true);
        var d32 = def.filter( v => v.lvl == 3 && v.status === status_2 && v.isFunded === true);
        var d33 = def.filter( v => v.lvl == 3 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true);
        // must be empty for the moment
        var d34 = def.filter( v => v.lvl == 3 && v.status === status_0 && v.isFunded === false);
        var d35 = def.filter( v => v.lvl == 3 && v.status === status_1 && v.isFunded === false);
        var d36 = def.filter( v => v.lvl == 3 && v.status === status_2 && v.isFunded === false);
        var d37 = def.filter( v => v.lvl == 3 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false);

        //
        var d40 = def.filter( v => v.lvl == 4 && v.status === status_0 && v.isFunded === true) ||0 ;
        var d41 = def.filter( v => v.lvl == 4 && v.status === status_1 && v.isFunded === true) || 0;
        var d42 = def.filter( v => v.lvl == 4 && v.status === status_2 && v.isFunded === true) || 0;
        var d43 = def.filter( v => v.lvl == 4 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === true) || 0;
        // must be empty for the moment
        var d44 = def.filter( v => v.lvl == 4 && v.status === status_0 && v.isFunded === false) ||0 ;
        var d45 = def.filter( v => v.lvl == 4 && v.status === status_1 && v.isFunded === false) || 0;
        var d46 = def.filter( v => v.lvl == 4 && v.status === status_2 && v.isFunded === false) || 0;
        var d47 = def.filter( v => v.lvl == 4 && (v.status === status_3_m || v.status === status_3_f) && v.isFunded === false) || 0;

        var t2 = performance.now();console.log("%cfilter defenses took " + (t2 - t1) + " milliseconds." ,sCStylPerf);

        var myArray = [];
        var now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');

        // ce mode de calcul a un risque majeur .... si on travaille à cheval sur deux mois, ou plus les périodes doivent être du 01 au .... et durer au plus un mois ou etre post 2020
        // au pire il faudra s'amuser à recalculer ligne à ligne
        var aPu=[];
        if(isInOldMode(dtFrom)){
            aPu[1] = [aPrice[1],0,aPrice[1]/2,aPrice[1]/2,aPrice[1],0,aPrice[1]/2,aPrice[1]/2];
            aPu[2] = [aPrice[2],0,aPrice[2]/2,aPrice[2]/2,aPrice[2],0,aPrice[2]/2,aPrice[2]/2];
            aPu[3] = [aPrice[3],0,aPrice[3]/2,aPrice[3]/2,aPrice[3],0,aPrice[3]/2,aPrice[3]/2];
            aPu[4] = [aPrice[4],0,aPrice[4]/2,aPrice[4]/2,aPrice[4],0,aPrice[4]/2,aPrice[4]/2];
        } else {
            aPu[1] = [aPrice[1],0,0,aPrice[1]/2,aPrice[1]/2,0,0,aPrice[1]/4];
            aPu[2] = [aPrice[2],0,0,aPrice[2]/2,aPrice[2]/2,0,0,aPrice[2]/4];
            aPu[3] = [aPrice[3],0,0,aPrice[3]/2,aPrice[3]/2,0,0,aPrice[3]/4];
            aPu[4] = [aPrice[4],0,0,aPrice[4]/2,aPrice[4]/2,0,0,aPrice[4]/4];
        }

        /*
         * because there is no level in bonus for autofunded, i couldn't do a post calculation on sessions or defenses element
         */
        var oSessionsAf = r.filter( v => v.type.toLowerCase() !== 'soutenance' && v.status === status_0 && v.isFunded === false);
        var _temp = oSessionsAf.groupBy( v => v.who_id);
        var oBonus = []
        for( var n in _temp.value()){
            oBonus.push({who_id:n,who_name:_temp.value()[n][0].who_name,sessions:_temp.value()[n].length}); // all elements of test.value()[n] must be the same name because of groupBy id
        }

        // optimisation : this function seem to be expensive , so i need to catch result because i use it a lot
        var _s10 = l10.value().length;  // NOTESTT: could also do l10.size().value()
        var _s11 = l11.value().length;
        var _s12 = l12.value().length;
        var _s13 = l13.value().length;
        var _s14 = l14.value().length;
        var _s15 = l15.value().length;
        var _s16 = l16.value().length;
        var _s17 = l17.value().length;
        var _s20 = l20.value().length;
        var _s21 = l21.value().length;
        var _s22 = l22.value().length;
        var _s23 = l23.value().length;
        var _s24 = l24.value().length;
        var _s25 = l25.value().length;
        var _s26 = l26.value().length;
        var _s27 = l27.value().length;
        var _s30 = l30.value().length;
        var _s31 = l31.value().length;
        var _s32 = l32.value().length;
        var _s33 = l33.value().length;
        var _s34 = l34.value().length;
        var _s35 = l35.value().length;
        var _s36 = l36.value().length;
        var _s37 = l37.value().length;
        var _s40 = l40.value().length;
        var _s41 = l41.value().length;
        var _s42 = l42.value().length;
        var _s43 = l43.value().length;
        var _s44 = l44.value().length;
        var _s45 = l45.value().length;
        var _s46 = l46.value().length;
        var _s47 = l47.value().length;
        // ---------------------------
        var _d10 = d10.value().length;
        var _d11 = d11.value().length;
        var _d12 = d12.value().length;
        var _d13 = d13.value().length;
        var _d14 = d14.value().length;
        var _d15 = d15.value().length;
        var _d16 = d16.value().length;
        var _d17 = d17.value().length;
        var _d20 = d20.value().length;
        var _d21 = d21.value().length;
        var _d22 = d22.value().length;
        var _d23 = d23.value().length;
        var _d24 = d24.value().length;
        var _d25 = d25.value().length;
        var _d26 = d26.value().length;
        var _d27 = d27.value().length;
        var _d30 = d30.value().length;
        var _d31 = d31.value().length;
        var _d32 = d32.value().length;
        var _d33 = d33.value().length;
        var _d34 = d34.value().length;
        var _d35 = d35.value().length;
        var _d36 = d36.value().length;
        var _d37 = d37.value().length;
        var _d40 = d40.value().length;
        var _d41 = d41.value().length;
        var _d42 = d42.value().length;
        var _d43 = d43.value().length;
        var _d44 = d44.value().length;
        var _d45 = d45.value().length;
        var _d46 = d46.value().length;
        var _d47 = d47.value().length;

        var aSNumbers = [_s10,_s11,_s12,_s13,_s14,_s15,_s16,_s17];
        var aDNumbers = [_d10,_d11,_d12,_d13,_d14,_d15,_d16,_d17];
        myArray.push({dtFrom,dtTo,now,errors:[],bonus:oBonus});
        myArray.push({sessions:{data:[l10,l11,l12,l13,l14,l15,l16,l17],number:aSNumbers,pu:aPu[1]},defenses:{data:[d10,d11,d12,d13,d14,d15,d16,d17],number:aDNumbers,pu:aPu[1]}});
        aSNumbers = [_s20,_s21,_s22,_s23,_s24,_s25,_s26,_s27];
        aDNumbers = [_d20,_d21,_d22,_d23,_d24,_d25,_d26,_d27];
        myArray.push({sessions:{data:[l20,l21,l22,l23,l24,l25,l26,l27],number:aSNumbers,pu:aPu[2]},defenses:{data:[d20,d21,d22,d23,d24,d25,d26,d27],number:aDNumbers,pu:aPu[2]}});
        aSNumbers = [_s30,_s31,_s32,_s33,_s34,_s35,_s36,_s37];
        aDNumbers = [_d30,_d31,_d32,_d33,_d34,_d35,_d36,_d37];
        myArray.push({sessions:{data:[l30,l31,l32,l33,l34,l35,l36,l37],number:aSNumbers,pu:aPu[3]},defenses:{data:[d30,d31,d32,d33,d34,d35,d36,d37],number:aDNumbers,pu:aPu[3]}});
        aSNumbers = [_s40,_s41,_s42,_s43,_s44,_s45,_s46,_s47];
        aDNumbers = [_d40,_d41,_d42,_d43,_d44,_d45,_d46,_d47];
        myArray.push({sessions:{data:[l40,l41,l42,l43,l44,l45,l46,l47],number:aSNumbers,pu:aPu[4]},defenses:{data:[d40,d41,d42,d43,d44,d45,d46,d47],number:aDNumbers,pu:aPu[4]}});
        /*
        myArray[1].sessions.number[0].value().length -> renvoie le nombre de sessions de niveau 1 dans la catégorie l10 (autofinancés et statut = réalisée
        myArray[1].sessions.number[0].value().length * myArray[1].sessions.pu[0] renvoie le CA des sessions de niveau expertise 1 autofinancés et réalisées
        myArray[3].sessions.pu[4] renvoie le prix unitaire des sessions de niveau 4
        */
        var t3 = performance.now();console.log("%cmy array computation took " + (t3 - t2) + " milliseconds.", sCStylPerf);

        //UIHideLoading();
        return myArray;

    }
    /*
     * dtFrom : dayjs format
     * dtTo : dayjs format
     * r : array of data
     */
    var showBillPhase1 = function (dtFrom, dtTo,r){
        var sHtml ="";
        var _ref = null;
        var iTotQ = 0
        var iTotM = 0
        var aTable = [[4,"Groupe"],[1,"Niveau 1"],[2,"Niveau 2"],[3,"Niveau 3"]]
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
            _ref = r[aTable[k][0]].sessions; // used by commons elments like pu for now
            let _q1 = _ref.number[0];
            let _q2 = _ref.number[4];
            let _m1 = _q1 * _ref.pu[0];
            let _m2 = _q2 * _ref.pu[4];
            iTotQ+= _q1+_q2;
            iTotM+= _m1+_m2;
            sHtml+=`<td>${_q1 +_q2 }</td><td>${(_ref.pu[0] + _ref.pu[4] )/2}</td><td>${_m1 + _m2}€</td>`;
            /*
            sHtml+=`<td>${_ref.number[0].value().length + _ref.number[4].value().length}</td>`;
            sHtml+=`<td>${_ref.pu[0]}</td><td>${_ref.number[0].value().length * _ref.pu[0] + _ref.number[4].value().length * _ref.pu[4]}€</td>`;
            iTotQ+=_ref.number[0].value().length + _ref.number[4].value().length;
            iTotM+=_ref.number[0].value().length * _ref.pu[0] + _ref.number[4].value().length * _ref.pu[4];
            */
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
            /*
            sHtml+=`<td>${_ref.number[2].value().length + _ref.number[6].value().length+_ref.number[3].value().length + _ref.number[7].value().length}</td>`;
            sHtml+=`<td>${_ref.number[2].value().length * _ref.pu[2] + _ref.number[6].value().length *_ref.pu[6] + _ref.number[3].value().length * _ref.pu[3] + _ref.number[7].value().length * _ref.pu[7]}€</td>`;
            iTotQ+=_ref.number[2].value().length + _ref.number[6].value().length+_ref.number[3].value().length + _ref.number[7].value().length;
            iTotM+=_ref.number[2].value().length * _ref.pu[2] + _ref.number[6].value().length *_ref.pu[6] + _ref.number[3].value().length * _ref.pu[3] + _ref.number[7].value().length * _ref.pu[7];
            */
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
        var _i = 1;
        while( _i < 5){
            iCanceledSessions += r[_i].sessions.number[1];
            iCanceledSessions += r[_i].sessions.number[5];
            _i+=1
        }

        // total of sessions
        var iTotalSessions = 0;
        var iTotalHtSessions = 0;

        for (var _k in r){
            if (_k == 0) continue; // NOTESTT === is an error cause this is a ref not an integer
            for (_i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too
                let _t = r[_k].sessions.number[_i];
                iTotalSessions += _t;
                iTotalHtSessions += _t * r[_k].sessions.pu[_i];
            }
        }


        var iTotalDefenses = 0;
        var iTotalHtDefenses = 0;

        for (_k in r){
            if (_k == 0) continue; // NOTESTT === is an error cause this is a ref not an integer
            for (_i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too
                let _t = r[_k].defenses.number[_i];
                iTotalDefenses += _t;
                iTotalHtDefenses += _t * r[_k].defenses.pu[_i];
            }
        }
        sHtml+= `<p>Ces ${iTotalSessions} session(s) se répartissent en ${iTotQG -iTotQ} session(s) de mentorat (${iTotMG -iTotM}€)`
        sHtml+= `, ${iTotQ} NoShows (${iTotM}€)`
        sHtml+= ` et ${iCanceledSessions} session(s) annulée(s) (${0}€)</p>`;
        sHtml+= `<p>Sur le total de ${iTotalSessions} session(s) (${iTotalHtSessions}€) `;
        sHtml+= `vous avez réalisé ${iTotalDefenses} soutenance(s) (${iTotalHtDefenses}€)</p>`;

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
    *
    */

    var showBillPhase2 = function (dtFrom, dtTo,r){
        console.log("enter computation bill");
        var t0 = performance.now()

        // UIShowLoading();

        /*var dtFrom=dayjs("2020-06-01");
        var dtTo=dayjs("2020-06-30");
        var r = calculateBill(dtFrom, dtTo);
        console.log(r);
        */
        var sHtml ="";
        var _ref = null;
        var iTotQ1 = 0
        var iTotQ2 = 0;
        var iTotM1 = 0
        var iTotM2 = 0;
        var aTable = [[4,"Groupe"],[1,"Niveau 1"],[2,"Niveau 2"],[3,"Niveau 3"]]
        /* https://www.w3.org/WAI/tutorials/tables/multi-level/ */
        sHtml+= "<style>.wrapper{  display: grid;grid-gap: 10px;grid-template-column: 1fr 1fr;}</style>";
        sHtml+='<div class="wrapper">';
        sHtml+='<table>';
        sHtml+='<caption>Sessions de mentorat</caption>';
        sHtml+='<thead>';
        sHtml+='<tr>';
        sHtml+='<th rowspan="2">Type</th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th>';
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+="</tr>";
        sHtml+='</thead>';
        sHtml+='<tbody>';
        // /!\ defenses are already counted in sessions
        var t12 = performance.now();//console.log("%cCalculate first html table took " + (t1 - t0) + " milliseconds.", sCStylPerf);
        for (var k in aTable){
            sHtml+='<tr>';
            sHtml+="<td>"+aTable[k][1]+"</td>";
            _ref = r[aTable[k][0]].sessions; // used by commons elments like pu for now
            let _q1 = _ref.number[0]//.value().length
            let _q2 = _ref.number[4]//.value().length
            let _m1 = _q1 * _ref.pu[0];
            let _m2 = _q2 * _ref.pu[4];
            iTotQ1+= _q1;
            iTotQ2+= _q2;
            iTotM1+= _m1;
            iTotM2+= _m2;
            sHtml+=`<td>${_q1}</td><td>${_ref.pu[0]}</td><td>${_m1}€</td>`;
            sHtml+=`<td>${_q2}</td><td>${_ref.pu[4]}</td><td>${_m2}€</td>`;
            sHtml+=`<td>${_q1 + _q2}</td><td>${_m1 + _m2}€</td>`;
            /*
            sHtml+=`<td>${_ref.number[0].value().length}</td><td>${_ref.pu[0]}</td><td>${_ref.number[0].value().length*_ref.pu[0]}€</td>`;
            sHtml+=`<td>${_ref.number[4].value().length}</td><td>${_ref.pu[4]}</td><td>${_ref.number[4].value().length*_ref.pu[4]}€</td>`;
            var t121 = performance.now();//console.log("%cCalculate first html table took " + (t1 - t0) + " milliseconds.", sCStylPerf);
            iTotQ1+=_ref.number[0].value().length;
            iTotQ2+=_ref.number[4].value().length;
            iTotM1+=_ref.number[0].value().length * _ref.pu[0];
            iTotM2+=_ref.number[4].value().length * _ref.pu[4];
            var t131 = performance.now();console.log("%cCalculate 4 value()" + (t131 - t121) + " milliseconds.", sCStylPerf);
            sHtml+=`<td>${_ref.number[0].value().length  + _ref.number[4].value().length}</td><td>${_ref.number[0].value().length * _ref.pu[0] + _ref.number[4].value().length * _ref.pu[4]}€</td>`;
            */
            sHtml+="</tr>";

        }
        var t13 = performance.now();console.log("%cCalculate first array" + (t13 - t12) + " milliseconds.", sCStylPerf); // avant optimisation 1960 ms puis 434ms puis 429ms
        sHtml+='</tbody>';
        sHtml+='<tfoot>';
        sHtml+='<tr>';
        sHtml+="<td>Total</td>";
        sHtml+=`<td>${iTotQ1}</td><td></td><td>${iTotM1}€</td>`;
        sHtml+=`<td>${iTotQ2}</td><td></td><td>${iTotM2}€</td>`;
        sHtml+=`<td>${iTotQ1+iTotQ2}</td><td>${iTotM1+iTotM2}€</td>`;
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='</tr>';
        sHtml+='</tfoot>';
        sHtml+='</table>'

        var t1 = performance.now();console.log("%cCalculate first html table took " + (t1 - t0) + " milliseconds.", sCStylPerf);

        var iTotQG = iTotQ1+iTotQ2;
        var iTotMG = iTotM1+iTotM2;
        iTotQ1 = 0
        iTotQ2 = 0;
        iTotM1 = 0
        iTotM2 = 0;
        sHtml+='<table>';
        sHtml+='<caption>Sessions de mentorat (NoShow)</caption>';
        sHtml+='<thead>';
        sHtml+='<tr>';
        sHtml+='<th rowspan="2"></th><th colspan="3" scope="colgroup">Financés</th> <th colspan="3" scope="colgroup">Autofinancés</th><th colspan="2" scope="colgroup">Ensemble</th>';
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>PU(<abbr title="hors taxes">HT</abbr>)</th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+='<th><abbr title="nombre">nb</abbr></th><th>Total(<abbr title="hors taxes">HT</abbr>)</th>';
        sHtml+="</tr>";
        sHtml+='</thead>';
        sHtml+='<tbody>';
        for (k in aTable){
            sHtml+='<tr>';
            sHtml+="<td>"+aTable[k][1]+"</td>";
            _ref = r[aTable[k][0]].sessions;
            let _q1 = _ref.number[3]//.value().length;
            let _q2 = _ref.number[7]//.value().length;
            let _m1 = _q1 * _ref.pu[3];
            let _m2 = _q2 * _ref.pu[7];
            iTotQ1+= _q1;
            iTotQ2+= _q2;
            iTotM1+= _m1;
            iTotM2+= _m2;
            sHtml+=`<td>${_q1}</td><td>${_ref.pu[3]}</td><td>${_m1}€</td>`;
            sHtml+=`<td>${_q2}</td><td>${_ref.pu[7]}</td><td>${_m2}€</td>`;
            sHtml+=`<td>${_q1 + _q2}</td><td>${_m1 + _m2}€</td>`;
            /*
            sHtml+=`<td>${_ref.number[3].value().length}</td><td>${_ref.pu[3]}</td><td>${_ref.number[3].value().length * _ref.pu[3]}€</td>`;
            sHtml+=`<td>${_ref.number[7].value().length}</td><td>${_ref.pu[7]}</td><td>${_ref.number[7].value().length * _ref.pu[7]}€</td>`;
            iTotQ1+=_ref.number[3].value().length;
            iTotQ2+=_ref.number[7].value().length;
            iTotM1+=_ref.number[3].value().length * _ref.pu[3];
            iTotM2+=_ref.number[7].value().length * _ref.pu[7];
            sHtml+=`<td>${_ref.number[3].value().length + _ref.number[7].value().length}</td> <td>${_ref.number[3].value().length * _ref.pu[3] + _ref.number[7].value().length * _ref.pu[7]}€</td>`;
            */
            sHtml+="</tr>";

        }

        sHtml+='</tbody>';
        sHtml+='<tfoot>';
        sHtml+='<tr>';
        sHtml+="<td>Total</td>";
        sHtml+=`<td>${iTotQ1}</td><td></td><td>${iTotM1}€</td>`;
        sHtml+=`<td>${iTotQ2}</td><td></td><td>${iTotM2}€</td>`;
        sHtml+=`<td>${iTotQ1+iTotQ2}</td><td>${iTotM1+iTotM2}€</td>`;
        sHtml+='</tr>';
        sHtml+='<tr>';
        sHtml+='</tr>';
        sHtml+='</tfoot>';
        sHtml+='</table>'

        var t2 = performance.now();console.log("%cCalculate second html table took " + (t2 - t1) + " milliseconds.", sCStylPerf); // without optim 1799ms after 308ms

        iTotQG += iTotQ1+iTotQ2;
        iTotMG += iTotM1+iTotM2;

        var iCanceledSessions = 0;
        var _i = 1;
        while( _i < 5){
            iCanceledSessions += r[_i].sessions.number[1]//.value().length;
            iCanceledSessions += r[_i].sessions.number[2]//.value().length;
            iCanceledSessions += r[_i].sessions.number[5]//.value().length;
            iCanceledSessions += r[_i].sessions.number[6]//.value().length;
            _i+=1
        }


        // total of sessions
        var iTotalSessions = 0;
        var iTotalHtSessions = 0;

        for (var _k in r){
            if (_k == 0) continue; // NOTESTT === is an error cause this is a ref not an integer
            for (_i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too
                let _t = r[_k].sessions.number[_i]//.value().length;
                iTotalSessions += _t;
                iTotalHtSessions += _t * r[_k].sessions.pu[_i];
            }
        }


        var iTotalDefenses = 0;
        var iTotalHtDefenses = 0;

        for (_k in r){
            if (_k == 0) continue; // NOTESTT === is an error cause this is a ref not an integer
            for (_i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too
                let _t = r[_k].defenses.number[_i]//.value().length
                //console.log(`calcul des soutenance level ${_k}, section ${_i} (i:0=10, i:1=11 ....) = ${_t}`);
                iTotalDefenses += _t;
                iTotalHtDefenses += _t * r[_k].defenses.pu[_i];
            }
        }
        sHtml+= `<p>Ces ${iTotalSessions} session(s) se répartissent en ${iTotQG -iTotQ1 - iTotQ2} session(s) de mentorat (${iTotMG -iTotM1 - iTotM2}€)`
        sHtml+= `, ${iTotQ1 + iTotQ2} NoShows (${iTotM1 + iTotM2}€)`
        sHtml+= ` et ${iCanceledSessions} session(s) annulée(s) (${0}€)</p>`;
        sHtml+= `<p>Sur le total de ${iTotalSessions} session(s) (${iTotalHtSessions}€) `;
        sHtml+= `vous avez réalisé ${iTotalDefenses} soutenance(s) (${iTotalHtDefenses}€)</p>`;

        var t3 = performance.now();console.log("%cCalcuate bottom remark <p> took " + (t3 - t2) + " milliseconds.", sCStylPerf); // before optim 4658ms

        sHtml+="<table>";
        sHtml+='<caption>Sessions de mentorat Bonus AF</caption>';
        sHtml+="<thead>";
        sHtml+="<th>Qui</th><th>Nb Sessions</th><th>PU</th><th>Total</th>";
        sHtml+="</thead>";
        sHtml+="<tbody>";
        var iTotG = 0;
        for(var t in r[0].bonus){
            //sHtml+=`<tr><td>${oBonus[t].who_name}</td><td>${oBonus[t].sessions}/4</td><td>30</td><td>${(oBonus[t].session*1)*30/4} €</td></tr>`; //NOTE STT last column evaluated to NaN ... why ?
            var iTot = r[0].bonus[t].sessions > 4 ? r[0].bonus[t].sessions*30/5 : r[0].bonus[t].sessions*30/4;
            iTotG+=iTot
            sHtml+=`<tr><td>${r[0].bonus[t].who_name}</td><td>${r[0].bonus[t].sessions}/${r[0].bonus[t].sessions > 4 ? 5 : 4}</td><td>30</td><td>${iTot} €</td></tr>`;
        }
        sHtml+="</tbody>";
        sHtml+="<tfoot>";
        //sHtml+=`<tr>total</tr><tr colspan=3>${oBonus.reduce( (r,v,k) => r+v.sessions*30,0 )}</tr>`; // NOTE STT don't work because must be /4 or /5 dependings on total sessions per month per users
        sHtml+=`<tr><td>total</td><td></td><td></td><td>${iTotG} €</td></tr>`;
        sHtml+="</tfoot>";

        sHtml+="</table>";

        var t4 = performance.now();console.log("%cCalculate AF took " + (t4 - t3) + " milliseconds.", sCStylPerf);

        // close waiting popup
        var t5 = performance.now();console.log("%cCalculate html table took " + (t4 - t0) + " milliseconds.", sCStylPerf);
        //UIHideLoading();

        //sHtml+= `<p>Vous avez avez également annulé ${iSessionCanceledTotal} sessions sur un total de ${r.value().length} sessions </p>`;
        //sHtml+= `<p>le total des sessions inclut ${def.value().length} soutenances pour un total de ${df10+df11+df12+df13+df20+df21+df22+df23+df30+df31+df32+df33+df40+df41+df42+df43} €</p>`
        //sHtml+= `<p>Vous avez avez également annulé ${iDefenseCanceledTotal} soutenance sur un total de ${def.value().length} soutenances </p>`;
        //sHtml+= `<p>Soit un total de ${r.value().length} sessions (dont ${iSessionCanceledTotal} annulée(s). Ce total comprend ${def.value().length} soutenance(s) facturées ${df10+df11+df12+df13+df20+df21+df22+df23+df30+df31+df32+df33+df40+df41+df42+df43} €</p>`;
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

    var statistics1 = async function(){
        var [dtFrom,dtTo] = await popupDateSelector(dayjs().startOf('month'),dayjs().endOf('month'),false);
        // get month of first Date
        let dtCurFrom = dtFrom;
        let aData = []
        var t0 = performance.now();
        while (dtCurFrom.isSameOrBefore(dtTo,'day')){
            let dtCurTo = dtCurFrom.endOf('month')
            aData.push(calculateBill(dtCurFrom, dtCurTo));
            //aData.push(calculateBill(dtCurFrom.format("YYYY-MM-DD"), dtCurTo.format("YYYY-MM-DD")));
            //console.log(`calculateBill(${dtCurFrom}, ${dtCurTo});`);
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        var t1 = performance.now();console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", sCStylPerf);
        var sHtml ="";
        var _iMaxIndex = dtTo.get('month')-dtFrom.get('month');
        sHtml += "<table>";
        sHtml+="<thead>";
        sHtml+="<tr><th>Origine</th>";
        var _m1=0
        while( _m1 <= _iMaxIndex){
            let _dt = dtFrom.add(_m1, 'month');
            sHtml+=`<th>${_dt.format("MMMM")}</th>`;
            _m1+=1
        }
        sHtml+="<th>Total</th><th>Moyenne</th></tr>";
        sHtml+="</thdead>";
        sHtml+="<tbody>";
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Sessions</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Sessions (Mt)</td>";
        let iTotalRow = 0;
        let _m = 0;
        let iTotal = 0;
        let aNbInMonth = [];
        let aNbDInMonth = [];
        let aNbMInMonth = [];
        let aAmInMonth = [];
        let aCanceledNbInMonth = [];
        let aCanceledNbDInMonth = [];
        let aCanceledNbMInMonth = [];
        dtCurFrom = dtFrom;
        while(_m <= _iMaxIndex){
            let _l = 1;
            aNbInMonth[_m] = 0;
            aNbDInMonth[_m] = 0;
            aNbMInMonth[_m] = 0;
            aCanceledNbInMonth[_m] = 0;
            aCanceledNbDInMonth[_m] = 0;
            aCanceledNbMInMonth[_m] = 0;
            while( _l < 5){
                let _z = [...Array(8).keys()];
                //for (let _i in [...Array(8).keys()]){ // NOTESTT: ~ pythonic range ... could use _range too NOTE STT JAAMIS de in pour des arrays, les types de clé sont faux _i sera une string et pas un int cf reco MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
                for (let _i=0; _i < _z.length; _i+=1 ){ // NOTESTT: ~ pythonic range ... could use _range too
                    iTotal+= aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
                    aNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
                    aNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
                    aNbMInMonth[_m] += (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]);
                    // depending on date some sessions are canceled or not
                    if(isInOldMode(dtCurFrom)){
                        if ([1,5].includes(_i)) {
                            aCanceledNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
                            aCanceledNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
                            aCanceledNbMInMonth[_m] += aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i];
                        }
                    } else {
                        if ([1,2,5,6].includes(_i)) {
                            aCanceledNbInMonth[_m] += aData[_m][_l].sessions.number[_i];
                            aCanceledNbDInMonth[_m] += aData[_m][_l].defenses.number[_i];
                            aCanceledNbMInMonth[_m] += aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i];
                        }
                    }
                }
            _l+=1
            }
            sHtml+=`<td>${iTotal}</td>`;
            aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        // -- Display nubmer of sessions
        sHtml+="<tr>";
        sHtml+="<td>Sessions (Nb)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${aNbInMonth[_m]-aCanceledNbInMonth[_m]}(${aNbInMonth[_m]})</td>`;
            iTotalRow+=aNbInMonth[_m]
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        // -- Display price of each sessions
        sHtml+="<tr>";
        sHtml+="<td>Sessions (PU)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        // NOTESTT: hint to show what are params aData[0][1].sessions.number.reduce((ac,v,k)=>console.log(ac,v,k))

        
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${(aAmInMonth[_m]/(aNbInMonth[_m]-aCanceledNbInMonth[_m])).toFixed(2)}</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";

        // -- coaching
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Mentorat</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Mentorat (Mt)</td>";
        _m = 0;
        iTotal = 0;
        aAmInMonth = [];
        while(_m <= _iMaxIndex){
            let _l = 1;
            while( _l < 5){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    iTotal+= aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i] - (aData[_m][_l].defenses.number[_i] * aData[_m][_l].defenses.pu[_i]);
                    aAmInMonth[_m] = iTotal;
                }
            _l+=1
            }
            sHtml+=`<td>${iTotal}</td>`;
            _m+=1;
            iTotal = 0;
        }
        sHtml+="<tr>";
        sHtml+="<tr>";
        sHtml+="<td>Mentorat (Nb)</td>";
        iTotalRow = 0;
        _m = 0;
        iTotal = 0;
        aNbInMonth = [];
        //aAmInMonth = [];
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${aNbMInMonth[_m]-aCanceledNbMInMonth[_m]}(${aNbMInMonth[_m]})</td>`;
            //aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        sHtml+="<td>Mentorat (PU)</td>";
        _m = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${(aAmInMonth[_m]/(aNbMInMonth[_m]-aCanceledNbMInMonth[_m])).toFixed(2)}</td>`;
            aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        // -- defenses
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Soutenances</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Soutenances (Mt)</td>";
        iTotalRow = 0;
        _m = 0;
        iTotal = 0;
        aNbInMonth = [];
        aAmInMonth = [];
        
        while(_m <= _iMaxIndex){
            let _l = 1;
            aNbInMonth[_m] = 0;
            while( _l < 5){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    iTotal+= aData[_m][_l].defenses.number[_i] * aData[_m][_l].defenses.pu[_i];
                    aNbInMonth[_m] += aData[_m][_l].defenses.number[_i];
                }
            _l+=1
            }
            sHtml+=`<td>${iTotal}</td>`;
            aAmInMonth[_m] = iTotal;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        sHtml+="<tr>";
        sHtml+="<td>Soutenances (Nb)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        while(_m <= _iMaxIndex){
            sHtml+=`<td>${aNbInMonth[_m]-aCanceledNbDInMonth[_m]}(${aNbInMonth[_m]})</td>`;
            iTotalRow+=aNbInMonth[_m]
            _m+=1
        }
        sHtml+=`<td>${iTotalRow}</td><td>${(iTotalRow/(_iMaxIndex+1)).toFixed(2)}</td>`;
        sHtml+="</tr>";
        sHtml+="<tr>";
        sHtml+="<td>Soutenances (PU)</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        // help to show what are params aData[0][1].sessions.number.reduce((ac,v,k)=>console.log(ac,v,k))

        while(_m <= _iMaxIndex){
            sHtml+=`<td>${((aAmInMonth[_m]-aCanceledNbDInMonth[_m])/aNbInMonth[_m]).toFixed(2)}</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";

        // -- Bonus AF
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">Bonus</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>Bonus AF</td>";
        _m = 0;
        iTotal = 0
        let aAmBoInMonth = [];
        while(_m <= _iMaxIndex){
            let _z = aData[_m][0].bonus;
            aAmBoInMonth[_m] = 0
            for (let _i=0; _i < _z.length; _i+=1 ){
            //for(var t in aData[_m][0].bonus){
                //sHtml+=`<tr><td>${oBonus[t].who_name}</td><td>${oBonus[t].sessions}/4</td><td>30</td><td>${(oBonus[t].session*1)*30/4} €</td></tr>`; //NOTE STT last column evaluated to NaN ... why ?
                iTotal+= _z[_i].sessions > 4 ? _z[_i].sessions*30/5 : _z[_i].sessions*30/4;
            }
            sHtml+=`<td>${iTotal}</td>`;
            aAmBoInMonth[_m]=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+= "</tr>";
        // -- TJM
        sHtml+="<tr>";
        sHtml+=`<td colspan=${_iMaxIndex} style="text-align:left;">TJM</td></tr>`;
        sHtml+="<tr>";
        sHtml+="<td>THM (théorique)</td>";
        _m = 0;
        var _iTot = [];
        iTotalRow = 0
        dtCurFrom = dtFrom;
        aAmInMonth = [];
        while(_m <= _iMaxIndex){
            iTotal = 0;
            let _l = 1;
            aAmInMonth[_m] = 0
             _iTot[_m] = 0;
            while( _l < 5){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];

                    if(isInOldMode(dtCurFrom)){
                        iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45/60);
                    } else {
                        if ([4,5,6,7].includes(_i)) {
                            // AF 30 min
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (30/60);
                        }
                        if ([0,1,2,3].includes(_i)) {
                            //
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45/60);
                        }
                    }
                    iTotal+= aData[_m][_l].defenses.number[_i] * (45/60);
                    //console.log(`cumul :${_m},${_l},${_i} soit ${iTotal} h`);
                }
                _l+=1
            }
            console.log(`montant mensuel : ${aAmInMonth[_m]} + bonus ${aAmBoInMonth[_m]}/ Nb heures ${iTotal} = $((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)`);
            sHtml+=`<td>${((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)} €</td>`;
            iTotalRow+=iTotal
            _iTot[_m] = iTotal
            iTotal = 0;
            _m+=1
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        sHtml+="</tr>";
        sHtml+="<tr>";
        sHtml+="<td>Nb heures</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        // help to show what are params aData[0][1].sessions.number.reduce((ac,v,k)=>console.log(ac,v,k))

        while(_m <= _iMaxIndex){
            sHtml+=`<td>${( _iTot[_m]).toFixed(2)} h</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";



        sHtml+="<tr>";
        sHtml+="<td>THM (person.)</td>";
        _m = 0;
        _iTot = [];
        iTotalRow = 0
        dtCurFrom = dtFrom;
        aAmInMonth = [];
        while(_m <= _iMaxIndex){
            iTotal = 0;
            let _l = 1;
            aAmInMonth[_m] = 0
             _iTot[_m] = 0;
            while( _l < 5){
                let _z = [...Array(8).keys()]; // NOTESTT: ~ pythonic range ... could use _range too
                for (let _i=0; _i < _z.length; _i+=1 ){
                    aAmInMonth[_m] += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];

                    if(isInOldMode(dtCurFrom)){
                        iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM")/60);

                    } else {
                        if ([4,5,6,7].includes(_i)) {
                            // AF 30 min
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsAfM")/60);
                        }
                        if ([0,1,2,3].includes(_i)) {
                            //
                            iTotal+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM")/60);
                        }
                    }
                    iTotal+= aData[_m][_l].defenses.number[_i] * (GM_config.get("nbHrsD")/60);
                    //console.log(`cumul :${_m},${_l},${_i} soit ${iTotal} h`);
                }
                _l+=1
            }
            console.log(`montant mensuel : ${aAmInMonth[_m]} + bonus ${aAmBoInMonth[_m]}/ Nb heures ${iTotal} = $((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)`);
            sHtml+=`<td>${((aAmInMonth[_m]+aAmBoInMonth[_m])/iTotal).toFixed(2)} €</td>`;
            iTotalRow+=iTotal
            _iTot[_m] = iTotal
            iTotal = 0;
            _m+=1
            dtCurFrom = dtCurFrom.add(1, 'month');
        }
        sHtml+="</tr>";
        sHtml+="<tr>";
        sHtml+="<td>Nb heures</td>";
        iTotalRow = 0;
         _m = 0;
         iTotal = 0;
        // help to show what are params aData[0][1].sessions.number.reduce((ac,v,k)=>console.log(ac,v,k))

        while(_m <= _iMaxIndex){
            sHtml+=`<td>${( _iTot[_m]).toFixed(2)} h</td>`;
            iTotalRow+=iTotal
            iTotal = 0;
            _m+=1
        }
        sHtml+=`<td>${iTotalRow.toFixed(2)}</td><td>n/a</td>`;
        sHtml+="</tr>";

        sHtml+="</tbody>";
        sHtml+="<tfoot>";
        sHtml+"<p>Attention le nombre entre parenthèse représente les sessions y compris les sessions annulées</p>";
        sHtml+="</tfoot>";
        sHtml+="</table>";
        //console.log("%cTemps total in " + (t2 - t0) + " milliseconds.", sCStylPerf);
        var t2 = performance.now();console.log("%cTime to show table :" + (t2 - t1) + " milliseconds.", sCStylPerf);
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

        //console.dir(r);

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
                if (r[i].status === "réalisée"){
                    iFPu = iPu;
                } else {
                    if (r[i].status === "étudiant absent" || r[i].status === "annulée tardivement" ){
                        iFPu = iPu * 0.5;
                    }
                }
            } else {
                bOldMode = false
                if (r[i].status === "réalisée"){
                    iFPu = iPu;
                } else {
                    if (r[i].status === "étudiant absent" ){
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
    var about = async function(){
        var sHtml ="";

        //sHtml+="dans l'idéal parse le read.me de github";

        const response = await GMC.XHR({
            method: 'GET',
            url: 'https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/README.md',
            responseType: 'text/html',
            //binary: true,
            headers: {
                "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            },
        });

        console.log(response);

        var md = response.responseText;

        var converter = new showdown.Converter();
        var html = converter.makeHtml(md);

        sHtml+=html;

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
        //addButton('getStudents', getStudents, {},div);
        addButton('addCbox', addCbox, {},div);
        addButton('collectChecked', collectChecked, {},div);
        addButton('CollectAuto', historyFetch, {}, div);
        addButton('showBill', showBill, {},div);
        //addButton('HideCookies', hideCookies, {},div);
        //addButton('Fetch', fetchG, {},div);
        addButton('billInDetails', billInDetails, {},div);
        addButton('RAZ', razDbase, {},div);
        addButton('SList', showStudentsList, {}, div);
        //addButton('DbgMode', debugMode, {}, div);
        addButton('statistics', statistics1, {}, div);
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
    /*
     * bMonthAdjustment : for toggle month aligned to selected from endofmonth
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
                if (bMonthAdjustment===true)
                    el.querySelector('#dtFrom').addEventListener('change', function(){document.getElementById('dtTo').value = dayjs(document.getElementById('dtFrom').value).endOf('month').format("YYYY-MM-DD");})
                //console.log("%conOpen popup", "color:coral")
            },
            onClose: (el) => {
                if (bMonthAdjustment===true)
                    el.querySelector('#dtFrom').removeEventListener("change");
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



        dtFrom = dayjs(formValues[0]);
        dtTo = dayjs(formValues[1]);

        await sleep(250); //NOTESTT this timer is need else popup don't really disappear tryout 500

        return [dtFrom,dtTo];
    }
    /* https://www.sitepoint.com/delay-sleep-pause-wait/ */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /*
    https://css-tricks.com/considerations-styling-modal/
    https://codepen.io/aepicos/pen/eYJWEpG
    */
    var uiShowPleaseWait = function(){

        //https://csscompressor.com/ ou https://cssminifier.com/
        var sHtml = "";
        sHtml+="<style>";
        // src https://dabblet.com/gist/7708654
        sHtml+='.loading{border-bottom:6px solid rgba(0,0,0,.1);border-left:6px solid rgba(0,0,0,.1);border-right:6px solid rgba(0,0,0,.1);';
        sHtml+='border-top:6px solid rgba(0,0,0,.4);border-radius:100%;height:50px;width:50px;animation:rot .6s infinite linear}';
        sHtml+='@keyframes rot{from{transform:rotate(0deg)}to{transform:rotate(359deg)}';

        sHtml+='.modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)}';
        sHtml+="</style>";

        sHtml+='<div id="modal" aria-hidden="true" aria-labelledby="modalTitle" aria-describedby="modalDescription" role="dialog">';
        sHtml+='div class="loading"></div>BLIP</div>';

        if (document.querySelector("#pleaseWaitDialog") == null) {
            var modalLoading = $(document.body).append(sHtml);
        }
        //$("#pleaseWaitDialog").modal("show");
    }

    /* https://stackoverflow.com/questions/40365771/sweet-alert-dialog-with-spinner-in-angularjs */

    const UIShowLoading = function() {
        Swal.fire({
            title: 'Please Wait',
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: '#19191a',
            showConfirmButton: false,
            onOpen: ()=>{
                Swal.showLoading();
            }

            // timer: 3000,
            // timerProgressBar: true
        });
    };

    const UIHideLoading = function(){
        Swal.close();
    }





    // ----------------------------- EntryPoint

    /**
     * More accurately check the type of a JavaScript object
     * @param  {Object} obj The object
     * @return {String}     The object type
     * SRC https://github.com/cferdinandi/reef/blob/master/src/components/reef.js
     */
    var trueTypeOf = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    };
    _.trueTypeOf = trueTypeOf;
    // adapted from https://github.com/cferdinandi
    var checkSupport = function () {
        if (!window.DOMParser) return false;
        var parser = new DOMParser();
        try {
            parser.parseFromString('x', 'text/html');
        } catch(err) {
            return false;
        }
        return true;
        if(_.trueTypeOf(fetchInject) !== 'function'){
           console.log("%cWe Will have a problem because fetchInject isn't loaded","background-color:red;color:white");
        }
        if(_.trueTypeOf(document.arrive) !== 'function'){
            console.warn("%cWe have a problem document.arrive is not loaded, let's try another strategy for loading it","background-color:coral;color:white");
           fetchInject([
            'https://raw.githubusercontent.com/StephaneTy-Pro/userscripts/master/arrive.min.js'
           ]).then(() => {
            console.log(`external arrive.min.js loaded`);
            document.arrive(".MuiAvatar-img", _warmup);
           })
        }
        // all is right
        return true;


    }
   
    var _warmup = function(){

        // 'this' refers to the newly created element
        console.log("%cinSetup","background-color:green;color:white");
        // chargement des CSS de jspnael
        GM_addStyle( GM_getResourceText("jspanelcss") );
        GM_addStyle( GM_getResourceText("toastifycss") );
        GM_addStyle( GM_getResourceText("simpledatatablecss") );
        /* SPECTRE CSS */
        // fonctionne mal avec le thème oc GM_addStyle( GM_getResourceText("spectrecss") );
        GM_registerMenuCommand('OC Facturier - configure', opencfg);
        /* hacks */
        if(GM_config.get('hackheaderzindex') === true){
            document.getElementById('header').style.zIndex = 0; // because z index is 1000 in oc rules
        }
        /* set size of content */
        GM_addStyle('.swal2-content{font-size:'+GM_config.get('sizeofcontentlist')+'}');
        GM_addStyle('.swal2-title{font-size:1.275em)'); // set by default to 1.875em by CSS of SWAL
        main();
    }

    const bSupport = checkSupport(); //TODO better use it
    console.log('%cAre all functions supported ?','background-color:green;color:white', bSupport);
    // when avatar if loaded start application
    document.arrive(".MuiAvatar-img", _warmup);

   var main = function(){
       console.log('​​​%cMainLoaded​​​','background-color:green;color:white');
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
       dayjs.extend(dayjs_plugin_localeData);
       dayjs.extend(dayjs_plugin_customParseFormat);
       //dayjs.extend(dayjs_locale_fr);
       // https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.28/plugin/localeData.min.js
        if (document.querySelector(".panel.menuBar.flex.draggable") === null){
            initUI();
        }
       if(GM_config.get("alwaysaddcbox") === true){addCbox();} // add checkbox to element in history
       dayjs.locale('fr')
   }

    // CFG
    // ----------------------------------------------------------- Tampermonkey Menu
    const windowcss = '#OCAddonsCfg {background-color: lightblue;} #OCAddonsCfg .reset_holder {float: left; position: relative; bottom: -1em;} #OCAddonsCfg .saveclose_buttons {margin: .7em;}';
    const iframecss = 'height: 16.7em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';
    const dbgcss    = 'position: absolute;top: 5px; left: 5px; right: 5px; bottom: 5px;padding: 10px;overflow-y: auto;display: none;background: rgba(250, 250, 250, 0.3);border: 3px solid #888;font: 14px Consolas,Monaco,Monospace;color: #ddd;z-index: 500';

    GM_config.init(
        {
            id: 'OCAddonsCfg',
            title: 'Configuration du module',
            fields:
            {
                nbHrsAfM:{
                    section: ['Statistiques', 'paramètres'],
                    label: "Nombre de minutes pour une session AF",
                    labelPos: 'left',
                    type: 'input',
                    default: 30,
                },
                nbHrsfM:{
                    label: "Nombre de minutes pour une session financée",
                    labelPos: 'left',
                    type: 'input',
                    default: 45,
                },
                nbHrsD:{
                    label: "Nombre de minutes pour une session de soutenance",
                    labelPos: 'left',
                    type: 'input',
                    default: 45,
                },
                maxfetchpg:{
                    section: ['Application', 'optimisation'],
                    label: "Maximum de page recherchées dans l'historique",
                    labelPos: 'left',
                    type: 'input',
                    default: 1000,
                },

                datacachelifetime: {
                    label: "Temps de conservation des données dans le cache (en ms)",
                    labelPos: 'left',
                    type: 'input',
                    default: 120000,
                },
                sizeofcontentlist:{
                    section: ['Interface', 'thème'],
                    label: 'taille de la police des listes',
                    labelPos: 'left',
                    type: 'input',
                    default: '1em;',
                },

                alwaysaddcbox:{
                    section: ['Interface', 'gadget'],
                    label: 'Toujours ajouter les checkbox',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },
                'hackheaderzindex':{
                    label: 'changer le zindex du bandeau haut',
                    labelPos: 'left',
                    type: 'checkbox',
                    default: true,
                },
                support: {
                    section: ['', 'Support'],
                    label: 'StephaneTy-Pro.github.io',
                    title: 'more info on https://github.com/StephaneTy-Pro',
                    type: 'button',
                    click: () => {
                        GM_openInTab('https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon', {
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
    // memoize
    // isSerialized allow function to use object cf doc : isSerialized -> should the parameters be serialized instead of directly referenced
    const memoized = moize.default(_calculateBill,{maxAge:GM_config.get("datacachelifetime"),  isSerialized: true, onCacheAdd: function(c,o,m){console.log("cache add");console.dir(c.keys);/*console.dir(o);console.dir(m)*/;}, onCacheHit: function(){console.log("cache hit");}});


    function opencfg()
    {
        GM_config.open();
        OCAddonsCfg.style = iframecss;
    }

})();



// ------ MISC
// found in stackoverflow to add an element first waiting full implementation of appendFirst in DOM
HTMLElement.prototype.appendFirst=function(childNode){
    if(this.firstChild)this.insertBefore(childNode,this.firstChild);
    else this.appendChild(childNode);
};
