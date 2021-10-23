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

import Api from './api.openclassrooms.js';
// voir aussi http://objectmodel.js.org qui parait plus récent et qui a plus d'options
import t from './vendor/tcomb/tcomb.neutral.js';

const StudentData = t.struct({
	id: t.String,              		// required string
	fullname: t.String,				// required string
	path: t.String,					// required string
	funding: t.String,					// required string
	created: t.String,				// required string
}, 'StudentData');
// mapper for oc session object
/*
{
"id": 6513434,
"displayName": "Alex Bourgoin",
"profilePicture": "https://user.oc-static.com/users/avatars/1609241852123_Alex%20%282%29.png",
"followedLearningPath": {
"learningPathId": 150,
"learningPathTitle": "Chef de projet digital"
},
"followedProject": {
"projectId": 520,
"projectTitle": "Développez votre présence en ligne",
"projectLevel": "2"
}
}*/


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
	
	/*
	 * Table
	 * 	id(string) id of student as known at oc as Number, is a 64-bit floating point IEEE 754  in js so limited to 2^53 we could use them as key
	 * 	fullname (string)
	 *  path (string) is the slug-path of OC
	 *  created date format YYYY-MM-DDTHH:mm:ssZ[Z]
	 * 	who_id (string) id of student je ne me souviens pas à quoi ça sert vieux champs qui a disparu
	 *  funding (string)
	 * */
	
	static tbl_name = 'students'; // private field prefixed with # are not currently supported 
	
	
	/*
	 * 
	 */
	 
	static ocmapper = async function(o){
		let bDebug = false;
		try {
			let _r = await Student.getFundingFomDashboard(o.id);
			if(bDebug===true)console.log('%cocmapper() funding is %o', APP_DEBUG_STYLE, _r);
			//this.id = o.id; 
			let id = o.id.toString(10); // force to string
			let fullname = o.displayName; 
			let _s = o.followedLearningPath.learningPathTitle; 
			let path;
			if (_s.length == 0){
				path = "non défini";
			}else{
				path =_s;
			}
			let funding = _r.toLowerCase();
			let created = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
			
		return StudentData({
			id,
			fullname,
			path,
			funding,
			created
		});
		
		}catch(e){ console.error('%c,IRRECOVERABLE ERROR in StudentData.ocmapper: %o', APP_ERROR_STYLE, e); } 
	}
	
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
        let me = {id:sStudentId,fullname:sStudentFullName,path:sStudentPath,funding:sStudentFunding,created:now};
		Student._save(me);
    }
    
    static _checkObject = function(oStudent){
		let bDebug = false;
		if(bDebug===true)console.log("%cChecking object student:%o ", APP_DEBUG_STYLE, oStudent);
		assert(
			typeof oStudent.id === 'string',
			'Student object id need to be a string.',
			TypeError
			);
		assert(
			typeof oStudent.fullname === 'string',
			'Student object fullname need to be a number.',
			TypeError
			);
		assert(
			typeof oStudent.path === 'string',
			'Student object path need to be a string.',
			TypeError
			);
		assert(
			typeof oStudent.funding === 'string',
			'Student object funding need to be a string.',
			TypeError
			);
		assert(
			typeof oStudent.created === 'string',
			'Student object created need to be a string.',
			TypeError
			);
	}
    
	// save student in db
	static _save = function(oStudent){
		let bDebug = false;
		Student._checkObject(oStudent);
		if(bDebug===true)console.log("%cSaving student %o to DB", APP_DEBUG_STYLE, oStudent);
		let db=App.Cfg.dbase;
		db.get(Student.tbl_name).push(JSON.parse(JSON.stringify(oStudent))).write();
	}
    
	static exists = function(needle, dtFrom=null){
		let bDebug = false;
		let _r = Student.findById(needle, dtFrom);
		if(bDebug===true)console.log(`%cStudent ${needle} exists in db ? ${_r === undefined ? false : true}`,APP_DEBUG_STYLE);
		return _r === undefined ? false : true;
	}
	
	/*
	 * 
	 * name: find
	 * @param needle the id of student
	 * @param dtFrom the date of the session
	 * @param cache true or false, used because in some function like check forinsertion in must remove cache
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
		//this option is used to desactivate cache so debugging is easier
		//let bUseCache = true;
		let bUseCache = GM_config.get("use_student_cache")
		
		if(bUseCache === false)console.log("%cache étudiant desactivé dans les options", APP_DEBUG_STYLE); 
		
		
		// provisoire avant conversion de base
		if (typeof sNeedle === 'number'){
			sNeedle = sNeedle.toString(10)
		}
		
		assert(
			typeof sNeedle === 'string',
			'You must provide a string.',
			TypeError
			);
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom);}
		// because of caching i must use string so convert date to iso before calling function
		if (dtFrom == null){
			if (bUseCache === false){return Student._findById(sNeedle, dtFrom);}
			return Student.m_findById(sNeedle, "null"); // stringify for safety 
			}
		//return Student.m_findById(sNeedle, dtFrom.format('YYYY-MM-DDTHH:mm:ssZZ')); // use cached version of function
		if (bUseCache === false){return Student._findById(sNeedle, dtFrom.toISOString());}
		return Student.m_findById(sNeedle, dtFrom.toISOString()); // use cached version of function prefered string method
	} 
	/*
	 * 
	 * Note giving a date allow us to join students and history
	 * No date, mean no history ...
	 * NOTE STT correct it (giving today) or not ???
	 */
	static _findById = function(sNeedle, dtFrom=null){
		let bDebug = false;
		let db=App.Cfg.dbase; 
		if (typeof dtFrom === 'string'){dtFrom = dayjs(dtFrom);}
		if(bDebug===true)console.log(`%c_findById() searching student with id:(${typeof sNeedle})${sNeedle} in db`,APP_DEBUG_STYLE);
		var _r = db.get(Student.tbl_name).find({id: sNeedle}).value();
		if(bDebug===true)console.log("%c_findById() student %o is found", APP_DEBUG_STYLE, _r);
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
					_rClone.path = _rPath.value;
				}
				return _rClone;
			}
			if(bDebug===true)console.log("%c_findById() student final %o is found", APP_DEBUG_STYLE, _r);
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
			//onCacheAdd: function(c,o,m){console.log("%c[m_findById]Add data to cache",APP_DEBUG_STYLE);/*console.dir(c.keys);console.dir(o);console.dir(m)*/;},
			//onCacheHit: function(){console.log("%c[m_findById]Get data from cache", APP_DEBUG_STYLE);},
			//onCacheChange: function(c,o,m){console.log("%c[m_findById]Change data from cache", APP_DEBUG_STYLE);/**/console.dir(c.keys);console.dir(o);console.dir(m);}
		});
    /*
     * Return funding mode of student
     * 
     * need to search by id if more than an id, use date if any to filter
     */
    static getFunding = async function(sId, dtFrom = null){
		// use cached version of function
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
		return await Student.m_getFunding(sId, dtFrom); // problem with memoized one ?
		//return await Student._getFunding(sId, dtFrom);
	} 
	/*
	 * Private function
	 */
	static _getFunding = async function(sId, dtFrom = null){
		let _r = Student.findById(sId, dtFrom);
		//let db=App.Cfg.dbase; 
		//console.log("Searching ....",sId);
		//let _r = db.get(Student.tbl_name).find({id: sId}).value()
		//console.log(`when searching ${studentId}, found those student ${_r}`);
		//if (_r == undefined){
		if (_r === undefined){
			//throw Error(`IRRECOVERABLE ERROR STUDENT WITH ID ${sId} NOT IN DB:`);
			console.log('%c[Student._getFunding()]Student %s is not in db, fetching data:"funded mode" from webpage', APP_DEBUG_STYLE, sId);
			_r =  await Student.getFundingFomDashboard(sId);
			console.log('%c[Student._getFunding()]Student %s funding is %o',APP_DEBUG_STYLE, sId, _r);
			return _r.toLowerCase();
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
			isPromise: true,
			//onCacheAdd: function(c,o,m){console.log("%c[m_getFunding]Add data to cache",APP_DEBUG_STYLE);/*console.dir(c.keys);console.dir(o);console.dir(m)*/;},
			//onCacheHit: function(){console.log("%c[m_getFunding]Get data from cache", APP_DEBUG_STYLE);},
			//onCacheChange: function(c,o,m){console.log("%c[m_getFunding]Change data from cache", APP_DEBUG_STYLE);/**/console.dir(c.keys);console.dir(o);console.dir(m);}
		});
	
	// https://caolan.github.io/async/v3/docs.html ....
	//static m_getFunding =  async.memoize(Student._getFunding);
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
			db.get(Student.tbl_name).remove( function(o){return dayjs(o.created,'YYYY-MM-DDTHH:mm:ssZ[Z]').isBefore(dtTo, 'day');} ).write();
			return;
		}
		if(dtFrom == null){
			db.get(Student.tbl_name).remove( function(o){return dayjs(o.created,'YYYY-MM-DDTHH:mm:ssZ[Z]').isAfter(dtFrom, 'day');} ).write();
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
			//var oListToUpdate = db.get("sessions").filter(v => v.who_id === sId && v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
			var oListToUpdate = db.get("sessions").filter( function(v){ return v.who_id === sId && dayjs(v.when).isSameOrAfter(dtFrom,'day')});
		} else {
			//var oListToUpdate = db.get("sessions").filter(v => v.who_id === sId && v => dayjs(v.when).isSameOrAfter(Core.getOldModeDate(),'day'));
			var oListToUpdate = db.get("sessions").filter( function(v){v.who_id === sId && dayjs(v.when).isSameOrAfter(Core.getOldModeDate(),'day')});
		}
		for(var i = oListToUpdate.value().length; i-=1; ){
			console.log(`There is ${i} elements left to update`,APP_DEBUG_STYLE);
			oListToUpdate.get(i).assign({'funding': sNewState}).write();
		}
	}
	
	/**
	 * Update the list of student
	 * 
	 * changed since 202006
	 * 	url is https://openclassrooms.com/fr/mentorship/dashboard/students
	 * 
	 */
	static getAll = async (e,ctx) => { // mode JS2020
		let dDebug = true;
        var bForceUpdate = false; //TODO temporary
        let db=App.Cfg.dbase; 
        var sPath ="table.crud-list tbody";
        // get full list of student
        if(bDebug===true)console.log('%c[getAll()] Enter function', APP_DEBUG_STYLE);
        //const oDom = await _fetch(`https://openclassrooms.com/fr/mentorship/dashboard/students`, 'script[id="mentorshipDashboardConfiguration"]');
        //var _r = JSON.parse(oDom.innerText.trim())
        //var aStudents = _r.mentorStudents;
        const oJson = await Api.getUserStudents();
        var aStudents = JSON.parse(oJson);
/*
 {
  "id": 6513434,
  "displayName": "Alex Bourgoin",
  "profilePicture": "https://user.oc-static.com/users/avatars/1609241852123_Alex%20%282%29.png",
  "followedLearningPath": {
    "learningPathId": 150,
    "learningPathTitle": "Chef de projet digital"
  },
  "followedProject": {
    "projectId": 520,
    "projectTitle": "Développez votre présence en ligne",
    "projectLevel": "2"
  }
}
* 
* controler le nom des champs car tout à changer, il faudrait probablement faire un mapping pour etre tranquille
* 
*/
         

        if(bDebug===true)console.log('%cgetAll() collect this array of stundent %o', APP_DEBUG_STYLE, aStudents);
        const now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'); // old format
        //const now = dayjs().format('YYYY-MM-DDTHH:mm:ssZZ'); //ISO A FAIRE POUR UN PROCHAINE MAJ BDD penser à verifier deleteById mais j'ai supprimé cette possibilité
        // POUR LE BIEN JE DEVRAIS AUSSI CHANGER le champs created, ou ajouter un champs updated
        //var _r = aStudents.shift(); // remove first element (line header)
        // essai d'estimmer le temps nécessaire à la mise à jour des différentes fiches étudiant
		var t0 = performance.now();
		//var sFirstStudentId = getKey(aStudents[0].children[0].querySelector('a').href, -2); // first line, first column, a.href
		//await Student.getFundingFomDashboard(aStudents[0].studentId)
		//await Student.getFundingFomDashboard(aStudents[0].id);
		await Student.ocmapper(aStudents[0]);
		if(bDebug===true)console.log(`%cEstimated time for updating : ${(performance.now()-t0)* aStudents.length} ms`, APP_DEBUG_STYLE);

        // --
        Swal.fire({
            position: 'top-end',
            icon: 'info',
            toast: true,
            title: `mise à jour de la base de donnée des étudiants...\ncela peut prendre du temps ~ ${(performance.now()-t0)* aStudents.length/1000} s`,
            showConfirmButton: false,
            timer: 1000
        })
        
        //NOTESTT: ce timer est nécessaire uniquement si j'utilise Swal et donc toastok
        await sleep(1000);
        if(bDebug===true)console.log('%cWill process all students of board', APP_DEBUG_STYLE);
        for (const oStudent of aStudents) {
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
            
            //var sStudentId = oStudent.studentId.toString(10); // sinon c'est un entier et toutes les insertions en bdd plantent
            
            let theStudent = await Student.ocmapper(oStudent);
            /*
            var sStudentId = oStudent.id.toString(10); // sinon c'est un entier et toutes les insertions en bdd plantent
            var sStudentFullName = oStudent.studentDisplayableName;
            if(bDebug===true)console.log('%c Working on student "%s"', APP_DEBUG_STYLE, sStudentFullName);
            toastOk(`Collecte les données de l'étudiant : ${sStudentFullName}`);
            //var sStudentPath = oStudent.followedLearningPathTitle;
            var sStudentPath = oStudent.followedProjectSlug;
            if (sStudentPath.length == 0){sStudentPath = "non défini";}
            if(bDebug===true)console.log('%cWill collect student "%s" funding', APP_DEBUG_STYLE, sStudentFullName);
            let sStudentFunding = await Student.getFundingFomDashboard(sStudentId);
            //var res = db.get(Student.tbl_name).find({id: sStudentId}).value();
            //var _r = db.get(Student.tbl_name).find({id: sStudentId}).value();
            * */
            if(bDebug===true)console.log('%c Working on student "%s"', APP_DEBUG_STYLE, theStudent.fullname);
            toastOk(`Collecte les données de l'étudiant : ${theStudent.fullname}`);
            //NOTESTT ne devrait plus servir le check etant fait avant
            /*
			assert(
				typeof theStudent.id === 'string',
				'sStudentId need to be a string.',
				TypeError
			);
			*/
            var _r = Student.m_findById(theStudent.id, null);
            
            if (_r === undefined ){
				if(bDebug===true)console.log(`%cStudent ${theStudent.fullname} (id:${theStudent.id}) not present in student database will create it`, APP_DEBUG_STYLE);
				Student.add(
					theStudent.id, 
					theStudent.fullname,
					theStudent.path,
					theStudent.funding,
					theStudent.created
				); // addStudent
				continue; // break iterator , so it goes to next iteration
			}
			/* i have found a student with this id check if it was updated*/

			if(theStudent.funding.toLowerCase() !== _r.funding.toLowerCase()){// update value and history
				db.get(Student.tbl_name)
				.find({id: theStudent.id})
				.assign({funding: theStudent.funding})
				.write();
				
				StudentHistory.addFunding( theStudent.id, _r.funding, dayjs());
				console.log(`%c[Student.getAll]Student ${theStudent.fullname}(id:${theStudent.id}) was already present in database but change of funding was detected (from ${_r.funding.toLowerCase()} to ${theStudent.funding.toLowerCase()})`, APP_DEBUG_STYLE);
			}
			if(theStudent.path !== _r.path){// update value and history
				db.get(Student.tbl_name)
				.find({id: theStudent.id})
				.assign({ path: theStudent.path})
				.write();
				
				StudentHistory.addPath( theStudent.id, _r.path, dayjs());
				console.log(`%c[Student.getAll]Student ${theStudent.fullname}(id:${theStudent.id}) was already present in database but change of path was detected (from ${_r.path} to ${theStudent.path})`, APP_DEBUG_STYLE);
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
                return {
					student_id: document.getElementById('student_id').value,
                    student_name: document.getElementById('student_name').value,
                    student_path:document.getElementById('student_path').value,
                    student_funding: document.getElementById('funding').checked, // true mean autofunded
                    session_date: document.getElementById('session_date').value,
                };
            }
        });

        if(formValues && formValues.hasOwnProperty('student_id')){
            var sFunding = "";
            if(formValues.student_funding === true){
                sFunding = OC_AUTOFUNDED;
            } else {
				sFunding = OC_FUNDED;
			}
            Student.add(
				formValues.student_id,
				formValues.student_name,
				formValues.student_path,
				sFunding,
				formValues.session_date
			)
        }
    }     	
}

export default Student;
