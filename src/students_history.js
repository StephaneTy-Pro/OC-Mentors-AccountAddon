/**
 * used by students to store history of students life
 * 
 * a student history is a data with time of change, a type of data and an old value
 * 
 * Example debug
 * 
 * d_StudentHistory.addFunding('7582346',"financé par un tiers","20200801") Ajoute à MAAIKE un changement de financement ancienne valeur 1 avant le 01.08.2020
 * d_StudentHistory.addFunding('7582346',"auto-financé","20200630") Ajoute à MAAIKE un changement de financement ancienne valeur 3 avant le 30.06.2020
 * d_StudentHistory.find('7582346',d_StudentHistory.getType('FUNDING'),"20200901") doit rien sortir
 * d_StudentHistory.find('7582346',d_StudentHistory.getType('FUNDING'),"20200701") doit sortir 1 la valeur avant le 01.08 mais pas 3 qui est une valeur plus ancienne encore
 * 
 */
 
/**
 *  date: timestamp, type: integer, id: string, value: mixed
 **/ 

import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	} from './constants.js';
import App from './index.js';
import Student from './students.js';
import {assert} from './utils.js';
/*
 * Factory function
 */
var fStudentHistory = function(){
	
	const TBL_NAME = 'students_history';
	
	
	// https://codeforwin.org/2018/05/10-cool-bitwise-operator-hacks-and-tricks.html paragraph 4.
	const TYPE_FUNDING  = 1;
	const TYPE_PATH		= 2;
	
	/*
	 * return the type by giving
	 */
	
	const getType = function(sType){
		if(sType.toUpperCase() === 'FUNDING') return TYPE_FUNDING;
		if(sType.toUpperCase() === 'PATH') return TYPE_PATH;
	    throw Error('Erreur qui ne devrait jamais arriver en getype');
        return false;
	}
	
    const addFunding = function(sStudentId, data, created=null){
		return add(sStudentId, TYPE_FUNDING ,data, created);
	};

    const addPath = function(sStudentId, data, created=null){
		return add(sStudentId, TYPE_PATH ,data, created);
    };

    const add = function(sStudentId, iType, data, created=null){
		assert(
			typeof sStudentId === 'string',
			'You must provide a string.',
			TypeError
			);
        const db=App.Cfg.dbase; 
        //if (typeof created === 'string'){ dtFrom = dayjs(created).format('YYYY-MM-DDTHH:mm:ssZZ')}
        if (typeof created === 'string'){ created = dayjs(created);}
        if(created === null){
			//created = dayjs().format('YYYY-MM-DDTHH:mm:ssZZ'); // FORMAT ISO 8601 for testing d_dayjs(d_dayjs().format('YYYY-MM-DDTHH:mm:ssZZ')) create date at today
			// https://www.ionos.fr/digitalguide/sites-internet/developpement-web/iso-8601/
			created = dayjs(); //prefer to timestamp
		}
		assert(
			created instanceof dayjs,
			'created date must be a string, a dayjs instance or null.',
			TypeError
			);
		let me = {id:sStudentId,type: 0 | iType,value:data,date:created.valueOf(), humanDate: created.format('YYYY-MM-DDTHH:mm:ssZZ')}
		console.log(`%cAdd in student history at date ${dayjs(me.date).format("YYYY-MM-DDTHH:mm:ssZZ")} data ${data} with type:${iType}`,APP_DEBUG_STYLE);
		return db.get(TBL_NAME)
		.push(JSON.parse(JSON.stringify(me)))
		.write();
    };
    // delete all = d_dbase.get('students_history').remove().write();
    const remove = function(sStudentId, iType=null, dtFrom=null){
		const db=App.Cfg.dbase; 
		if (sStudentId == null && iType == null && dtFrom == null){
			console.log(`%cRemove all in student history`,APP_DEBUG_STYLE);
			return db.get(TBL_NAME).remove().write();
		}
		if(typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom);}
		if(dtFrom == null){ // wanna delete all history for a student at a date
			if(iType == null){
				console.log(`%cRemove for student id:${sStudentId} history for all type of event`,APP_DEBUG_STYLE);
				return db.get(TBL_NAME).remove( {id:sStudentId} ).write();
			} else {
				console.log(`%cRemove for student id:${sStudentId} history with event type:${type}`,APP_DEBUG_STYLE);
				return db.get(TBL_NAME).remove( {id:sStudentId, type:iType} ).write();
			}
		}
		console.log(`%cRemove for student id:${sStudentId} history at date ${dtFrom.format("DD/MM/YYYY")} with event type:${type}`,APP_DEBUG_STYLE);
		//var _r = find(sStudentId, iType, dtFrom);
		//console.log(`%cThis function is not tested.....${_r}`, APP_WARN_STYLE);
		return db.get(TBL_NAME).remove( {id:sStudentId, type:iType, date:dtFrom.valueOf()} ).write();
		//return db.get(TBL_NAME).remove( {id: _r.id} ).write();
	};
    
    /* get Data for a specified type before a specified date */
    
    const find = function(sStudentId, iType, dtFrom=null){
		const db=App.Cfg.dbase;
		//if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom);}
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom);}
		 if(dtFrom === null){
			 dtFrom = dayjs();
		}
		console.log(`%cSearching in student history at date ${dtFrom.format("DD/MM/YYYY")} any data with type:${iType}`,APP_DEBUG_STYLE);
		var _iBaseDay = +dtFrom.valueOf();

