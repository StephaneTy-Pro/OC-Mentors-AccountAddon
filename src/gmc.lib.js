// CFG
// ----------------------------------------------------------- Tampermonkey Menu
const windowcss = '#OCAddonsCfg {background-color: lightblue;} #OCAddonsCfg .reset_holder {float: left; position: relative; bottom: -1em;} #OCAddonsCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 16.7em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';
const dbgcss    = 'position: absolute;top: 5px; left: 5px; right: 5px; bottom: 5px;padding: 10px;overflow-y: auto;display: none;background: rgba(250, 250, 250, 0.3);border: 3px solid #888;font: 14px Consolas,Monaco,Monospace;color: #ddd;z-index: 500';
const appmenu = {
	id: 'OCAddonsCfg',
	title: 'Configuration du module',
	fields:
	{
		nbHrsAfM:{
			section: ['Statistiques', 'paramètres'],
			label: "Nombre de minutes pour une session d'étudiant auto financé",
			title: "Durée moyenne d'une session AF (calcul du THM)",
			labelPos: 'left',
			type: 'input',
			default: 30,
		},
		nbHrsfM:{
			label: "Nombre de minutes pour une session d'étudiant financé",
			title: "Durée moyenne d'une session Financée (calcul du THM)",
			labelPos: 'left',
			type: 'input',
			default: 45,
		},
		nbHrsS:{
			label: "Nombre de minutes pour une session (avant 01/07/2020)",
			title: "Durée moyenne d'une session avant la séparation auto financé | financé (calcul du THM)",
			labelPos: 'left',
			type: 'input',
			default: 45,
		},
		nbHrsD:{
			label: "Nombre de minutes pour une session de soutenance",
			title: "Durée moyenne d'une sessionde soutenance AF (calcul du THM)",
			labelPos: 'left',
			type: 'input',
			default: 45,
		},
		nbHrsC:{
			label: "Nombre de minutes pour une session de coaching",
			title: "Durée moyenne d'une session de coachine (calcul du THM)",
			labelPos: 'left',
			type: 'input',
			default: 45,
		},
		maxfetchpg:{
			section: ['Application', 'optimisation'],
			label: "Maximum de page recherchées dans l'historique",
			labelPos: 'left',
			type: 'input',
			default: 1000,
		},

		datacachelifetime: {
			label: "Temps de conservation des données dans le cache (en ms)",
			labelPos: 'left',
			type: 'input',
			default: 120000,
		},
		
		checksessionalreadyexists: {
			section: ['Application', 'Base de donnée'],
			label: 'sessions: vérifier existence avant insertion',
			labelPos: 'left',
			type: 'checkbox',
			default: true,
		},

		sizeofcontentlist:{
			section: ['Interface', 'thème'],
			label: 'taille de la police des listes',
			labelPos: 'left',
			type: 'input',
			default: '1em;',
		},
		
		use_custom_css: {
			label: 'utiliser des styles personnalisés',
			labelPos: 'left',
			type: 'checkbox',
			default: false,
		},
		
		custom_css_url: {
			label: 'url de la feuille de style (si plusieurs les séparer par des virgules)',
			labelPos: 'left',
			type: 'input',
			default: '',
		},
		custom_css_data: {
			label: 'saisir ici le code css à injecter directement dans la page',
			title: 'Je me demande bien à quoi sert le titre',
			labelPos: 'left',
			type: 'input',
			default: '',
		},

		alwaysaddcbox:{
			section: ['Interface', 'Gadget'],
			label: 'Toujours ajouter les checkbox sur l\'interface',
			labelPos: 'left',
			type: 'checkbox',
			default: true,
		},
		show_throttle:{
			label: 'Afficher le temoin d\'utilisation du CPU',
			title: 'Affiche le point rouge qui circule dans la barre de menu. Quand il s\'arrête le CPU est utilisé',
			labelPos: 'left',
			type: 'checkbox',
			default: true,
		},		
		'hackheaderzindex':{
			section: ['', 'Hack'],
			label: 'Changer le zindex du bandeau haut',
			title : 'le bandeau haut à un z-index  (1000) qui le place au dessus de tout ce qui est présent à l\'écran, ce qui gêne la barre de menu ; activer cette option réduit ce chiffre à 0',
			labelPos: 'left',
			type: 'checkbox',
			default: true,
		},
		support: {
			section: ['', 'Support'],
			label: 'StephaneTy-Pro.github.io',
			title: 'more info on https://github.com/StephaneTy-Pro',
			type: 'button',
			click: () => {
				GM_openInTab('https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon', {
					active: true,
					insert: true,
					setParent: true
				});
			}
		},
	},
	css: windowcss,
	events:
	{
		save: function() {
			GM_config.close();
		}
	},
};


var opencfg = function()
{
    GM_config.open();
    OCAddonsCfg.style = iframecss;
}
    
    
export { 
	appmenu,
	opencfg,
};     
