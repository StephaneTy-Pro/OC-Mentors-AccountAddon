/**
 * 
 */
import {
	APP_DEBUG_STYLE, APP_PERF_STYLE,
	OC_STATUS_0, //"réalisée";
	OC_STATUS_1, // "annulée";
	OC_STATUS_2, // "annulée tardivement";
	OC_STATUS_3_M,	// "étudiant absent";
	OC_STATUS_3_F,	//"étudiante absente";
	OC_PRICE1, OC_PRICE2, OC_PRICE3, OC_PRICE4, OC_PRICE5, OC_PRICE6,
	OC_AUTOFUNDED, OC_FUNDED, OC_OTHER,
	BILL_AUTOFUNDED, BILL_FUNDED, BILL_OTHER,
	SESSION_DONE, SESSION_CANCEL, SESSION_CANCEL_LATE, SESSION_STUDENT_AWAY,
	TYPE_SESSION, TYPE_DEFENSE, TYPE_COACHING,
	} from './constants.js';
import App from './index.js';
import Session from './sessions.js';
import Core from './core.js';
import Accounting from './accounting.js';
import { workday_count } from './date.lib.js';


class List {
	static detail_bill = 'truc'; // reference les fonctions a appeller pour les détails ... je sais pas si ça va me servir au fond
	
/*
 * 
 * name: inconnu
 * Get price for a list of sessions
 * @param
 * @return
 * 
 */
	
