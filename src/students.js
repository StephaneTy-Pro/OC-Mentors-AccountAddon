/**
 * 
 */
import {
	APP_DEBUG_STYLE,
	APP_WARN_STYLE,
	APP_ERROR_STYLE,
	OC_AUTOFUNDED,
	OC_FUNDED,
	OC_OTHER,
	} from './constants.js';
import App from './index.js';
import Core from './core.js';
import {
	getKey,
	_fetch,
	assert,
	sleep,
	} from './utils.js';
import {
	toastOk,
	} from './components.js';

import StudentHistory from './students_history.js';

class Student {
	/**
	 * 
	 * created: "2020-08-22T22:32:24+02:00Z"
​​
fullname: "Maaike Joubert"
​​
fundedby: "Auto-financé"
​​
id: "7582346"
​​
path: "81-expert-en-strategie-marketing-et-communication"
* 
* Comment gérer les doublons ?
	 * 
	 * 
	 * 
	 */
	
	static tbl_name = 'students'; // private field prefixed with # are not currently supported 
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
    static add = function(sStudentId,sStudentFullName="noname",sStudentPath="nopath",sStudentFunding="unknown",created){
        let db=App.Cfg.dbase; 
        var now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
        let me = {id:sStudentId,fullname:sStudentFullName,path:sStudentPath,funding:sStudentFunding,created:now}
        db.get(Student.tbl_name)
        .push(JSON.parse(JSON.stringify(me)))
        .write();
    }
    
	static exists = function(needle, dtFrom=null){
		let _r = Student.findById(needle, dtFrom);
		console.log(`%cStudent ${needle} exists in db ? ${_r === undefined ? false : true}`,APP_DEBUG_STYLE);
		return _r === undefined ? false : true;
	}
	
	/*
	 * 
	 * name: find
	 * @param needle the id of student
	 * @param dtFrom the date of the session
	 * @return
	 * 
	 *  Reflexion
	 *    Student could have been saved at 01/07/2020 FUNDED, 15/07/2020 AUTO_FUNDED, 20/07/2020 OTHER
	 *                             
	 *       date of session could be 01/06/2020 => 2 Students how to know good date .... choose oldest
	 *       date of session could be 13/07/2020 => must choose 01/07
	 *       date of session could be 16/072020 => must choose 15/07/2020
	 * 
	 */
    static findById = function(sNeedle, dtFrom=null){
		assert(
			typeof sNeedle === 'string',
			'You must provide a string.',
			TypeError
			);
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
		// because of caching i must use string so convert date to iso before calling function
		if (dtFrom == null){
			return Student.m_findById(sNeedle, dtFrom); // NOTE STT je me demande si ça ne crée pas de fausse entrée en cache
			}
		return Student.m_findById(sNeedle, dtFrom.format('YYYY-MM-DDTHH:mm:ssZZ')); // use cached version of function
	} 
	/*
	 * 
	 * Note giving a date allow us to join students and history
	 * No date, mean no history ...
	 * NOTE STT correct it (giving today) or not ???
	 */
	static _findById = function(sNeedle, dtFrom=null){
		let db=App.Cfg.dbase; 
		if (typeof dtFrom === 'string'){dtFrom = dayjs(dtFrom)}
		console.log(`%cSearching student with id:${sNeedle} in db`,APP_DEBUG_STYLE);
		var _r = db.get(Student.tbl_name).find({id: sNeedle}).value();
		 if (_r === undefined){
			 return undefined;
		 } else {
			 if(dtFrom !== null){
				 /* avoid manipulating ref to object .... doing so manipulate memory data which conduct to desynchronization between dbase and data */
				var _rClone = {..._r}; // spread syntax cloning https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
				 // check in history any change
				var _rFunding = StudentHistory.find(sNeedle, StudentHistory.getType('FUNDING'), dtFrom);
				if (_rFunding !== undefined){
					_rClone.funding = _rFunding.value;
				}
				var _rPath = StudentHistory.find(sNeedle, StudentHistory.getType('PATH'), dtFrom);
				if (_rPath !== undefined){
					_rClone.path = _rPath.value
				}
				return _rClone;
			}
			return _r;
		 }
	}
	/*
	 * find students in db (memoized version)	
	 */
	 static m_findById = moize.default(
		Student._findById,
		{ 	maxAge: 600000,
			isSerialized: true,
			//onCacheAdd: function(c,o,m){console.log("%cAdd data to cache",APP_DEBUG_STYLE);/*console.dir(c.keys);console.dir(o);console.dir(m)*/;},
			onCacheHit: function(){console.log("%cGet data from cache", APP_DEBUG_STYLE);}
		});
    /*
     * Return funding mode of student
     * 
     * need to search by id if more than an id, use date if any to filter
     */
    static getFunding = function(sId, dtFrom = null){
		// use cached version of function
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
		return Student.m_getFunding(sId, dtFrom);
	} 
	/*
	 * Private function
	 */
	static _getFunding = function(sId, dtFrom = null){
		let _r = Student.findById(sId, dtFrom);
		//let db=App.Cfg.dbase; 
		//console.log("Searching ....",iStudentId);
		//let _r = db.get(Student.tbl_name).find({id: studentId}).value()
		//console.log(`when searching ${studentId}, found those student ${_r}`);
		//if (_r == undefined){
		if (_r === undefined){
			 //throw Error(`IRRECOVERABLE ERROR STUDENT WITH ID ${studentId} NOT IN DB:`);
			 console.log(`%cStudent ${studentId} is not in db, fetchin data:'funded mode' from webpage`,APP_DEBUG_STYLE);
			 return Student.getFundingFomDashboard(studentId).toLowerCase();
		 }else {
			 return _r.funding.toLowerCase();
		 }
	}
	/*
	 * get funded mode (memoized version) 
	 */
	static m_getFunding = moize.default(
		Student._getFunding,
		{ 	maxAge: 600000,
			isSerialized: true,
			//onCacheAdd: function(c,o,m){console.log("%cAdd data to cache",APP_DEBUG_STYLE);/*console.dir(c.keys);console.dir(o);console.dir(m)*/;},
			//onCacheHit: function(){console.log("%cGet data from cache", APP_DEBUG_STYLE);}
		});
	
