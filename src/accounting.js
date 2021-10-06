/**
 *
 */
 
import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE, APP_PERF_STYLE,
	OC_AUTOFUNDED, 	//Auto-financé"; 
	OC_FUNDED,		//"Financé par un tiers" 
	OC_OTHER,		//"Autre"
	OC_STATUS_0,	//"réalisée";
	OC_STATUS_1,	//"annulée";
	OC_STATUS_2,	//"annulée tardivement";
	OC_STATUS_3_M,	//"étudiant absent";
	OC_STATUS_3_F,	//"étudiante absente";
	OC_MAX_LEVEL,	// max facturation level (used when loop in financial array) 5 since june
	OC_PRICE1, OC_PRICE2, OC_PRICE3, OC_PRICE4, OC_PRICE5, OC_PRICE6,
	BILL_AUTOFUNDED,BILL_FUNDED,BILL_OTHER,
	SESSION_DONE, SESSION_CANCEL, SESSION_CANCEL_LATE, SESSION_STUDENT_AWAY,
	TYPE_SESSION, TYPE_DEFENSE, TYPE_COACHING, TYPE_MENTORAT
	} from './constants.js';
import App from './index.js';
import Archive from './archives.js';
import Session from './sessions.js';
import Core from './core.js';

import {
	sleep,
	matrix,
} from './utils.js';

import {FpsTracker} from './ui.js';

class Accounting {
	
	
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */

