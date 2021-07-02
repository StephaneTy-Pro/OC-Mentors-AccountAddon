/**
 * Commentaires
 * 	Ne pas oublier que URL est une fonction de base dans JS !!!!!
 */

import {
	APP_DEBUG_STYLE, APP_WARN_STYLE, APP_ERROR_STYLE,
	} from './constants.js';
	
import GMC from "./gmc.polyfills.js";
import { assert } from './utils.js';
import { isArray } from './helpers.js';

var fApi = function(){
	
	let _header = {}
	let _user = '0'; //sera capturé
	//let _user = 7688561; //provisoire
	const VERBOSE = true;
	
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

	const getMe = async function(){
		//const bDebug = true;
		const API_ME_URL = API_BASE_URL + "/me";
		let _r = await _fetchGet(API_ME_URL); // here we must not use xGet else we as xGet use getME it was an infinite recursion
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
	
	const getPendingSessionAfter = async (dtDate=dayjs(), iFrom=0, iTo=19) =>  
		await _getSessionOnDate ("AFTER", dtDate, [LIFE_CYCLE_STATUS_PENDING], iFrom, iTo);
	const getPendingSessionBefore = async (dtDate=dayjs(), iFrom=0, iTo=19) =>
		await _getSessionOnDate("BEFORE", dtDate, [LIFE_CYCLE_STATUS_PENDING], iFrom, iTo);
	const getHistorySession = async (aFilter, iFrom=0, iTo=19) =>
		await _getSession(aFilter, iFrom, iTo);
		// /!\ c'est pas tout à fait du isoString
		// OC 		  : 2021-06-06T20:50:00Z
		// ISO STRING : 2021-06-06T21:09:27.915Z
		// dans dayjs[] -> escape so [Z] allow us to write Z letter else was the template 
		// a priori il faut juste encoder la date
		
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
		bDebug = true;
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
		
		if (bDebug){ console.log("%cUrl to call is:%o , params are %o", APP_DEBUG_STYLE, API_URL, oLimit);}
		let _r = await xGet(API_URL, oLimit);
		if(_r === null || _r === undefined ){
			console.error("%cAPI have a problem returned value %o is null|undefined", APP_ERROR_STYLE, _r);
			throw new Error('Request:'+`${API_BASE_URL}/users/${_user}/sessions?actor=expert&life-cycle-status=${sFilter}`+' have a problem');
		}
		if(_r.errors){
			console.log("%cAPI return an error %s", APP_ERROR_STYLE, _r.errors.message);
		}
		return _r;
	}
	
	
	// exemple https://api.openclassrooms.com/users/9786459
	const getUser = async function(iUser){
		const API_USER = `${API_BASE_URL}/users/${iUser}`;
		let _r = await xGet(API_USER);
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
    
    // -- use at your ownr risks
    const xGet = async function(sUrl, oHeader={}){
		// checking
		await _checkSupport();
		//console.log("%c[Api.xGet()] call _fetchGet with url :%s and with header:%o", APP_DEBUG_STYLE, sUrl, oHeader);
		let _r = await _fetchGet(sUrl, oHeader);
        return _r;
	};
	
	const xPost = async function(sUrl){
		// checking
		await _checkSupport();
		let _r = await _fetchPost(sUrl, mData);
        return _r;
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
	
	const _fetchGet = async function(sUrl="", oHeader={}, sFormat='json', sPath="", bAll=true){
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
				console.error("%c[Api_fetchGer()]Error is %o",APP_ERROR_STYLE, error); // SRC copied from https://greasyfork.org/en/scripts/20423-patchouli/code script i use for xhr promises
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
				console.error("%c[Api_fetchGer()]Error is %o",APP_ERROR_STYLE, error); // SRC copied from https://greasyfork.org/en/scripts/20423-patchouli/code script i use for xhr promises
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
	const _fetchPost = async function(sUrl="", oHeader={}, oData={}){}; 

	// 	https://dmitripavlutin.com/catch-the-xmlhttp-request-in-plain-javascript/
	const _bootstrap = function(){
		const VERBOSE = false;
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
		var onReadyStateChangeReplacement = function() {
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
				if(this._url.match(/^https:\/\/api.openclassrooms.com/g)){
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
		  if(this._onreadystatechange) {
			return this._onreadystatechange.apply(this, arguments);
		  }
		};
		// monkey patch function
		var sendReplacement = function(data) {
			if(VERBOSE === true)console.log('%csendReplacement(%o)', FN_VERBOSE_STYLE, data);
			if(this.onreadystatechange) {
				this._onreadystatechange = this.onreadystatechange;
			}
			this.onreadystatechange = onReadyStateChangeReplacement;
			return send.apply(this, arguments);
		};
		// monkey patch function
		var setRequestHeaderReplacement = function(header, value){
			//will trap all request which concerne openclassrooms api
			if(this._url.match(/^https:\/\/api.openclassrooms.com/g)){
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
	
	return Object.freeze({
		forge:forge,
		getPendingSessionAfter: getPendingSessionAfter,
		getPendingSessionBefore: getPendingSessionBefore,
		getHistorySession: getHistorySession,
        getUser:getUser,
        getUserFollowedPath:getUserFollowedPath,
        getUserPath:getUserPath,
        getMe:getMe,
        xGet:xGet,
        xPost:xPost,
 	});
  
}

const Api = fApi();
export default Api;
