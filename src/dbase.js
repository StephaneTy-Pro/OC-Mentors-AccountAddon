/**
 *
 */
import {APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE} from './constants.js';
import App from './index.js';
import Meta from './meta.js';
import{
	semverCompare,
} from './utils.js';
import {
	maj_1_00_0006,
} from './update_database.js';

// just for export table
import Session from './sessions.js'

import Papa from './vendor/papaparse/papaparse.min.js';

class Dbase{
	/*
	 * 
	 * name: save
	 * @param
	 * @return string
	 * 
	 */
	static save = function(){
		console.log(`%cWanna save DBASE`, APP_DEBUG_STYLE);
		return JSON.stringify(App.Cfg.dbase.getState())
	}
	/*
	 * 
	 * name: load
	 * @param sFileName : database format json
	 * @return
	 * TODO: add checking
	 */
	static load = function(sFileName){
		console.log(`%cWanna load ${sFileName} in DBASE`, APP_DEBUG_STYLE);
		console.log(`%c !!!!!! TYPE NOT CHECKED BE CARREFULL`, APP_DEBUG_STYLE);
		return App.Cfg.dbase.setState(JSON.parse(sFileName)).write();
	}
	
	//static version = App.Cfg.dbase.get("meta").values() === undefined ? '1.0.0' : App.Cfg.dbase.get("meta").values().dbVersion;
	//static version = App.Cfg.dbase.get("meta").value().dbVersion;
	
	/*
	 * name: update
	 * @param sVersion : string version of dbase
	 * @return nil
	 * 
	 * Process
	 *   By default database is same version of the app, if this is not
	 *    the case, i must check if any update is created
	 *   As there is only one update to db, the process is not really
	 *    optimized, the ideal way is to update a array version by 
	 *    loading the update_database file, process the whole array and 
	 *    check if update needed.
	 *   Another way could be to define a constant array and 
	 *    fetch_inject the code 
	 */
	