	/*
	 * return true if student is "autofinancé"
	 */
	static isAutoFunded = function(iStudentId){
		console.log(`%cFUNCTION DEPRECATED !!!!!!!!!!!!!!!!!!!!!! `,APP_ERROR_STYLE);
		//console.log(`l'étudiant est ${Student.getFunded(iStudentId).toLowerCase()}`);
		//console.log(`${OC_AUTOFUNDED} === ${Student.getFunded(iStudentId).toLowerCase() === OC_AUTOFUNDED} ?`);
		//if Student.getFunded(iStudentId).toLowerCase() === OC_AUTOFUNDED = FALSE && Student.getFunded(iStudentId).toLowerCase() === OC_FUNDED == FALSE ===> ERROR
		return Student.getFunded(iStudentId).toLowerCase() === OC_AUTOFUNDED;
	}
	
    /*
     * browse dashboard of students to get financial mode
     * */
    static getFundingFomDashboard = async function(id){
        const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${id}/dashboard`, ".mentorshipStudent__details > p");
        //console.log("oDom",oDom.innerText);
        return oDom.innerText.trim();
	}
	
	/*
	 *  get path of students (in db or not in db)
	 */
	static getPath = async function(sId, dtFrom = null){
		//let db=App.Cfg.dbase; 
		//console.log("Searching ....",iStudentId);
		//let _r = db.get(Student.tbl_name).find({id: studentId}).value()
		//console.log(`when searching ${studentId}, found those student ${_r}`);
		let _r = Student.findById(sId, dtFrom);
		//console.log(_r);
		if (_r == undefined){
			console.log(`%cStudent ${sId} is not in db, fetching data: 'path' from webpage ....`,APP_DEBUG_STYLE);
			// document.querySelector("a[href*='paths/']")
			const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/students/${sId}/dashboard`, "a[href*='paths/']");
			//console.log(oDom);
			if (oDom.innerText.length == 0){
				console.error(`%cStudent path is not readable from url : https://openclassrooms.com/fr/mentorship/students/${sId}/dashboard`, APP_ERROR_STYLE);
			}
			return oDom.innerText.trim();
		} else {
			return _r.path;
		}
	}
	
	/*
	 * 
	 * name: delete
	 * @param dtFrom dayjs format date from
	 * @param dtTo dayjs format date to
	 * @return
	 * 
	 * Delete elements form DB
	 * 
	 * dayjs could be string, the will be translated to dayjs bu be carreful with format entry
	 */
	static delete = function(dtFrom=null, dtTo=null){
		let db=App.Cfg.dbase; 
		if (typeof dtFrom === 'string'){ dtFrom = dtFrom.format("YYYY-MM-DD"); }
		if (typeof dtTo === 'string'){ dtTo = dtTo.format("YYYY-MM-DD"); }
		
		if(dtFrom === null && dtTo == null){
			console.log(`%cWanna suppress ALL Students from DB`, APP_DEBUG_STYLE);
			db.get(Student.tbl_name).remove().write(); // suppress all from students
			return;
		}
		if(dtTo == null){
			db.get(Student.tbl_name).remove( function(o){return dayjs(o.created,'YYYY-MM-DDTHH:mm:ssZ[Z]').isBefore(dtTo), 'day'} ).write();
			return;
		}
		if(dtFrom == null){
			db.get(Student.tbl_name).remove( function(o){return dayjs(o.created,'YYYY-MM-DDTHH:mm:ssZ[Z]').isAfter(dtFrom, 'day')} ).write();
			return;
		}
		//console.log(`%cWanna suppress Students from DB before/between ${dtFrom.format('DD/MM/YYYY')} and/or until ${dtTo.format('DD/MM/YYYY')}`, APP_DEBUG_STYLE);
		db.get(Student.tbl_name).remove( function(o){return dayjs(o.created,'YYYY-MM-DDTHH:mm:ssZ[Z]').isBetween(dtFrom, dtTo, 'day','[]')} ).write();
	} 
	
	/*
	 * 
	 * name: deleteById
	 * @param (string) id 
	 * @param (date) 
	 * @return
	 * 
	 */
	
	//static deleteById = function(sId, dtCreated=null){
	static deleteById = function(sId, dtCreated=null){
		let db=App.Cfg.dbase; 
		//if( typeof dtCreated === 'string'){ dtCreated = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');}
		//if (dtCreated == null){
			db.get('students').remove((o)=>(o.id === sId)).write();
			console.log(`%cAll students with id:${sId} are removed from DataBase`, APP_DEBUG_STYLE);
		/*} else {
			db.get('students').remove((o)=>(o.id === sId && dtCreated.isSame(dayjs(o.created)))).write();
			console.log(`%cStudents ${sId} , created at ${dtCreated.format('YYYY-MM-DDTHH:mm:ssZ[Z]')} have been suppressed`, APP_DEBUG_STYLE);
		}*/
	} 
	
	/*
	 * Modifiy the type of funding of the student and update all sessions until next element of history of type update fundong
	 * 
	 */

	static modifyFunding(sId,dtFrom,sNewState){
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
		assert(
			created instanceof dayjs,
			'modifyFunding date must be a string, a dayjs instance or null.',
			TypeError
			);
			
		const sCurFunding = Student.getFunding(sId,dtFrom);
		if (sNewState.toLower() === sCurFunding.toLower()){
			console.log(`%cFundingMode ${sNewState} is identical as current: ${sCurrent}, nothing to do`, APP_DEBUG_STYLE);
			return;
		}
		// update field
		// be carreful no check of state
		if (sNewState !== OC_AUTOFUNDED || sNewState != OC_FUNDED || sNewState !== OC_OTHER) {
			console.log(`%cWarning this state is unknown ${sNewState}`, APP_WARN_STYLE);
		}

		const db=App.Cfg.dbase; 
		const dtNow = dayjs().format('YYYY-MM-DDTHH:mm:ssZZ'); // Format ISO;
		if (dtFrom === null){ // update is at today
			dtFrom = dtNow; // Format ISO
		}
		// find oldest history data same type to get dat until update sessions
		oLastHistory = StudentHistory.find(sId, StudentHistory.getType('FUNDING'), dtFrom)
		// update history if needed
		db.get(Student.tbl_name).find({id:sId}).assign({funding:sNewState}).write(); // update database
		StudentHistory.addFunding(sId, sCurFunding, dtNow);
		
		// update sessions list
		if (dtFrom.isSameOrAfter(Core.getOldModeDate())){
			var oListToUpdate = db.get("sessions").filter(v => v.who_id === sId && v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
		} else {
			var oListToUpdate = db.get("sessions").filter(v => v.who_id === sId && v => dayjs(v.when).isSameOrAfter(Core.getOldModeDate(),'day'));
		}
		for(var i = oListToUpdate.value().length; i-=1; ){
			console.log(`There is ${i} elements left to update`,APP_DEBUG_STYLE);
			oListToUpdate.get(i).assign({'funding': sNewState}).write();
		}
	}
	/**
	 * Update the list of student
	 * 
	 */
	static getAll = async (e,ctx) => { // mode JS2020
        var bForceUpdate = false; //TODO temporary
        let db=App.Cfg.dbase; 
        var sPath ="table.crud-list tbody";
        var aStudents = document.querySelectorAll(sPath)[1]; //  get list of Attributed Students
        const now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'); // old format
        //const now = dayjs().format('YYYY-MM-DDTHH:mm:ssZZ'); //ISO A FAIRE POUR UN PROCHAINE MAJ BDD penser à verifier deleteById mais j'ai supprimé cette possibilité
        // POUR LE BIEN JE DEVRAIS AUSSI CHANGER le champs created, ou ajouter un champs updated
        
        // essai d'estimmer le temps nécessaire à la mise à jour des différentes fiches étudian
		var t0 = performance.now();
		var sFirstStudentId = getKey(aStudents.children[0].children[0], -2);
		await Student.getFundingFomDashboard(sFirstStudentId)
		console.log(`%cEstimated time for updating : ${(performance.now()-t0)* aStudents.children.length} ms`, APP_DEBUG_STYLE);

        // --
        Swal.fire({
            position: 'top-end',
            icon: 'info',
            toast: true,
            title: `mise à jour de la base de donnée des étudiants...\ncela peut prendre du temps ~ ${(performance.now()-t0)* aStudents.children.length/1000} s`,
            showConfirmButton: false,
            timer: 1000
        })
        
        // ce timer est nécessaire uniquement si j'utilise Swal et donc toastok
        await sleep(1000);
        
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
            toastOk(`Collecte les données de l'étudiant : ${el.children[0].innerText}`);
            var sStudentId = getKey(el.children[0],-2);
            var sStudentFullName = el.children[0].innerText;
            var sStudentPath = "non défini";
            if(el.children[1].firstElementChild){ // sometimes there is no info of path for a students in OC table
                sStudentPath = el.children[1].firstElementChild.href.split("/").pop();
            }
            let sStudentFunding = await Student.getFundingFomDashboard(sStudentId);
            //var res = db.get(Student.tbl_name).find({id: sStudentId}).value();
            //var _r = db.get(Student.tbl_name).find({id: sStudentId}).value();
            var _r = Student.m_findById(sStudentId, null);
            
            if (_r === undefined ){
				console.log(`%cStudent ${sStudentFullName}(id:${sStudentId}) not present in database will create it`, APP_DEBUG_STYLE);
				return Student.add(sStudentId, sStudentFullName, sStudentPath, sStudentFunding, now); // addStudent
			}
			/* i have found a student with this id check if it was updated*/

			if(sStudentFunding.toLowerCase() !== _r.funding.toLowerCase()){// update value and history
				db.get(Student.tbl_name)
				.find({id: sStudentId})
				.assign({ funding: sStudentFunding.toLowerCase()})
				.write();
				
				StudentHistory.add( sStudentId, StudentHistory.getType('FUNDING'), _r.funding.toLowerCase(), dayjs());
				console.log(`%cStudent ${sStudentFullName}(id:${sStudentId}) was already present in database but change of funding was detected (from ${_r.funding.toLowerCase()} to ${sStudentFunding.toLowerCase()})`, APP_DEBUG_STYLE);
			}
			if(sStudentPath !== _r.path){// update value and history
				db.get(Student.tbl_name)
				.find({id: sStudentId})
				.assign({ path: sStudentPath})
				.write();
				
				StudentHistory.add( sStudentId, StudentHistory.getType('PATH'), _r.path, dayjs());
				console.log(`%cStudent ${sStudentFullName}(id:${sStudentId}) was already present in database but change of path was detected (from ${_r.path} to ${sStudentPath})`, APP_DEBUG_STYLE);
			}
			

			
            
            /*
            if(res && bForceUpdate===false){
                    console.log(`%c${sStudentFullName}(uniquid:${sStudentId}) already present in database created at ${res.created}`, APP_DEBUG_STYLE)
            } else {
                let sStudentFunding = await Student.getFundingFomDashboard(sStudentId);
                console.log(`%cFinancial Mode of student ${sStudentFullName}(id:${sStudentId}) is ${sStudentFunding}`, APP_DEBUG_STYLE);
                //setTimeout(function() {
                    Toastify({
                        text: `Ajoute l'étudiant : ${sStudentFullName}(${sStudentFunding}) en base`,
                        gravity: "top",
                        position: 'right',
                        close: true,
                        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }).showToast();
                //}, 500);
                //let me = {id:sStudentId,fullname:sStudentFullName,path:sStudentPath,fundedby:sStudentFundedBy,created:now}
                //data.push(me);
                //db.get('students').push(JSON.parse(JSON.stringify(me))).write();
                Student.add(sStudentId, sStudentFullName, sStudentPath, sStudentFunding, now)
            }
			*/

        }
    };
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	static showList = function(){
        let db=App.Cfg.dbase; 
        let _r = db.get(Student.tbl_name).value();
        var sHtml = "";
        sHtml+= '<table>';
        sHtml+= '<caption>Liste des étudiant</caption>';
        sHtml+= '<thead>';
        sHtml+= '<tr>';
        sHtml+= `<th>Nom</th><th>Parcours</th><th>Financement</th><th>Date de création</th><th>Edition</th>`;
        sHtml+= '</tr>';
        sHtml+= '</thead>';
        sHtml+= '<tbody>';
        for(var idx in _r){
            sHtml+= '<tr>';
            sHtml+= `<td>${_r[idx].fullname}</td><td>${_r[idx].path}</td><td>${_r[idx].funding}</td>`;
            sHtml+= `<td>${dayjs(_r[idx].created,'YYYY-MM-DDTHH:mm:ssZ[Z]').format("DD/MM/YYYY à HH:mm")}</td>`;
            sHtml+= `<td><a href="https://openclassrooms.com/fr/mentorship/students/${_r[idx].id}/dashboard">${_r[idx].id}</a></td>`;
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
    };
    
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */

	static createManually = async function(sStudentId,sStudentName,sSessionDate){
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
        sHtml+='<label for="funding">Autofinancé</label>';
        sHtml+='<input id="funding" type="checkbox" value="autofunded">';
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
                    document.getElementById('funding').checked, // true mean autofunded
                    document.getElementById('session_date').value,
                ]
            }
        });


        if(formValues){
            var sFundedBy = "";
            if(formValues[3] === true){
                sFunding = OC_AUTOFUNDED;
            } else {
                sFunding = OC_FUNDED;
            }
            Student.add(formValues[0],formValues[1],formValues[2],sFunding,formValues[4])
        }
    }     	
	
}

export default Student;
