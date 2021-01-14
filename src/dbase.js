/**
 *
 */
import {APP_DEBUG_STYLE, APP_WARN_STYLE} from './constants.js';
import App from './index.js';
import Meta from './meta.js';
import{
	semverCompare,
} from './utils.js';
import {
	maj_1_00_0006,
} from './update_database.js';

class Dbase{
	/*
	 * 
	 * name: export
	 * @param
	 * @return string
	 * 
	 */
	static export = function(){
		console.log(`%cWanna export DBASE`, APP_DEBUG_STYLE);
		return JSON.stringify(App.Cfg.dbase.getState())
	}
	/*
	 * 
	 * name: import
	 * @param sExport : database format json
	 * @return
	 * TODO: add checking
	 */
	static import = function(sExport){
		console.log(`%cWanna import ${sExport} in DBASE`, APP_DEBUG_STYLE);
		console.log(`%c !!!!!! TYPE NOT CHECKED BE CARREFULL`, APP_DEBUG_STYLE);
		return App.Cfg.dbase.setState(JSON.parse(sExport)).write();
	}
	
	//static version = App.Cfg.dbase.get("meta").values() === undefined ? '1.0.0' : App.Cfg.dbase.get("meta").values().dbVersion;
	//static version = App.Cfg.dbase.get("meta").value().dbVersion;
	
	static update = async function(sVersion){
		console.log(`%cIs there any update to DB to go to version ${sVersion}`, APP_DEBUG_STYLE);
		// check if an update exists to db
		if ( semverCompare(sVersion, '1.00.0006') == 0 ){
			console.log("%cFound an update to DB version '1.00.0006' proceed conversion...", APP_DEBUG_STYLE);
			let _r = await maj_1_00_0006();
			// id there is no error or cancel .... 
			if( _r == -1 ){
				console.log('%cError something was wrong during update.... you have canceled it', APP_ERROR_STYLE);
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: "Quelque chose s'est mal passé ou vous avez annulé l'update \n\nUtiliser l'application dans ces conditions n'est pas garanti  !",
					footer: '<a href="https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon/issues">Générer un bug?</a>'
				});	
			} else {
				//App.Cfg.dbase.get("meta").assign({dbVersion: sVersion}).write();
			let _r = Meta.setVersion(sVersion);
			console.log(`%cChanged DB to version ${_r}`, APP_DEBUG_STYLE);
			}
			return ;
		}
		// finally if there is no error
		let _r = Meta.setVersion(sVersion);
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
	}
	
	// table_exist(tbl) = App.Cfg.dbase.has(tbl).value
	// create_table(tbl) = App.Cfg.dbase.assign({tbl:[]}).write
	// delete_table(tbl_id) = App.Cfg.dbase.unset([tbl_id]).write NOTESTT même si tbl_id est un nombre (suite à mauvaise manip)
	// delete_field on data -> use unset : sample delete isFunded on field 0....get(0).unset(['isFunded']).write();
}

export default Dbase;
