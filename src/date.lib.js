    // https://stackoverflow.com/questions/28425132/how-to-calculate-number-of-working-days-between-two-dates-in-javascript-using#28425663
    // ajout du plugin UTC pour la partie sans prise en compte des changements d'heure
    // NOTE STT 01/05/2021 est un samedi
    var workday_count = function (start,end) { // STT exemple 01/07/2020 au 31/07/2020
        /* la table qui suit est construite de la manière suivante
        si je suis un dimanche (0) du dimanche (indice dayjs.day = 0) au lundi (indice 1) il y a 1 jours -> sur la ligne 0, colonne 1 => 1
        ... du dimanche au vendredi , mais aussi au samedi il y a 5 jours et du dimanche au dimanche il y a 0 jours

        SRC https://openclassrooms.com/forum/sujet/calculer-le-nombre-de-jour-entre-deux-dates-33473 (avec décalage pour les indices
        faire un tableau sur papier pour aller plus vite (ligne et colonne sont les jours de la semaine en démarrant à dimanche,dimanche
        */
        let lookup=[
            [0, 1, 2, 3, 4, 5, 5],
            [5, 1, 2, 3, 4, 5, 5],
            [4, 5, 1, 2, 3, 4, 4],
            [3, 4, 5, 1, 2, 3, 3],
            [2, 3, 4, 5, 1, 2, 2],
            [1, 2, 3, 4, 5, 1, 1],
            [0, 1, 2, 3, 4, 5, 0]
        ];
        //console.log(Math.trunc(end.diff(start,'days')/7)*5);
        //console.log(start.day(), end.day());
        //console.log(lookup[start.day()][end.day()]);
        //console.dir(lookup);
        return  Math.trunc(end.diff(start,'days')/7)*5+lookup[start.day()][end.day()]; // get the total
    } //
    
export { 
	workday_count,
};     
