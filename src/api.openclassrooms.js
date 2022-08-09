/**
 * Commentaires
 * 	Ne pas oublier que URL est une fonction de base dans JS !!!!!
 *
 *
 * v1.1
 * 		Ajout des fonctions liés aux étudiant dans l'api
 */



import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	} from './constants.js';

import GMC from "./gmc.polyfills.js";
import { assert } from './utils.js';
import { isArray,isNullOrUndefined } from './helpers.js';

const C = {
	APP_DEBUG_STYLE: [
		"color: #373737",
		"background-color: #CC6",
		"padding: 2px 4px",
		"border-radius: 2px"
	].join(";"),

	VERBOSE:true,
	DEBUG: true,
	NAME: 'Api',
}

var fApi = function(){

	let _header = {}
	let _user = '0'; //sera capturé
	//let _user = 7688561; //provisoire
	const VERBOSE = C.VERBOSE;

	// API URLs
	const API_BASE_URL = "https://api.openclassrooms.com";

	// https://api.openclassrooms.com/users/7688561/sessions?actor=expert&life-cycle-status=canceled%2Ccompleted%2Clate%20canceled%2Cmarked%20student%20as%20absent
	// "https://api.openclassrooms.com/users/7688561/sessions?actor=expert&life-cycle-status=canceled,completed,late canceled,marked student as absent"
	const LIFE_CYCLE_STATUS_PENDING = 'pending';
	const LIFE_CYCLE_STATUS_CANCELED = 'canceled';
	const LIFE_CYCLE_STATUS_COMPLETED = 'completed';
	const LIFE_CYCLE_STATUS_LATE_CANCELED = 'late canceled';
	const LIFE_CYCLE_STATUS_ABSENT = 'marked student as absent';


	/*
	 * Partie reservation de créneau de soutenance
	 *   test samedi 30 octobre à 09h00
	 *   4 fichiers
	 *    https://api.openclassrooms.com/users/7688561/availabilities
	 *    post https://api.openclassrooms.com/users/7688561/availabilities
	 * 			requete:{"startDate":"2021-10-30T07:00:00Z","endDate":"2021-10-30T08:00:00Z","recurrence":null}
	 *    https://api.openclassrooms.com/users/7688561/availabilities
	 *    get https://api.openclassrooms.com/users/7688561/availabilities
	 *          réponse [{"availabilityId":242538,"endDate":"2021-10-30T08:00:00+0000","recurrence":null,"startDate":"2021-10-30T07:00:00+0000"},{"availabilityId":224812,"endDate":"2021-10-18T18:00:00+0000","recurrence":"DTSTART:20211018T170000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T17:00:00+0000"},{"availabilityId":224811,"endDate":"2021-10-18T17:00:00+0000","recurrence":"DTSTART:20211018T160000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T16:00:00+0000"},{"availabilityId":224810,"endDate":"2021-10-18T16:00:00+0000","recurrence":"DTSTART:20211018T150000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T15:00:00+0000"},{"availabilityId":224809,"endDate":"2021-10-18T15:00:00+0000","recurrence":"DTSTART:20211018T140000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T14:00:00+0000"},{"availabilityId":224808,"endDate":"2021-10-18T14:00:00+0000","recurrence":"DTSTART:20211018T130000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T13:00:00+0000"},{"availabilityId":224807,"endDate":"2021-10-18T13:00:00+0000","recurrence":"DTSTART:20211018T120000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T12:00:00+0000"},{"availabilityId":224806,"endDate":"2021-10-18T12:00:00+0000","recurrence":"DTSTART:20211018T110000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T11:00:00+0000"},{"availabilityId":224805,"endDate":"2021-10-18T11:00:00+0000","recurrence":"DTSTART:20211018T100000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T10:00:00+0000"},{"availabilityId":224804,"endDate":"2021-10-18T10:00:00+0000","recurrence":"DTSTART:20211018T090000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T09:00:00+0000"},{"availabilityId":224802,"endDate":"2021-10-18T09:00:00+0000","recurrence":"DTSTART:20211018T080000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T08:00:00+0000"},{"availabilityId":224800,"endDate":"2021-10-18T08:00:00+0000","recurrence":"DTSTART:20211018T070000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T07:00:00+0000"},{"availabilityId":224801,"endDate":"2021-10-18T07:00:00+0000","recurrence":"DTSTART:20211018T060000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T06:00:00+0000"},{"availabilityId":211303,"endDate":"2021-10-15T17:00:00+0000","recurrence":null,"startDate":"2021-10-15T16:00:00+0000"},{"availabilityId":211301,"endDate":"2021-10-15T16:00:00+0000","recurrence":null,"startDate":"2021-10-15T15:00:00+0000"},{"availabilityId":211299,"endDate":"2021-10-15T15:00:00+0000","recurrence":null,"startDate":"2021-10-15T14:00:00+0000"},{"availabilityId":211297,"endDate":"2021-10-15T14:00:00+0000","recurrence":null,"startDate":"2021-10-15T13:00:00+0000"},{"availabilityId":211294,"endDate":"2021-10-15T13:00:00+0000","recurrence":null,"startDate":"2021-10-15T12:00:00+0000"},{"availabilityId":211293,"endDate":"2021-10-15T12:00:00+0000","recurrence":null,"startDate":"2021-10-15T11:00:00+0000"},{"availabilityId":211291,"endDate":"2021-10-15T11:00:00+0000","recurrence":null,"startDate":"2021-10-15T10:00:00+0000"},{"availabilityId":211289,"endDate":"2021-10-15T10:00:00+0000","recurrence":null,"startDate":"2021-10-15T09:00:00+0000"},{"availabilityId":211286,"endDate":"2021-10-15T09:00:00+0000","recurrence":null,"startDate":"2021-10-15T08:00:00+0000"},{"availabilityId":211285,"endDate":"2021-10-15T08:00:00+0000","recurrence":null,"startDate":"2021-10-15T07:00:00+0000"},{"availabilityId":211283,"endDate":"2021-10-15T07:00:00+0000","recurrence":null,"startDate":"2021-10-15T06:00:00+0000"},{"availabilityId":211302,"endDate":"2021-10-14T17:00:00+0000","recurrence":null,"startDate":"2021-10-14T16:00:00+0000"},{"availabilityId":211300,"endDate":"2021-10-14T16:00:00+0000","recurrence":null,"startDate":"2021-10-14T15:00:00+0000"},{"availabilityId":211298,"endDate":"2021-10-14T15:00:00+0000","recurrence":null,"startDate":"2021-10-14T14:00:00+0000"},{"availabilityId":211296,"endDate":"2021-10-14T14:00:00+0000","recurrence":null,"startDate":"2021-10-14T13:00:00+0000"},{"availabilityId":211295,"endDate":"2021-10-14T13:00:00+0000","recurrence":null,"startDate":"2021-10-14T12:00:00+0000"},{"availabilityId":211292,"endDate":"2021-10-14T12:00:00+0000","recurrence":null,"startDate":"2021-10-14T11:00:00+0000"},{"availabilityId":211290,"endDate":"2021-10-14T11:00:00+0000","recurrence":null,"startDate":"2021-10-14T10:00:00+0000"},{"availabilityId":211288,"endDate":"2021-10-14T10:00:00+0000","recurrence":null,"startDate":"2021-10-14T09:00:00+0000"},{"availabilityId":211287,"endDate":"2021-10-14T09:00:00+0000","recurrence":null,"startDate":"2021-10-14T08:00:00+0000"},{"availabilityId":211284,"endDate":"2021-10-14T08:00:00+0000","recurrence":null,"startDate":"2021-10-14T07:00:00+0000"},{"availabilityId":211282,"endDate":"2021-10-14T07:00:00+0000","recurrence":"DTSTART:20211014T060000Z\nRRULE:UNTIL=20211014T220000Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-14T06:00:00+0000"},{"availabilityId":211281,"endDate":"2021-09-13T17:00:00+0000","recurrence":"DTSTART:20210913T160000Z\nRRULE:UNTIL=20211013T160034Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T16:00:00+0000"},{"availabilityId":211280,"endDate":"2021-09-13T16:00:00+0000","recurrence":"DTSTART:20210913T150000Z\nRRULE:UNTIL=20211013T150027Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T15:00:00+0000"},{"availabilityId":211279,"endDate":"2021-09-13T15:00:00+0000","recurrence":"DTSTART:20210913T140000Z\nRRULE:UNTIL=20211013T140022Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T14:00:00+0000"},{"availabilityId":211278,"endDate":"2021-09-13T14:00:00+0000","recurrence":"DTSTART:20210913T130000Z\nRRULE:UNTIL=20211013T130016Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T13:00:00+0000"},{"availabilityId":211277,"endDate":"2021-09-13T13:00:00+0000","recurrence":"DTSTART:20210913T120000Z\nRRULE:UNTIL=20211013T120009Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T12:00:00+0000"},{"availabilityId":211276,"endDate":"2021-09-13T12:00:00+0000","recurrence":"DTSTART:20210913T110000Z\nRRULE:UNTIL=20211013T110003Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T11:00:00+0000"},{"availabilityId":211275,"endDate":"2021-09-13T11:00:00+0000","recurrence":"DTSTART:20210913T100000Z\nRRULE:UNTIL=20211013T100058Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T10:00:00+0000"},{"availabilityId":211274,"endDate":"2021-09-13T10:00:00+0000","recurrence":"DTSTART:20210913T090000Z\nRRULE:UNTIL=20211013T090051Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T09:00:00+0000"},{"availabilityId":211273,"endDate":"2021-09-13T09:00:00+0000","recurrence":"DTSTART:20210913T080000Z\nRRULE:UNTIL=20211013T080045Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T08:00:00+0000"},{"availabilityId":211272,"endDate":"2021-09-13T08:00:00+0000","recurrence":"DTSTART:20210913T070000Z\nRRULE:UNTIL=20211013T070038Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T07:00:00+0000"},{"availabilityId":211271,"endDate":"2021-09-13T07:00:00+0000","recurrence":"DTSTART:20210913T060000Z\nRRULE:UNTIL=20211013T060025Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T06:00:00+0000"},{"availabilityId":211265,"endDate":"2021-09-10T15:00:00+0000","recurrence":null,"startDate":"2021-09-10T14:00:00+0000"},{"availabilityId":211266,"endDate":"2021-09-10T13:00:00+0000","recurrence":null,"startDate":"2021-09-10T12:00:00+0000"},{"availabilityId":211267,"endDate":"2021-09-10T09:00:00+0000","recurrence":null,"startDate":"2021-09-10T08:00:00+0000"},{"availabilityId":211251,"endDate":"2021-09-10T07:00:00+0000","recurrence":null,"startDate":"2021-09-10T06:00:00+0000"},{"availabilityId":211264,"endDate":"2021-09-09T17:00:00+0000","recurrence":null,"startDate":"2021-09-09T16:00:00+0000"},{"availabilityId":211263,"endDate":"2021-09-09T16:00:00+0000","recurrence":null,"startDate":"2021-09-09T15:00:00+0000"},{"availabilityId":211262,"endDate":"2021-09-09T13:00:00+0000","recurrence":null,"startDate":"2021-09-09T12:00:00+0000"},{"availabilityId":211261,"endDate":"2021-09-09T12:00:00+0000","recurrence":null,"startDate":"2021-09-09T11:00:00+0000"},{"availabilityId":211260,"endDate":"2021-09-09T11:00:00+0000","recurrence":null,"startDate":"2021-09-09T10:00:00+0000"},{"availabilityId":211268,"endDate":"2021-09-09T08:00:00+0000","recurrence":null,"startDate":"2021-09-09T07:00:00+0000"},{"availabilityId":211250,"endDate":"2021-09-09T07:00:00+0000","recurrence":null,"startDate":"2021-09-09T06:00:00+0000"},{"availabilityId":211259,"endDate":"2021-09-08T17:00:00+0000","recurrence":null,"startDate":"2021-09-08T16:00:00+0000"},{"availabilityId":211258,"endDate":"2021-09-08T16:00:00+0000","recurrence":null,"startDate":"2021-09-08T15:00:00+0000"},{"availabilityId":211257,"endDate":"2021-09-08T15:00:00+0000","recurrence":null,"startDate":"2021-09-08T14:00:00+0000"},{"availabilityId":211256,"endDate":"2021-09-08T14:00:00+0000","recurrence":null,"startDate":"2021-09-08T13:00:00+0000"},{"availabilityId":211255,"endDate":"2021-09-08T13:00:00+0000","recurrence":null,"startDate":"2021-09-08T12:00:00+0000"},{"availabilityId":211254,"endDate":"2021-09-08T12:00:00+0000","recurrence":null,"startDate":"2021-09-08T11:00:00+0000"},{"availabilityId":211253,"endDate":"2021-09-08T11:00:00+0000","recurrence":null,"startDate":"2021-09-08T10:00:00+0000"},{"availabilityId":211270,"endDate":"2021-09-08T10:00:00+0000","recurrence":null,"startDate":"2021-09-08T09:00:00+0000"},{"availabilityId":211269,"endDate":"2021-09-08T09:00:00+0000","recurrence":null,"startDate":"2021-09-08T08:00:00+0000"},{"availabilityId":211252,"endDate":"2021-09-08T08:00:00+0000","recurrence":null,"startDate":"2021-09-08T07:00:00+0000"},{"availabilityId":211249,"endDate":"2021-09-08T07:00:00+0000","recurrence":null,"startDate":"2021-09-08T06:00:00+0000"},{"availabilityId":211248,"endDate":"2021-09-07T17:00:00+0000","recurrence":null,"startDate":"2021-09-07T16:00:00+0000"},{"availabilityId":211247,"endDate":"2021-09-07T16:00:00+0000","recurrence":null,"startDate":"2021-09-07T15:00:00+0000"},{"availabilityId":211246,"endDate":"2021-09-07T15:00:00+0000","recurrence":null,"startDate":"2021-09-07T14:00:00+0000"},{"availabilityId":211245,"endDate":"2021-09-07T12:00:00+0000","recurrence":null,"startDate":"2021-09-07T11:00:00+0000"},{"availabilityId":211244,"endDate":"2021-09-07T11:00:00+0000","recurrence":null,"startDate":"2021-09-07T10:00:00+0000"},{"availabilityId":211243,"endDate":"2021-09-07T10:00:00+0000","recurrence":null,"startDate":"2021-09-07T09:00:00+0000"},{"availabilityId":211242,"endDate":"2021-09-07T09:00:00+0000","recurrence":null,"startDate":"2021-09-07T08:00:00+0000"},{"availabilityId":211241,"endDate":"2021-09-07T07:00:00+0000","recurrence":null,"startDate":"2021-09-07T06:00:00+0000"},{"availabilityId":211240,"endDate":"2021-09-06T17:00:00+0000","recurrence":null,"startDate":"2021-09-06T16:00:00+0000"},{"availabilityId":211239,"endDate":"2021-09-06T16:00:00+0000","recurrence":null,"startDate":"2021-09-06T15:00:00+0000"},{"availabilityId":211238,"endDate":"2021-09-06T15:00:00+0000","recurrence":null,"startDate":"2021-09-06T14:00:00+0000"},{"availabilityId":211237,"endDate":"2021-09-06T14:00:00+0000","recurrence":null,"startDate":"2021-09-06T13:00:00+0000"},{"availabilityId":211236,"endDate":"2021-09-06T13:00:00+0000","recurrence":null,"startDate":"2021-09-06T12:00:00+0000"},{"availabilityId":211235,"endDate":"2021-09-06T12:00:00+0000","recurrence":null,"startDate":"2021-09-06T11:00:00+0000"},{"availabilityId":211234,"endDate":"2021-09-06T11:00:00+0000","recurrence":null,"startDate":"2021-09-06T10:00:00+0000"},{"availabilityId":211233,"endDate":"2021-09-06T10:00:00+0000","recurrence":null,"startDate":"2021-09-06T09:00:00+0000"},{"availabilityId":211232,"endDate":"2021-09-06T09:00:00+0000","recurrence":null,"startDate":"2021-09-06T08:00:00+0000"},{"availabilityId":211231,"endDate":"2021-09-06T08:00:00+0000","recurrence":null,"startDate":"2021-09-06T07:00:00+0000"},{"availabilityId":211230,"endDate":"2021-09-06T07:00:00+0000","recurrence":null,"startDate":"2021-09-06T06:00:00+0000"},{"availabilityId":208065,"endDate":"2021-09-03T15:00:00+0000","recurrence":null,"startDate":"2021-09-03T14:00:00+0000"},{"availabilityId":208026,"endDate":"2021-09-03T07:00:00+0000","recurrence":null,"startDate":"2021-09-03T06:00:00+0000"},{"availabilityId":208048,"endDate":"2021-09-02T18:00:00+0000","recurrence":null,"startDate":"2021-09-02T17:00:00+0000"},{"availabilityId":208047,"endDate":"2021-09-02T17:00:00+0000","recurrence":null,"startDate":"2021-09-02T16:00:00+0000"},{"availabilityId":208046,"endDate":"2021-09-02T16:00:00+0000","recurrence":null,"startDate":"2021-09-02T15:00:00+0000"},{"availabilityId":208064,"endDate":"2021-09-02T13:00:00+0000","recurrence":null,"startDate":"2021-09-02T12:00:00+0000"},{"availabilityId":208059,"endDate":"2021-09-02T12:00:00+0000","recurrence":null,"startDate":"2021-09-02T11:00:00+0000"},{"availabilityId":208052,"endDate":"2021-09-02T11:00:00+0000","recurrence":null,"startDate":"2021-09-02T10:00:00+0000"},{"availabilityId":208053,"endDate":"2021-09-02T09:00:00+0000","recurrence":null,"startDate":"2021-09-02T08:00:00+0000"},{"availabilityId":208028,"endDate":"2021-09-02T08:00:00+0000","recurrence":null,"startDate":"2021-09-02T07:00:00+0000"},{"availabilityId":208025,"endDate":"2021-09-02T07:00:00+0000","recurrence":null,"startDate":"2021-09-02T06:00:00+0000"},{"availabilityId":208043,"endDate":"2021-09-01T18:00:00+0000","recurrence":null,"startDate":"2021-09-01T17:00:00+0000"},{"availabilityId":208044,"endDate":"2021-09-01T17:00:00+0000","recurrence":null,"startDate":"2021-09-01T16:00:00+0000"},{"availabilityId":208045,"endDate":"2021-09-01T16:00:00+0000","recurrence":null,"startDate":"2021-09-01T15:00:00+0000"},{"availabilityId":208062,"endDate":"2021-09-01T15:00:00+0000","recurrence":null,"startDate":"2021-09-01T14:00:00+0000"},{"availabilityId":208061,"endDate":"2021-09-01T14:00:00+0000","recurrence":null,"startDate":"2021-09-01T13:00:00+0000"},{"availabilityId":208060,"endDate":"2021-09-01T13:00:00+0000","recurrence":null,"startDate":"2021-09-01T12:00:00+0000"},{"availabilityId":208058,"endDate":"2021-09-01T12:00:00+0000","recurrence":null,"startDate":"2021-09-01T11:00:00+0000"},{"availabilityId":208051,"endDate":"2021-09-01T11:00:00+0000","recurrence":null,"startDate":"2021-09-01T10:00:00+0000"},{"availabilityId":208054,"endDate":"2021-09-01T10:00:00+0000","recurrence":null,"startDate":"2021-09-01T09:00:00+0000"},{"availabilityId":208055,"endDate":"2021-09-01T09:00:00+0000","recurrence":null,"startDate":"2021-09-01T08:00:00+0000"},{"availabilityId":208027,"endDate":"2021-09-01T08:00:00+0000","recurrence":null,"startDate":"2021-09-01T07:00:00+0000"},{"availabilityId":208024,"endDate":"2021-09-01T07:00:00+0000","recurrence":null,"startDate":"2021-09-01T06:00:00+0000"},{"availabilityId":208040,"endDate":"2021-08-31T18:00:00+0000","recurrence":null,"startDate":"2021-08-31T17:00:00+0000"},{"availabilityId":208041,"endDate":"2021-08-31T17:00:00+0000","recurrence":null,"startDate":"2021-08-31T16:00:00+0000"},{"availabilityId":208042,"endDate":"2021-08-31T16:00:00+0000","recurrence":null,"startDate":"2021-08-31T15:00:00+0000"},{"availabilityId":208063,"endDate":"2021-08-31T15:00:00+0000","recurrence":null,"startDate":"2021-08-31T14:00:00+0000"},{"availabilityId":208057,"endDate":"2021-08-31T12:00:00+0000","recurrence":null,"startDate":"2021-08-31T11:00:00+0000"},{"availabilityId":208050,"endDate":"2021-08-31T11:00:00+0000","recurrence":null,"startDate":"2021-08-31T10:00:00+0000"},{"availabilityId":208049,"endDate":"2021-08-31T10:00:00+0000","recurrence":null,"startDate":"2021-08-31T09:00:00+0000"},{"availabilityId":208056,"endDate":"2021-08-31T09:00:00+0000","recurrence":null,"startDate":"2021-08-31T08:00:00+0000"},{"availabilityId":208023,"endDate":"2021-08-31T07:00:00+0000","recurrence":null,"startDate":"2021-08-31T06:00:00+0000"},{"availabilityId":208039,"endDate":"2021-08-30T18:00:00+0000","recurrence":null,"startDate":"2021-08-30T17:00:00+0000"},{"availabilityId":208038,"endDate":"2021-08-30T17:00:00+0000","recurrence":null,"startDate":"2021-08-30T16:00:00+0000"},{"availabilityId":208037,"endDate":"2021-08-30T16:00:00+0000","recurrence":null,"startDate":"2021-08-30T15:00:00+0000"},{"availabilityId":208036,"endDate":"2021-08-30T15:00:00+0000","recurrence":null,"startDate":"2021-08-30T14:00:00+0000"},{"availabilityId":208035,"endDate":"2021-08-30T14:00:00+0000","recurrence":null,"startDate":"2021-08-30T13:00:00+0000"},{"availabilityId":208034,"endDate":"2021-08-30T13:00:00+0000","recurrence":null,"startDate":"2021-08-30T12:00:00+0000"},{"availabilityId":208033,"endDate":"2021-08-30T12:00:00+0000","recurrence":null,"startDate":"2021-08-30T11:00:00+0000"},{"availabilityId":208032,"endDate":"2021-08-30T11:00:00+0000","recurrence":null,"startDate":"2021-08-30T10:00:00+0000"},{"availabilityId":208031,"endDate":"2021-08-30T10:00:00+0000","recurrence":null,"startDate":"2021-08-30T09:00:00+0000"},{"availabilityId":208030,"endDate":"2021-08-30T09:00:00+0000","recurrence":null,"startDate":"2021-08-30T08:00:00+0000"},{"availabilityId":208029,"endDate":"2021-08-30T08:00:00+0000","recurrence":null,"startDate":"2021-08-30T07:00:00+0000"},{"availabilityId":208022,"endDate":"2021-08-30T07:00:00+0000","recurrence":null,"startDate":"2021-08-30T06:00:00+0000"},{"availabilityId":208014,"endDate":"2021-08-27T18:00:00+0000","recurrence":null,"startDate":"2021-08-27T17:00:00+0000"},{"availabilityId":208013,"endDate":"2021-08-27T15:00:00+0000","recurrence":null,"startDate":"2021-08-27T14:00:00+0000"},{"availabilityId":208019,"endDate":"2021-08-27T09:00:00+0000","recurrence":null,"startDate":"2021-08-27T08:00:00+0000"},{"availabilityId":208003,"endDate":"2021-08-27T07:00:00+0000","recurrence":null,"startDate":"2021-08-27T06:00:00+0000"},{"availabilityId":208011,"endDate":"2021-08-26T18:00:00+0000","recurrence":null,"startDate":"2021-08-26T17:00:00+0000"},{"availabilityId":208012,"endDate":"2021-08-26T17:00:00+0000","recurrence":null,"startDate":"2021-08-26T16:00:00+0000"},{"availabilityId":208015,"endDate":"2021-08-26T16:00:00+0000","recurrence":null,"startDate":"2021-08-26T15:00:00+0000"},{"availabilityId":208016,"endDate":"2021-08-26T11:00:00+0000","recurrence":null,"startDate":"2021-08-26T10:00:00+0000"},{"availabilityId":208017,"endDate":"2021-08-26T09:00:00+0000","recurrence":null,"startDate":"2021-08-26T08:00:00+0000"},{"availabilityId":208002,"endDate":"2021-08-26T08:00:00+0000","recurrence":null,"startDate":"2021-08-26T07:00:00+0000"},{"availabilityId":208000,"endDate":"2021-08-26T07:00:00+0000","recurrence":null,"startDate":"2021-08-26T06:00:00+0000"}]
	 *
	 * Suppression
	 *  https://api.openclassrooms.com/availabilities/242538
	 *  delete https://api.openclassrooms.com/availabilities/242538
	 *  https://api.openclassrooms.com/users/7688561/availabilities
	 *  get https://api.openclassrooms.com/users/7688561/availabilities
	 *     réponse [{"availabilityId":224812,"endDate":"2021-10-18T18:00:00+0000","recurrence":"DTSTART:20211018T170000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T17:00:00+0000"},{"availabilityId":224811,"endDate":"2021-10-18T17:00:00+0000","recurrence":"DTSTART:20211018T160000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T16:00:00+0000"},{"availabilityId":224810,"endDate":"2021-10-18T16:00:00+0000","recurrence":"DTSTART:20211018T150000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T15:00:00+0000"},{"availabilityId":224809,"endDate":"2021-10-18T15:00:00+0000","recurrence":"DTSTART:20211018T140000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T14:00:00+0000"},{"availabilityId":224808,"endDate":"2021-10-18T14:00:00+0000","recurrence":"DTSTART:20211018T130000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T13:00:00+0000"},{"availabilityId":224807,"endDate":"2021-10-18T13:00:00+0000","recurrence":"DTSTART:20211018T120000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T12:00:00+0000"},{"availabilityId":224806,"endDate":"2021-10-18T12:00:00+0000","recurrence":"DTSTART:20211018T110000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T11:00:00+0000"},{"availabilityId":224805,"endDate":"2021-10-18T11:00:00+0000","recurrence":"DTSTART:20211018T100000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T10:00:00+0000"},{"availabilityId":224804,"endDate":"2021-10-18T10:00:00+0000","recurrence":"DTSTART:20211018T090000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T09:00:00+0000"},{"availabilityId":224802,"endDate":"2021-10-18T09:00:00+0000","recurrence":"DTSTART:20211018T080000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T08:00:00+0000"},{"availabilityId":224800,"endDate":"2021-10-18T08:00:00+0000","recurrence":"DTSTART:20211018T070000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T07:00:00+0000"},{"availabilityId":224801,"endDate":"2021-10-18T07:00:00+0000","recurrence":"DTSTART:20211018T060000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-18T06:00:00+0000"},{"availabilityId":211303,"endDate":"2021-10-15T17:00:00+0000","recurrence":null,"startDate":"2021-10-15T16:00:00+0000"},{"availabilityId":211301,"endDate":"2021-10-15T16:00:00+0000","recurrence":null,"startDate":"2021-10-15T15:00:00+0000"},{"availabilityId":211299,"endDate":"2021-10-15T15:00:00+0000","recurrence":null,"startDate":"2021-10-15T14:00:00+0000"},{"availabilityId":211297,"endDate":"2021-10-15T14:00:00+0000","recurrence":null,"startDate":"2021-10-15T13:00:00+0000"},{"availabilityId":211294,"endDate":"2021-10-15T13:00:00+0000","recurrence":null,"startDate":"2021-10-15T12:00:00+0000"},{"availabilityId":211293,"endDate":"2021-10-15T12:00:00+0000","recurrence":null,"startDate":"2021-10-15T11:00:00+0000"},{"availabilityId":211291,"endDate":"2021-10-15T11:00:00+0000","recurrence":null,"startDate":"2021-10-15T10:00:00+0000"},{"availabilityId":211289,"endDate":"2021-10-15T10:00:00+0000","recurrence":null,"startDate":"2021-10-15T09:00:00+0000"},{"availabilityId":211286,"endDate":"2021-10-15T09:00:00+0000","recurrence":null,"startDate":"2021-10-15T08:00:00+0000"},{"availabilityId":211285,"endDate":"2021-10-15T08:00:00+0000","recurrence":null,"startDate":"2021-10-15T07:00:00+0000"},{"availabilityId":211283,"endDate":"2021-10-15T07:00:00+0000","recurrence":null,"startDate":"2021-10-15T06:00:00+0000"},{"availabilityId":211302,"endDate":"2021-10-14T17:00:00+0000","recurrence":null,"startDate":"2021-10-14T16:00:00+0000"},{"availabilityId":211300,"endDate":"2021-10-14T16:00:00+0000","recurrence":null,"startDate":"2021-10-14T15:00:00+0000"},{"availabilityId":211298,"endDate":"2021-10-14T15:00:00+0000","recurrence":null,"startDate":"2021-10-14T14:00:00+0000"},{"availabilityId":211296,"endDate":"2021-10-14T14:00:00+0000","recurrence":null,"startDate":"2021-10-14T13:00:00+0000"},{"availabilityId":211295,"endDate":"2021-10-14T13:00:00+0000","recurrence":null,"startDate":"2021-10-14T12:00:00+0000"},{"availabilityId":211292,"endDate":"2021-10-14T12:00:00+0000","recurrence":null,"startDate":"2021-10-14T11:00:00+0000"},{"availabilityId":211290,"endDate":"2021-10-14T11:00:00+0000","recurrence":null,"startDate":"2021-10-14T10:00:00+0000"},{"availabilityId":211288,"endDate":"2021-10-14T10:00:00+0000","recurrence":null,"startDate":"2021-10-14T09:00:00+0000"},{"availabilityId":211287,"endDate":"2021-10-14T09:00:00+0000","recurrence":null,"startDate":"2021-10-14T08:00:00+0000"},{"availabilityId":211284,"endDate":"2021-10-14T08:00:00+0000","recurrence":null,"startDate":"2021-10-14T07:00:00+0000"},{"availabilityId":211282,"endDate":"2021-10-14T07:00:00+0000","recurrence":"DTSTART:20211014T060000Z\nRRULE:UNTIL=20211014T220000Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-10-14T06:00:00+0000"},{"availabilityId":211281,"endDate":"2021-09-13T17:00:00+0000","recurrence":"DTSTART:20210913T160000Z\nRRULE:UNTIL=20211013T160034Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T16:00:00+0000"},{"availabilityId":211280,"endDate":"2021-09-13T16:00:00+0000","recurrence":"DTSTART:20210913T150000Z\nRRULE:UNTIL=20211013T150027Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T15:00:00+0000"},{"availabilityId":211279,"endDate":"2021-09-13T15:00:00+0000","recurrence":"DTSTART:20210913T140000Z\nRRULE:UNTIL=20211013T140022Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T14:00:00+0000"},{"availabilityId":211278,"endDate":"2021-09-13T14:00:00+0000","recurrence":"DTSTART:20210913T130000Z\nRRULE:UNTIL=20211013T130016Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T13:00:00+0000"},{"availabilityId":211277,"endDate":"2021-09-13T13:00:00+0000","recurrence":"DTSTART:20210913T120000Z\nRRULE:UNTIL=20211013T120009Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T12:00:00+0000"},{"availabilityId":211276,"endDate":"2021-09-13T12:00:00+0000","recurrence":"DTSTART:20210913T110000Z\nRRULE:UNTIL=20211013T110003Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T11:00:00+0000"},{"availabilityId":211275,"endDate":"2021-09-13T11:00:00+0000","recurrence":"DTSTART:20210913T100000Z\nRRULE:UNTIL=20211013T100058Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T10:00:00+0000"},{"availabilityId":211274,"endDate":"2021-09-13T10:00:00+0000","recurrence":"DTSTART:20210913T090000Z\nRRULE:UNTIL=20211013T090051Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T09:00:00+0000"},{"availabilityId":211273,"endDate":"2021-09-13T09:00:00+0000","recurrence":"DTSTART:20210913T080000Z\nRRULE:UNTIL=20211013T080045Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T08:00:00+0000"},{"availabilityId":211272,"endDate":"2021-09-13T08:00:00+0000","recurrence":"DTSTART:20210913T070000Z\nRRULE:UNTIL=20211013T070038Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T07:00:00+0000"},{"availabilityId":211271,"endDate":"2021-09-13T07:00:00+0000","recurrence":"DTSTART:20210913T060000Z\nRRULE:UNTIL=20211013T060025Z;FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR","startDate":"2021-09-13T06:00:00+0000"},{"availabilityId":211265,"endDate":"2021-09-10T15:00:00+0000","recurrence":null,"startDate":"2021-09-10T14:00:00+0000"},{"availabilityId":211266,"endDate":"2021-09-10T13:00:00+0000","recurrence":null,"startDate":"2021-09-10T12:00:00+0000"},{"availabilityId":211267,"endDate":"2021-09-10T09:00:00+0000","recurrence":null,"startDate":"2021-09-10T08:00:00+0000"},{"availabilityId":211251,"endDate":"2021-09-10T07:00:00+0000","recurrence":null,"startDate":"2021-09-10T06:00:00+0000"},{"availabilityId":211264,"endDate":"2021-09-09T17:00:00+0000","recurrence":null,"startDate":"2021-09-09T16:00:00+0000"},{"availabilityId":211263,"endDate":"2021-09-09T16:00:00+0000","recurrence":null,"startDate":"2021-09-09T15:00:00+0000"},{"availabilityId":211262,"endDate":"2021-09-09T13:00:00+0000","recurrence":null,"startDate":"2021-09-09T12:00:00+0000"},{"availabilityId":211261,"endDate":"2021-09-09T12:00:00+0000","recurrence":null,"startDate":"2021-09-09T11:00:00+0000"},{"availabilityId":211260,"endDate":"2021-09-09T11:00:00+0000","recurrence":null,"startDate":"2021-09-09T10:00:00+0000"},{"availabilityId":211268,"endDate":"2021-09-09T08:00:00+0000","recurrence":null,"startDate":"2021-09-09T07:00:00+0000"},{"availabilityId":211250,"endDate":"2021-09-09T07:00:00+0000","recurrence":null,"startDate":"2021-09-09T06:00:00+0000"},{"availabilityId":211259,"endDate":"2021-09-08T17:00:00+0000","recurrence":null,"startDate":"2021-09-08T16:00:00+0000"},{"availabilityId":211258,"endDate":"2021-09-08T16:00:00+0000","recurrence":null,"startDate":"2021-09-08T15:00:00+0000"},{"availabilityId":211257,"endDate":"2021-09-08T15:00:00+0000","recurrence":null,"startDate":"2021-09-08T14:00:00+0000"},{"availabilityId":211256,"endDate":"2021-09-08T14:00:00+0000","recurrence":null,"startDate":"2021-09-08T13:00:00+0000"},{"availabilityId":211255,"endDate":"2021-09-08T13:00:00+0000","recurrence":null,"startDate":"2021-09-08T12:00:00+0000"},{"availabilityId":211254,"endDate":"2021-09-08T12:00:00+0000","recurrence":null,"startDate":"2021-09-08T11:00:00+0000"},{"availabilityId":211253,"endDate":"2021-09-08T11:00:00+0000","recurrence":null,"startDate":"2021-09-08T10:00:00+0000"},{"availabilityId":211270,"endDate":"2021-09-08T10:00:00+0000","recurrence":null,"startDate":"2021-09-08T09:00:00+0000"},{"availabilityId":211269,"endDate":"2021-09-08T09:00:00+0000","recurrence":null,"startDate":"2021-09-08T08:00:00+0000"},{"availabilityId":211252,"endDate":"2021-09-08T08:00:00+0000","recurrence":null,"startDate":"2021-09-08T07:00:00+0000"},{"availabilityId":211249,"endDate":"2021-09-08T07:00:00+0000","recurrence":null,"startDate":"2021-09-08T06:00:00+0000"},{"availabilityId":211248,"endDate":"2021-09-07T17:00:00+0000","recurrence":null,"startDate":"2021-09-07T16:00:00+0000"},{"availabilityId":211247,"endDate":"2021-09-07T16:00:00+0000","recurrence":null,"startDate":"2021-09-07T15:00:00+0000"},{"availabilityId":211246,"endDate":"2021-09-07T15:00:00+0000","recurrence":null,"startDate":"2021-09-07T14:00:00+0000"},{"availabilityId":211245,"endDate":"2021-09-07T12:00:00+0000","recurrence":null,"startDate":"2021-09-07T11:00:00+0000"},{"availabilityId":211244,"endDate":"2021-09-07T11:00:00+0000","recurrence":null,"startDate":"2021-09-07T10:00:00+0000"},{"availabilityId":211243,"endDate":"2021-09-07T10:00:00+0000","recurrence":null,"startDate":"2021-09-07T09:00:00+0000"},{"availabilityId":211242,"endDate":"2021-09-07T09:00:00+0000","recurrence":null,"startDate":"2021-09-07T08:00:00+0000"},{"availabilityId":211241,"endDate":"2021-09-07T07:00:00+0000","recurrence":null,"startDate":"2021-09-07T06:00:00+0000"},{"availabilityId":211240,"endDate":"2021-09-06T17:00:00+0000","recurrence":null,"startDate":"2021-09-06T16:00:00+0000"},{"availabilityId":211239,"endDate":"2021-09-06T16:00:00+0000","recurrence":null,"startDate":"2021-09-06T15:00:00+0000"},{"availabilityId":211238,"endDate":"2021-09-06T15:00:00+0000","recurrence":null,"startDate":"2021-09-06T14:00:00+0000"},{"availabilityId":211237,"endDate":"2021-09-06T14:00:00+0000","recurrence":null,"startDate":"2021-09-06T13:00:00+0000"},{"availabilityId":211236,"endDate":"2021-09-06T13:00:00+0000","recurrence":null,"startDate":"2021-09-06T12:00:00+0000"},{"availabilityId":211235,"endDate":"2021-09-06T12:00:00+0000","recurrence":null,"startDate":"2021-09-06T11:00:00+0000"},{"availabilityId":211234,"endDate":"2021-09-06T11:00:00+0000","recurrence":null,"startDate":"2021-09-06T10:00:00+0000"},{"availabilityId":211233,"endDate":"2021-09-06T10:00:00+0000","recurrence":null,"startDate":"2021-09-06T09:00:00+0000"},{"availabilityId":211232,"endDate":"2021-09-06T09:00:00+0000","recurrence":null,"startDate":"2021-09-06T08:00:00+0000"},{"availabilityId":211231,"endDate":"2021-09-06T08:00:00+0000","recurrence":null,"startDate":"2021-09-06T07:00:00+0000"},{"availabilityId":211230,"endDate":"2021-09-06T07:00:00+0000","recurrence":null,"startDate":"2021-09-06T06:00:00+0000"},{"availabilityId":208065,"endDate":"2021-09-03T15:00:00+0000","recurrence":null,"startDate":"2021-09-03T14:00:00+0000"},{"availabilityId":208026,"endDate":"2021-09-03T07:00:00+0000","recurrence":null,"startDate":"2021-09-03T06:00:00+0000"},{"availabilityId":208048,"endDate":"2021-09-02T18:00:00+0000","recurrence":null,"startDate":"2021-09-02T17:00:00+0000"},{"availabilityId":208047,"endDate":"2021-09-02T17:00:00+0000","recurrence":null,"startDate":"2021-09-02T16:00:00+0000"},{"availabilityId":208046,"endDate":"2021-09-02T16:00:00+0000","recurrence":null,"startDate":"2021-09-02T15:00:00+0000"},{"availabilityId":208064,"endDate":"2021-09-02T13:00:00+0000","recurrence":null,"startDate":"2021-09-02T12:00:00+0000"},{"availabilityId":208059,"endDate":"2021-09-02T12:00:00+0000","recurrence":null,"startDate":"2021-09-02T11:00:00+0000"},{"availabilityId":208052,"endDate":"2021-09-02T11:00:00+0000","recurrence":null,"startDate":"2021-09-02T10:00:00+0000"},{"availabilityId":208053,"endDate":"2021-09-02T09:00:00+0000","recurrence":null,"startDate":"2021-09-02T08:00:00+0000"},{"availabilityId":208028,"endDate":"2021-09-02T08:00:00+0000","recurrence":null,"startDate":"2021-09-02T07:00:00+0000"},{"availabilityId":208025,"endDate":"2021-09-02T07:00:00+0000","recurrence":null,"startDate":"2021-09-02T06:00:00+0000"},{"availabilityId":208043,"endDate":"2021-09-01T18:00:00+0000","recurrence":null,"startDate":"2021-09-01T17:00:00+0000"},{"availabilityId":208044,"endDate":"2021-09-01T17:00:00+0000","recurrence":null,"startDate":"2021-09-01T16:00:00+0000"},{"availabilityId":208045,"endDate":"2021-09-01T16:00:00+0000","recurrence":null,"startDate":"2021-09-01T15:00:00+0000"},{"availabilityId":208062,"endDate":"2021-09-01T15:00:00+0000","recurrence":null,"startDate":"2021-09-01T14:00:00+0000"},{"availabilityId":208061,"endDate":"2021-09-01T14:00:00+0000","recurrence":null,"startDate":"2021-09-01T13:00:00+0000"},{"availabilityId":208060,"endDate":"2021-09-01T13:00:00+0000","recurrence":null,"startDate":"2021-09-01T12:00:00+0000"},{"availabilityId":208058,"endDate":"2021-09-01T12:00:00+0000","recurrence":null,"startDate":"2021-09-01T11:00:00+0000"},{"availabilityId":208051,"endDate":"2021-09-01T11:00:00+0000","recurrence":null,"startDate":"2021-09-01T10:00:00+0000"},{"availabilityId":208054,"endDate":"2021-09-01T10:00:00+0000","recurrence":null,"startDate":"2021-09-01T09:00:00+0000"},{"availabilityId":208055,"endDate":"2021-09-01T09:00:00+0000","recurrence":null,"startDate":"2021-09-01T08:00:00+0000"},{"availabilityId":208027,"endDate":"2021-09-01T08:00:00+0000","recurrence":null,"startDate":"2021-09-01T07:00:00+0000"},{"availabilityId":208024,"endDate":"2021-09-01T07:00:00+0000","recurrence":null,"startDate":"2021-09-01T06:00:00+0000"},{"availabilityId":208040,"endDate":"2021-08-31T18:00:00+0000","recurrence":null,"startDate":"2021-08-31T17:00:00+0000"},{"availabilityId":208041,"endDate":"2021-08-31T17:00:00+0000","recurrence":null,"startDate":"2021-08-31T16:00:00+0000"},{"availabilityId":208042,"endDate":"2021-08-31T16:00:00+0000","recurrence":null,"startDate":"2021-08-31T15:00:00+0000"},{"availabilityId":208063,"endDate":"2021-08-31T15:00:00+0000","recurrence":null,"startDate":"2021-08-31T14:00:00+0000"},{"availabilityId":208057,"endDate":"2021-08-31T12:00:00+0000","recurrence":null,"startDate":"2021-08-31T11:00:00+0000"},{"availabilityId":208050,"endDate":"2021-08-31T11:00:00+0000","recurrence":null,"startDate":"2021-08-31T10:00:00+0000"},{"availabilityId":208049,"endDate":"2021-08-31T10:00:00+0000","recurrence":null,"startDate":"2021-08-31T09:00:00+0000"},{"availabilityId":208056,"endDate":"2021-08-31T09:00:00+0000","recurrence":null,"startDate":"2021-08-31T08:00:00+0000"},{"availabilityId":208023,"endDate":"2021-08-31T07:00:00+0000","recurrence":null,"startDate":"2021-08-31T06:00:00+0000"},{"availabilityId":208039,"endDate":"2021-08-30T18:00:00+0000","recurrence":null,"startDate":"2021-08-30T17:00:00+0000"},{"availabilityId":208038,"endDate":"2021-08-30T17:00:00+0000","recurrence":null,"startDate":"2021-08-30T16:00:00+0000"},{"availabilityId":208037,"endDate":"2021-08-30T16:00:00+0000","recurrence":null,"startDate":"2021-08-30T15:00:00+0000"},{"availabilityId":208036,"endDate":"2021-08-30T15:00:00+0000","recurrence":null,"startDate":"2021-08-30T14:00:00+0000"},{"availabilityId":208035,"endDate":"2021-08-30T14:00:00+0000","recurrence":null,"startDate":"2021-08-30T13:00:00+0000"},{"availabilityId":208034,"endDate":"2021-08-30T13:00:00+0000","recurrence":null,"startDate":"2021-08-30T12:00:00+0000"},{"availabilityId":208033,"endDate":"2021-08-30T12:00:00+0000","recurrence":null,"startDate":"2021-08-30T11:00:00+0000"},{"availabilityId":208032,"endDate":"2021-08-30T11:00:00+0000","recurrence":null,"startDate":"2021-08-30T10:00:00+0000"},{"availabilityId":208031,"endDate":"2021-08-30T10:00:00+0000","recurrence":null,"startDate":"2021-08-30T09:00:00+0000"},{"availabilityId":208030,"endDate":"2021-08-30T09:00:00+0000","recurrence":null,"startDate":"2021-08-30T08:00:00+0000"},{"availabilityId":208029,"endDate":"2021-08-30T08:00:00+0000","recurrence":null,"startDate":"2021-08-30T07:00:00+0000"},{"availabilityId":208022,"endDate":"2021-08-30T07:00:00+0000","recurrence":null,"startDate":"2021-08-30T06:00:00+0000"},{"availabilityId":208014,"endDate":"2021-08-27T18:00:00+0000","recurrence":null,"startDate":"2021-08-27T17:00:00+0000"},{"availabilityId":208013,"endDate":"2021-08-27T15:00:00+0000","recurrence":null,"startDate":"2021-08-27T14:00:00+0000"},{"availabilityId":208019,"endDate":"2021-08-27T09:00:00+0000","recurrence":null,"startDate":"2021-08-27T08:00:00+0000"},{"availabilityId":208003,"endDate":"2021-08-27T07:00:00+0000","recurrence":null,"startDate":"2021-08-27T06:00:00+0000"},{"availabilityId":208011,"endDate":"2021-08-26T18:00:00+0000","recurrence":null,"startDate":"2021-08-26T17:00:00+0000"},{"availabilityId":208012,"endDate":"2021-08-26T17:00:00+0000","recurrence":null,"startDate":"2021-08-26T16:00:00+0000"},{"availabilityId":208015,"endDate":"2021-08-26T16:00:00+0000","recurrence":null,"startDate":"2021-08-26T15:00:00+0000"},{"availabilityId":208016,"endDate":"2021-08-26T11:00:00+0000","recurrence":null,"startDate":"2021-08-26T10:00:00+0000"},{"availabilityId":208017,"endDate":"2021-08-26T09:00:00+0000","recurrence":null,"startDate":"2021-08-26T08:00:00+0000"},{"availabilityId":208002,"endDate":"2021-08-26T08:00:00+0000","recurrence":null,"startDate":"2021-08-26T07:00:00+0000"},{"availabilityId":208000,"endDate":"2021-08-26T07:00:00+0000","recurrence":null,"startDate":"2021-08-26T06:00:00+0000"}]
	 */

	/*
	 * https://api.openclassrooms.com/me 										-> détail me concernant (je suppose celui qui a obtenu le bail)
	 * https://api.openclassrooms.com/users/8740532/supports?type=tutoring 		-> renvoie une 403
	 * https://api.openclassrooms.com/users/8740532   							-> détail d'un utilisateur
	 * https://api.openclassrooms.com/users/8740532/followed-path
	 * 		exemple : "{\"category\":{\"color\":\"#00838F\",\"id\":18,\"name\":\"D\\u00e9veloppement\"},\"certifications\":[{\"id\":69,\"authority\":\"CNCP\",\"title\":\"Computer Engineering Expert\",\"type\":\"RNCP\",\"level\":\"Dipl\\u00f4me niveau 7 (Bac+5)\",\"prerequisiteCertificate\":{\"level\":\"2\",\"field\":\"\"},\"europeanLevel\":7,\"frenchLevel\":\"I\"}],\"description\":\"Devenez un expert dans le d\\u00e9veloppement logiciel en concevant des solutions complexes.\",\"duration\":\"P15M\",\"format\":\"path\",\"id\":190,\"illustration\":\"https:\\/\\/static.oc-static.com\\/prod\\/images\\/paths\\/illustrations\\/190\\/15677807440774_15675903228907_DEVELOPMENT_software_architecht.png\",\"language\":\"fr\",\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/paths\\/190-architecte-logiciel\",\"openedAt\":\"2019-09-24T14:00:00+0200\",\"projectsDuration\":\"PT1100H\",\"releaseSeason\":null,\"releaseYear\":null,\"shortDescription\":\"Devenez un expert dans le d\\u00e9veloppement logiciel en concevant des solutions complexes.\",\"status\":\"archived\",\"title\":\"Architecte logiciel\",\"longDescription\":null,\"projects\":[{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/entrez-dans-votre-formation-darchitecte-logiciel\\/assignment\",\"createdAt\":\"2019-07-22T17:21:41+0200\",\"duration\":\"PT20H\",\"evaluatorType\":\"mentor\",\"id\":701,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"D\\u00e9couvrez le m\\u00e9tier d'architecte logiciel, cr\\u00e9ez l'offre d'emploi de vos r\\u00eaves et mettez en place un plan d'action pour r\\u00e9ussir votre formation.\",\"status\":\"active\",\"title\":\"Entrez dans votre formation d'architecte logiciel\",\"updatedAt\":\"2020-12-09T15:06:40+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/entrez-dans-votre-formation-darchitecte-logiciel\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2020-06-11T10:38:45+0200\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/definissez-le-perimetre-de-votre-projet-en-accord-avec-votre-client\\/assignment\",\"createdAt\":\"2019-07-22T17:53:27+0200\",\"duration\":\"PT60H\",\"evaluatorType\":\"validator\",\"id\":702,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Votre client veut moderniser ses syst\\u00e8mes pour optimiser ses co\\u00fbts. Votre mission est de synth\\u00e9tiser ses besoins dans un brief et de lui fournir une solution technique rationalis\\u00e9e.\",\"status\":\"active\",\"title\":\"D\\u00e9finissez le p\\u00e9rim\\u00e8tre de votre projet en accord avec votre client\",\"updatedAt\":\"2021-01-06T15:45:13+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/definissez-le-perimetre-de-votre-projet-en-accord-avec-votre-client\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2020-07-09T15:42:06+0200\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/faites-laudit-dune-architecture-existante-et-proposez-une-nouvelle-solution\\/assignment\",\"createdAt\":\"2019-07-22T17:53:45+0200\",\"duration\":\"PT100H\",\"evaluatorType\":\"validator\",\"id\":703,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Votre entreprise a besoin de votre aide pour rendre sa solution plus performante. Vous devez \\u00e9valuer l'architecture existante et pr\\u00e9senter votre solution aux diff\\u00e9rentes parties prenantes.\",\"status\":\"active\",\"title\":\"Faites l'audit d'une architecture existante et proposez une nouvelle solution\",\"updatedAt\":\"2020-10-21T09:12:28+0200\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/faites-laudit-dune-architecture-existante-et-proposez-une-nouvelle-solution\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2020-09-09T10:46:59+0200\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/cherchez-les-solutions-pour-optimiser-la-mise-a-niveau-dune-architecture\\/assignment\",\"createdAt\":\"2019-07-22T17:54:01+0200\",\"duration\":\"PT80H\",\"evaluatorType\":\"validator\",\"id\":704,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Votre client a besoin d'ajouter une nouvelle fonctionnalit\\u00e9 \\u00e0 son architecture. Il a cependant de nombreuses contraintes... Votre travail consiste \\u00e0 trouver la meilleure solution !\",\"status\":\"active\",\"title\":\"Cherchez les solutions pour optimiser la mise \\u00e0 niveau d'une architecture\",\"updatedAt\":\"2020-05-28T10:07:22+0200\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/cherchez-les-solutions-pour-optimiser-la-mise-a-niveau-dune-architecture\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2021-01-15T23:02:58+0100\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/concevez-une-nouvelle-architecture-afin-de-soutenir-le-developpement-de-votre-entreprise\\/assignment\",\"createdAt\":\"2019-07-22T17:54:14+0200\",\"duration\":\"PT80H\",\"evaluatorType\":\"validator\",\"id\":705,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Vous travaillez pour une startup en forte croissance, dont l'architecture d'application a besoin d'\\u00eatre repens\\u00e9e. \\u00c0 vous de d\\u00e9velopper un syst\\u00e8me maintenable et qui fonctionne avec la nouvelle base clients.\",\"status\":\"active\",\"title\":\"Concevez une nouvelle architecture afin de soutenir le d\\u00e9veloppement de votre entreprise\",\"updatedAt\":\"2020-03-09T14:04:28+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/concevez-une-nouvelle-architecture-afin-de-soutenir-le-developpement-de-votre-entreprise\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2021-01-10T09:53:01+0100\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/creez-une-application-de-communication-multiplateforme\\/assignment\",\"createdAt\":\"2019-07-22T17:54:28+0200\",\"duration\":\"PT70H\",\"evaluatorType\":\"validator\",\"id\":706,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Vous \\u00eates consultant pour une grande entreprise qui a besoin de rationaliser le processus de communication entre ses diff\\u00e9rents d\\u00e9partements, tout en g\\u00e9rant sa dette technique.\",\"status\":\"active\",\"title\":\"Cr\\u00e9ez une application de communication multiplateforme\",\"updatedAt\":\"2020-03-09T14:04:56+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/creez-une-application-de-communication-multiplateforme\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2021-03-09T16:10:06+0100\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/realisez-un-plan-dimplementation-pour-assurer-le-bon-deroulement-de-votre-projet-darchitecture\\/assignment\",\"createdAt\":\"2019-07-22T17:54:41+0200\",\"duration\":\"PT100H\",\"evaluatorType\":\"validator\",\"id\":707,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Vous \\u00eates charg\\u00e9 d'impl\\u00e9menter la solution architecturale d'une grande entreprise industrielle. Impressionnez votre CTO en d\\u00e9finissant la roadmap id\\u00e9ale, tout en assurant les performances et la s\\u00e9curit\\u00e9.\",\"status\":\"active\",\"title\":\"R\\u00e9alisez un plan d'impl\\u00e9mentation pour assurer le bon d\\u00e9roulement de votre projet d'architecture\",\"updatedAt\":\"2021-01-04T09:57:50+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/realisez-un-plan-dimplementation-pour-assurer-le-bon-deroulement-de-votre-projet-darchitecture\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2021-04-19T23:30:38+0200\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/utilisez-un-plan-de-test-pour-assurer-le-succes-de-votre-architecture\\/assignment\",\"createdAt\":\"2019-07-22T17:54:55+0200\",\"duration\":\"PT120H\",\"evaluatorType\":\"validator\",\"id\":708,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Vous reprenez un important projet d'architecture, mais vous r\\u00e9alisez que la conception logique et physique est incompl\\u00e8te. Vous reprenez cela en main et d\\u00e9finissez un plan de test.\",\"status\":\"active\",\"title\":\"Utilisez un plan de test pour assurer le succ\\u00e8s de votre architecture\",\"updatedAt\":\"2021-03-08T15:11:09+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/utilisez-un-plan-de-test-pour-assurer-le-succes-de-votre-architecture\\/assignment\",\"completion\":1,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"passed\",\"reviewedAt\":\"2021-05-18T17:33:13+0200\"},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/gerez-les-risques-grace-a-un-cadre-de-gouvernance-darchitecture\\/assignment\",\"createdAt\":\"2019-07-22T17:55:12+0200\",\"duration\":\"PT100H\",\"evaluatorType\":\"validator\",\"id\":709,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Appliquez vos architectures \\u00e0 un syst\\u00e8me existant, et d\\u00e9finissez comment g\\u00e9rer la migration en utilisant une strat\\u00e9gie de mitigation des risques.\",\"status\":\"active\",\"title\":\"G\\u00e9rez les risques gr\\u00e2ce \\u00e0 un cadre de gouvernance d'architecture\",\"updatedAt\":\"2020-03-26T17:36:26+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/gerez-les-risques-grace-a-un-cadre-de-gouvernance-darchitecture\\/assignment\",\"completion\":null,\"followedStatus\":\"followed\",\"learningActivityStatus\":\"in progress\",\"reviewedAt\":null},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/coordonnez-une-equipe-de-developpement-pour-assurer-une-livraison-efficace\\/assignment\",\"createdAt\":\"2019-07-22T17:55:27+0200\",\"duration\":\"PT70H\",\"evaluatorType\":\"validator\",\"id\":710,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Travaillez avec votre \\u00e9quipe de d\\u00e9veloppement pour vous assurer que votre architecture est d\\u00e9livr\\u00e9e en accord avec votre roadmap.\",\"status\":\"active\",\"title\":\"Coordonnez une \\u00e9quipe de d\\u00e9veloppement pour assurer une livraison efficace\",\"updatedAt\":\"2020-03-26T17:36:51+0100\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/coordonnez-une-equipe-de-developpement-pour-assurer-une-livraison-efficace\\/assignment\",\"completion\":null,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"not started\",\"reviewedAt\":null},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/faites-adherer-les-parties-prenantes-avec-un-poc\\/assignment\",\"createdAt\":\"2019-07-22T17:55:39+0200\",\"duration\":\"PT150H\",\"evaluatorType\":\"validator\",\"id\":711,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Vous \\u00eates consultant et devez convaincre un client d'un domaine sensible que votre solution est fiable et s\\u00e9curis\\u00e9e. Il est temps de d\\u00e9velopper un Proof of Concept (POC) et de vous assurer qu'il sera pr\\u00eat lorsque l'\\u00e9quipe de d\\u00e9veloppement prendra la main.\",\"status\":\"active\",\"title\":\"Faites adh\\u00e9rer les parties prenantes avec un POC\",\"updatedAt\":\"2020-10-15T16:44:01+0200\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/faites-adherer-les-parties-prenantes-avec-un-poc\\/assignment\",\"completion\":null,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"not started\",\"reviewedAt\":null},{\"OpenClassroomsUrl\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/gerez-les-changements-des-exigences-dans-un-projet-darchitecture-logicielle\\/assignment\",\"createdAt\":\"2019-07-22T17:55:50+0200\",\"duration\":\"PT150H\",\"evaluatorType\":\"validator\",\"id\":712,\"illustration\":null,\"isActive\":true,\"isAvailable\":true,\"isStudentDeliverable\":true,\"language\":\"fr\",\"lifecycleStatus\":\"active\",\"requiredPresentation\":true,\"shortDescription\":\"Vous \\u00eates freelance et venez de livrer un projet d'architecture logicielle. Mais une petite erreur semble cr\\u00e9er de gros probl\\u00e8mes... Faites le n\\u00e9cessaire pour que votre client soit satisfait.\",\"status\":\"active\",\"title\":\"G\\u00e9rez les changements des exigences dans un projet d'architecture logicielle\",\"updatedAt\":\"2021-05-17T16:17:55+0200\",\"url\":\"https:\\/\\/openclassrooms.com\\/fr\\/projects\\/gerez-les-changements-des-exigences-dans-un-projet-darchitecture-logicielle\\/assignment\",\"completion\":null,\"followedStatus\":\"not-followed\",\"learningActivityStatus\":\"not started\",\"reviewedAt\":null}],\"fundingMechanisms\":null,\"completion\":{\"actual\":0.59,\"expected\":0.72,\"status\":\"late\"},\"userCanReEnroll\":false,\"userIsFollowingLearningPath\":true,\"userLearningInformation\":{\"completedAt\":null,\"isFollowingLearningPath\":true,\"unfollowedAt\":\"2021-10-28T23:59:59+02:00\"}}"
	 * https://api.openclassrooms.com/users/8740532/paths
	 * 		semble retourner la liste de tous les parcours ...
	 *
	 *
	 */

	/*
	 * https://openclassrooms.com/ajax/users/available-users?q=aaaa&premiumPlus=1 permet de lister les étudiant qui correspondent au nom de aaaa
	 *
	 * https://api.openclassrooms.com/users/11816429/followed-path/projects?learningActivityStatus=retry,ready for review
	 * https://api.openclassrooms.com/users/11816429/followed-path/projects?learningActivityStatus=retry%2Cready%20for%20review (voila l'url)
	 */

	// TODO replace it by calling https://api.openclassrooms.com/me
	// ne fonctionne pas je passe par une initialisation manuelle pour le moment
	const _setUser = async function(){
		let _r = await getMe();
		_r = JSON.parse(_r);
		_user = _r.id;
		return _user;
	};


	// check that _user and header are not empyt else, ... throw an error
	// could'nt use API
	const _checkSupport = async function(){
		if (_header.length == 0){
			throw new Error("_header is empty, no xhr have been trapped so could't do some api request");
		}
	};

/*
{"displayName":"Stephane Torchy","email":"stephane.ty.missions@gmail.com","enrollment":"Free","firstName":"Stephane","id":7688561,"identityLocked":true,"language":"fr","lastName":"Torchy","openClassroomsProfileUrl":"https:\/\/openclassrooms.com\/fr\/members\/17kt5784hnq7","organization":null,"premium":true,"profilePicture":"https:\/\/s3.eu-west-1.amazonaws.com\/user.oc-static.com\/users\/avatars\/15123790592942_Working-1focushead.png"}
*/

	/**
	 * get the current user
	 *
	 * NOTESTT a priori c'est pareil que de faire getUser(avec l'id retourné dans me)
	 */

	const getMe = async function(){
		//const bDebug = true;
		const API_ME_URL = API_BASE_URL + "/me";
		let _r = await _fetchGet(API_ME_URL); // here we must not use xGet else we as xGet use getME it was an infinite recursion
		//if (bDebug){ console.log("%cUrl to call is:%o , result is are %o", APP_DEBUG_STYLE, URL, _r);}
		return _r;
	}

	/**
	 * return a long object with properties from mentor
	 * notamment les locales ce dont je me servirais bien pour la partie calendrier
	 */

	const getMentor = async function(iUser){
		//const bDebug = true;
		const FINAL_URL = `${API_BASE_URL}/mentors/${iUser}`;
		let _r = await _fetchGet(FINAL_URL); // here we must not use xGet else we as xGet use getME it was an infinite recursion
		//if (bDebug){ console.log("%cUrl to call is:%o , result is are %o", APP_DEBUG_STYLE, URL, _r);}
		return _r;
	}



	// {key: "Range", value: "items=0-19"}

	const _getLimit = function(iFrom,iTo){ return {'Range':`items=${iFrom}-${iTo}`}; }

	/* quelques tests
	 * -- _r = JSON.parse(await d_Api.getPendingSessionAfter(d_dayjs('20210701'),20,39))
	   --> je suis en fr donc 1/07
	   renvoi enristrement
	 *-- _r = JSON.parse(await d_Api.getPendingSessionBefore(d_dayjs('2020701')))
	 * renvoi vide
	 */

	/**
	 * helper getPendingSessionAfter
	 */
	const getPendingSessionAfter = async (dtDate=dayjs(), iFrom=0, iTo=19) =>
		await _getSessionOnDate ("AFTER", dtDate, [LIFE_CYCLE_STATUS_PENDING], iFrom, iTo);
	/**
	 * helper getPendingSessionBefore
	 */
	const getPendingSessionBefore = async (dtDate=dayjs(), iFrom=0, iTo=19) =>
		await _getSessionOnDate("BEFORE", dtDate, [LIFE_CYCLE_STATUS_PENDING], iFrom, iTo);
	/**
	 * helper getHistorySession
	 */
	const getHistorySession = async (aFilter, iFrom=0, iTo=19) =>
		await _getSession(aFilter, iFrom, iTo);
		// /!\ c'est pas tout à fait du isoString
		// OC 		  : 2021-06-06T20:50:00Z
		// ISO STRING : 2021-06-06T21:09:27.915Z
		// dans dayjs[] -> escape so [Z] allow us to write Z letter else was the template
		// a priori il faut juste encoder la date

	/**
	 * _getSessionOnDate
	 *
	 *   return a list of sessions corresponding to filters
	 */

	const _getSessionOnDate = async function(sPeriod="BEFORE", dtDate,
		aFilter=[
			LIFE_CYCLE_STATUS_CANCELED,
			LIFE_CYCLE_STATUS_COMPLETED,
			LIFE_CYCLE_STATUS_LATE_CANCELED,
			LIFE_CYCLE_STATUS_ABSENT,
		],
		iFrom=0, iTo=19){
		bDebug = true;
		// check type
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}

		assert(
			isArray(aFilter) === true,
			'You must provide an array as param aFilter.',
			TypeError
		);

		assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);

		let sFilter = aFilter.join(',');
		let sDate = encodeURIComponent(dtDate.format('YYYY-MM-DDTHH:MM:ss[Z]'));
		sFilter = encodeURIComponent(sFilter);

		let API_URL="";
		/* l'utilisation d'une constante ici fait naitre une erreur
		 * le compilateur diagnostic deux constantes celle utilisée dans
		 * l'envoi de la fonction via xGet et celle defini dans le bloc
		 *  if else
		 */

		// because i need the user (mentor/coach) in this request
		if(_user == 0){
			await _setUser();
		}

		if(sPeriod === 'AFTER'){
			API_URL = `${API_BASE_URL}/users/${_user}/sessions?actor=expert&after=${sDate}&life-cycle-status=${sFilter}`;
			console.log('URL IS %s', API_URL);
		}else{
			API_URL = `${API_BASE_URL}/users/${_user}/sessions?actor=expert&before=${sDate}&life-cycle-status=${sFilter}`;
			console.log('URL IS %s', API_URL);
		}
		let oLimit =  _getLimit(iFrom,iTo);
		if (bDebug){ console.log("%c_getSessionOnDate url to call is:%s , params are %o", APP_DEBUG_STYLE, API_URL, oLimit);}
		let _r = await xGet(API_URL, _getLimit(iFrom,iTo));
		return _r;
	}

	/*
	 *
	 * message de retour si nombre trop grand : "{\"errors\":[{\"message\":\"Maximum of items: 21\"}]}"
	 * note il semblerait que passer en paramètre autre chose que 0-19, 20-29 .... ne renvoie rien
	 *  1-20 plante par exemple
	 *  19-38 plante mais 20-39 fonctionne

	 */


	const _getSession = async function(
		aFilter=[],
		iFrom=0, iTo=19){
		const HEADER = `${C.NAME}::_getSession()`
		let bDebug = C.DEBUG;
		//bDebug = true;// force
		assert(
			isArray(aFilter) === true,
			'You must provide an array as param aFilter.',
			TypeError
		);
		// filter must not be empty
		if(aFilter.length == 0){
			aFilter=[
				LIFE_CYCLE_STATUS_CANCELED,
				LIFE_CYCLE_STATUS_COMPLETED,
				LIFE_CYCLE_STATUS_LATE_CANCELED,
				LIFE_CYCLE_STATUS_ABSENT,
			]
		}

		let sFilter = aFilter.join(',');
		sFilter = encodeURIComponent(sFilter);
		// because i need the user (mentor/coach) in this request
		if(_user == 0){
			await _setUser();
		}
		const API_URL = `${API_BASE_URL}/users/${_user}/sessions?actor=expert&life-cycle-status=${sFilter}`;
		let oLimit =  _getLimit(iFrom,iTo);

		if (bDebug){ console.log("%c%s%c Url to call is:%o , params are %o", APP_DEBUG_STYLE, HEADER, '',API_URL, oLimit);}
		let _r = await xGet(API_URL, oLimit);
		if(_r === null || _r === undefined ){
			console.error("%cAPI have a problem returned value %o is null|undefined", APP_ERROR_STYLE, _r);
			throw new Error('Request:'+`${API_BASE_URL}/users/${_user}/sessions?actor=expert&life-cycle-status=${sFilter}`+' have a problem');
		}
		if(_r.errors){
			console.error("%cAPI return an error %s", APP_ERROR_STYLE, _r.errors.message);
		}
		return _r;
	}


	// exemple https://api.openclassrooms.com/users/9786459
	const getUser = async function(iUser){
		const API_USER = `${API_BASE_URL}/users/${iUser}`;
		let _r = await xGet(API_USER);
		return _r;
    };
    /**
     * return list of availabilities
     *
     *
     */
	const getUserAvailabilities = async function(iUser){
		const API_USER = `${API_BASE_URL}/users/${iUser}/availabilities`;
		let _r = await xGet(API_USER);
		return _r;
    };
    /**
     * return list of events
     *
     *
     */
	/*const getUserEvents = async function(iUser){
		const API_USER = `${API_BASE_URL}/users/${iUser}/events`;
		let _r = await xGet(API_USER);
		return _r;
    }; */
    // fonctionne on en fait qu'une seule au final
 	//const getUserEventsLim = async function(iUser,iFrom=0, iTo=19){
 	const getUserEvents = async function(iUser,iFrom=0, iTo=19){
		const API_USER = `${API_BASE_URL}/users/${iUser}/events`;
		let _r = await xGet(API_USER,_getLimit(iFrom,iTo));
		return _r;
    };


    // on tente avec une date
    // semble ne pas fonctionner
 	const getUserEventsAfter = async function(iUser, dtDate){
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		let sDate = encodeURIComponent(dtDate.format('YYYY-MM-DDTHH:MM:ss[Z]'));
		const FINAL_URL = `${API_BASE_URL}/users/${iUser}/events?after=${sDate}`;
		let _r = await xGet(FINAL_URL);
		return _r;
    };

 	const getUserEventsBefore = async function(iUser, dtDate){
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		let sDate = encodeURIComponent(dtDate.format('YYYY-MM-DDTHH:MM:ss[Z]'));
		const FINAL_URL = `${API_BASE_URL}/users/${iUser}/events?before=${sDate}`;
		let _r = await xGet(FINAL_URL);
		return _r;
    };

	const getUserFollowedPath = async function(iUser){
		// checking
		await _checkSupport();
		const API_URL = `${API_BASE_URL}/users/${iUser}/paths/followed-path`;
		let _r = await xGet(API_URL);
        return _r;
    };
	// exemple https://api.openclassrooms.com/users/9786459/paths
	const getUserPath = async function(iUser){
		const API_USER_PATHS = `${API_BASE_URL}/users/${iUser}/paths`;
		let _r = await xGet(API_USER_PATHS);
        return _r;
    };

    // exemple https://api.openclassrooms.com/mentors/7688561/students
    const getUserStudents = async function(iUser=null){
		if(iUser === null){
			let _r = await getMe();
			_r = JSON.parse(_r);
			iUser = _r.id;
		}
		const API_REQUEST = `${API_BASE_URL}/mentors/${iUser}/students`;
		let _r;
		try {
			_r = await xGet(API_REQUEST);
		}
		catch(e){console.error("%c[getUserStudents()] Trapped error %o",APP_ERROR_STYLE, e);}
		finally { return _r; }
        //return _r;
	}

	// set a book
	/*
	 * @param (int) user
	 * @param (int) project id
	 * @param (int) student id
	 * @param (string) date of the element to book UTC standard format
	 *
	 * @return (object) the result of api call
	 *
	 * URL : https://api.openclassrooms.com/mentoring-sessions
	 */
	const bookStudent = async function(iUser=null, iProjectId, iStudentId, sDate){

		// voir ici pour un parsing d'arguments https://gomakethings.com/my-preferred-way-to-pass-arguments-into-a-function-with-vanilla-javascript/

		if(iUser === null){
			let _r = await getMe();
			_r = JSON.parse(_r);
			iUser = _r.id;
		}
		const API_REQUEST = `${API_BASE_URL}/mentoring-sessions`;
		//const sDate = dtDate.format('YYYY-MM-DDTHH:MM:ss[Z]');
		const mData = {"mentorId":iUser, "projectId":iProjectId, "studentId":iStudentId, "sessionDate": sDate}

		let _r = await xPost(API_REQUEST, {}, mData);
		if(typeof _r === 'string'){
			// gestion des erreurs ... le retour est une chaine de caractere au format json
			const data = JSON.parse(_r);
			// check
			// https://stackoverflow.com/a/10895432
			if (//data.hasOwnProperty('errors') &&
				'errors' in data  &&
				data.errors.length == 1 &&
				data.errors[0].code === 'SESSION_ALREADY_EXISTS'){
				const e = data.errors[0];
				console.error("%c[Api.bookStudent()] call bookStudent error[%s] :%s ", APP_ERROR_STYLE, e.code, e.message);
			} else {
				console.log("%c[Api.bookStudent()] return an unknow value :%o", APP_ERROR_STYLE, data);
			}
			return data;
		}
		const data = await _r.json();
		console.log("%c[Api.bookStudent()] return :%o ", APP_DEBUG_STYLE, data);
        //const properties = Object.keys(data);
        //if (properties.includes('error') && properties.includes('body')) {console.log('bookStudent error');}
        return;
    }

    // -- use at your ownr risks

	/*
	 *
	 * xGet
	 * 	@param (string) url to call
	 *  @param (object) header
	 *  @return the text value of get
	 *  @raise error if fail
	 *
	 *
	 * NOTESTT: je devrais la réecrire je suis parti du principe que c'était toujours du json mais ce n'est pas certain
	 */
    const xGet = async function(sUrl, oHeader={}){
		// checking
		await _checkSupport();
		//console.log("%c[Api.xGet()] call _fetchGet with url :%s and with header:%o", APP_DEBUG_STYLE, sUrl, oHeader);
		let _r = await _fetchGet(sUrl, oHeader);
		//console.log("%c[Api.xGet()] returned value by _fetchGet is %o", APP_DEBUG_STYLE, _r);

		if(typeof _r === 'string'){
			// gestion des erreurs ... le retour est une chaine de caractere au format json
			let _t = JSON.parse(_r);
			if (typeof _t.errors !== 'undefined'){ // _t.hasOwnProperty('errors')
				const e = _t.errors.reduce( (acc,v) => `${acc}{v.message}`);
				console.error("%c[Api.xGet()] call _fetchGet error :%s ", APP_ERROR_STYLE, e.message);
				throw new Error(`[Api.xGet()] Irrecoverable error :' ${e.message}'`);
			}
			// pas d'erreur
			//console.log("%c[Api.xGet()] there is no propety error in data, will return %o", APP_DEBUG_STYLE, _r);
			return _r;
		}
		throw new Error(`[Api.xGet()] Irrecoverable error result is not a string but a :' ${typeof _r}'`);
		return;
        //return _r;
	};
	/*
	 *  @raise error if fail
	 */
	const xPost = async function(sUrl, oHeader={}, mData={}, bThrowError = true){
		// checking
		await _checkSupport();
		let _r = await _fetchPost(sUrl, oHeader, mData);
		console.log("%c[Api.xPost()] call _fetchPost with url :%s and with data:%o", APP_DEBUG_STYLE, sUrl, mData);
		if(typeof _r === 'string'){ // gestion des erreurs ... le retour est une chaine de caractere au format json
			let _t = JSON.parse(_r);
			if (typeof _t.errors !== 'undefined'){
				// il est à noter qu'il existe certain code qui sont parfois rapporté dans le message on va le trouver dans _r.errors[].code
				// mais ce n'est pas forcément très important
				// pour l'instant je le gère comme ça, mais il faudra faire mieux
				if (_t.errors.length == 1 &&
				    _t.errors[0].code === 'SESSION_ALREADY_EXISTS'
				    ){
					return _r;
				}
				// ERR: Cette valeur doit être supérieure ou égale à ....
				if (_t.errors.length == 1 &&
				    _t.errors[0].code === 'TOO_LOW_ERROR' &&
				    _t.errors[0].field === 'sessionDate'
				    ){
					return _r;
				}
				console.error("%c[Api.xPost()] raw list of error :%o ", APP_ERROR_STYLE, _t);
				const e = _t.errors.reduce( (acc,v) => `${acc}{v.message}`);
				console.error("%c[Api.xPost()] call _fetchPost error :%s ", APP_ERROR_STYLE, e.message);
				if(bThrowError === true){
					throw new Error(`[Api.xPost()] Irrecoverable error :' ${e.message}'`);
				}
				return;
			}
			// pas d'erreur
			return _r;
		}
		if(bThrowError === true){
			throw new Error(`[Api.xPost()] Irrecoverable error result is not a string but a :' ${typeof _r}'`);
		}
		return;
        //return _r;
	};

	/* this function only serve to force header to be build,
	 *  by bootstraping
	 * if i have no function the api never be called and so
	 *  builder don't include them and bootstrap ever occure
	 */
	const forge = function(idUser){
		_user = idUser;
		};

	// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
	const _containsEncodedComponents = function(x){
		// ie ?,=,&,/ etc
		return (decodeURI(x) !== decodeURIComponent(x));
	}

	const _fetchGet = async function(sUrl="", oHeader={}, sFormat='json', sPath="", bAll=true, bThrowError=false){
		//console.info(`%c[Api._fetchGet()] waiting return from : ${sUrl}`, APP_DEBUG_STYLE, sUrl);
		let mHeader =  Object.assign({"User-Agent":"Mozilla/5.0"}, _header, oHeader);
		//console.log("%c[Api._fetchGet()]final header is %o", APP_DEBUG_STYLE, mHeader);
		//console.log("%c[Api._fetchGet()]format is ", APP_DEBUG_STYLE, sFormat);
		if (sFormat.toLowerCase() === 'json'){
			const response = await GMC.XHR({
				method: 'GET',
				url: sUrl,
				responseType: 'application/json',
				//binary: true,
				headers: mHeader,
				//onabort: (_e) => console.log("%c _fetchGet()->onabort  args:%o", APP_DEBUG_STYLE, _e),
				//onloadstart: (_e) => console.log("%c _fetchGet()->onloadstart args:%o", APP_DEBUG_STYLE, _e),
				//onprogress: (_e) => console.log("%c _fetchGet()->onprogress args:%o", APP_DEBUG_STYLE, _e),
				//onreadystatechange: (_e) => console.log("%c _fetchGet()->onreadystatechange  args:%o", APP_DEBUG_STYLE, _e),
				//onload: (_e) => console.log("%c _fetchGet()->onload args:%o", APP_DEBUG_STYLE, _e),
				//onerror: (_e) => console.error("%c _fetchGet()->onerror error is:%o", APP_ERROR_STYLE, _e),
			}).catch((error) => {
				// dans le catch error on trouve des "response" à NULL
				if (isNullOrUndefined(response)){
					if(bThrowError === true){
						throw new Error(`[Api._fetchGet()] Repsponse is undefined : ${error}'`);
					}
					return null;
				}

				console.error("%c[_fetchGet()]Error is %o",APP_ERROR_STYLE, error); // SRC copied from https://greasyfork.org/en/scripts/20423-patchouli/code script i use for xhr promises
				return null;
			});

			//console.log("_fetch() ending proceed with response %o",response.responseText);
			return response.responseText;
		}
		if (sFormat.toLowerCase === 'html'){
			const response = await GMC.XHR({
				method: 'GET',
				url: sUrl,
				responseType: 'application/json',
				//binary: true,
				headers: mHeader,
				//onabort: (_e) => console.log("%c _fetchGet()->onabort  args:%o", APP_DEBUG_STYLE, _e),
				//onloadstart: (_e) => console.log("%c _fetchGet()->onloadstart args:%o", APP_DEBUG_STYLE, _e),
				//onprogress: (_e) => console.log("%c _fetchGet()->onprogress args:%o", APP_DEBUG_STYLE, _e),
				//onreadystatechange: (_e) => console.log("%c _fetchGet()->onreadystatechange  args:%o", APP_DEBUG_STYLE, _e),
				//onload: (_e) => console.log("%c _fetchGet()->onload args:%o", APP_DEBUG_STYLE, _e),
				//onerror: (_e) => console.error("%c _fetchGet()->onerror error is:%o", APP_ERROR_STYLE, _e),
			}).catch((error) => {
				console.error("%c[Api_fetchGet()]Error is %o",APP_ERROR_STYLE, error); // SRC copied from https://greasyfork.org/en/scripts/20423-patchouli/code script i use for xhr promises
			});

			//console.log("_fetch() ending proceed with response %o",response.responseText);
			//return response.responseText;
			let domparser = new DOMParser();
			/*
			response.responseXML.body is malformed so i need responseText
			responseText add \n, need to proceed a [string].replace(/\\n/mg,"\n")
			*/
			let doc = domparser.parseFromString(response.responseText.replace(/\n/mg,""), "text/html");
			/* there is a cloudflare captcha */
			/* seems there is no more captcha 202106
			let sCaptcha = doc.querySelector('meta[id=captcha-bypass]');
			if (sCaptcha !==null ){
				console.error(`%cError CloudFlare CAPTCHA : ${doc.querySelector('title').innerText}`, APP_DEBUG_STYLE);
				throw new Error("Must Respond to Cloudflare Captcha or waiting....");
			}
			*/
			var oDom = {}
			if (bAll===true){
				oDom = doc.querySelectorAll(sPath);
			} else {
				oDom = doc.querySelector(sPath); // need only first
			}
			return oDom;
		}
	}
	/**
	 * Need to complete after
	 */
	const _fetchPost = async function(sUrl="", oHeader={}, oData={}){
		console.info(`%c[Api._fetchPost()] waiting return from : ${sUrl}`, APP_DEBUG_STYLE, sUrl);
		let mHeader =  Object.assign({"User-Agent":"Mozilla/5.0"}, _header, oHeader);
		console.log("%c[Api._fetchPost()]final header is %o", APP_DEBUG_STYLE, mHeader);
		console.log("%c[Api._fetchPost()]data is %o", APP_DEBUG_STYLE, oData);

		// pour plus d'information voir ici https://www.tampermonkey.net/documentation.php#GM_xmlhttpRequest
		const response = await GMC.XHR({
			method: 'POST',
			url: sUrl,
			responseType: 'application/json',
			//binary: true,
			headers: mHeader,
			data: JSON.stringify(oData),
			//onabort: (_e) => console.log("%c _fetchPost()->onabort  args:%o", APP_DEBUG_STYLE, _e),
			//onloadstart: (_e) => console.log("%c _fetchPost()->onloadstart args:%o", APP_DEBUG_STYLE, _e),
			//onprogress: (_e) => console.log("%c _fetchPost()->onprogress args:%o", APP_DEBUG_STYLE, _e),
			//onreadystatechange: (_e) => console.log("%c _fetchPost()->onreadystatechange  args:%o", APP_DEBUG_STYLE, _e),
			//onload: (_e) => console.log("%c _fetchPost()->onload args:%o", APP_DEBUG_STYLE, _e),
			//onerror: (_e) => console.error("%c _fetchPost()->onerror error is:%o", APP_ERROR_STYLE, _e),
		}).catch((error) => {
			console.error("%c[Api_fetchPost()]Error is %o",APP_ERROR_STYLE, error); // SRC copied from https://greasyfork.org/en/scripts/20423-patchouli/code script i use for xhr promises
		});

		//console.log("_fetch() ending proceed with response %o",response.responseText);
		return response.responseText;



	};

	// 	https://dmitripavlutin.com/catch-the-xmlhttp-request-in-plain-javascript/
	const _bootstrap = function(){
		const REG_FILTER = /^https:\/\/api.openclassrooms.com/g;
		var open = window.XMLHttpRequest.prototype.open,
			send = window.XMLHttpRequest.prototype.send,
			setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;
		// monkey patch function
		var openReplacement = function(method, url, async, user, password) {
			this._url = url;
			this._requestHeaders = {};
			this._knox = [];
			return open.apply(this, arguments);
		};
		var onReadyStateChanged = function() {
			// Process the response
			if (
				this.readyState === 4 &&
				this.status &&
				this.status >= 200 &&
				this.status < 300
			) {
				if(this._url.match(REG_FILTER)){
					//Put all keys,value to header
                    for(var i in this._knox){
                        _header[this._knox[i].key] = this._knox[i].value;
                    }
				}
			}
		};
		// monkey patch function
		var sendReplacement = function(data) {
			this.onreadystatechange = onReadyStateChanged;
			return send.apply(this, arguments);
		};
		// monkey patch function
		var setRequestHeaderReplacement = function(header, value){
			if(this._url.match(REG_FILTER)){
				this._knox.push( {key:header, value:value} );
			}
			this._requestHeaders[header] = value;
			return setRequestHeader.apply(this, arguments);
		};
		window.XMLHttpRequest.prototype.open = openReplacement;
		window.XMLHttpRequest.prototype.send = sendReplacement;
		window.XMLHttpRequest.prototype.setRequestHeader = setRequestHeaderReplacement;
	}
	// La même mais avec du deboggage possible
	const _bootstrapDbg = function(){
		const VERBOSE = false;
		const REG_FILTER = /^https:\/\/api.openclassrooms.com/g;
		const FN_VERBOSE_STYLE =  'color:DarkSalmon;background-color:AliceBlue;';
		var open = window.XMLHttpRequest.prototype.open,
			send = window.XMLHttpRequest.prototype.send,
			setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;
		// monkey patch function
		var openReplacement = function(method, url, async, user, password) {
			if(VERBOSE === true)console.log("%cmethod %o url:%o, async:%o, user %o, password:%o",FN_VERBOSE_STYLE,method,url,async,user,password);
			this._url = url;
			this._requestHeaders = {};
			this._knox = [];
			//console.log(this);
			return open.apply(this, arguments);
		};
		// monkey patch function
		//var onReadyStateChangeReplacement = function() {
		var onReadyStateChanged = function() {
			if(VERBOSE === true)console.log('%cReady state changed to: %o', FN_VERBOSE_STYLE, this.readyState);
			// from https://github.com/cferdinandi/atomic/blob/master/src/js/atomic/atomic.js
			// Process the response
			if (
				this.readyState === 4 &&
				this.status &&
				this.status >= 200 &&
				this.status < 300
			) {
				//console.log('URL %s send us a response', this._url);
				if(this._url.match(REG_FILTER)){
					if(VERBOSE === true)console.log("%cOPENCLASSROOMS API", FN_VERBOSE_STYLE);
					//Put all keys,value to header
                    for(var i in this._knox){
                        _header[this._knox[i].key] = this._knox[i].value;
                    }
                    if(VERBOSE === true)console.log("%c _header is %o", FN_VERBOSE_STYLE, _header);
                    // could'nt use it cause user is the mentor in some request but students il most of them
					//_user= this._url.match(/\/(\d+)/s)[1] || 0;
					if(VERBOSE === true){
						if(_containsEncodedComponents(this._url)){
							console.log('%cDECODED URL:%s',FN_VERBOSE_STYLE, decodeURIComponent(this._url));
						} else {
							console.log('%c DECODED URL:%s',FN_VERBOSE_STYLE, decodeURI(this._url));
						}
					}
				}
				if(VERBOSE === true)console.log('%cResponse is :%o', FN_VERBOSE_STYLE, this.response);
			}
		  /**
		   * RETURN TO ORIGINAL
		   */
		  /*if(this._onreadystatechange) {
			return this._onreadystatechange.apply(this, arguments);
		  }
		  * */
		};
		// monkey patch function
		var sendReplacement = function(data) {
			if(VERBOSE === true)console.log('%csendReplacement(%o)', FN_VERBOSE_STYLE, data);
			/*if(this.onreadystatechange) {
				this._onreadystatechange = this.onreadystatechange;
			}
			* */
			//this.onreadystatechange = onReadyStateChangeReplacement;
			this.onreadystatechange = onReadyStateChanged;
			return send.apply(this, arguments);
		};
		// monkey patch function
		var setRequestHeaderReplacement = function(header, value){
			//will trap all request which concerne openclassrooms api
			if(this._url.match(REG_FILTER)){
				//console.log('OPENCLASSROOMS');
				this._knox.push( {key:header, value:value} );
			}
			this._requestHeaders[header] = value;
			/*console.log('%csetRequestHeader key:%c%s%c, value:%c%s',
						'color:mediumseagreen',
						'color:darksalmon',header,
						'color:mediumseagreen',
						'color:darksalmon',value);
			*/
			return setRequestHeader.apply(this, arguments);
		};
		window.XMLHttpRequest.prototype.open = openReplacement;
		window.XMLHttpRequest.prototype.send = sendReplacement;
		window.XMLHttpRequest.prototype.setRequestHeader = setRequestHeaderReplacement;
	}

	_bootstrap();

	//_bootstrapDbg();

	return Object.freeze({
		bookStudent: bookStudent,
		forge:forge,
        // -- Logged user
		getMe:getMe,
		// -- Mentor
		getMentor:getMentor,
		getPendingSessionAfter: getPendingSessionAfter,
		getPendingSessionBefore: getPendingSessionBefore,
		getHistorySession: getHistorySession,
		//-- Users
        getUser:getUser,
        getUserAvailabilities: getUserAvailabilities,
        getUserEvents: getUserEvents,
        //getUserEventsLim, mélangé avec celle du dessus.
        getUserEventsAfter,
        getUserEventsBefore,
        getUserFollowedPath:getUserFollowedPath,
        getUserPath:getUserPath,
		getUserStudents: getUserStudents,
        //--Reserved generic get/post
        xGet:xGet,
        xPost:xPost,
 	});

}

const Api = fApi();
export default Api;
