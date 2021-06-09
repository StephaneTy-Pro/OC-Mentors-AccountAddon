/**
 * Some parts borrowed to https://github.com/alpinejs/alpine/blob/master/src/utils.js
 *
 */
 
import GMC from "./gmc.polyfills.js";
import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE
	} from './constants.js';
 
// Thanks @stimulus:
// https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
var  domReady = function () {
	return new Promise(resolve => {
		if (document.readyState == "loading") {
			document.addEventListener("DOMContentLoaded", resolve)
		} else {
			resolve();
		}
	})
};

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
	console.info(`%cfetch() waiting return from : ${sUrl}`, APP_DEBUG_STYLE);
	const response = await GMC.XHR({
		method: 'GET',
		url: sUrl,
		responseType: 'text/html',
		//binary: true,
		headers: {
			"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
		},
		
		// SRC https://github.com/Tampermonkey/tampermonkey/issues/609#
		
		onprogress: function(e) {
			//console.log(`%cOn progress function:`, APP_DEBUG_STYLE);
			//console.dir(e);
			//console.log(`%cgm_xhr onprogress lengthComputable: ${e.lengthComputable}`, APP_DEBUG_STYLE);
			//console.log(`%cgm_xhr onprogress loaded: ${e.loaded}`, APP_DEBUG_STYLE);
			//console.log(`%cgm_xhr onprogress total: ${e.total}`, APP_DEBUG_STYLE);
			/* STT aJOUTE mais il y en a encore d'autres */
			//console.log(`%cgm_xhr onprogress total: ${e.position}`, APP_DEBUG_STYLE);
			//console.log(`%cgm_xhr onprogress total: ${e.done}`, APP_DEBUG_STYLE);
		},
	
	}).catch((error) => {
		console.error(`%cError ${error}`,APP_ERROR_STYLE); // SRC copied from https://greasyfork.org/en/scripts/20423-patchouli/code script i use for xhr promises
	});

	//
	//console.log("_fetch() proceed domparser");
	let domparser = new DOMParser();
	/*
	response.responseXML.body is malformed so i need responseText
	responseText add \n, need to proceed a [string].replace(/\\n/mg,"\n")
	*/
	let doc = domparser.parseFromString(response.responseText.replace(/\n/mg,""), "text/html");
	/* there is a cloudflare captcha */
	let sCaptcha = doc.querySelector('meta[id=captcha-bypass]');
	if (sCaptcha !==null ){
		console.error(`%cError CloudFlare CAPTCHA : ${doc.querySelector('title').innerText}`, APP_DEBUG_STYLE);
		throw new Error("Must Respond to Cloudflare Captcha or waiting....");
	}        
	var oDom = {}
	if (bAll===true){
		oDom = doc.querySelectorAll(sPath);
	} else {
		oDom = doc.querySelector(sPath); // need only first
	}
	return oDom;
} 
    

/*
 * 
 * name: getKey
 *
 * get a param from an url by exploding the path
 *   return by default last element of path because index is by default set to -1
 * 
 * @param
 * @return
 * 
 */
var getKeyOld = function(el, idx=-1){ // before 20210601
	try {
		var _t1 = (el.children[0].href || "/").split("/");
		return _t1[_t1.length+idx];
	} catch(e) { console.error(`%cError in getkey${e.stack||e}`,APP_ERROR_STYLE);} // Erreur qui ne devrait jamais arriver en getkey 
}

/*
 * Cette fonction devrait être réecrite pour ne prendre en parametre que le href
 */

var getKey = function(el, idx=-1){
	try {
		var _t1 = (el.querySelector("a").href || "/").split("/");
		return _t1[_t1.length+idx];
	} catch(e) { console.error(`%cError in getkey${e.stack||e}`,APP_ERROR_STYLE);} // Erreur qui ne devrait jamais arriver en getkey 
}

/*
 * name: extractDate
 * 
 * 	extract date from string dd mmmm yyyy à hh:mm
 * 
 * 	@param (string) the date (format: 'dd mmmm yyyy à hh:mm') 
 *  @return (string) YYYY-MM-DDTHH:MM
 * 
 * 
 */
var extractDate = function(sWhen){
	//var _t = sWhen.split(' ');
	var _t = sWhen.trim().split(' '); // NOTESTT: parfois la date est précédée d'un espace je dois donc compresser la chaine sinon j'ai trop d'élements dans le tableau
	//var oMonth = {month:'void',id:'void'}
	try {
		//oMonth = _.find( aMonthFrench, ['month', _t[1]]);
		var id = (dayjs_locale_fr.months.findIndex( m => m === _t[1]))+1 // since janvier is 0
	} catch(e) { console.error(`%cError in extractDate${e.stack||e}`,APP_ERROR_STYLE);} // Erreur qui ne devrait jamais arriver en conversion de date
	//return `${_t[2]}-${oMonth.id}-${_t[0]}T${_t[4]}`; // NOTESTT correspond plus ou moins au format std day js YYYY-MM-DDTHH:MM
	return `${_t[2]}-${id}-${_t[0]}T${_t[4]}`; // NOTESTT correspond plus ou moins au format std day js YYYY-MM-DDTHH:MM
}

