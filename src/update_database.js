
import {
	APP_DEBUG_STYLE,
	OC_AUTOFUNDED,
	OC_FUNDED,
	} from './constants.js';
import App from './index.js';
import Student from './students.js';
import Session from './sessions.js';
import {
	sleep,
} from './utils.js';

/* vide pour le moment ou presque * /


/* changement de la clé String > Int */
var wtf_is_this_function_for = function(){
	r = unsafeWindow.Facturier.cfg.dbase.get('history_session_cache').value();
	for(_l = 0; _l < r.length; _l+=1){
	let e = unsafeWindow.Facturier.cfg.dbase.get('history_session_cache')
			.find({id: r[_l].id})
			.assign({ id: +r[_l].id})
			.write();
	console.log(e);
	// check if e.id is int and if e.id === +r[_l].id ????
	}
}
// ne jamais oublier que sans async avant le mot clé function il est impossible de faire un await
var maj_1_00_0006 = async function(){
	// pour debugger 
	// db = unsafeWindow.Facturier.cfg.dbase
	// dayjs = unsafeWindow.Facturier.libs[1].ptr
	
/*
 * 	//toutes les sessions qui ne sont pas des soutenances doivent vérifier que ce ne sont pas des coachings
	// un coaching est une session sur un étudiant d'un parcours particulier
	// pour éviter à l'avenir d'autres mésaventures de ce genre je vais soit stocker un autre état que session ou defense, ou alors stocker le parcours
	// la deuxieme option me semble préférable car plus souple et évite de changer un type que OC ne change pas
	
	// correction de la base de donnée, pour une raison que j'ignore les id étudiants sont faux dans la base .... il va falloir vérifier pourquoi
	
	// En attendant je peux lancer un traitement qui fait le rapprochement du nom et de l'id
	// pour se faire il va falloir compresser la db, c'est à dire virer les enregistrements vides
	
	// controler la db ... verifier que les enregistrements attendus sont bien non null
*/

	let db = App.Cfg.dbase;
	const majWorkFlow = await Swal.mixin({
		confirmButtonText: 'Suivant &rarr;',
		showCancelButton: true,
		progressSteps: ['0', '1', '2', '3', '4','5'],
		onOpen: function (modal) {
			console.log("...onOpen");
		}, 
		onRender: function (modal){
			console.log("....onUpdate");
		},
		onClose: function(modal){
			console.log(".....onClose");
		},
		onAfterClose: function(modal){
			console.log("......onAfterClose");
		},
		onDestroy: function(modal){
			console.log(".......onDestroy");
		}, 
	}).queue([
	{
		title: 'Migration de la base',
		html: '<p>Cette migration va corriger la base et ajouter les nouveaux champs nécessaires, l`interrpuption du traitement est sans danger (mais ce n\' est pas une raison !)</p>',
	},
	{
		title: 'Correction de la table étudiant',
		html: '<p>Correction de la liste des étudiants (who_id)',
		onOpen: async function (modal) {
			console.log('%cMigration table des étudiants correction du who_id', APP_DEBUG_STYLE);
			Swal.showLoading(); // do disable button so don't need Swal.disableButtons();
			var dtFrom = dayjs("2020-06-01"); // TODO add this in constants the date
			var oListStudents  = db.get("students");
			var aListStudents = oListStudents.value();
			var aListSessionsSinceJune = db.get("sessions").filter(v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
			var iSize  = oListStudents.size().value();
			// update de l'id avec le nom trouvé
			var sContent = Swal.getContent().textContent;
			for(i = 0; i < iSize; i+=1){
				var r = aListSessionsSinceJune.find( v => v.who_name === aListStudents[i].fullname).value(); 
				if(r !== undefined) oListStudents.get(i).assign({ who_id: r.who_id}).write();
				//console.log(r);
				const content = Swal.getContent();
				if (content != undefined) content.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i}/${aListStudents.length}</p>`; 
				await sleep(1);// pause need here else no count was shown
			}
			Swal.hideLoading();
			const content = Swal.getContent();
			if (content != undefined) content.textContent = `Traitement terminé : ${aListStudents.length}/${aListStudents.length}`; // pause need here else no count was shown
		
		},
	},
	{
		title: 'Correction de la table étudiant',
		html: '<p>Correction de la liste des étudiants funded devient funding</p>',
		onOpen: async function (modal) {
			console.log("%cMigration : table des étudiants suppression de l'ancien champs et ajout du champs funding", APP_DEBUG_STYLE);
			Swal.showLoading(); 
			var oListStudents  = db.get("students");
			var iSize  = oListStudents.size().value();
			var sContent = Swal.getContent().textContent;
			for(var i = 0; i < iSize; i+=1){
				var _r = oListStudents.get(i).value().fundedby;
				//console.log(oListStudents.get(i).value());
				//console.log(_r);
				if (_r === undefined){
					console.log("%cStudent ${oListStudents.get(i).who_name} already converted, skip it", APP_DEBUG_STYLE);
					continue;
				}
				oListStudents.get(i)
				.unset(['fundedby'])
				.assign({'funding':_r})
				.write();
				//.assign({'funding':_r}).write();
				//oListStudents.get(i).unset(['fundedby']).write();
				console.log("%cStudent ${oListStudents.get(i).who_name} create field funding and remove fundedby", APP_DEBUG_STYLE);
				const content = Swal.getContent();
				if (content != undefined) content.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i}/${iSize}</p>`; 
				await sleep(1);// pause need here else no count was shown
			}
			Swal.hideLoading();
			const content = Swal.getContent();
			if (content != undefined) content.textContent = `Traitement terminé : ${iSize}/${iSize}`; // pause need here else no count was shown
		},
	 },
	{
		title: 'Correction table Etudiants',
		html: '<p>Correction de la liste des sessions, ajout du path dans la session</p>',
		onOpen: async function (modal) {
			console.log('%cMigration table des sessions correction de id_who', APP_DEBUG_STYLE);
			Swal.showLoading();
			var dtFrom = dayjs("2020-06-01"); // TODO add this in constants the date
			var oListStudents  = db.get("students");
			var aListStudents  = oListStudents.value();
			var aListSessionsSinceJune = db.get("sessions").filter(v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
			var aListToUpdate = aListSessionsSinceJune.filter((v)=>v.type!='soutenance').value();
			var sContent = Swal.getContent().textContent;
			for(i = 0; i < aListToUpdate.length; i+=1){
				//var r = db.get("students").find({ who_id: aListToUpdate[i].who_id}).value(); 
				var _r = oListStudents.find({ who_id: aListToUpdate[i].who_id}).value(); 
				console.log("found",_r);
				var data = (_r !== undefined && _r.path.length > 0) ? _r.path : "0-unknown"; 
				db.get("sessions")
				.find({ id: aListToUpdate[i].id})
				.assign({ path: data }).write();
				const content = Swal.getContent();
				if (content != undefined) content.innerHTML = `${sContent}<br /><p>Traitement en cours : ${i}/${aListToUpdate.length}</p>`; 
				await sleep(1);// pause need here else no count was shown
			}
			Swal.hideLoading();
			const content = Swal.getContent();
			if (content != undefined) content.textContent = `Traitement terminé : ${i}/${aListToUpdate.length}`; 
		}    
	  },
		/*
		 par ailleurs je découvre que : "La section “Autres” correspond aux apprenants qui ne sont ni “autofinancés” ni “financés”. 
		 il faudra donc prévoir une catégorie autre que financé et non financé dans les calculs
		*/  
	  {
		title: 'Migration de la table des Sessions',
		html: '<p>Correction de la liste des sessions, suppression du champs "isFunded"</p>',
		onOpen: async function (modal) {
			console.log('%cMigration : table des sessions suppression de isFunded', APP_DEBUG_STYLE);
			Swal.showLoading(); 
			var dtFrom = dayjs("2020-06-01"); // TODO add this in constants the date
			var aListStudents  = db.get("students").value();
			var aListSessionsSinceJune = db.get("sessions").filter(v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
			var sContent = Swal.getContent().textContent;
			//for(var i = 0, iSize = aListSessionsSinceJune.value().length ; i < iSize; i+=1){
			for(var i = aListSessionsSinceJune.value().length ; i-=1; ){
				var _r = aListSessionsSinceJune.get(i);
				if ( _r.value().isFunded === undefined || _r.value().isFunded === undefined ){
					console.log(`%cSkip ${_r.value()} already converted`, APP_DEBUG_STYLE);
				} else {
					_r
					.unset(['isFunded'])
					.write(); // loadash omit don't mutate so use unset
				}
				const content = Swal.getContent();
				//if (content != undefined) content.innerHTML = `${sContent}<br /><p>Traitement en cours :  ${i}/${aListSessionsSinceJune.value().length}</p>`; 
				if (content != undefined) content.innerHTML = `${sContent}<br /><p>Traitement en cours : il reste ${i} élements à convertir</p>`; 
				await sleep(1);// pause need here else no count was shown
			}
			Swal.hideLoading();
			const content = Swal.getContent();
			if (content != undefined) content.textContent = `Traitement en terminé : ${aListSessionsSinceJune.value().length}/${aListSessionsSinceJune.value().length}`; 
		}    
	},  
	{
		title: 'Migration de la table des Sessions',
		html: '<p>Correction de la liste des sessions, ajout de funding</p>',
		onOpen: async function (modal) {
			/*
			 * 	ajout du champs funding (financement)
			 */
			console.log('%cMigration : table des sessions ajout de fundedBy', APP_DEBUG_STYLE);
			Swal.showLoading(); // do disable button
			var dtFrom = dayjs("2020-06-01"); // TODO add this in constants the date
			var aListStudents  = db.get("students").value();
			var aListSessionsSinceJune = db.get("sessions").filter(v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
			// start with whatever but not soutenance
			var oListToUpdate = aListSessionsSinceJune.filter((v)=>v.type!='soutenance');
			var sContent = Swal.getContent().textContent;
			//for(var i = 0; i < oListToUpdate.value().length; i+=1){
			for(var i = oListToUpdate.value().length; i-=1; ){
				var _r = oListToUpdate.get(i); 
				if ( _r.value().funding !== undefined ){
					console.log(`%cSkip ${_r.value()} already converted`, APP_DEBUG_STYLE);
				} else {
					_r.assign({'funding': Student.getFunding(_r.value().who_id)}).write();
				}
				const content = Swal.getContent();
				content.innerHTML = `${sContent}<br /><p>Traitement en cours : il rest ${i}élements à convertir</p>`; 
				await sleep(1);// pause need here else no count was shown
			}
			var j = i; // save all index
			// only soutenance
			var oListToUpdate = aListSessionsSinceJune.filter((v)=>v.type=='soutenance');
			for(var i = 0; i < oListToUpdate.value().length; i+=1){
				oListToUpdate.get(i).assign({'funding':OC_FUNDED}).write();
				const content = Swal.getContent();
				if (content != undefined) content.innerHTML = `${sContent}<br /><p>Traitement en cours : ${j+i}/${aListSessionsSinceJune.value().length}</p>`; 
				await sleep(1);// pause need here else no count was shown
			}
			Swal.hideLoading();
			const content = Swal.getContent();
			if (content != undefined) content.textContent = `Traitement terminé :  ${aListSessionsSinceJune.value().length}/${aListSessionsSinceJune.value().length}`; 
		}    
	 },
	]).then((result) => {
	  if (result.value) {
		const answers = JSON.stringify(result.value)
		Swal.fire({
		  title: 'Traitement terminé!',
		  html: `
			Your answers:
			<pre><code>${answers}</code></pre>
		  `,
		  confirmButtonText: 'Lovely!'
		});
	  } else {
			// treatment has been canceled ( anycancel action is allowed)
			console.log('%c resultat en erreur',APP_DEBUG_STYLE,result, result.dismiss === Swal.DismissReason.cancel);
			return -1;
	  }
	});
	
	
	
	return majWorkFlow;
	//let db = App.Cfg.dbase;
	//toutes les sessions qui ne sont pas des soutenances doivent vérifier que ce ne sont pas des coachings
	// un coaching est une session sur un étudiant d'un parcours particulier
	// pour éviter à l'avenir d'autres mésaventures de ce genre je vais soit stocker un autre état que session ou defense, ou alors stocker le parcours
	// la deuxieme option me semble préférable car plus souple et évite de changer un type que OC ne change pas
	
	// correction de la base de donnée, pour une raison que j'ignore les id étudiants sont faux dans la base .... il va falloir vérifier pourquoi
	
	// En attendant je peux lancer un traitement qui fait le rapprochement du nom et de l'id
	// pour se faire il va falloir compresser la db, c'est à dire virer les enregistrements vides
	
	// controler la db ... verifier que les enregistrements attendus sont bien non null
	
	// db = unsafeWindow.Facturier.cfg.dbase
	// dayjs = unsafeWindow.Facturier.libs[1].ptr
	
	var dtFrom = dayjs("2020-06-01"); // TODO add this in constants the date
	var aListStudents  = db.get("students").value();
	var aListSessionsSinceJune = db.get("sessions").filter(v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
	// update de l'id avec le nom trouvé
	for(i = 0; i < aListStudents.length; i+=1){var r = aListSessionsSinceJune.find( v => v.who_name === aListStudents[i].fullname).value(); if(r !== undefined) db.get("students").find({ fullname: r.who_name}).assign({ who_id: r.who_id}).write();}
	
	
	
	// sauvegarde de la table
	
	// update de la table
	
	// update de la base existante pour toutes les sessions à partir de juin attention il existe un risque si l'étudiant à changé de groupe, dans ce cas là il faudra prévoir un editeur de champs options 1
	// ou un export csv + modification + import
	
	/*
	const db = unsafeWindow.Facturier.cfg.dbase
	const dayjs = unsafeWindow.Facturier.libs[1].ptr 
	*/
	
	//var dtFrom = dayjs("2020-06-01"); // TODO add this in constants the date
	//var aListStudents  = db.get("students").value();
	//var aListSessionsSinceJune = db.get("sessions").filter(v => dayjs(v.when).isSameOrAfter(dtFrom,'day'));
	var aListToUpdate = aListSessionsSinceJune.filter((v)=>v.type!='soutenance').value();
	for(i = 0; i < aListToUpdate.length; i+=1){var r = db.get("students").find({ who_id: aListToUpdate[i].who_id}).value(); var data = (r !== undefined && r.path.length > 0) ? r.path : "0-unknown"; db.get("sessions").find({ id: aListToUpdate[i].id}).assign({ path: data }).write();}
	
	// par ailleurs je découvre que : "La section “Autres” correspond aux apprenants qui ne sont ni “autofinancés” ni “financés”. 
	// Pour ces apprenants, OC applique le tarif des apprenants financés. Pour cette raison, le forfait d’accompagnement inter-session de 30€ n’est pas prévu dans la prestation de mentorat. "
	// il faudra donc prévoir une catégorie autre que financé et non financé dans les calculs
	
	// suppression du champs isFunded,
	for(var i = 0; i < aListSessionsSinceJune.value().length; i+=1){aListSessionsSinceJune.get(i).unset(['isFunded']).write();} // omit don't mutate
	
	// ajout du champs fundedBy
	var oListToUpdate = aListSessionsSinceJune.filter((v)=>v.type!='soutenance');
	for(var i = 0; i < oListToUpdate.value().length; i+=1){var _r= oListToUpdate.get(i); _r.assign({'fundedBy': Student.getFunded(_r.value().who_id)}).write();}
	var oListToUpdate = aListSessionsSinceJune.filter((v)=>v.type=='soutenance');
	for(var i = 0; i < oListToUpdate.value().length; i+=1){oListToUpdate.get(i).assign({'fundedBy':OC_FUNDED}).write();}
}

export {
	maj_1_00_0006,
}
