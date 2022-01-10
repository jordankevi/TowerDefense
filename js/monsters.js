// ----------------------
// - FUNCTIONS MONSTERS -
// ----------------------


/**
 * Fonction qui crée des monstres et les ajoute dans le tableau "monsters"
 */
function createMonsters(Path, monsters, Player) {
	let MonsterToCreate;
	let monstersVague = vagues(Player);

	// On crée l'ensemble des monstres que l'on stocke dans un tableau (variable max = 5 correspond à l'ajout de 5 monstres dans le tableau)
	for(let j = 0; j < monstersVague.length; j++) {
		let monsterLife = monstersVague[j].life;
		let monsterName = monstersVague[j].name;
		let monsterMoney = monstersVague[j].money;
		let monsterImage = monstersVague[j].img;
		let monsterDamage = monstersVague[j].damage;
		let monsterSpeed = monstersVague[j].speed;
		let monsterQuantity = monstersVague[j].quantity;
		
		for (let i = 0; i < monsterQuantity; i++) {
			// On crée un monstre : on instancie un nouvel objet de la classe Monster
			MonsterToCreate = new Monster(-100*(i+1), Path.start, monsterLife, monsterName, monsterMoney, monsterImage, monsterDamage, monsterSpeed);
			monsters.push(MonsterToCreate); // On met l'instance du monstre dans le tableau des monstres
		}
	}
}

/**
 * Fonction qui déplace les monstres sur le jeu et permet aux tours d'attaquer
 */
function monstersMove(Player, Path, monsters, towers) {
	timerMonsterMove = setInterval(function(){
		Path.runMonsters(monsters, Player);

		// On boucle sur chaque tour afin de vérifier si elle peut attaquer un monstre ou si elle doit rechercher une cible
		for (let i = 0, c = towers.length; i < c; i++) {
			if(towers[i].carac == 'Damage') {
				// Si la tour a une cible :
				if (towers[i].monsterTarget !== null) {
					monsterHittedByTower(Player, towers[i], monsters);
				}
				// Sinon, elle recherche la cible la plus proche
				else {
					monsterClosestToTheTower(towers[i], monsters);
				}
			}
			if(towers[i].carac == 'Slower') {
				// Faire la liste des monstres dans la portée
				resetMonstersSpeed(towers[i].monstersToSlow);
				towers[i].monstersToSlow = [];
				monstersInRange(towers[i], monsters);
				monsterSlowedByTower(towers[i], monsters);
			}
			if(towers[i].carac == 'EXPLOSION') {
				if(towers[i].monsterTarget !== null) {
					monsterHittedByTower(Player, towers[i], monsters);
				} else {
					monsterClosestToTheTower(towers[i], monsters);
				}
			}
		}

		// S'il n'y a plus de monstres, on lance la prochaine vague
		if (monsters.length == 0) {
			Player.level = Player.level + 1;
			Player.time = 3;
			startGame(Player, Path, [], towers);
			clearInterval(timerMonsterMove);
		}
	}, Player.speed);
}


/**
 * Fonction réinitialise la vitesse des monstres
 * @param {Array} monsters 
 */
function resetMonstersSpeed(monsters) {
	if(monsters) {
		for(let i=0; i < monsters.length; i++) {
			monsters[i].speed = monsters[i].baseSpeed;
			$(monsters[i].DOM).find('.monster-picture').css("filter", "invert(0)");
		}
	}
}

/**
 * Fonction qui vérifie si la tour peut attaquer le monstre qu'elle cible. Elle vérifie que le monstre qu'elle cible est toujours vivant et à distance de tir. Si le monstre n'a plus de HP pendant ce tour, on retire le monstre du jeu et le joueur gagne l'argent que le monstre lui rapporte.
 */
