# Etudiants

## Modifier un étudiant


## Changer le mode de financement d'un étudiant

ici étudiant d'id : 7582346 , transformer son mode de financement en "autre" (cf annexe list des code de financement)

```js
d_dbase.get(d_Student.tbl_name).find({id:'7582346'}).assign({funding:"autre"}).write();
```

/!\ Comme le financement est stocké dans la base des sessions, si vous modifiez un financement pour un étudiant il faut traiter consécutivement toute la base des sessions jusqu'à la date du prochain evenement historique de type modification de financement

C'est pourquoi il vaut mieux passer par l'objet Student qui va prendre ça en charge
