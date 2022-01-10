// ----------------------
// -- FUNCTIONS TOWERS --
// ----------------------

/**
 * Fonction qui déclare les différentes tours du jeu et retourne un tableau de ces dernières
 * @return {array} Retourne un tableau comprenant les différentes tours disponibles
 */
function towersAvailable() {
	var towersAvailable = [];

	var ControlerTower = {
		dist : 100,
		type : 'Controleur',
		carac : 'Damage',
		img  : 'resources/controleur.svg',
		time : 100,
		money: 20,
		sizeX: 60,
		sizeY: 60,
		damage: 0.50,
		options: {},
	};
	towersAvailable.push(ControlerTower);

	var WaterTower = {
		dist : 150,
		type : 'Guichet',
		carac : 'Slower',
		img  : 'resources/guichet.svg',
		time : 400,
		money: 40,
		sizeX: 60,
		sizeY: 60,
		damage: 1,
		options: {},
	};
	towersAvailable.push(WaterTower);

	var FireTower = {
		dist : 200,
		type : 'Super controleur',
		carac : 'EXPLOSION',
		img  : 'resources/super_controleur.svg',
		time : 500,
		money: 100,
		sizeX: 60,
		sizeY: 60,
		damage: 1,
		options: {explosionRadius: 200, explosionDamage: 0.25},
	};
	towersAvailable.push(FireTower);

	return towersAvailable;
}

/**
 * Fonction qui affiche les tours disponibles dans la partie construction du jeu
 */
function displayTowers(Player){
	// On récupère les tours disponibles à créer
	var tabTowersAvailable = towersAvailable();

	// On réinitialise le contenu html dans la partie construction des tours
	$('.game-constructor .all-towers').html('');

	var html = '';

	// On boucle sur le tableau comprenant toutes les différents tours du jeu
	for (var i = 0, c = tabTowersAvailable.length; i < c; i++) {
		if (Player.money >= tabTowersAvailable[i].money) { // SI le joueur a assez d'argent pour payer la tour
			html = '<div class="col-md-2 tower">';
		}
		else {
			html = '<div class="col-md-2 tower disabled">'; // SI le joueur n'a pas assez d'argent pour payer la tour : on ajoute la classe CSS "disabled"
		}
			html += `<div class="infos">
						<p>Distance shot :<br>${tabTowersAvailable[i].dist}</p>
						<p>Damage shot :<br>${tabTowersAvailable[i].damage}%</p>
						<p>Time to built :<br> ${tabTowersAvailable[i].time}</p>
					</div>

					<img src="${tabTowersAvailable[i].img}" alt="Tour ${tabTowersAvailable[i].type}" class="tower img-fluid">
					<h5>${tabTowersAvailable[i].type}</h5>
					<p>${tabTowersAvailable[i].money} <img src="resources/billet.svg" alt="Diamond" class="diamond img-fluid"></p>
				</div>`;

		$('.game-constructor .all-towers').append(html);
	}
}

/**
 * Check if the tower is not to close to another.
 * @param {e} event containg the position of the cursor (position of the tower to place)
 * @param {towers} list of all the towers already place on the game
 *
 * @return true if the tower is toclose to another, false otherwise
 */
function notToCloseToTower(e, towers) {
    var top       = e.pageY - 30,
        left      = e.pageX - 15,
        distX     = 0,
        distY     = 0,
        distMin   = calculateHypotenuse(45, 45);

    // On vérifie pour chaque tour existante dans le jeu si le joueur peut créer la tour (afin d'éviter de créer une tour sur une tour)
    for (var i = 0, c = towers.length; i < c; i++) {
        distX = Math.abs(towers[i].left - left);
        distY = Math.abs(towers[i].top - top);
        hypo  = calculateHypotenuse(distX, distY);

        // On vérifie si la distance entre le clic et les tours existantes
        // SI le clic est dans une zone d'une tour existante : on refuse l'ajout
        if (hypo < distMin) {
            return false;
        }
    }
    return true;
}


/** 
 * Check if the tower is on the path.
 * @param {e} event containing the position of the cursor
 *
 * @return true if the tower is on the path, false otherwise
 */
function isOnPath(e) {
    var top       = e.pageY - 30,
        left      = e.pageX - 15,
        right     = e.pageX + 15,
        bottom    = e.pageY + 30;
        path      = $(".path").children();
    for (const pathItem of path) {
        let t = pathItem.offsetTop;
        let l = pathItem.offsetLeft;
        let b = t + pathItem.offsetHeight;
        let r = l + pathItem.offsetWidth;
        if (top <= b && bottom >= t && left <= r && right >= l) {
            return true;
        }
    }
    return false;
}

