function vagues(Player) {
    let vague = Player.level
    Player.life += (vague % 10 == 0) ? 5 : 0 ;
    return [
        {life: Player.difficulty * 100, name: 'MMI1', money: 2, img: 'resources/MMI_Premiere_annee.svg', damage: 1, speed: 2, quantity:5 + Math.floor(vague/5)},
        {life: Player.difficulty * 200, name: 'MMI2', money: 3, img: 'resources/MMI_Deuxieme_annee.svg', damage: 1, speed: 2, quantity: (vague % 5 > 1) ? 3 + Math.floor(vague/10) : 0},
        {life: Player.difficulty * 350, name: 'Délégué', money: 5, img: 'resources/MMI_delegue.svg', damage: 2, speed: 1, quantity: (vague % 5 > 2) ? 2 : 0},
        {life: Player.difficulty * 350, name: 'Déléguée', money: 5, img: 'resources/MMI_Deleguee.svg', damage: 2, speed: 1, quantity: (vague % 5 > 2) ? 2 : 0},
        {life: Player.difficulty * 80, name: 'Stagiaire', money: 2, img: 'resources/MMI_Premiere_annee.svg', damage: 1, speed: 4, quantity: (vague % 5 > 3) ? 3 : 0},
        {life: Player.difficulty * 400 + 50 * Math.floor(i / 5), name: 'Professeur', money: 2, img: 'resources/Professeur_M.svg', damage: 2, speed: 1, quantity: (vague % 10 >= 5) ? 1 : 0},
        {life: Player.difficulty * 400 + 50 * Math.floor(i / 5), name: 'Professeure', money: 2, img: 'resources/Professeur_F.svg', damage: 2, speed: 1, quantity: (vague % 10 >= 5) ? 1 : 0},
        {life: Player.difficulty * 1000 + 500 * Math.floor(vague / 10), name: 'Directeur', money: 250, img: 'resources/Directeur_de_departement.svg', damage: 10, speed: 2, quantity: (vague % 10 == 0) ? 1 : 0},
    ]
}