	static getListDetailBill = function(dtFrom, dtTo){
		let db=App.Cfg.dbase; 
		// classer par date
		let _r = db.get(Session.tbl_name)
		.filter(v => dayjs(v.when).isSameOrBefore(dtTo,"day") && dayjs(v.when).isSameOrAfter(dtFrom, "day"))
		.sortBy(function (o){return dayjs(o.when).valueOf()})
		//.reverse()
		.value();
		
		
		// must have two table before 01/06 and after 01/06
		/*
		console.time("mode_1");
		var mPu_before = Accounting.getPriceList2(dayjs('2020-05-31'));
		console.timeLog("mode_1");
		var mPu_after = Accounting.getPriceList2(dayjs('2020-06-01'));
		console.timeEnd("mode_1") 
		console.time("mode_2");
		var mPu_before1 = Accounting.getPriceList2(dayjs('2020-05-31'));
		console.timeLog("mode_2");
		var mPu_after1 = Accounting.getPriceList2(dayjs('2020-06-01'));
		console.timeEnd("mode_2") 
		mPu_before.toConsole();
		mPu_after.toConsole();
		*/
		const dtNewMode = Core.getOldModeDate();
		let aPu_before = Accounting.getPriceList(dtNewMode.subtract(1,'day'));
		let aPu_after = Accounting.getPriceList(dtNewMode);
		
		let iCumul = 0;
		
		// has i manipulate data, i have better to clone database result to avoid weird addition in memory data, and desynchronization Memory vs DBase
		//var _rClone = [..._r]; // spread syntax cloning only first level
		// STT TODO .... there seem to be a problem perhaps i need deep cloning ....
		// deep cloning voir si la version json est plus rapide
		//var _rClone = JSON.parse(JSON.stringify(_r));
		var _rClone = _.cloneDeep(_r);
		
		/* test real cloning
		_rClone[0].test = "clone";
		console.log('_rClone[0]', _rClone[0]);
		console.log('_r[0]', _r[0]);
		*/

		for (var i in _rClone) {
			//if (_rClone[i].lvl > aPrice.length-1) { throw Error('ERROR PRICE ARRAY MUST BE UPDATED IN LISTS.JS')};
			//var iPu = _rClone[i].funding === true ? aPrice[_rClone[i].lvl] : aPrice[_rClone[i].lvl] * 0.5;
			var iPu = 0;
			var iFPu = 0;
			var bOldMode = true;
			var iStatus = 0;
			if (_rClone[i].status === OC_STATUS_0) iStatus = SESSION_DONE;
			if (_rClone[i].status === OC_STATUS_1) iStatus = SESSION_CANCEL;
			if (_rClone[i].status === OC_STATUS_2) iStatus = SESSION_CANCEL_LATE;
			if (_rClone[i].status === OC_STATUS_3_M || _rClone[i].status === OC_STATUS_3_F) iStatus = SESSION_STUDENT_AWAY;
			
			var iType =0;
			if (_rClone[i].type.toLowerCase() === 'session') iType = TYPE_SESSION;
			if (_rClone[i].type.toLowerCase() === 'soutenance') iType = TYPE_DEFENSE;
			if (_rClone[i].path != undefined && _rClone[i].path.toLowerCase() === '158-trouvez-lemploi-qui-vous-correspond' && _rClone[i].type !== 'soutenance') iType = TYPE_COACHING;
			
			var iFunding = 0;
			if (_rClone[i].funding === OC_AUTOFUNDED) iFunding = BILL_AUTOFUNDED;
			if (_rClone[i].funding === OC_FUNDED) iFunding = BILL_FUNDED;
			if (_rClone[i].funding === OC_OTHER) iFunding = BILL_OTHER;
			
			//console.log( +_rClone[i].lvl, iType, iStatus, iFunding);
			
			if (Core.isInOldMode(dayjs(_rClone[i].when))) {
				/*if (_rClone[i].status === OC_STATUS_0) {
				iFPu = iPu;
				} else {
				if (_rClone[i].status === OC_STATUS_3_M || _rClone[i].status === OC_STATUS_3_F || _rClone[i].status === OC_STATUS_2) {
						iFPu = iPu * 0.5;
					}
				}*/
				//iPu = +_rClone[i].lvl > 0 ? mPu_before.get( +_rClone[i].lvl, iType, iStatus, iFunding) : 0 ;
				//iPu = +_rClone[i].lvl > 0 ? mPu_before.get( +_rClone[i].lvl, iType, iStatus, iFunding) : 0 ;
				iPu = +_rClone[i].lvl > 0 ? aPu_before[+_rClone[i].lvl][iType][iStatus][iFunding] : 0 ;
			} else {
				bOldMode = false;
				//iPu = +_rClone[i].lvl > 0 ? mPu_after.get( +_rClone[i].lvl, iType, iStatus, iFunding) : 0 ;
				iPu = +_rClone[i].lvl > 0 ? aPu_after[+_rClone[i].lvl][iType][iStatus][iFunding]  : 0 ;
				/*if (_rClone[i].status === OC_STATUS_0) {
				iFPu = iPu;
				} else {
					if (_rClone[i].status === OC_STATUS_3_M || _rClone[i].status === OC_STATUS_3_F) {
						iFPu = iPu * 0.5;
					}
				}*/
			}
			//iCumul += iFPu;
			iCumul += iPu;
			_rClone[i].iPu = iPu;
			_rClone[i].oldMode = bOldMode;
			_rClone[i].iCumul = iCumul;
		}
		return _rClone;
	}
	static getListStatistic = function(dtFrom, dtTo){
		let dtCurFrom = dtFrom.clone();
		let dtCurTo = dtCurFrom.endOf('month');
		let aData = [];
		let aStat = [];
		let _m = 0; // store current month index
		//let _iMaxIndex = dtTo.get('month')-dtFrom.get('month');
		let _iMaxIndex =  dtTo.diff(dtFrom, "month");
		var t0 = performance.now();
		/* Collect all datas and push them into aData*/
		while (dtCurFrom.isSameOrBefore(dtTo,'day')){
			aData.push(Accounting.calculateBill(dtCurFrom, dtCurTo));
			//aData.push(calculateBill(dtCurFrom.format("YYYY-MM-DD"), dtCurTo.format("YYYY-MM-DD")));
			//console.log(`calculateBill(${dtCurFrom}, ${dtCurTo});`);
			dtCurFrom = dtCurFrom.add(1, 'month');
			dtCurTo = dtCurFrom.endOf('month');
		}
		var t1 = performance.now();console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);  
		
