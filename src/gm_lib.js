/***
 * 
 */

// src : https://greasyfork.org/en/scripts/31456-google-drive-video-player-for-cytube/code
export isRunningTampermonkey = function () {
	try {
		return GM_info.scriptHandler === 'Tampermonkey';
	} catch (error) {
		return false;
	}
}

/*
 *  SRC https://stackoverflow.com/questions/13731209/window-onload-works-in-firefoxgreasemonkey-script-but-not-in-a-chrome-userscrip
 * addJS_Node (null, null, GM_main); 
 * function GM_main () {
    window.onload = function () {
        console.log(exampleFunction);
        alert("LOADED!");
    
 */


//-- This is a standard-ish utility function:
function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}