function monsterHittedByTower(Player, Tower, monsters) {

	// SI le monstre est toujours à distance :
	if ( (Tower.minTop < Tower.monsterTarget.top) && (Tower.monsterTarget.top < Tower.maxTop) && (Tower.minLeft < Tower.monsterTarget.left) && (Tower.monsterTarget.left < Tower.maxLeft)) {
		
		// On retire des HP au monstre cible
		Tower.monsterTarget.hp -= 1*Tower.damage;
		if(Tower.carac == 'EXPLOSION') {
			explode(Tower, monsters)
		}

		// On change l'affichage de la barre de HP du monstre
		$(Tower.monsterTarget.DOM).find('div.progress-bar').text(parseInt(Tower.monsterTarget.hp));
		$(Tower.monsterTarget.DOM).find('div.progress-bar').css('width',percentageProgressBar(Tower.monsterTarget.hp, Tower.monsterTarget.hpMax) + '%');
		$(Tower.monsterTarget.DOM).find('div.progress-bar').attr('aria-valuenow',Tower.monsterTarget.hp);

		// Si le monstre n'a plus de hp
		let i = 0;
		let length = monsters.length;
		while(i < length) {
			if (monsters[i].hp <= 0){

				// On supprime le monstre du jeu (html)
				$(monsters[i].DOM).fadeOut('slow',function(){
					$(this).remove();
				});

				// On supprime le montre du tableau des monstres

				// On fait gagner de l'argent au joueur
				Player.money += monsters[i].money;
				$('.infos span.money').text(Player.money);

				// On réactualise l'affichage des tours à créer
				displayTowers(Player);
				monsters.splice(i,1);
				length--;
			} else {
				i++;
			}
		}
	}
	// SINON, on retire le monstre ciblé de la tour
	else {
		Tower.monsterTarget = null;
	}	
}

/**
 * Fonction qui calcule pour la tour le monstre le plus proche à portée de tir
 */
function monsterClosestToTheTower(Tower, monsters){
	var hypo,
		distX   = 0,
		distY   = 0,
		distMin = 10000;
		
	// Pour chaque monstre
	for (var i = 0, c = monsters.length; i < c; i++) {

		// SI la tour peut attaquer (elle a fini d'être construite) ET le montre est à distance de tir
		if ( (Tower.canAttack == true) && (Tower.minTop < monsters[i].top) && (monsters[i].top < Tower.maxTop) && (Tower.minLeft < monsters[i].left) && (monsters[i].left < Tower.maxLeft) ) {
			distX = Math.abs(monsters[i].left - Tower.left);
			distY = Math.abs(monsters[i].top - Tower.top);
			hypo  = calculateHypotenuse(distX, distY); // On calcule la distance entre le monstre et la tour

			// Si la distance est inférieure on définit la nouvelle cible
			if (hypo < distMin) {
				distMin = hypo;
				Tower.monsterTarget = monsters[i];
			}
		}
	}
}

/**
 * Fonction qui donne la liste des monstres dans la portée de la tour
 */
function monstersInRange(Tower, monsters) {
	for (let i = 0; i < monsters.length; i++) {
		if((Tower.canAttack == true) && (Tower.minTop < monsters[i].top) && (monsters[i].top < Tower.maxTop) && (Tower.minLeft < monsters[i].left) && (monsters[i].left < Tower.maxLeft)) {
			Tower.monstersToSlow.push(monsters[i]);
		}
	}
}

/**
 * 
 * 
 */
function explode(Tower, monsters) {
	for(let i = 0; i < monsters.length; i++) {
		distX = Math.abs(monsters[i].left - Tower.monsterTarget.left);
		distY = Math.abs(monsters[i].top - Tower.monsterTarget.top);
		hypo = calculateHypotenuse(distX, distY);

		if(hypo < Tower.options.explosionRadius) {
			monsters[i].hp -= 1*Tower.options.explosionDamage;
			// On change l'affichage de la barre de HP du monstre
			$(monsters[i].DOM).find('div.progress-bar').text(parseInt(monsters[i].hp));
			$(monsters[i].DOM).find('div.progress-bar').css('width',percentageProgressBar(monsters[i].hp, monsters[i].hpMax) + '%');
			$(monsters[i].DOM).find('div.progress-bar').attr('aria-valuenow',monsters[i].hp);
		}
	}
}