		// add sessions_mt for each monthly stats
		// aStat[0] = {col_lbl: [], row_lbl: [], info: {date:} }  
		// line 0 = label

		dtCurFrom = dtFrom.clone();
		dtCurTo = dtCurFrom.endOf('month');
		
		let _i0=0, _i1=0, _i2=0, _qs=0, _ms=0, _qsc=0, _msc=0;
		
		while(_m <= _iMaxIndex){
			const oMeta = aData[_m].get(0,0,0,0);
			const iCurrentMaxLevel = oMeta.maxLevel; /* could be different from the global OC_MAX_LEVEL (depending on when data was saved */
			aStat[_m] = {
				header:{dtFrom:null,dtTo:null,created_at:null},
				sessions:{total:0,nb:0,pu:0,nbc:0},
				defenses:{total:0,nb:0,pu:0,nbc:0},
				coaches:{total:0,nb:0,pu:0,nbc:0},
				bonus:0,kpi:{jrs:0,hrs:0,hrsp:0}};
			let _l = 1; // data start at 1, 0 is for global informations
			while( _l < iCurrentMaxLevel){
				let cTotal=0, cNb=0, cPu=0, cNbc=0;
				// SESSIONS 
				// /!\ a === undefined et typeof(a) === 'undefined' pas tout à fait pareil le premier à priori ne peut pas être réalisé en operation unaire
				// la compilation ne donne pas la meme chose l'un donne void 0 l'autre utilise bien typeof
				
				// le probleme qui me reste à régler .... faire de _i1 et _i2 des integer et pas des objets et _i0 un integer egalement apres
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_DONE, BILL_AUTOFUNDED, _l);
				_i2 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_DONE, BILL_FUNDED, _l);
				_i1 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_DONE, BILL_OTHER, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
		
				
				//KPI
				//_i0 = typeof _i0 === 'undefined' ? 0 : _i0;
				_i0 = typeof _i0 === 'undefined' ? 0 : _i0.number; // bug NaN sinon car _i0 étant un objet il renvoi l'objet et pas 0
				// NaN is a number https://javascriptrefined.io/nan-and-typeof-36cd6e2a4e43
				//_i0 = isNaN(_i0) ? 0 : _i0; //Correction provisoire du bug sur _i0 
				/* quand on passe au niveau _m 3 ça devient un objet pour bien sur planter après l'addition à _i1
				 *
				 * amount: 160
				 * data: Array(4) [ {…}, {…}, {…}, … ]
				 * number: 4
				 * 
				 * data sont des objets lignes 
				 * funding: "autre"
​​​					id: "570935"
					​​​lvl: "3"
					​​​path: ""
					​​​status: "réalisée"
					​​​type: "session"
					​​​when: "2020-8-25T11:15"
					​​who_id: "7582346"
					​who_name: "Maaike Joubert"
				 */
				if(Core.isInOldMode(dtCurFrom)){
					aStat[_m].kpi.hrs += (_i0 + _i1 + _i2) * (45/60);
					aStat[_m].kpi.hrsp+= (_i0 + _i1 + _i2) * (GM_config.get("nbHrsS")/60);
				} else {
					aStat[_m].kpi.hrs += (_i2) * (30/60);
					aStat[_m].kpi.hrsp+= (_i2) * (GM_config.get("nbHrsAfM")/60);
					aStat[_m].kpi.hrs += (_i0 + _i1) * (45/60);
					aStat[_m].kpi.hrsp+= (_i0 + _i1) * (GM_config.get("nbHrsfM")/60);
				}
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL, BILL_FUNDED, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL, BILL_OTHER, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;

