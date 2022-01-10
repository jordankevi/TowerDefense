/* ------------------------- */
/* ------ INFORMATION ------ */
/* Author : 
/* Version : 1.0
/* Date : 
/* Description :
/* ------------------------- */

var timerMonsterMove;

function displayScoreBoard() {
	$('#high_score_display').modal();
	html = "<h4>Tableau des scores</h4><ol>"
	for(let i = 0; i < highscore.length; i++) {
		html += `<li>${highscore[i][0]} : ${highscore[i][1]}`
	}
	$('#high_score_display').text("");
	$('#high_score_display').append(html);
}

function chooseDifficulty() {
	$('#difficulty').modal();
}

function initGame(difficulty) {
	$.modal.close();
	$('#menu').css("display", "none");
	$('#game-div').css("display", "block");
	$('body').css('background-image', 'url("./resources/background_game.svg")');
	launch(difficulty);
}

function reset() {
	$('.towers').empty();
	$('.path').remove();
}

function launch(difficulty) {

	/* ---------- ---------- */
	/* ----- SETTINGS ------ */
	/* ---------- ---------- */

	// Instanciation de la variable player qui stocke les informations du joueur
	var newPlayer = new Player(100, 20, 1, 3, 1, difficulty);

	/* ---------- ---------- */
	/* -------- PATH ------- */
	/* ---------- ---------- */

	// Objet littéral qui stocke le chemin des monstres
	
	var	newPath = new Path(100, 20);

	/* ---------- ---------- */
	/* ------ TOWERS ------- */
	/* ---------- ---------- */

	var towers = [];  // Tableau qui stocke toutes les tours du jeu

	displayTowers(newPlayer); 
	$('.game-commands').append('<div class="col-md-1 speed-command" style="position: absolute; top: 0px; right: 15px;"><img class="forward" src="./resources/fast-forward.svg"><p style="position: absolute; right: 15px; top: 15px;">x<span class="speed"></span></p></div>');
	$('.speed').text(1);
	$('.game-constructor').on('click', '.speed-command img',function() {

		let index = ([100, 25, 1].indexOf(newPlayer.speed) + 1) % 3
		newPlayer.speed = [100, 25, 1][index];
		console.log(newPlayer.speed)
		$('.speed').text(index + 1);
	});

	createTowers(newPlayer, towers);

	/* ---------- ---------- */
	/* ----- MONSTERS ------ */
	/* ---------- ---------- */

	var	monsters = []; // Tableau qui stocke tous les monstres du jeu

	/* ---------- ---------- */
	/* ------- GAME -------- */
	/* ---------- ---------- */

	startGame(newPlayer, newPath, monsters, towers);
}

// ------------------------------------------------------------------------- //
// ----------------------- ALL FUNCTIONS FOR THE GAME ---------------------- //
// ------------------------------------------------------------------------- //

// ----------------------
// --- FUNCTIONS GAME ---
// ----------------------

/** 
 * @function startGame - Fonction qui "démarre le jeu" :
 * 		1) Affiche les informations du joueur (argent, temps restant avant la prochaine vague, vies restantes, niveau),
 * 		2) Appelle la fonction qui crée les monstres du jeu,
 * 		3) Lance le décompte avant que les monstres se déplacent et que les tours les attaquent 
 */
function startGame(Player, Path, monsters, towers) {
	// 1) On affiche les informations du joueur dans la page html
	$('.infos span.time').text(Player.time);
	$('.infos span.life').text(Player.life);
	$('.infos span.money').text(Player.money);
	$('.infos span.level').text(Player.level);

	// 2) On crée les monstres du jeu
	createMonsters(Path, monsters, Player);
	// 3) On lance le décompte
	var timer = setInterval(function() {
		Player.time--; // On décompte le temps du joueur restant avant le début de la vague
		$('.infos span.time').text(Player.time); // ... et on l'affiche dans la page html

		if (Player.time <= 0) { // Si le décompte est à 0
			clearInterval(timer); // On arrête le décompte

			monstersMove(Player, Path, monsters, towers);
		}
	}, 1000); // 1000ms = 1s
}

// ----------------------
// -- FUNCTIONS OTHERS --
// ----------------------

/**
 * Fonction qui calcul l'hypotenuse
 */
function calculateHypotenuse(a, b) {
  return(Math.sqrt((a * a) + (b * b)));
}

/**
 * Fonction qui retourne une valeur entière en % d'une valeur par rapport à sa valeur maximale.
 * Elle est utilisée afin de transformer les hp d'un monstre en % pour l'affichage de la barre restante de vie du monstre.
 * Elle est également utilisée afin d'afficher la barre de progression de construction d'une tour en %
 * @example
 * percentageProgressBar(50, 200); // return 25
 */
function percentageProgressBar (val, valMax) {
	return parseInt(val * 100 / valMax);
}