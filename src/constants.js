/**
 * exampple from https://github.com/mrdoob/three.js/blob/dev/src/constants.js
 */

// AMONTH ne doit plus être utilisée
//export const  AMONTHFRENCH = [{month:'janvier',id:'01'},{month:'février',id:'02'},{month:'mars',id:'03'},{month:'avril',id:'04'},{month:'mai',id:'05'},{month:'juin',id:'06'},{month:'juillet',id:'07'},{month:'août',id:'08'},{month:'septembre',id:'09'},{month:'octobre',id:'10'},{month:'novembre',id:'11'},{month:'décembre',id:'12'}]
export const  APP_NAME = "OC-Addons";
export const  APP_AUTHOR = "Stéphane TORCHY";
// APPLICATION
export const APP_DEBUG_STYLE	= "background-color:green;color:white"; 
export const APP_LOG_STYLE 		= "background-color:black;color:white"; 
export const APP_WARN_STYLE 	= "background-color:coral;color:white";
export const APP_INFO_STYLE 	= "background-color:cyan;color:white";
export const APP_ERROR_STYLE 	= "background-color:red;color:white";
export const APP_PERF_STYLE 	= "background-color:blue;color:white"; // style for performance analysis in console
// OC
export const OC_AUTOFUNDED 	= "auto-financé"; // in oc -> need to check uncapitalized
export const OC_FUNDED 		= "financé par un tiers" ; // in oc
export const OC_OTHER 		= "autre"; // ça peut être financé par coupon pour remise d'un mois gratuit par exemple, mais pour le moment je n'ai pas cette info
export const OC_STATUS_0 	= "réalisée";
export const OC_STATUS_1 	= "annulée";
export const OC_STATUS_2 	= "annulée tardivement";
export const OC_STATUS_3_M 	= "étudiant absent";
export const OC_STATUS_3_F 	= "étudiante absente";
export const OC_MAX_LEVEL 	=6; // max facturation level (used when loop in financial array) 5 since june
export const OC_PRICE1		=30;
export const OC_PRICE2		=35;
export const OC_PRICE3		=40;
export const OC_PRICE4		=45;
export const OC_PRICE5		=50;
export const OC_PRICE6		=55;



//BILL
export const BILL_AUTOFUNDED = 0;
export const BILL_FUNDED = 1;
export const BILL_OTHER = 2;
export const BILL_BILLMODIFICATORS = [{pathId:158,path:'158-trouvez-lemploi-qui-vous-correspond',value:2}]; // handle different price for some kind of path
export const SESSION_DONE = 0;
export const SESSION_CANCEL = 1;
export const SESSION_CANCEL_LATE = 2;
export const SESSION_STUDENT_AWAY = 3;

// SESSION
/* the session type*/
export const TYPE_SESSION = 0; 
export const TYPE_DEFENSE = 1;
export const TYPE_COACHING = 2;
export const TYPE_MENTORAT = 0; // new since 202106 --> same as old sessions 

// SESSION API
export const OC_API_SESSION_STATUS_0 	= "completed";
export const OC_API_SESSION_STATUS_1 	= "canceled";
export const OC_API_SESSION_STATUS_2 	= "late canceled";
export const OC_API_SESSION_STATUS_3 	= "marked student as absent";

// SELECTOR
export const OC_DASHBOARDCSSMAINDATASELECTOR = 'table'; // before 'table[id*="session"]
