# OC-Mentors-AccountAddon

![](https://img.shields.io/badge/build-pass-success)
![](https://img.shields.io/badge/version-1.00-orange)
[![](https://img.shields.io/badge/chat-workplace-blueviolet)](https://openclassrooms.workplace.com/groups/314612209540660/)

Cet addon vise à aider le mentor à préparer sa facture mensuelle, mais aussi à voir l'évolution de sa facturation via le module de statistiques intégré.

## Démarrage rapide

### Préalable

Commencer par installer tampermonkey (greasmonkey ou violetmonkey devraient fonctionner mais je n'ai pas testé)

### Installation du script

Aller dans le menu Tampermonkey et selectionner ajouter un nouveau script, ajouter le lien sur ce script


### Utilisation

Avant toute chose veuillez noter que la barre de menu ne s'affiche que si on est dans l'historique OC.

Cette barre de menu peut être déplacée en positionnant votre curseur sur le rond gris , il ne vous reste plus qu'à cliquer et déplacer. 

**Boutons**
- COLLECTCHECKED :Permet d'ajouter les élements cochés à la bdd
- COLLECTAUTO : Permet de spécifier une période et de collecter automatiquement les sessions pour les ajouter en base
- SHOWBILL : Afficher la facture
- BILLINDETAILS : Afficher la facture en détail (plus exactement pour le moment affiche la liste des prestations à facturer pour uné période)
- PDF : Afficher la liste des prestations à facturer pour uné période
- SLIST : Affichage de la liste des étudiants
- STATISTICS : Statistiques sur les sessions
- DATABASE : Actions sur la base de données
  - RAZ : Mise à zero de toutes ou parties des tables (choix de la date de RAZ possible) /!\ action irréversible
  - Export : Exporter la base de donnée au format json
  - Import : Importer la base de donnée au format json ... /!\ action irréversible
- ABOUT : En savoir plus

## Configuration

Si vous faites un click gauche sur l'icone présent dans la barre de votre navigateur vous devriez voir apparaitre un menu avec une option "OC- facturier- configure", vous pourrez notamment définir les temps passé par type de session pour calculer votre THM

## Mise à jour

Elle devrait se faire en automatique depuis le dashboard de tampermonkey