/*
 * 
 * name: convertRowToDate
 * @param index (integer)
 * @return
 *  if default is used return converted date from first children of dom element
 *  if -1 is given return converted date from last children of dom element
 *  return converted date from 'index' children of dom element
 */
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
/*
 * name: sleep
 * 	@param (integer) ms
 *  @return (promise) void
 *
 * https://www.sitepoint.com/delay-sleep-pause-wait
 * ne pas oublier de mettre un await avant son utilisation : await sleep(1000);
 */
var sleep = function (ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 * return file extension
 * 
 * https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript/1203361#1203361
 */

const getFileExtension = function(filename){
	return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}


/* semverCompare 
 * SRC https://github.com/substack/semver-compare/blob/master/index.js
 * 
 * compare two semver version strings, returning -1, 0, or 1
 * The return value can be fed straight into [].sort.
 * 
 *  return -1 if a < b
 *  return 1 if a > b
 *  return 0 if equals
 * */
var semverCompare = function(a,b){
    var pa = a.split('.');
    var pb = b.split('.');
    for (var i = 0; i < 3; i++) {
        var na = Number(pa[i]);
        var nb = Number(pb[i]);
        if (na > nb) return 1;
        if (nb > na) return -1;
        if (!isNaN(na) && isNaN(nb)) return 1;
        if (isNaN(na) && !isNaN(nb)) return -1;
    }
    return 0;
}
/*
 * A tester : https://stackoverflow.com/questions/42108782/firefox-webextensions-get-local-files-content-by-path/44516256#44516256
 * example readFile('file:///home/saba/Desktop/test.js', function(_res){console.log(_res);}); // <--  result (file content)});
 * 
 * 
 */ 

var readFile = function readFile(_path, _cb){

    console.info('Reading:', _path);

    return fetch(_path, {mode:'same-origin'})   // <-- important

    .then(function(_res) {
        return _res.blob();
    })

    .then(function(_blob) {
        var reader = new FileReader();

        reader.addEventListener("loadend", function() {
            _cb(this.result);
        });

        reader.readAsText(_blob); 
    });
};

/*
 * Inspiration from https://stackoverflow.com/questions/3613429/algorithm-to-convert-a-multi-dimensional-array-to-a-one-dimensional-array
 * and
 * https://www.freecodecamp.org/news/class-vs-factory-function-exploring-the-way-forward-73258b6a8d15/ for the factory 
 * 
 * Tests
 var m = matrix([4,5,3]);
 m.set(3,4,2,"data");
 console.log(m.get(3,4,2));
 console.log(m.get(3,6,2));

Note STT il s'agit bien des tailles des tableaux et pas de l'indice maximal;
* 
* TODO : create default value when init

 */


/*
 * 
 * name: matrix
 * @param
 * @return
 * 
 * /!\ Beaucoup de collision
 * 
 */
var matrix = function(aSizes){
	
	const _matrix = aSizes;
	//var _data = [];
	const _iSize = aSizes.reduce(function(a,c){return a*c})
	var _data = new Array(_iSize);
	/*
	 * 
	 * name: set
	 * @param
	 * @return the data which was set
	 * 
	 */
	const set = function(...args){
		const data = args.pop();
		if (args.length !== aSizes.length){
			throw 'Wrong matrix dimensions, need '+aSizes.length+', you provide '+data.length+'!';  
		}
		if (checkType(args) === 0){
			throw 'Wrong type for set need one or more int has dimension, check type of!';  
		}
		const _r = getIndex(args);
		
		/*if (_data[_r]){
			console.log(`%cBe Carreful COLLISION RISK data ${_data[_r]} exist before assignement, will be updated to ${data}`, APP_WARN_STYLE);
		}*/
		
		//console.log(`%cset(${args}) at index ${_r}`, APP_DEBUG_STYLE);
		_data[_r] = data;
		return data;
	}
	/*
	 * 
	 * name:
	 * @param
	 * @return
	 * 
	 */
	const get = function(...args){
	if (args.length !== aSizes.length){
		throw 'Wrong matrix dimensions, need '+aSizes.length+', you provide '+args.length+'!';   
	}
		if (checkType(args) === 0){
			throw 'Wrong type for set need one or more int has dimension, check type of!';  
		}
		const _r = getIndex(args);
		//console.log(`%cget(${args}) at index ${_r}`, APP_DEBUG_STYLE);
		return _data[_r];
	}
	/*
	 * 
	 * name: 
	 * @param
	 * @return
	 * 
	 */
	const del = function(...args){
		const _r = getIndex(args);
		_data[_r] = undefined;
		return _data[_r] === undefined;
	}
	/*
	 * 
	 * name: 
	 * @param
	 * @return
	 * 
	 */
	const toConsole = function(){
		console.group("dump table");
		console.table(_data);
		console.groupEnd("dump table");
	}
	
	// --------------------------------- private
	/*
	 * 
	 * name: 
	 * @param
	 * @return
	 * 
	 * 
	 * Attention très dangereux si on ne controle pas que les valeurs passées sont inférieures strictement aux tailles... pour une matrice 5,5,5 on ne peut pas demander 0,0,5 -> collision avec 0,1,0
 * TESTS
 * 
 * _
 matrix= [5,5,5];
[4,4,4].reduce(function(accumulator, currentValue, currentIndex, array) {
			let _t = _matrix.slice(currentIndex+1);console.log("_t",_t)
			let _ratio = _t.length > 0 ? _t.reduce(function(a,c){return a*c}) : 1;
      console.log(accumulator, currentValue,_ratio, currentIndex, array);
		return accumulator + currentValue * _ratio;
		},0);
		* 
		* 
	*/
	
	
	
	const getIndex = function(aValues){
	// multiplicator is calculated by reducing _matrix removing the index not need
		/*
		let _r = aValues.reduce(function(accumulator, currentValue, currentIndex, array) {
			let _t = _matrix.slice(currentIndex);
			let _ratio = _t.reduce(function(a,c){return a*c})
			return accumulator + currentValue * _ratio;
		});
  	
			console.log(`%cgetIndex(${aValues}) is ${_r}`, APP_DEBUG_STYLE);
		return _r;
		*/

    
		return aValues.reduce(function(accumulator, currentValue, currentIndex, array) {
			let _t = _matrix.slice(currentIndex+1); // need to forget the element left first element
			let _ratio = _t.length > 0 ? _t.reduce(function(a,c){return a*c}) : 1; // need to return 1 if no value left in _t
		return accumulator + currentValue * _ratio;
		},0); // need to start to 0
	}

	/*
	 * 
	 * name: checkType
	 * @param
	 * @return bool true if all is number
	 * 
	 * ['t',0,1,2,4,].reduce( (a,e) => a & typeof e === 'number', 1) = 0
	 *  [0,0,1,2,4,].reduce( (a,e) => a & typeof e === 'number', 1) = 1
	 * 
	 */
	const checkType = function(aValues){
		return aValues.reduce( (a,e) => a & typeof e === 'number', 1)
	}
                       
  return Object.freeze({
    set,
    get,
    del,
    toConsole,
 	});
  
}

/**
 * Hash function
 * https://stackoverflow.com/a/52171480
 * It is roughly similar to the well-known MurmurHash/xxHash algorithms. 
 * It uses a combination of multiplication and Xorshift to generate the hash, 
 * but not as thorough. As a result it's faster than either would be 
 * in JavaScript and significantly simpler to implement. 
 * Keep in mind this is not a secure algorithm, 
 * if privacy/security is a concern, this is not for you.

Like any proper hash, it has an avalanche effect, which basically means small changes in the input have big changes in the output making the resulting hash appear more 'random':

"501c2ba782c97901" = cyrb53("a")
"459eda5bc254d2bf" = cyrb53("b")
"fbce64cc3b748385" = cyrb53("revenge")
"fb1d85148d13f93a" = cyrb53("revenue")




You can also supply a seed for alternate streams of the same input:

"76fee5e6598ccd5c" = cyrb53("revenue", 1)
"1f672e2831253862" = cyrb53("revenue", 2)
"2b10de31708e6ab7" = cyrb53("revenue", 3)
* 



* 
* More info on algo https://stackoverflow.com/a/22429679

NOTE STT
cyrb53("revenue") => 8309097637345594 
cyrb53("revenge") => 4051478007546757 

cyrb53("revenue", 1) => 8697026808958300
cyrb53("revenue", 2) => 2021074995066978
* 
* 
	RETURN Number

 */
 
const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

/**
 * Performs an assertion.
 * @ignore
 *
 * @param  {Boolean} condition - The expression to assert.
 * @param  {String}  errorMessage - The message to throw if the assertion fails
 * @param  {ErrorConstructor}   [ErrorType=Error] - The error to throw if the assertion fails.
 *
 * @throws {Error} If `condition` returns `false`.
 * 
 * SRC : https://github.com/dinerojs/dinero.js/blob/develop/src/services/assert.js
 * 
 * USAGE
 * 
 *   assert(
    isPercentage(percentage),
    'You must provide a numeric value between 0 and 100.',
    RangeError
  )
 * 
 * RangeError, TypeError
 * 
 */
var assert = function (condition, errorMessage, ErrorType = Error) {
  if (!condition) throw new ErrorType(errorMessage)
}

export {
	domReady,
	_fetch,
	getKey,
	extractDate,
	convertRowToDate,
	sleep,
	semverCompare,
	getFileExtension,
	readFile,
	matrix,
	assert,
	cyrb53,
}