	static calculateBill = function(dtFrom, dtTo){
		let sArchiveId = dtTo.format('YYYYMM');
		if (Archive.exists(sArchiveId) === true){
			console.log(`%cUse Archived version ${sArchiveId} of accounting`, APP_DEBUG_STYLE);
			let _r = Archive.get(sArchiveId);
			return _r.data;
		}
		 //aData.push(memoized(dtCurFrom.format("YYYY-MM-DD"), dtCurTo.format("YYYY-MM-DD")));
		//const memoized = nanomemoize(calculateBill,{maxAge:50000});
		//const memoized = moize.default(_calculateBill,{maxAge:500000,  onCacheAdd: function(c,o,m){console.log("cache add");console.dir(c.keys);/*console.dir(o);console.dir(m)*/;}, onCacheHit: function(){console.log("cache hit");}});

		// NOTESTT for a unknow reason object are not converted to same date (perhaps because of conversion to endofmonth so for cachine only use string keys
		// example : 0: Array [ "|\"2020-03-31T22:00:00.000Z\"|\"2020-04-29T22:00:00.000Z\"|" ]
		//1: Array [ "|\"2020-04-30T22:00:00.000Z\"|\"2020-05-30T22:00:00.000Z\"|" ]
		//2: Array [ "|\"2020-05-31T22:00:00.000Z\"|\"2020-06-29T22:00:00.000Z\"|" ]
		// 3: Array [ "|\"2020-05-31T22:00:00.000Z\"|\"2020-06-30T21:59:59.999Z\"|" ]
		//4: Array [ "|\"2020-04-30T22:00:00.000Z\"|\"2020-05-31T21:59:59.999Z\"|" ]
		//5: Array [ "|\"2020-03-31T22:00:00.000Z\"|\"2020-04-30T21:59:59.999Z\"|" ]
		//6: Array [ "|\"2020-02-29T23:00:00.000Z\"|\"2020-03-31T21:59:59.999Z\"|" ]
		//7: Array [ "|\"2020-01-31T23:00:00.000Z\"|\"2020-02-29T22:59:59.999Z\"|" ]
		//8: Array [ "|\"2019-12-31T23:00:00.000Z\"|\"2020-01-31T22:59:59.999Z\"|" ]
		if (typeof dtFrom === 'string'){ dtFrom = dtFrom.format("YYYY-MM-DD"); }
		if (typeof dtTo === 'string'){ dtTo = dtTo.format("YYYY-MM-DD"); }
		// use cached version of function
		return Accounting.m_calculateBill(dtFrom, dtTo);
	}
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
	
	
	static _calculateBill = function (dtFrom, dtTo){
		//UIShowLoading();

		// cast to date type
		if (typeof dtFrom === 'string'){dtFrom = dayjs(dtFrom);}
		if (typeof dtTo === 'string'){dtTo = dayjs(dtTo);}
		const now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
		var _1 = 0,_2 = 0;
		var t0 = performance.now();

		const db=App.Cfg.dbase; 
		/*
		 * Note STT faire une méthode value() dès que possible manipuler
		 *  db.get(Session.tbl_name).filter(v => dayjs(v.when).isSameOrBefore(dtTo,'day') && dayjs(v.when).isSameOrAfter(dtFrom,'day')) 
		 *  est une horreur l'objet doit sans doutes être très gros, ce qui a abouti à des temps de traitement de malade précédemment
		 * 
		 */
		/* la variable ci dessous ne me sert que si je fait le traitement des autofinancés comme je le fait actuellement
		 * or je pense que je peux l'optimiser en traitant tout dans la meme boucle
		 * la rien que le calcul du bonus prend 1800 ms quand le calcul prenait avant au total 700 ms */
		/* TODO gérer les erreurs */
		const dbSessions = db.get(Session.tbl_name).filter(v => dayjs(v.when).isSameOrBefore(dtTo,'day') && dayjs(v.when).isSameOrAfter(dtFrom,'day'));
		const oSessions = dbSessions.value();
		//console.log("%cWill Treat those sessions in accounting %o", APP_DEBUG_STYLE, oSessions);
		const iSessionsNumber = oSessions.length;
		let oMeta = {from: dtFrom, to: dtTo, created_at: null, maxLevel:OC_MAX_LEVEL, number:0, amount:0, errors:{funding:[], level:[], path:[], status:[],type:[]}, flatFee:[] };
		let iNumber = 0;
		let iAmount = 0;
		let aBonus = [];
		
		_1 = performance.now();
		const aPu = Accounting.getPriceList(dtFrom);
		_2 = performance.now();console.log("%cGetPriceList took " + (_2 - _1) + " milliseconds." ,APP_PERF_STYLE);
		
		// idée je mets toutes les données au premier niveau et je monte l'arbre progressivement ou en une fois 
		// dans l'arbre je trouve un uuid qui me permet de retrouver la donnée du premier niveau
		// ou alors j'utilise la matrix qui va me permettre d'associer des indices à une valeur
		
		let theSessionsMatrix = matrix([OC_MAX_LEVEL+1,OC_MAX_LEVEL+1,OC_MAX_LEVEL+1,OC_MAX_LEVEL+1])
		// test collision
		/*
		theSessionsMatrix.toConsole();
		for (var i = 0; i<OC_MAX_LEVEL+1; i+=1){
			for (var j = 0; j<OC_MAX_LEVEL+1; j+=1){
				for (var k = 0; k<OC_MAX_LEVEL+1; k+=1){
					for (var l = 0; l<OC_MAX_LEVEL+1; l+=1){
						console.log(i,j,k,l);
						theSessionsMatrix.set(i,j,k,l,666);
						
					}
				}
			}
		}
		
		theSessionsMatrix.toConsole();
		debugger;
		*/
		//for (var _i= iSessionsNumber; _i-=1;){ // the problem is value 0 which was falsy and so skip so returning to good old mode
		for (var _i= 0; _i<iSessionsNumber; _i+=1){	
			// type - funding mode - lvl - state
			const oTheSession = oSessions[_i];
			var iStatus = 0;
			if (oTheSession.status === OC_STATUS_0) iStatus = SESSION_DONE;
			if (oTheSession.status === OC_STATUS_1) iStatus = SESSION_CANCEL;
			if (oTheSession.status === OC_STATUS_2) iStatus = SESSION_CANCEL_LATE;
			if (oTheSession.status === OC_STATUS_3_M || oTheSession.status === OC_STATUS_3_F) iStatus = SESSION_STUDENT_AWAY;
			var iType = 0;
			if (oTheSession.type.toLowerCase() === 'session') iType = TYPE_SESSION;
			if (oTheSession.type.toLowerCase() === 'mentorat') iType = TYPE_MENTORAT;
			if (oTheSession.type.toLowerCase() === 'soutenance') iType = TYPE_DEFENSE;
			if (oTheSession.path != undefined && oTheSession.path.toLowerCase() === '158-trouvez-lemploi-qui-vous-correspond' && oTheSession.type !== 'soutenance') iType = TYPE_COACHING;
			var iFunding = 0;
			// dirty hack because funding is post first dbase 01/07/2020 before it was isFunded and i 've not updated the whole db (too long)
			// it seems that all isFunded is set to true before 01/06/2020 but to be carreful ....
			const bIsInOldMode = Core.isInOldMode(dtFrom);
			if (bIsInOldMode === true){
				iFunding = oTheSession.isFunded === true ? BILL_FUNDED : BILL_AUTOFUNDED;
			} 
			if (oTheSession.funding === OC_AUTOFUNDED) iFunding = BILL_AUTOFUNDED;
			if (oTheSession.funding === OC_FUNDED) iFunding = BILL_FUNDED;
			if (oTheSession.funding === OC_OTHER) iFunding = BILL_OTHER;
			
			// errors
			if (oTheSession.lvl == ''){
				// add to error list
				oMeta.errors.level.push(oTheSession);
				continue;
			}
			if(typeof oTheSession.lvl === 'string'){
				oTheSession.lvl = parseInt(oTheSession.lvl, 10);
			}
			if (oTheSession.lvl < 0){
				// add to error list
				oMeta.errors.level.push(oTheSession);
				continue;
			}


			
			if (bIsInOldMode === false && oTheSession.funding !== OC_AUTOFUNDED && oTheSession.funding !== OC_FUNDED && oTheSession.funding !== OC_OTHER){
				// add to error list
				oMeta.errors.funding.push(oTheSession);
				continue;
			}
			if (oTheSession.type.toLowerCase() !== 'session' /*because session is 0 and default iType is 0*/
				&& oTheSession.type.toLowerCase() !== 'mentorat' 
				&& iType !== TYPE_DEFENSE
				&& iType !== TYPE_COACHING){
				// add to error list
				//console.log(`add ${oTheSession} to bad type list`);
				oMeta.errors.type.push(oTheSession);
				continue;
			}
			/* je devrais gérer bad path mais un étudiant sans parcours est en pause */
			
			if (oTheSession.status !== OC_STATUS_0 
			 && oTheSession.status !== OC_STATUS_1 
			 && oTheSession.status !== OC_STATUS_2 
			 && oTheSession.status !== OC_STATUS_3_M && oTheSession.status !== OC_STATUS_3_F){
				// add to error list
				oMeta.errors.status.push(oTheSession);
				continue;
			}
			
			// recupérer la valeur de la matrice, la mettre à jour
			// déposer la nouvelle valeur
			// faire une detection de collision en initialisant la valeur avec une valeur improbable genre 987654321 ou 1234567890 ou 666 111 666 (max 32 int is 2,147,483,647) 
			//console.log("the session is", oTheSession);
			let toUpdate = theSessionsMatrix.get(iType, iStatus ,iFunding, +oTheSession.lvl);
			if (toUpdate === undefined){
				toUpdate = {number:0, amount:0, data:[]}
			} /*else {
				console.log("to update",toUpdate);
			}*/
			toUpdate.number+= 1;
			iNumber+=1;
			//console.log("montant avant", toUpdate.amount);
			//console.log("price is ", aPu[oTheSession.lvl].session[iStatus][iFunding]);
			if (oTheSession.lvl < 0 ){ // if level lesser than 0 price will be 0
				toUpdate.amount += 0;
				iAmount+=0;
			} else {
				//console.log('toUpdate.amount:%o aPu:%o, oTheSession.lvl:%o iType:%o iStatus%o iFunding:%o',toUpdate.amount, aPu, oTheSession.lvl,iType, iStatus, iFunding);
				toUpdate.amount += 1 * aPu[oTheSession.lvl][iType][iStatus][iFunding];
				iAmount+=1 * aPu[oTheSession.lvl][iType][iStatus][iFunding];
			}
			//console.log("montant après", toUpdate.amount);
			toUpdate.data.push(oTheSession);
			//console.log(toUpdate);
			theSessionsMatrix.set(iType, iStatus, iFunding, +oTheSession.lvl, toUpdate);
			
			// bonus : session, autofinancées non annulées
			if(iType === TYPE_SESSION
			 && iFunding === BILL_AUTOFUNDED
			 && oTheSession.status !== OC_STATUS_1 
			 ){
				aBonus.push({id:+oTheSession.who_id, who_id:oTheSession.who_id,who_name:oTheSession.who_name});
			}
			
		}
		
		
		//var oSessionsAf = dbSessions.filter( v => v.type.toLowerCase() !== 'soutenance' && v.status === OC_STATUS_0 && v.funding === OC_AUTOFUNDED && v.path !== '158-trouvez-lemploi-qui-vous-correspond');
		var oBonus = [];
		// Calculating bonus 
		/* pour etre plus performant je pourrais déplacer le calcul dans le tableau du dessus */
		_1 = performance.now();
		//var _0 = Object.values(oSessionsAf.groupBy( v => v.who_id).value());
		/*
		for( var _i= _0.length; _i-=1; ){
			oBonus.push({who_id:_0[_i][0].id,who_name:_0[_i][0].who_name,sessions:_0[_i].length}); // all elements of test.value()[n] must be the same name because of groupBy id
		}*/
		//_2 = performance.now();console.log("%cCalculating bonus took " + (_2 - _1) + " milliseconds." ,APP_PERF_STYLE);
		//console.log(aBonus);
		//_1 = performance.now();
		oBonus = _.uniqBy(aBonus, 'id');
		//_2 = performance.now();console.log("%cCalculating bonus (loadash) took " + (_2 - _1) + " milliseconds." ,APP_PERF_STYLE);
		
		oMeta.flatFee = oBonus; // lump sum = montant forfaitaire voir fix fee
		oMeta.number = iNumber;
		oMeta.amount = iAmount;
		
		// errors check
		
		if (oMeta.number + 
			oMeta.errors.funding.length +
			oMeta.errors.level.length + 
			oMeta.errors.path.length +
			oMeta.errors.status.length +
			oMeta.errors.type.length
			< iSessionsNumber){
			console.log(`%cError total number of sessions is ${iSessionsNumber} and total number of sessions in bill ${iNumber} + all errors are different`, APP_ERROR_STYLE);
			console.log("errors are",oMeta.errors);
			console.log("sessions are",oSessions);
		}
		oMeta.created_at = now;
		
		theSessionsMatrix.set(0, 0, 0, 0, oMeta);
		var t666 =performance.now();console.log("%cFunction took " + (t666 - t0) + " milliseconds." ,APP_PERF_STYLE);
		//theSessionsMatrix.toConsole();
		if(
			oMeta.errors.funding.length +
			oMeta.errors.level.length + 
			oMeta.errors.path.length +
			oMeta.errors.status.length +
			oMeta.errors.type.length
			> 0
		){
			console.log("%cWarning some errors found %o", APP_WARN_STYLE, oMeta.errors);
		}
		return theSessionsMatrix;
	}
	
	
	// memoize
	// isSerialized allow function to use object cf doc : isSerialized -> should the parameters be serialized instead of directly referenced
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 * NOTE STT
	 *   Je voudrais pouvoir utiliser dans la fonction memoizd GM_config.get("datacachelifetime"), cependant au moment ou je la lance cette valeur est inconnue puisque je n'ai pas fait l'init de la configuration
	 */
	
