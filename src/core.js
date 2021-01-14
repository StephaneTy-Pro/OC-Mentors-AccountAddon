/**
 * 
 */

import {APP_DEBUG_STYLE} from './constants.js';

class Core {
    /*
     * check if something is in old mode
     * by checking the date parameters is before the changing date 01/06/2020
     */
    static isInOldMode = function(date){
        var dtDate = null;
        if (typeof date === 'string'){
            dtDate = dayjs(date);
        } else {
            dtDate = date;
        }
        try {
            return dtDate.isBefore(Core.getOldModeDate()); // STT note that : dayjs("2020-06-01").isBefore("2020-06-01") return false
        } catch(e) { throw Error('Erreur qui ne devrait jamais arriver en IsInOldMode (probablement un probleme sur la conversion de la date en objet dayjs:'+e.stack||e );}
    }
    
	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * 
	 */
    static getOldModeDate = function(){
		return dayjs("2020-06-01");
		}
		
	// when getting out of tampermonkey have to get a real verstion
	static getAppVersion = function(){ return GM.info.script.version;}
}

export default Core;
