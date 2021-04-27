# CHANGELOG

C : Corrections(Fixes) / B : Corrections de Bug (BugFixes) / F : Ajout de fonctionnalité (Features) / D : Divers (Misc)

  ## 1.10.0004 (27/04/2021)
  	- C: Prise en compte d'une évolution d'OpenClassrooms sur l'ui de l'écran de contrôle mentor

  ## 1.10.0003 (01/02/2021)
  
  	- C: Correction d'un bug dans la partie ajout d'étudiant
  	- A: Ajout de la fonctionnalité d'export
  	- D: Changement de nom pour la fonctionnalité export de base total qui est devenu sauvegarde
  	- D: Changement de nom pour la fonctionnalité import de base total qui est devenu chargement

  ## 1.10.0002 (18/01/2021)
  
  	- C: Correction d'un bug dans la partie ajout d'étudiant

  ## 1.10.0001 (14/01/2021)
  
  	- C: Correction d'un bug dans la partie management de base de donnée RAZ

  ## 1.10.0000 (14/01/2021)
    
    - F: prise en compte du mode autre dans les modes de financement 
    - F: possiblité de définir une feuille de style personnalisée
    - F: Mode debug qui permet d'intéragir avec l'application dans la console
    - F: versionning de base de donnée, avec outil de migration
    - B: Le calcul des statistiques a été revu pour intégrer les sessions étudiant absent pour 5 min et pas une session complète
    
    - D: réecriture complete de beaucoup de fonctionnalités les temps de calcul sont notamment divisés par 10
    - D: Début de documentation
    
    

  ## 1.00.0005 (30/07/2020)

  - F: Mise à jour du mode de calcul des stat, outre les performances, les stat du mois en cours ne sont plus ajoutées au stat totales, tant que nous ne sommes pas le dernier jour du mois (pour ne pas fausser les stat)
  - F: Travail sur la partie interface début de paramétrage d'un style personnalisé (non finalisé donc non pleinement fonctionnel)
  - F: Début de travail pour sortir un plugin autonome (3 versions user scripts/extension/standalone)
  - B: Corrections diverses
  
  ## 1.00.0004 (18/07/2020)

  - B: Erreur sous chrome : var dans extractDate non définie -> crash malgré le try/catch
  
  ## 1.00.0003 (17/07/2020)

  - B: Erreur en création des index d'historique qui a provoqué des erreurs en chaine
  - B: Correction du format de l'index des historique qui passe d'une chaine à un entier

  ## 1.00.0002 (16/07/2020)

  - B: Erreur RAZ la base n'était pas correctement effacée
  - F: import de base de donnée (json)
  - F: export de base de données (json)
 
 ## 1.00.0001 (15/07/2020)

  - B: Erreur en facture détail suite à changement de version 
  
 ## 1.00 (15/07/2020)
 
  - F:Ajout de la fonctionnalité de signet (cache sur l'historique)
  - F:Ajout de la possibilité d'ajouter une ou plusieurs feuille(s) de style ou du style personnel
  - D:Changement du mode de déploiement
  - F:Export du détail d'une facture au format PDF
  
## 0.9.0003

  - B:Oubli d'ajouter un import en création d'étudiant
  - F:Début de la fonctionnalité pour avoir plusieurs étudiants avec le meme id en base  

## 0.9.0002

 - F:Ajout de l'export manquant pour les archives
   
## 0.9.0001

- B:Bug dans le décompte des sessions annulées
- D:Passage en mode compilation + compression
- C:Correction du calcul du forfait   

## 0.9

 - F:Ajout du TJM en fonction du nombre de jours ouvrés (sans tenir compte de jours fériés)
 - F:Début de l'archivage des données financières (pour accélérer les stat)
 - F:Ajout de la possibilité de filtrer les données supprimées (financière pour le moment)
 - F: Intégration du niveau X de données financières
 - F:Ajout d'un "temoin d'inactivité de l'application"
 - D:Travail sur l'optimisation
 - F:Intégration d'un selecteur de date pour la RAZ
 - F:Début de travail sur le PDF

## 0.8

 - B:Correction d'un bug sur l'affichage des prix unitaires
 - F:Ajout de la possibilité en configuration de régler le temps de mise en cache dans le menu de configuration du "plugin"
 - F:Ajout du read.me dans le about
 - B:Correction du bug sur le mois dans les stat
 - B:Corrections de bugs divers
 - D:Nettoyage du code, mises en commentaires de console
 - F:Ajout de la notion de canceled dans les statistiques
 - F:Ajout du paramétrage du nombre d'heure nécessaire par type de session pour les stats
 
## 0.7.0001

 - D:Version pour corriger le bug d'antony (deuxieme essai) 
 
 ## 0.7
 
 - F:Suite module de statistiques
 - F:Utilisation de memoize pour mettre en cache le tableau
 - F:UI Suppression du bouton getstudents qui ne sert plus à rien car lancé en automatique si l'étudiant n'est pas trouvé dans la liste
 - C:Correction du bug pour Antony (document.arrive non disponible... mise en place provisioire d'un event alternatif)

## 0.6

 - F:Travail sur la pré facture : changement du code pour une meilleure performance et pour permettre la réalisation de stat mensuselle : créattion d'un module spécifique
 - C:Prise en compte du statut étudiante absente, version au féminin du statut étudiant absent pris en compte jusque là.
 - F:Début du travail sur le module de statistique

## 0.5 

 - C:correction de la matrice de calcul après juin
 - F:intégration du calcul du bonus af
 - C:Ccorrections diverses de texte (changements de mots principalement)
 - C:Nettoyage de quelques dépendances
 - D:Travail sur la fonction fetch history pour la simplifier
 - D:UI changement de texte de la facture
 - D:UI la case à cocher est renommée en "in DB"
 - F:La fonctionn addCbox ne recrée pas toute les cbox à chaque fois on peut donc l'appeller apres la collecte automatique
 - F:En création d'étudiant la liste des parcours (incomplète est proposée dans l'autocompletion
 - B:Correction d'un bug dans la facturation avant 06/2020 (mauvaise affectation de la catégorie des noshow : annulé tardivement qui étaient visuellement avec les sessions)

## 0.4.0002 

  - C:Oubli d'une trace deboggage

## 0.4.0001 

  - C:Correction des libellés de boutons (menu)

## 0.4 

  - F:ajout de la mention dont X soutenances plutot que X soutenances
  - F:ajout de la fonctionnalité sur les périodes
  - F:le popup de selection de date incrémente automatiquement la date de fin de 1 mois si on change la date de débu
  - F:nettoyage de code
  - B:sur la facturation prise en compte des noshow sur tous les étudiants
  - B:sur la prise en compte des dates

## 0.3.0001 

  - F:Correction d"un bug sur les dates

## 0.3 Première version publique



 * 0.4.0001 Correction des libellés de boutons (menu)
 * 0.4.0002 Oubli d'une trace deboggage
 * 0.5 correction de la matrice de calcul après juin
 *     intégration du calcul du bonus af
 *     corrections diverses de texte (changements de mots principalement)
 *     nettoyage de quelques dépendances
 *     travail sur la fonction fetch history pour la simplifier
 *     UI changement de texte de la facture
 *     UI la case à cocher est renommée en "in DB"
 *     la fonctionn addCbox ne recrée pas toute les cbox à chaque fois on peut donc l'appeller apres la collecte automatique
 *     en création d'étudiant la liste des parcours (incomplète est proposée dans l'autocompletion
 *     correction d'un bug dans la facturation avant 06/2020 (mauvaise affectation de la catégorie des noshow : annulé tardivement qui étaient visuellement avec les sessions)
 *
 *
