# Etudiants

## Lister les étudiants


## Chercher le type de financement d'un étudiant 

si je donne une date, l'application regarde dans la table des historique le financement à cette date

```js
 d_Student.getFunding('7582346','20200801');
```

## Historique de l'étudiant

Chercher la liste des modifications historiques de l'étudiant 7582346

```js
d_dbase.get(d_StudentHistory.tbl_name).find({id:'7582346'}).value();
```