/**
 * Fonction qui permet de cliquer sur l'image d'une tour dans la partie construction afin de créer une tour dans le jeu (html). Elle permet également d'afficher ou masquer la zone de la portée de tir de la tour
 */
function createTowers(Player, towers) {
	var canCreateTower; // Variable booléenne qui indique si le joueur peut créer ou non la tour : true / false
	var tabTowersAvailable = towersAvailable();
	var TowerSelected; // Tour sélectionnée (instance de l'objet Tower)

	// On affiche les informations de la tour que l'on survolle
	$('.game-constructor').on({
	    mouseenter: function () {
	        $(this).parent().find('.infos').fadeIn();
	    },
	    mouseleave: function () {
	        $(this).parent().find('.infos').fadeOut();
	    }
	}, '.tower img.tower');

	// SI l'utilisateur clique sur l'image d'une tour
	$('.game-constructor').on('click', '.tower img',function() {

		// A modifier
		for (i = 0, c = tabTowersAvailable.length; i < c; i++) {
			if (tabTowersAvailable[i].type == $(this).parent().find('h5').text()) {
				TowerSelected = tabTowersAvailable[i];
				break;
			}
		}

		// SI le joueur a suffisamment d'argent pour acheter la tour sélectionnée
		if(Player.money >= TowerSelected.money){
			canCreateTower = true; // On définit que l'on peut créer la tour
		}
	});

	// Quand on clique sur une tour présente dans le jeu : on affiche ou on masque la zone de tir de la tour
	$('.game').on('click', '.tower',function(){
		$(this).find('.area').toggle();
	});

	// SI l'utilisateur appuie sur la touche "echap" afin de ne pas ajouter de tour
	$(document).keyup(function(e) {
		if (e.keyCode === 27) { // 27 correspond à la touche "échap"
			canCreateTower = false; // On définit que l'on ne peut pas créer la tour
			$('.follow-tower').css('display', 'none'); // On masque la "follow tower" de la zone de jeu
		}
	});

	// SI l'utilisateur clique sur la zone du jeu
	$('.game').click(function(e) {
		if (canCreateTower == true) { // SI la tour peut être créée
            var canCreate = notToCloseToTower(e, towers) && !isOnPath(e);
			// SI on peut créer une tour
			if (canCreate == true) {
                var top       = e.pageY - 30,
                    left      = e.pageX - 15;

                // On crée une nouvelle tour : on crée une nouvelle instance de la classe Tower
                var newTower = new Tower(top, left, TowerSelected.dist, TowerSelected.type, TowerSelected.img, TowerSelected.time, TowerSelected.money, TowerSelected.damage, TowerSelected.carac, TowerSelected.options, Player.speed);

				// On l'ajoute au tableau des tours
				towers.push(newTower);

				canCreateTower = false; // On réinitialise la variable
				$('.follow-tower').css('display', 'none'); // On masque la "follow tower" de la zone de jeu

				// On retire de l'argent au joueur
				Player.money -= TowerSelected.money;
				$('.infos span.money').text(Player.money);

				// On réactualise l'affichage des tours à créer
				displayTowers(Player);
			}
		}
	});

	// Quand on déplace la souris sur la page afin de créer une tour
	$('.game').mousemove(function(e){
		if (canCreateTower == true) {
            if (notToCloseToTower(e, towers) && !isOnPath(e)) {
                $('body').css('cursor', 'auto');
            } else {
                $('body').css('cursor', 'not-allowed');
            }
			// On définit la taille de la zone d'attaque
			$('.follow-tower .area').css('width', (TowerSelected.dist*2) + 'px');
			$('.follow-tower .area').css('height', (TowerSelected.dist*2) + 'px');

			// On positionne la zone d'attaque autour du curseur
			$('.follow-tower .area').css('top', ((TowerSelected.dist*2-TowerSelected.sizeY)/-2) + 'px');
			$('.follow-tower .area').css('left', ((TowerSelected.dist*2-TowerSelected.sizeX)/-2) + 'px');

			// On définit le type de la tour à afficher
			$('.follow-tower div.type p').text(TowerSelected.type);

			// On affiche son image
			$('.follow-tower img').attr('src', TowerSelected.img);

			// On affiche la tour
			$('.follow-tower').show();

			// On la déplace en fonction du curseur
			$('.follow-tower').css({'top': e.pageY - TowerSelected.sizeX/2, 'left': e.pageX - 15 });
		}
	});
}