/**
 * Fonction qui ralentie les monstres à portée de la tour.
 * @param {*} Tower 
 */
function monsterSlowedByTower(Tower) {

	for(let i = 0; i < Tower.monstersToSlow.length; i++) {
		// SI le monstre est toujours à distance :
		if ( (Tower.minTop < Tower.monstersToSlow[i].top) && (Tower.monstersToSlow[i].top < Tower.maxTop) && (Tower.minLeft < Tower.monstersToSlow[i].left) && (Tower.monstersToSlow[i].left < Tower.maxLeft) && Tower.monstersToSlow[i].hp > 0) {
			
			// On retire des HP au monstre cible
			Tower.monstersToSlow[i].speed *= 0.5*Tower.damage;
			$(Tower.monstersToSlow[i].DOM).find('.monster-picture').css("filter", "invert(0.5)");
		}
		// SINON, on retire le monstre ciblé de la tour
		else {
			Tower.monstersToSlow[i].speed = Tower.monstersToSlow[i].baseSpeed;
			$(Tower.monstersToSlow[i].DOM).find('.monster-picture').css("filter", "invert(0.5)");
			Tower.monstersToSlow.slice(i, 1);
		}	
	}
}

/**
 * Définition de la classe Monster afin de créer un monstre pour le jeu
 * @constructor
 * @param {number} top - Position du monstre en top dans la page html
 * @param {number} left - Position du monstre en left dans la page html
 * @param {number} hp - Nombre de points de vie du monstre
 * @param {string} name - Nom du monstre
 * @param {number} money - Argent que rapporte le monstre quand il n'a plus de point de vie
 * @param {string} img - Source de l'image du monstre
 * @namespace
 * @property {number} topTemp - Position temporaire du monstre en top dans la page html
 * @property {number} leftTemp - Position temporaire du monstre en left dans la page html
 * @property {number} hpMax - Nombre de points de vie maximal du monstre
 * @property {number} cStep - Etape du monstre dans le chemin
 * @property {Object} DOM - Sélecteur jQuery afin d'accéder au code source du monstre dans la page html
 * @method create() - Méthode appelée lors de la création d'un nouveau monstre qui permet de créer et d'afficher le monstre dans la page html. Elle permet également de définir la propriété "DOM" afin de pouvoir facilement sélectionner le code source dans la page html et ainsi le manipuler
 * @method moveUpDown() - Méthode qui permet de déplacer le monstre dans la page html en position top
 * @method moveLeftRight() - Méthode qui permet de déplacer le monstre dans la page html en position left
 */
class Monster {
	constructor(top, left, hp, name, money, img, damage, speed) {
		this.top = top;
		this.topTemp = top;
		this.left = left;
		this.leftTemp = 0;
		this.hp = hp;
		this.hpMax = hp;
		this.name = name;
		this.money = money;
		this.img = img;
		this.cStep = 0;
		this.damage = damage;
		this.baseSpeed = speed;
		this.speed = speed;

		// On appelle la méthode qui crée un monstre (html)
		this.create();
	}

	create() {
		var html = $(`<div class="monster" style="top: ${this.top}px; left: ${this.left}px; z-index:3" data-hp="${this.hp};" data-name="${this.name}">
			<img class="monster-picture" src="${this.img}" style="object-fit:contain;" alt="Monstre ${this.name}">
			<div class="progress-bar bg-success" role="progressbar" aria-valuemin="0" aria-valuemax="${this.hp}" aria-valuenow="${this.hp}" style="width:100%;">${this.hp}</div>
			</div>`);

		this.DOM = html; // On stocke dans la propriété "DOM" de l'objet le code HTML généré
		$('.monsters').append(html);
	};

	// Méthode qui permet de déplacer le monstre vers le haut/bas
	moveUpDown() {
		$(this.DOM).css('top', this.top + 'px');
	};

	// Méthode qui permet de déplacer le monstre vers la droite/gauche
	moveLeftRight() {
		$(this.DOM).css('left', this.left + 'px');
	};
}