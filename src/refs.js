/**
 * 
 * This object manage all references in application
 * 
 * This is a very strategic object
 * 
 * Cet objet gère toutes les references au sein de l'application
 * et permet notamment de faire le lien entre le hash calculé
 *  pour une session (en fonction de la date et de l'id de l'étudiant
 *  et une session dans la table des sessions
 * 
 */
 
 /*
  *  SCHEMA
  *  	key1 (mixed)
  * 	key2 (mixed)
  * 	type (string) type of reference
  * 	created (date)
  * 	updated (date)
  * 
  */

import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	} from './constants.js';
import App from './index.js';
import { assert } from './utils.js';
import { pause } from './helpers.js';

/*
 * Factory function
 */
var fRef = function(){
	
	const TBL_NAME = 'refs'; // be careful to user either exported property (min) or constant (maj)
	const TYPE_DEFAULT = 0;
	// https://codeforwin.org/2018/05/10-cool-bitwise-operator-hacks-and-tricks.html paragraph 4.
	const TYPE_FUNDING  = 1;
	const TYPE_PATH		= 2;
	
	const TYPE = {
		DEFAULT: 0,
		SESSIONID_DATEREFID: 1
	}
	
	const checkSupport = function(){
		if( App.Cfg.dbase.get("refs").value() === undefined) {
			console.log("%cDb dont' contain ref table create it", APP_DEBUG_STYLE);
			App.Cfg.dbase.assign({refs:[]}).write();
		}
	}
	// j'ai encore une fois un probleme pour écrire dans la base .... mais je ne me souviens jamais pourquoi ça ne fonctionne pas toujours
	const add = function(mKey1,mKey2,sType=TYPE.DEFAULT){
		let db=App.Cfg.dbase; 
		var now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
		let me = {key1:mKey1,key2:mKey2,type:sType,created:now,updated:now};
		//console.log(me);
		/*let _r = db.get(Ref.tbl_name)
		  .push(JSON.parse(JSON.stringify(me)))
		  .write();
		  */
		let _r = _save(me);  
		pause(50);  
		
		assert(
			Array.isArray(_r) && _r.length > 0,
			'Database insertion fail',
		);

/* en ajoutant cela ça fonctionne mais pourquoi ????
      console.log(me);
      console.log(db);
      console.log(db.value());
      console.log(db.get('refs').value());
      // no use debounce(() => db.get(Ref.tbl_name).push(JSON.parse(JSON.stringify(me))).write());
      console.log(Ref.tbl_name);
      db.get(Ref.tbl_name).push(JSON.parse(JSON.stringify(me))).write();
      console.log(db);
      console.log(db.value());
      console.log(db.get('refs').value());
      console.log(`wanna execute db.get(${Ref.tbl_name}).push(%o).write()`, JSON.parse(JSON.stringify(me)));
      console.log('pause end');
      *
 AVEC CA AUSSI
 * 
       let db = src_default.Cfg.dbase;
      var now = dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]");
      let me = { key1: mKey1, key2: mKey2, type: sType2, created: now, updated: now };
      //console.log(me);
      //console.log(db);
      console.log(db.value());
      console.log(db.get('refs').value());
      // no use debounce(() => db.get(Ref.tbl_name).push(JSON.parse(JSON.stringify(me))).write());
      console.log(Ref.tbl_name);
      db.get(Ref.tbl_name).push(JSON.parse(JSON.stringify(me))).write();
      //console.log(db);
      console.log(db.value());
      console.log(db.get('refs').value());
      //console.log(`wanna execute db.get(${Ref.tbl_name}).push(%o).write()`, JSON.parse(JSON.stringify(me)));
      //console.log('pause end');
      *  
      * 
*/

	};
	/*
	 * Because later in perhaps need to change the way db done save, insert .... (lowdb change)
	 * 
	 */
	const _save = function (oRef){
		let db=App.Cfg.dbase; 
		let _r = db.get(Ref.tbl_name)
		  .push(JSON.parse(JSON.stringify(oRef)))
		  .write();
		return _r  
	}
	/*
	 * 
	 * search mNeedle as key number 1 or 2
	 */
	const getByKey = function (mNeedle, iKey=1, sType=TYPE.DEFAULT){
		assert(
			typeof iKey === 'number',
			'You must provide a number as index of key.',
			TypeError
		);
		let db=App.Cfg.dbase;
		let _r = null; 
		if (iKey == 1){
			//r = db.get(Ref.tbl_name).filter(o => o.key1 === mNeedle && o.type === sType).value();
			_r = db.get(Ref.tbl_name).find(o => o.key1 === mNeedle && o.type === sType).value();
		} 
		if (iKey == 2){
			//_r = db.get(Ref.tbl_name).filter(o => o.key2 === mNeedle && o.type === sType).value();
			_r = db.get(Ref.tbl_name).find(o => o.key2 === mNeedle && o.type === sType).value();
		} 
		if (_r === undefined || _r === null){ return undefined /*new style of return but too long to change anywhere {ko:{value:_r}}*/ }
		/* theorically because find return only one there is no problem
		if (_r.length > 1){
			console.log("%cProblem in Ref::GetByKey is bigger than 1 %o", APP_WARN_STYLE, _r);
			return _r
		}*/
		return _r;
	}
	
	const exists = function(mNeedle, iKey, sType=TYPE.DEFAULT){
		let _r = Ref.getByKey(mNeedle, iKey, sType);
		console.log(`%cRef ${mNeedle} exists in db ? ${_r === undefined ? false : true}`,APP_DEBUG_STYLE);
		return _r === undefined ? false : true;
	}
	
	const updKey1 = function(mNeedle, mValue, sType=TYPE.DEFAULT){
		let db=App.Cfg.dbase;
		let _r;
		_r = db.get(Ref.tbl_name)
		.find(o=> o.key2 === mNeedle && o.type === sType)
		.assign({ key1: mValue} )
		.write();
		console.log("%cNeedle  %o mValue %o sType %o", APP_DEBUG_STYLE, mNeedle,  mValue , sType);
		console.log("%c_r %o", APP_DEBUG_STYLE, _r);
		assert(
			Array.isArray(_r) && _r.length > 0,
			'Database insertion fail',
		);
	}

	const updKey2 = function(mNeedle, mValue, sType=TYPE.DEFAULT){
		let db=App.Cfg.dbase;
		let _r;
		_r = db.get(Ref.tbl_name)
		.find(o=> o.key1 === mNeedle && o.type === sType)
		.assign({ key2: mValue} )
		.write();
		console.log("%cNeedle  %o mValue %o sType %o", APP_DEBUG_STYLE, mNeedle,  mValue , sType);
		console.log("%c_r %o", APP_DEBUG_STYLE, _r);
		assert(
			Array.isArray(_r) && _r.length > 0,
			'Database insertion fail',
		);
	}
	
	return Object.freeze({
		tbl_name: TBL_NAME,
		TYPE: TYPE,
		add: add,
		updKey1: updKey1,
		updKey2: updKey2,
		checkSupport: checkSupport,
		exists : exists,
		getByKey : getByKey,
 	});
  
}

const Ref = fRef();
export default Ref;
