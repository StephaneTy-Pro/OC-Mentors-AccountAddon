/**
 * 
 **/
 
// vendor one

//// https://github.com/ryangjchandler/spruce/blob/2.x/src/utils.js

export const isNullOrUndefined = value => {
    return value === null || value === undefined
}

//// NOTE STT 
//// ATTENTION verifie que le prototype de l'objet est bien un objet neutre
//// ça plante sur une instance d'objet type dayjs => utiliser instanceof
export const isObject = _ => {
    return Object.getPrototypeOf(_) === Object.prototype
}


export const isArray = _ => Array.isArray(_) 

// Mix mine or other from stack

/*
 * check if function contain nothing 
 * don't work with () => functions
 * visiblement en cas concret ça ne fonctionne pas
 * le nombre de caractere de la fonction vide en tout cas sous chromium n'est pas le meme
 * la fonction semble passée sur plusieurs lignes 
 */
 
export const isEmptyFunction = _ => _.toString().trim().length <= 'function(){}'.length;

/*
 * waitFor(() => window.waitForMe, () => console.log('got you'))
*/

/*
 * {function}
 * {function}
 * {int}
 * {int}
 */
 
// nouvelle fonction sur la base de
// https://www.bayanbennett.com/posts/retrying-and-exponential-backoff-with-promises/
// https://tusharsharma.dev/posts/retry-design-pattern-with-js-promises
// voir également la librairie : https://caolan.github.io/async/v3/docs.html#retry
// https://stackoverflow.com/questions/53982040/retrying-a-failed-async-promise-function 
//  --> on y fait mention de axios.retry a voir également

export const waitForRetry = async function(
	condition=()=>true,
	callback=()=>{console.log("waitForRetry...default fn")},
	ms=1000,
	redo = 1
	){
	var bDebug = true;
	if(bDebug) console.log('%cwaitForRetry() typeof condition:%o typeof callback:%o ms:%i redo:%i','color:darksalmon', typeof condition, typeof callback, ms, redo);
	try {
		await retryFn(
			0,
			null,
			async()=>{await waitFor(condition, callback, ms)},
			redo);
	}catch(e){
		console.log("%cwaitForRetry() Error : %o",'color:darksalmon',e);
	}
	if(bDebug) console.log('%cwaitForRetry() Waiting conditions are met','color:darksalmon');
};

const delay = retryCount =>
	new Promise(resolve => setTimeout(resolve, 10 ** retryCount));
	
const retryFn = async (retryCount = 0, lastError = null, fn =()=>true, retryLimit ) => {
	var bDebug = true;
	if(bDebug) console.log('%retryFn() Start','color:darksalmon');
  if (retryCount > retryLimit) throw new Error(lastError);
	try {
		return fn();
	} catch (e) {
		await delay(retryCount);
		return retryFn(retryCount + 1, e, fn, retryLimit);
	}
};

	
export const waitFor = async function(
	condition=()=>true,
	callback=()=>{console.log("waitFor...default fn")},
	ms=1000
	){
		var bDebug = true;
		if(bDebug) console.log('%cwaitFor() typeof condition:%o typeof callback:%o ms:%i','color:darksalmon', typeof condition, typeof callback, ms);
		await until(condition, ms); // if debugging could say instead await until(condition, ms, 1e1, true);
		if(bDebug) console.log('%cwaitFor() Waiting conditions are met','color:darksalmon');
		callback();
	}
export const wait= async function(ms){
	console.log(`%cwait() will wait ${ms}ms`, 'color:darksalmon');
	sleep(ms);
}

// https://stackoverflow.com/questions/35556876/javascript-repeat-a-function-x-amount-of-times
export const repeatFn = function(times=1,fn = ()=> {} ){
	Array.from({length: times}, () => fn());
}

/**
 * Debounce functions for better performance
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} fn The function to debounce
 */
export var debounce = function (fn) {

	// Setup a timer
	var timeout;

	// Return a function to run debounced
	return function () {

		// Setup the arguments
		var context = this;
		var args = arguments;

		// If there's a timer, cancel it
		if (timeout) {
			window.cancelAnimationFrame(timeout);
		}

		// Setup the new requestAnimationFrame()
		timeout = window.requestAnimationFrame(function () {
			fn.apply(context, args);
		});

	}

};