	static update = async function(sVersion){
		console.log(`%cIs there any update to DB to go to version ${sVersion}`, APP_DEBUG_STYLE);
		// check if an update exists to db
		
		const aDbNeedUpdate = [
			{version:"1.00.0006", action: maj_1_00_0006}
		];
		
		for (let _i=0, _size = aDbNeedUpdate.length; _i < _size; _i++)
			{
			//if ( semverCompare(sVersion, '1.00.0006') == 0 ){
			if ( semverCompare(sVersion, aDbNeedUpdate[_i].version) == 0 ){
				console.log(`%cFound an update to DB version '${aDbNeedUpdate[_i].version}' proceed conversion...`, APP_DEBUG_STYLE);
				let _r = await aDbNeedUpdate[_i].action();
				// if there is no error or cancel .... 
				if( _r == -1 ){
					console.log(`%cError something was wrong during update of database from version: ${Meta.getVersion()} to version:${aDbNeedUpdate[_i].version}.... you have canceled it`, APP_ERROR_STYLE);
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: "Quelque chose s'est mal passé ou vous avez annulé l'update \n\nUtiliser l'application dans ces conditions n'est pas garanti  !",
						footer: '<a href="https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon/issues">Générer un bug?</a>'
					});	
				} else {
					//App.Cfg.dbase.get("meta").assign({dbVersion: sVersion}).write();
				let _r = Meta.setDbVersion(sVersion);
				console.log(`%cChanged DB to version ${_r}`, APP_DEBUG_STYLE);
				}
			}
		}
		// finally if there is no error
		let _r = Meta.setDbVersion(sVersion);
		console.log(`%cChanged DB to version ${_r}`, APP_DEBUG_STYLE);
	}
	
	/*
	 * erase data of a table
	 * 
	 * (string) the name of the table
	 */
	
	static erase = function(sTableName){
		console.log(`%cErase all data of table: ${sTableName}`, APP_DEBUG_STYLE);
		return App.Cfg.dbase.get(sTableName).remove().write();
		//db.set(sTableName, []).write() // devrait aussi fonctionner https://jsfiddle.net/typicode/4kd7xxbu/
	}
	/*
	 * seen here
	 * https://jsfiddle.net/typicode/4kd7xxbu/
	 */
	static loadTable = function(sTableName, aValue){
		if(table_exist(sTableName)){
			return App.Cfg.dbase.set(sTableName, aValue).write();
		}
		throw 'Table :'+sTableName+', not exists in DB !'; 
		return -1;
	}
	
	static table_exist = (sTableName) => App.Cfg.dbase.has(sTableName).value
	
	static table_export = function(sTableName){
		if(table_exist(sTableName)){
			return JSON.stringify(App.Cfg.dbase.get(sTableName).value())
		}
		throw 'Table :'+sTableName+', not exists id DB !';  
		return -1;
	}
	
	// table_exist(tbl) = App.Cfg.dbase.has(tbl).value
	// create_table(tbl) = App.Cfg.dbase.assign({tbl:[]}).write
	// delete_table(tbl_id) = App.Cfg.dbase.unset([tbl_id]).write NOTESTT même si tbl_id est un nombre (suite à mauvaise manip)
	// delete_field on data -> use unset : sample delete isFunded on field 0....get(0).unset(['isFunded']).write();
	
	/* 
	 * export to CSV
	 * depend on papa parse lib
	 *
	 */
	 
	 static exportTblToCSV = function(sTableName="",sDateFrom, sDateTo){
		/*
		 * if(sTableName == ""){
			console.log(`%cIrrecoverable Error: You forget to define a data table name` , APP_ERROR_STYLE);
			return -1;
		}
		if(App.Cfg.dbase.has(sTableName).value == false){
			console.log(`%cIrrecoverable Error: table ${sTableName} don't exist` , APP_ERROR_STYLE);
			return -1;
		}
		console.log(`%cExport all data of ${sTableName}`, APP_DEBUG_STYLE);
		*/
		const data = Dbase.exportTblToJSON(sTableName, sDateFrom, sDateTo)
		const config = {
			quotes: false, //or array of booleans
			quoteChar: '"',
			escapeChar: '"',
			delimiter: ",",
			header: true,
			newline: "\r\n",
			skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
			columns: null //or array of strings
		}


		//const data = App.Cfg.dbase.get(sTableName).value();
		return Papa.unparse(data, config);

	 } 
	 


	 static exportTblToJSON = function(sTableName="",sDateFrom , sDateTo){
		if(sTableName == ""){
			console.log(`%cIrrecoverable Error: You forget to define a data table name` , APP_ERROR_STYLE);
			return -1;
		}
		
		if(sDateFrom !== null && sDateFrom !== ""){
			dtFrom = dayjs(sDateFrom);
		}
		if(sDateTo !== null && sDateTo !== ""){
			dtTo = dayjs(sDateTo);
		}
		
		if(App.Cfg.dbase.has(sTableName).value == false){
			console.log(`%cIrrecoverable Error: table ${sTableName} don't exist` , APP_ERROR_STYLE);
			return -1;
		}
		/* Gérer des dates n'a pas de sens pour export car les dates peuvent representer les dates de création ou les dates de survenance
		 * il faudrait plutot demander à la l'objet lui meme de s'exporter
		 */
		 
		if( sTableName === Session.tbl_name ){
			if (typeof dtFrom === "object" && dtTo === "object"){
				return App.Cfg.dbase.get(sTableName).filter(v => 
					   dayjs(v.when).isSameOrBefore(dtTo,'day')
					&& dayjs(v.when).isSameOrAfter(dtFrom,'day'))
					.value();
			} 
			if (typeof dtFrom === "object"){
				return App.Cfg.dbase.get(sTableName).filter(v => 
					dayjs(v.when).isSameOrAfter(dtFrom,'day'))
					.value();
			} 
			if (typeof dtTo === "object"){
				return App.Cfg.dbase.get(sTableName).filter(v => 
					dayjs(v.when).isSameOrBefore(dtTo,'day'))
					.value();
			}
		
		} 
		return App.Cfg.dbase.get(sTableName).value();
	 } 
}

export default Dbase;
