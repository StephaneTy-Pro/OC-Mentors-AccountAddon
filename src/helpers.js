/**
 * 
 **/

/*
 * waitFor(() => window.waitForMe, () => console.log('got you'))
*/

export const waitForRetry = async function(
	condition=true,
	callback=()=>{console.log("waitForEnd")},
	ms=1000,
	redo=0
	){
		console.log('waitForRetry typeof condition is',typeof condition,'condition is', condition);
		retry(()=>{waitFor(condition, callback, ms)}, redo);
	}
	
export const waitFor = async function(
	condition=true,
	callback=()=>{console.log("waitForEnd")},
	ms=1000
	){
		console.log('waitFor typeof condition is',typeof condition,'condition is ',condition);
		await until(condition, ms); // if debugging could say instead await until(condition, ms, 1e1, true);
		console.log('Waiting conditions are met');
		callback();
	}
export const wait= async function(ms){
	console.log(`will sleep ${ms}ms`);
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

// https://lihautan.com/retry-async-function-with-callback-promise/
// NOTESTT be carreful because catch are not send to console, sometimes we ignore the why system crash
const retry = async function(fn, n) {
  for (let i = 0; i < n; i++) {
    try {
      return await fn();
    } catch(e) {/*console.log('error',e)// for debugging*/}
  }

  throw new Error(`Failed retrying ${n} times`);
}

/*
 * iMax   => max iteration of testing trueness of tes
 * bError => when iteration are reached does we need to throw error
 */

const until = async function (fn, ms=0, iMax=1000, bError=false) {
	console.log('Waiting Start');
	var _iMax = iMax;
    while (iMax && !fn()) {
		console.log(`waiting condition is:${fn}, result of condition is ${fn()}, iteration is:${_iMax-iMax}, waiting time is:${ms}`);
		//console.log('Waiting conditions are NOT met');
    	await sleep(ms);
		iMax--;
    }
	if(bError && iMax == 0){
		throw new Error(`Failed retrying ${_iMax} times`);
	}
    console.log('Waiting End');
}

const sleep = async function (ms) {
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