	//static memoized = moize.default(
	static m_calculateBill = moize.default(
		Accounting._calculateBill,
		{ 	maxAge: 120000,// in ms //GM_config.get("datacachelifetime"),
			isSerialized: true,
			//onCacheAdd: function(c,o,m){console.log("%cAdd data to cache",APP_DEBUG_STYLE);/*console.dir(c.keys);console.dir(o);console.dir(m)*/;},
			//onCacheHit: function(){console.log("%cGet data from cache", APP_DEBUG_STYLE);}
		});	
		
	/*
	 * 
	 * name: inconnu
	 * 
	 * Generate Price list for a date
	 * 
	 * @param
	 * @return matrix( lvl, type, state, funding);
	 * 
	 * Pierre lelevé niveau 2, session, réalisé, financé = (2, 0, 0, 1) 
	 * NO NEED CACHE due to performance cached version= 0ms, non cached = 1ms;
	 */
	
	static getPriceList = function(dtFrom){
		if (typeof dtFrom === 'string'){ dtFrom = dayjs(dtFrom)};
		var aPrice = [0, OC_PRICE1, OC_PRICE2, OC_PRICE3, OC_PRICE4, OC_PRICE5, OC_PRICE6];
		const bIsInOldMode = Core.isInOldMode(dtFrom);
		
		//var t1 = performance.now();
		var aPu=new Array(7);
		for(let _i = 1; _i <= OC_MAX_LEVEL ; _i+=1){
			let iPrice = aPrice[_i];
			let iPriceHalf = aPrice[_i]/2;
			let iPriceQuart = aPrice[_i]/4;
			if(bIsInOldMode){
				aPu[_i] = new Array(3);
				
				aPu[_i][TYPE_SESSION] = new Array(5);
				aPu[_i][TYPE_SESSION][SESSION_DONE] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
				aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_FUNDED] = iPrice;
				aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_OTHER] = iPrice;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_FUNDED] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_OTHER] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_OTHER] = iPriceHalf;
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;

				aPu[_i][TYPE_DEFENSE] = new Array(5);
				aPu[_i][TYPE_DEFENSE][SESSION_DONE] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
				aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_FUNDED] = iPrice;
				aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_OTHER] = iPrice;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_FUNDED] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_OTHER] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_OTHER] = iPriceHalf;
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
				
				aPu[_i][TYPE_COACHING] = new Array(5);
				aPu[_i][TYPE_COACHING][SESSION_DONE] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
				aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_FUNDED] = iPrice;
				aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_OTHER] = iPrice;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_FUNDED] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_OTHER] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_OTHER] = iPriceHalf;
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
			} else {
				/* dans l'idéal je devrais procéder ligne à ligne mais ici je vais parti */
				aPu[_i] = new Array(3);
				
				aPu[_i][TYPE_SESSION] = new Array(5);
				aPu[_i][TYPE_SESSION][SESSION_DONE] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_FUNDED] = iPrice;
				aPu[_i][TYPE_SESSION][SESSION_DONE][BILL_OTHER] = iPrice;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_FUNDED] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL][BILL_OTHER] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_FUNDED] = 0;
				aPu[_i][TYPE_SESSION][SESSION_CANCEL_LATE][BILL_OTHER] = 0;
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY] = new Array(4);
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceQuart;
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_SESSION][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;

				aPu[_i][TYPE_DEFENSE] = new Array(5);
				aPu[_i][TYPE_DEFENSE][SESSION_DONE] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
				aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_FUNDED] = iPrice;
				aPu[_i][TYPE_DEFENSE][SESSION_DONE][BILL_OTHER] = iPrice;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_FUNDED] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL][BILL_OTHER] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_FUNDED] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_CANCEL_LATE][BILL_OTHER] = 0;
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY] = new Array(4);
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_DEFENSE][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
				
				aPu[_i][TYPE_COACHING] = new Array(5);
				aPu[_i][TYPE_COACHING][SESSION_DONE] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_AUTOFUNDED] = iPrice;
				aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_FUNDED] = iPrice;
				aPu[_i][TYPE_COACHING][SESSION_DONE][BILL_OTHER] = iPrice;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_FUNDED] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL][BILL_OTHER] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_AUTOFUNDED] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_FUNDED] = 0;
				aPu[_i][TYPE_COACHING][SESSION_CANCEL_LATE][BILL_OTHER] = 0;
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY] = new Array(4);
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_AUTOFUNDED] = iPriceHalf;
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_FUNDED] = iPriceHalf;
				aPu[_i][TYPE_COACHING][SESSION_STUDENT_AWAY][BILL_OTHER] = iPriceHalf;
			}
		}
		//var t2 = performance.now();console.log("%cCalculating unitary price (PU) took " + (t2 - t1) + " milliseconds.", APP_PERF_STYLE);
		return aPu;
	}
}

export default Accounting;
