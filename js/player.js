class Player {
    constructor(money, life, speed, time, level, difficulty) {
        this.money = money; // Argent de départ du joueur
        this.life = life; // Vie de départ du joueur
        this.speed = speed; // Vitesse de déplacement des monstres : 1 = rapide; 10 = normal; 20 = lent
        this.time = time; // Temps (en secondes) avant le début de la vague
        this.level = level; // Niveau du joueur
        this.score = 0;
        this.difficulty = difficulty;
    }

    loseLife(hit) {
        this.life -= hit;
        $('.infos span.life').text(this.life);

        if(this.life <= 0) {
            $('.score').text(this.level)
            clearInterval(timerMonsterMove);
            $('#high_score').modal({
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
        }
    }
    
}