/* si c'est négatif la date examinée (_iBaseDay) est postérieure à la date de l'enregistrement
 * si c'est égal à 0 alors on a une concordance parfaite
 * si c'est positif la date examinée (_iBaseDay) est antérieure à la date de l'enregistrement
 * prendre le min des negatif me donnera un indice sur le décalage minimum entre la dete enregistrement et la date de recherche et donc l'indice sur la valeur active (valeur postérieure minimum)
 *
 *
 * d_StudentHistory.addFunding('7582346',"financé par un tiers","20200801") Ajoute à MAAIKE un changement de financement ancienne valeur 1 avant le 01.08.2020
 * d_StudentHistory.addFunding('7582346',"auto-financé","20200630") Ajoute à MAAIKE un changement de financement ancienne valeur 3 avant le 30.06.2020
 * d_StudentHistory.find('7582346',d_StudentHistory.getType('FUNDING'),"20200901") doit rien sortir
 * d_StudentHistory.find('7582346',d_StudentHistory.getType('FUNDING'),"20200701") doit sortir 1 la valeur avant le 01.08 mais pas 3 qui est une valeur plus ancienne encore
*/

		//console.log("_iBaseDay",_iBaseDay);
		//console.log('1',db.get(TBL_NAME).filter(o =>  o.id === sStudentId && o.type & iType).value());
		//console.log('2',db.get(TBL_NAME).filter(o =>  o.id === sStudentId && o.type & iType).map( i =>  i.date - _iBaseDay ).value());

		var _r = db.get(TBL_NAME).filter(o =>  o.id === sStudentId && o.type & iType).map( i =>  i.date - _iBaseDay ).filter( i => i>= 0).value();
		//console.log(_r);
		if (_r.length == 0){
			console.log(`%cThere is no data in student history at date ${dtFrom.format("DD/MM/YYYY")} with type:${iType}`, APP_DEBUG_STYLE);
			return undefined;
		}
		// tester la valeur 0 ?
		// je veux le plus petit des résultats avant la date examinée soit le moins ancien des elements de l'historique antérieur à une date
		const min = arr => Math.min(...arr); // clone de la fonction min qui prend désormais en charge un array et plus une liste
		let _needle = _iBaseDay + min(_r);
		return db.get(TBL_NAME).filter(o =>  o.id === sStudentId && (o.type & iType) && o.date == _needle).value()[0];
	}
	
	const isFunding = function(data){
		return is(data, TYPE_FUNDING);
	}
	
	const isPath = function(data){
		return is(data, TYPE_PATH);
	}
	// https://codeforwin.org/2018/05/10-cool-bitwise-operator-hacks-and-tricks.html paragraph 4.
	const is = function(data, type) {
		return data.type & type;
	}

	return Object.freeze({
		addFunding,
		addPath,
		getType,
		remove,
		find,
		isFunding,
		isPath,
		tbl_name: TBL_NAME,
 	});
  
}

const StudentHistory = fStudentHistory();
export default StudentHistory;