/**
 * Définition de la classe Tower afin de créer une tour pour le jeu
 * @constructor
 * @param {number} top - Position de la tour en top dans la page html
 * @param {number} left - Position de la tour en left dans la page html
 * @param {number} dist - Distance de tir de la tour
 * @param {string} type - Type de la tour
 * @param {string} img - Source de l'image de la tour
 * @param {number} time - Temps de construction de la tour
 * @param {number} money - Montant de ma construction de la tour
 * @param {number} damage - Puissance des dégâts de la tour (1 = 1 hp / px)
 * @param {number} speed - Vitesse du jeu définie dans l'objet littéral Player.speed 
 * 
 * @property {number} sizeX - Taille en largeur de la tour dans la page html - 60px par défaut
 * @property {number} sizeY - Taille en largeur de la tour dans la page html - 60px par défaut
 * @property {number} minLeft - Position en left minimale où la tour peut tirer
 * @property {number} maxLeft - Position en left maximale où la tour peut tirer
 * @property {number} minTop - Position en top minimale où la tour peut tirer
 * @property {number} maxTop - Position en top maximale où la tour peut tirer
 * @property {boolean} canAttack - Indique si la tour peut tirer ou non (par exemple si elle est construire complètement)
 * @property {Object} DOM - Sélecteur jQuery afin d'accéder au code source du monstre dans la page html
 * @property {Object} monsterTarget - Instance d'un monstre ciblé par la tour

 * @method createLoader() - Méthode appelée lors de la création d'une nouvelle tour qui crée et affiche une barre de progression de la construction de la tour afin d'être fonctionnelle
 * @method create() - Méthode appelée quand la construction est finie afin d'afficher la tour dans la page html. Elle permet également de définir la propriété "DOM" afin de pouvoir facilement sélectionner le code source dans la page html et ainsi la manipuler
 */
class Tower {
	constructor(top, left, dist, type, img, time, money, damage, carac, options, speed) {
		this.top = top;
		this.left = left;
		this.sizeX = 60;
		this.sizeY = 60;
		this.dist = dist;
		this.minLeft = 0;
		this.maxLeft = this.left + this.dist + this.sizeX/2;
		this.minTop = 0;
		this.maxTop = this.top + this.dist + this.sizeY/2;
		this.type = type;
		this.img = img;
		this.time = time;
		this.money = money;
		this.damage = damage;
		this.carac = carac;
		this.options = options;
		this.canAttack = false;
		this.DOM = false;
		this.monsterTarget = null;

		if ((this.top - this.dist) > 0) {
			this.minTop = this.top - this.dist - this.sizeY/2;
		}

		if ((this.left - this.dist) > 0) {
			this.minLeft = this.left - this.dist - this.sizeX/2;
		}

		this.createLoader = function () {
			var html = $(`<div class="tower" style="top: ${(this.top + 15)}px; left: ${(this.left + this.sizeX/2)}px;">
							<div class="progress-bar bg-info" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="width:0%;">0</div>
						</div>`);

			$('.towers').append(html);

			var compte = 0;
			var timer = setInterval(() => {
				if (compte <= this.time) {
					compte++;
					html.find('div.progress-bar').text(percentageProgressBar(compte, this.time));
					html.find('div.progress-bar').css('width', percentageProgressBar(compte, this.time) + '%');
					html.find('div.progress-bar').attr('aria-valuenow', compte);
				}
				else {
					clearInterval(timer);
					this.create();
					html.remove();
				}
			}, speed);

		};

		this.createLoader();

		this.create = function() {
			this.canAttack = true;

			var html = $(`<div class="tower" style="top: ${this.top}px; left: ${this.left}px;" data-distance="${this.dist}" data-type="${this.type}">
							<div class="area" style="width: ${this.dist * 2}px; height: ${this.dist * 2}px; top: ${(this.dist * 2 - this.sizeY) / -2}px; left: ${(this.dist * 2 - this.sizeX) / -2}px"></div>
							<img src="${this.img}" alt="Tour ${this.type}">
							<div class="type"><p>${this.type}</p></div>
						</div>`);

			this.DOM = html; // On stocke dans la propriété "DOM" de l'objet le code HTML généré
			$('.towers').append(html);
		};
	}
}
