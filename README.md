# !!!!!!!!!!!!!!!!!! ATTENTION !!!!!!!!!!!!!!!!!!!!!!!!!
Depuis mars 2024 et les changements dans le modèle de facturation openclassrooms, cet outil n'est plus fonctionnel, je vous enjoint à regarder du côté de https://github.com/StephaneTy-Pro/OC-Mentors-Tools pour son évolution

--------------------------------------------------



# OC-Mentors-AccountAddon

![](https://img.shields.io/badge/build-pass-success)
![](https://img.shields.io/badge/version-1.1-orange)
[![](https://img.shields.io/badge/chat-workplace-blueviolet)](https://openclassrooms.workplace.com/groups/314612209540660/)

Cet addon vise à aider le mentor à préparer sa facture mensuelle, mais aussi à voir l'évolution de sa facturation via le module de statistiques intégré.

## Démarrage rapide

### Préalable

Installer l'extension tampermonkey pour votre navigateur (greasmonkey ou violetmonkey devraient fonctionner mais je n'ai pas testé). Cette extension permet d'injecter un script ou un ensemble de script dans une page web affichée par le navigateur.

### Installation du script

- Cliquer sur l'icone tampermonkey présent sur la page de votre navigateur et choisir l'option dashboard (ou l'activer depuis la gestion des plugins)
- Deux options existent pour l'installation
- Option 1: en mode automatique
	- Prendre l'onglet Utilitaires ou Utilities dernière ligne "Install from URL" , coller l'url du script ( /!\ bien penser à prendre le format RAW du lien github ce qui donne https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js et non pas https://github.com/StephaneTy-Pro/OC-Mentors-AccountAddon/blob/master/dist/app.min.js) 
- Option 2: à la main
	- Cliquer sur le + présent dans la barre de menu à côté de l'onglet "Installed UserScripts"
	- recopier le contenu du fichier github de l'[application](https://raw.githubusercontent.com/StephaneTy-Pro/OC-Mentors-AccountAddon/master/dist/app.min.js)(en mode raw) dans la nouvelle page ainsi ouverte 
	- Sauvegarder


### Utilisation

La barre de menu s'affiche dès que vous êtes dans l'interface mentor

Cette barre de menu peut être déplacée en positionnant votre curseur sur le rond gris , il ne vous reste plus qu'à cliquer et déplacer. 

#### Première utilisation

Avant toute chose il faut savoir que ans l'interface de votre navigateur vous avez un icône correpondant a Tapermonkey (ou violentmonkey...), un clic droit sur cet icône permet d'ouvrir un menu. Dans ce menu vous trouverez le menu de paramétrage de l'extension tampermonkey.Par convention j'appellerais ce menu le menu de l'extension

**Menu de l'extension**
- configure: permet de jouer sur les options de configuration
- menu bar on the top: permet de réafficher la barre de menu en haut de l'écran (compte tenu de la manière avec laquelle OC a codé l'application il est difficile de maintenir la barre en haut de la fenêtre)


**Boutons de la barre d'actions**
- COLLECTCHECKED :Permet d'ajouter les élements cochés à la bdd
- COLLECTAUTO : Permet de spécifier une période et de collecter automatiquement les sessions pour les ajouter en base
- SHOWBILL : Afficher la facture
- BILLINDETAILS : Afficher la facture en détail (plus exactement pour le moment affiche la liste des prestations à facturer pour uné période)
- PDF : Afficher la liste des prestations à facturer pour uné période
- SLIST : Affichage de la liste des étudiants
- DBGMODE : Permet d'accéder au mode debug (pour pouvoir exécuter des actions sur le coeur de l'application. Ce mode permet entre autres d'accéder au moteur de base de données et aux tables de l'application (je vous renvoie à la [documentation](https://stephanety-pro.github.io/OC-Mentors-AccountAddon/#/actionbar?id=dbgmode) pour plus d'informations).
- STATISTICS : Statistiques sur les sessions
- DATABASE : Actions sur la base de données
  - RAZ : Mise à zero de toutes ou parties des tables (choix de la date de RAZ possible) /!\ action irréversible
  - Export : Exporter la base de donnée au format json
  - Import : Importer la base de donnée au format json ... /!\ action irréversible
- ABOUT : En savoir plus


Pour plus d'information voir la [documentation](https://stephanety-pro.github.io/OC-Mentors-AccountAddon/)

## Configuration

Si vous faites un click gauche sur l'icone présent dans la barre de votre navigateur vous devriez voir apparaitre un menu avec une option "OC- facturier- configure", vous pourrez notamment définir les temps passé par type de session pour calculer votre THM

## Mise à jour

Elle devrait se faire en automatique depuis le dashboard de tampermonkey

Après chaque mise à jour avant toute manipulation assurez vous par précaution de faire les choses suivantes

- sauvegarde de la base
- remise à zéro du mois de facturation en cours (option database/épurer et cochez la case session et précisez le mois en cours) 

### Tester une mise à jour

En ajoutant un nouveau script tampermonkey et en procédant comme une nouvelle installation de ce script je peux très bien conserver deux versions du script actuel

## Désactiver la fonctionnalité

Dans tampermonkey désactiver l'utilisation du script , cette action est aussi possible au travers du menu disponible sur l'icone tampermonkey du navigateur (icone : carré noir avec deux ronds blancs)

## FAQ

> mon calcul est faux, je viens de relancer une collecte automatique mais le calcul n'est pas mis à jour

Pour gagner du temps j'ai mis en place deux stratégies :

 - un cache du total mensuel : ce cache est effectif sur le calcul des sessions du mois en cours, ce cache à une durée de validité de 2 min par défaut, et est détruit au rafraichissement de la page.
 - un archivage des totaux mensuels des mois précédents le mois en cours calculés (cela signifie qu'il faut en demander le calcul)
 
 De ce fait il est possible que le document qui vous est présenté soit issu de ce cache(archive). Pour contourner le problème vous pouvez

  - si c'est un mois précédent le mois en cours : utiliser l'option Database/RAZ tout décocher sauf les archives, et sélectionner la date à recalculer.
  - si c'est le mois en cours rafrîchir la page (par précaution si nous sommes le dernier jour du mois, faites aussi un raz le mois en cours par précaution)
  
> les polices du tableau sont trop grandes
 
Dans le menu de configuration vous pouvez configurer la taille des caractères

> Il y a un écart entre la facture détail et la facture globale

La facture détail est toujours recalculée à chaque demande, le cache et les archives ne sont pas utilisées ce qui peut expliquer un écart (cf. 'le point mon calcul est faux ci dessus').

> Qu'est ce que le THMp dans le module de statistiques

C'est un taux horaire personnalisé, vous pouvez déterminer dans la configuration du module les temps associés à une soutenace, une session de mentorat financé et non financée

> Pourquoi on me propose de créer un étudiant

Depuis juin 2020 les auto financés sont traités différement des financés, il faut donc que l'application puisse connaitre cet état. Puisque vous n'utilisez pas tous l'application depuis le début, si un étudiant n'est plus dans les effectifs l'application n'est pas capable de savoir si l'étudiant est auto financé ou pas (la zone parcours est là pour information et est facultative).

> Pourquoi ma collecte dans l'historique s'arrête inopinément ?

Parce qu'Openclassrooms (via leur CDN) finit par blacklister des ip quand on fait trop de requête (captcha à compléter) généralement ça refonctionne quelques dix minutes plus tard. Pour contourner le probleme vous pouvez toujours essayer d'afficher l'historique il est alors possible que vous ayez à compléter le captcha.