				if(Core.isInOldMode(dtCurFrom)){
					_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
					_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
					_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				} else {
					_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
					_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
					_i0 = aData[_m].get(TYPE_SESSION,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				}
				
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);
				_i2 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
				_i1 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_SESSION,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				
				// session annulée temps 15min
				//KPI
				_i0 = typeof _i0 === 'undefined' ? 0 : _i0;
				aStat[_m].kpi.hrs += (_i0 + _i1 + _i2) * (15/60);
				aStat[_m].kpi.hrsp+= (_i0 + _i1 + _i2) * (15/60);
				cTotal = aStat[_m].sessions.total;
				cNb = aStat[_m].sessions.nb;
				cPu = aStat[_m].sessions.pu;
				cNbc = aStat[_m].sessions.nbc;
				//console.log(_qs, _qsc, _ms);
				//console.log(cTotal, cNb, cNbc, cPu);
				aStat[_m].sessions={total: _ms+cTotal, nb: _qs+cNb, pu: (_ms+cTotal)/(_qs+cNb), nbc: _qsc+cNbc};
				
				// SOUTENANCES 
				cTotal=0;
				cNb=0;
				cPu=0;
				cNbc=0;
				_qs=0;
				_ms=0;
				_qsc=0;
				_msc=0;
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_DONE, BILL_AUTOFUNDED, _l);
				_i2 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_DONE, BILL_FUNDED, _l);
				_i1 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_DONE, BILL_OTHER, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				//KPI
				_i0 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				aStat[_m].kpi.hrs += (_i0 + _i1 + _i2) * (45/60);
				aStat[_m].kpi.hrsp+= (_i0 + _i1 + _i2) * (GM_config.get("nbHrsD")/60);

				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_FUNDED, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL, BILL_OTHER, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;

				/*if(Core.isInOldMode(dtCurFrom)){
					_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
					_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
					_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				} else {*/
					_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
					_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
					_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				//}
				
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);
				_i2 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
				_i1 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_DEFENSE,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				
				// session annulée temps 15min
				//KPI
				_i0 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				aStat[_m].kpi.hrs += (_i0 + _i1 + _i2) * (15/60);
				aStat[_m].kpi.hrsp+= (_i0 + _i1 + _i2) * (15/60);
				
				cTotal = aStat[_m].defenses.total;
				cNb = aStat[_m].defenses.nb;
				cPu = aStat[_m].defenses.pu;
				cNbc = aStat[_m].defenses.nbc;
				//console.log(_qs, _qsc, _ms);
				//console.log(cTotal, cNb, cNbc, cPu);
				aStat[_m].defenses={total: _ms+cTotal, nb: _qs+cNb, pu: (_ms+cTotal)/(_qs+cNb), nbc: _qsc+cNbc};
				
				// COACHING
				cTotal=0;
				cTotal=0;
				cNb=0;
				cPu=0;
				cNbc=0;
				_qs=0;
				_ms=0;
				_qsc=0;
				_msc=0;
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_DONE, BILL_AUTOFUNDED, _l);
				_i2 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_DONE, BILL_FUNDED, _l);
				
				_i1 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_DONE, BILL_OTHER, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				
				//KPI
				_i0 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				aStat[_m].kpi.hrs += (_i0 + _i1 + _i2) * (45/60);
				aStat[_m].kpi.hrsp+= (_i0 + _i1 + _i2) * (GM_config.get("nbHrsC")/60);

				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL, BILL_AUTOFUNDED, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL, BILL_FUNDED, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL, BILL_OTHER, _l);
				_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
				_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;

				/*if(Core.isInOldMode(dtCurFrom)){
					_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
					_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
					_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
					_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
					_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				} else {*/
					_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_AUTOFUNDED, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
					_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_FUNDED, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
					_i0 = aData[_m].get(TYPE_COACHING,  SESSION_CANCEL_LATE, BILL_OTHER, _l);
					_qsc =  typeof _i0 === 'undefined' ? _qsc : _qsc + _i0.number; 
					_msc =  typeof _i0 === 'undefined' ? _msc : _msc + _i0.amount;
				//}
				
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_AUTOFUNDED, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_FUNDED, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				_i0 = aData[_m].get(TYPE_COACHING,  SESSION_STUDENT_AWAY, BILL_OTHER, _l);
				_qs =  typeof _i0 === 'undefined' ? _qs : _qs + _i0.number; 
				_ms =  typeof _i0 === 'undefined' ? _ms : _ms + _i0.amount;
				
				cTotal = aStat[_m].coaches.total;
				cNb = aStat[_m].coaches.nb;
				cPu = aStat[_m].coaches.pu;
				cNbc = aStat[_m].coaches.nbc;
				//console.log(_qs, _qsc, _ms);				// session annulée temps 15min
				//KPI
				_i0 =  typeof _i0 === 'undefined' ? 0 : _i0.number;
				aStat[_m].kpi.hrs +=_i0 * (15/60);
				aStat[_m].kpi.hrsp+=_i0 * (15/60);
				
				//console.log(cTotal, cNb, cNbc, cPu);
				aStat[_m].coaches={total: _ms+cTotal, nb: _qs+cNb, pu: (_ms+cTotal)/(_qs+cNb), nbc: _qsc+cNbc};
				_l+=1;
			}
		// Bonus
		let iFlatFeeNumber = oMeta.flatFee.length  
		for(var t=0; t < iFlatFeeNumber; t+=1){
				aStat[_m].bonus+=30
		}
		//KPI
		if(dtCurTo.isAfter(dtTo,'day')) dtCurTo = dtTo.clone(); // last month not add a month
		aStat[_m].kpi.jrs = workday_count(dtCurFrom,dtCurTo);
		// header
		aStat[_m].header.dtFrom = dtCurFrom.format('YYYY-MM-DD');
		aStat[_m].header.dtTo = dtCurTo.format('YYYY-MM-DD');			
		aStat[_m].header.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss'); // std dayjs format
		//next month
		dtCurFrom = dtCurFrom.add(1, 'month');
		dtCurTo = dtCurFrom.endOf('month');

		_m+=1
		}
	return aStat;
	}
	static getListStatisticOld = function(dtFrom, dtTo){
		let dtCurFrom = dtFrom.clone();
		let dtCurTo = dtCurFrom.endOf('month');
		let aData = [];
		let aStat = [];
		let _iMaxIndex = dtTo.get('month')-dtFrom.get('month');
		var t0 = performance.now();
		/* Collect all datas and push them into aData*/
		while (dtCurFrom.isSameOrBefore(dtTo,'day')){
			aData.push(Accounting.calculateBill(dtCurFrom, dtCurTo));
			//aData.push(calculateBill(dtCurFrom.format("YYYY-MM-DD"), dtCurTo.format("YYYY-MM-DD")));
			//console.log(`calculateBill(${dtCurFrom}, ${dtCurTo});`);
			dtCurFrom = dtCurFrom.add(1, 'month');
			dtCurTo = dtCurFrom.endOf('month');
		}
		var t1 = performance.now();console.log("%cComputed data between the two dates in" + (t1 - t0) + " milliseconds.", APP_PERF_STYLE);  
		
		// add sessions_mt for each monthly stats
		// aStat[0] = {col_lbl: [], row_lbl: [], info: {date:} }  
		// line 0 = label
		let _m = 0;
		dtCurFrom = dtFrom.clone();
		dtCurTo = dtCurFrom.endOf('month');
		
		console.log(aData);
		
		while(_m <= _iMaxIndex){
			let iCurrentMaxLevel = aData[_m][0].max_level; /* could be different from the global OC_MAX_LEVEL (depending on when data was saved) */
			aStat[_m] = {
				header:{dtFrom:null,dtTo:null,created_at:null},
				sessions:{total:0,nb:0,pu:0,nbc:0},
				defenses:{total:0,nb:0,pu:0,nbc:0},
				coaches:{total:0,nb:0,pu:0,nbc:0},
				bonus:0,kpi:{jrs:0,hrs:0,hrsp:0}};
			let _l = 1; // data start at 1, 0 is for global informations
			while( _l < iCurrentMaxLevel){
				let _z = [...Array(8).keys()];
				for (let _i=0; _i < _z.length; _i+=1 ){ // NOTESTT: ~ pythonic range ... could use _range too
					// iTotal+= aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
					
					aStat[_m].sessions.total += aData[_m][_l].sessions.number[_i] * aData[_m][_l].sessions.pu[_i];
					aStat[_m].sessions.nb += aData[_m][_l].sessions.number[_i];
					
					aStat[_m].defenses.total += aData[_m][_l].defenses.number[_i] * aData[_m][_l].defenses.pu[_i];
					aStat[_m].defenses.nb += aData[_m][_l].defenses.number[_i];
					
					// canceled ones
					
					if(Core.isInOldMode(dtCurFrom)){
						if ([1,5].includes(_i)) {
							aStat[_m].sessions.nbc+= aData[_m][_l].sessions.number[_i];
							aStat[_m].defenses.nbc+= aData[_m][_l].defenses.number[_i];
						}
					} else {
						if ([1,2,5,6].includes(_i)) {
							aStat[_m].sessions.nbc+= aData[_m][_l].sessions.number[_i];
							aStat[_m].defenses.nbc+= aData[_m][_l].defenses.number[_i];	
						}
					}
					// bonus
					/*
					if(_l === 1){
						if(aStat[_m].bonus+= aData[_m][0].bonus.length > 0){
							aStat[_m].bonus+= aData[_m][0].bonus[_i].sessions > 0 ? 30 : 0;
						}
					}*/
					// KPI
					if(Core.isInOldMode(dtCurFrom)){
						aStat[_m].kpi.hrs+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45/60);
						aStat[_m].kpi.hrsp+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM")/60);
					} else {
						if ([4,5,6,7].includes(_i)) {
							// AF 30 min
							aStat[_m].kpi.hrs+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (30/60);
							aStat[_m].kpi.hrsp+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsAfM")/60);
						}
						if ([0,1,2,3].includes(_i)) {
							// F 45 min
							aStat[_m].kpi.hrs+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (45/60);
							aStat[_m].kpi.hrsp+= (aData[_m][_l].sessions.number[_i] - aData[_m][_l].defenses.number[_i]) * (GM_config.get("nbHrsfM")/60);
						}
					}
					// defenses
					aStat[_m].kpi.hrs+=aData[_m][_l].defenses.number[_i] * (45/60);
					aStat[_m].kpi.hrsp+= aData[_m][_l].defenses.number[_i] * (GM_config.get("nbHrsD")/60);
				}
				_l+=1;
			}
			aStat[_m].sessions.pu = aStat[_m].sessions.total / (aStat[_m].sessions.nb-aStat[_m].sessions.nbc);
			aStat[_m].defenses.pu = aStat[_m].defenses.total / (aStat[_m].defenses.nb- aStat[_m].defenses.nbc);
			aStat[_m].coaches.total = aStat[_m].sessions.total - aStat[_m].defenses.total;
			aStat[_m].coaches.nb = aStat[_m].sessions.nb - aStat[_m].defenses.nb;
			aStat[_m].coaches.nbc = aStat[_m].sessions.nbc - aStat[_m].defenses.nbc;
			aStat[_m].coaches.pu  = aStat[_m].coaches.total / (aStat[_m].coaches.nb-aStat[_m].coaches.nbc);
			
			// bonus
			for (let _i = 0; _i < aData[_m][0].bonus.length; _i += 1) {
				aStat[_m].bonus += aData[_m][0].bonus[_i].sessions > 0 ? 30 : 0;
			}
			
			//KPI
			if(dtCurTo.isAfter(dtTo,'day')) dtCurTo = dtTo.clone(); // last month not add a month
			aStat[_m].kpi.jrs = workday_count(dtCurFrom,dtCurTo);
			// header
			aStat[_m].header.dtFrom = dtCurFrom.format('YYYY-MM-DD');
			aStat[_m].header.dtTo = dtCurTo.format('YYYY-MM-DD');			
			aStat[_m].header.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss'); // std dayjs format
			//next month
			dtCurFrom = dtCurFrom.add(1, 'month');
			dtCurTo = dtCurFrom.endOf('month');
			_m+=1;
		}	
	return aStat;	    
	}
}
export default List;