// ## Private functions
// NOTE STT BUGGEE
// https://lihautan.com/retry-async-function-with-callback-promise/
// NOTESTT be carreful because catch are not send to console, sometimes we ignore the why system crash
const retry = async function(fn, n) {
	var bDebug = true;
	if(bDebug) console.log('%cretry() Start','color:darksalmon');
	//if(bDebug) console.log('%cretry() type of fn:%o number of n:%o', 'color:darksalmon', typeof fn, n);
	if(bDebug) console.log('%cretry() retry %o %i times', 'color:darksalmon', typeof fn, n);
	for (let i = 0; i < n; i++) {
		if(bDebug) console.log('%cretry() iteration:%i', 'color:darksalmon', i);
		try {
			return await fn();
		} catch(e) {
			/*console.log('error',e)// for debugging*/
		}
	}
	if(bDebug) console.log('%cRetry End','color:darksalmon');
	throw new Error(`Failed retrying ${n} times`);
}

/*
 * iMax   => max iteration of testing trueness of test
 * bError => when iteration are reached does we need to throw error
 */

const until = async function (fn, ms=0, iMax=1000, bError=false) {
	var bDebug = true;
	if(bDebug) console.log('%cuntil() type of fn:%o ms:%i iMax:%i, bError:%o', 'color:darksalmon', typeof fn, ms, iMax, bError);
	if(bDebug) console.log('%cuntil() Start', 'color:darksalmon');
	var _iMax = iMax;
    while (iMax && !fn()) {
		if(bDebug) console.log(`%cuntil() waiting condition is NOT met, condition is:${fn}, result of condition is ${fn()}, iteration is:${_iMax-iMax}, waiting time is:${ms}`, 'color:darksalmon');
    	await sleep(ms);
		iMax-=ms;
    }
    
	if(bDebug) console.log('%cuntil() End at iteration:%i', 'color:darksalmon', _iMax-iMax);
    
	if(bError && iMax == 0){
		throw new Error(`Failed retrying ${_iMax} times`);
	}
	
	if(iMax == 0){
		return false
	}
	
	return true;
	

}

const sleep = async function (ms) {
	console.log('%csleep() will sleep %i ms ', 'color:darksalmon', ms);
	return new Promise(resolve => setTimeout(resolve, ms));
}


/*
 * console.log("Hello");
sleep(2000);
console.log("World!");
* 
* src https://www.sitepoint.com/delay-sleep-pause-wait/
*/


export const pause = function (milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


/*
 tests
 * 
 * 
console.log('test');
await sleep(1000);
console.log('test');
//await until( () => {true === false}, 50);
await waitFor( true == true , ()=>{console.log("waitFor End")}, 50);
//await retry(()=>{console.log("e")}, 4 );
console.log('test waitForRetry');
await waitForRetry( true == false , ()=>{console.log("waitForRetry End")}, 50,2);

*/


// --- polling
// https://davidwalsh.name/javascript-polling
// The polling function
const poll = async function (fn, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    var checkCondition = function(resolve, reject) {
        // If the condition is met, we're done! 
        var result = fn();
        if(result) {
            resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };

    return new Promise(checkCondition);
}

// Usage:  ensure element is visible
/*
poll(function() {
	return document.getElementById('lightbox').offsetWidth > 0;
}, 2000, 150).then(function() {
    // Polling done, now do something else!
}).catch(function() {
    // Polling timed out, handle the error!
});
*/



/*
Without Deferreds

If you aren't using Deferreds, no worry -- polling is just about the same:

function poll(fn, callback, errback, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    (function p() {
            // If the condition is met, we're done! 
            if(fn()) {
                callback();
            }
            // If the condition isn't met but the timeout hasn't elapsed, go again
            else if (Number(new Date()) < endTime) {
                setTimeout(p, interval);
            }
            // Didn't match and too much time, reject!
            else {
                errback(new Error('timed out for ' + fn + ': ' + arguments));
            }
    })();
}

// Usage:  ensure element is visible
poll(
    function() {
        return document.getElementById('lightbox').offsetWidth > 0;
    },
    function() {
        // Done, success callback
    },
    function() {
        // Error, failure callback
    }
);
*/
