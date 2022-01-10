class Path {
	constructor(size, length) {
		this.size = size;
		this.step = this.generatePath(length);

		this.createPath();
	}

	/**
 	* Méthode qui crée le chemin (visuel). 
 	*/
	createPath() {


	
		var prevTop  = 0;
		var prevLeft = this.start - 40; // On retire 40px afin de centrer les monstres sur le chemin
	
		var html = '<div class="path" style="top:0px;">';
		html += `<div id="house" style="width: ${this.size}px; height: ${(this.step[0][1])}px; top: ${prevTop}px; left: ${prevLeft}px; z-index: ${0}"></div>`;
		prevTop += this.step[0][1];
	
		for (let i = 1, c = this.step.length - 1; i < c; i++) {
			switch (this.step[i][0]) {
				case 'down':
					html    += `<div style="width: ${this.size}px; height: ${(this.step[i][1])}px; top: ${prevTop}px; left: ${prevLeft}px; z-index: ${2 * i}"></div>`;
					prevTop += this.step[i][1];
					break;
	
				case 'up':
					html    += `<div style="width: ${this.size}px; height: ${(this.step[i][1])}px; top: ${(prevTop-this.step[i][1])}px; left: ${prevLeft}px; z-index: ${2 * i}"></div>`;
					prevTop -= this.step[i][1];
					break;
	
				case 'right':
					html    += `<div style="height: ${this.size}px; width: ${(this.step[i][1] + this.size)}px; top: ${(prevTop)}px; left: ${prevLeft}px; z-index: ${2 * i}"></div>`;
					prevLeft+= this.step[i][1];
					break;
	
				case 'left':
					html    += `<div style="height: ${this.size}px; width: ${(this.step[i][1] + this.size)}px; top: ${(prevTop)}px; left: ${(prevLeft-this.step[i][1])}px; z-index: ${2 * i}"></div>`;
					prevLeft-= this.step[i][1];
					break;
			}
		}

		switch (this.step[this.step.length - 1][0]) {
			case 'down':
				html    += `<div id="school" style="width: ${this.size}px; height: ${(this.step[this.step.length - 1][1])}px; top: ${prevTop}px; left: ${prevLeft}px; z-index: ${2 * (this.step.length)}; background-position: bottom;"></div>`;
				break;

			case 'up':
				html    += `<div id="school" style="width: ${this.size}px; height: ${(this.step[this.step.length - 1][1])}px; top: ${(prevTop-this.step[this.step.length - 1][1])}px; left: ${prevLeft}px; z-index: ${2 * (this.step.length - 1)};  background-position: top;"></div>`;
				break;

			case 'right':
				html    += `<div id="school" style="height: ${this.size}px; width: ${(this.step[this.step.length - 1][1] + this.size)}px; top: ${(prevTop)}px; left: ${prevLeft}px; z-index: ${2 * (this.step.length - 1)};  background-position: right;"></div>`;
				break;

			case 'left':
				html    += `<div id="school" style="height: ${this.size}px; width: ${(this.step[this.step.length - 1][1] + this.size)}px; top: ${(prevTop)}px; left: ${(prevLeft-this.step[this.step.length - 1][1])}px; z-index: ${2 * (this.step.length - 1)};  background-position: left;"></div>`;
				break;
		}

		html += '<div class="monsters"></div>'
	
		html += '</div>';
	
		// On crée le chemin
		$('.game').append($(html));
	}

	generatePath(nbrTales) {
		let doLoop = true;
		let store = nbrTales;
		while(doLoop) {
			this.start = randomInt(1, Math.floor(window.innerWidth / this.size) - 3) * this.size;
			let iter = 0;
			var step = [];
			let previousDirection = "down";
			let length = this.size;
			this.top = 0;
			this.left = this.start;
			let i = 0;
			let stepPath = [[this.top, this.left]];
			nbrTales = store;			
			var insideJob = true;
			while((i < nbrTales) && (insideJob)) {
				iter++;
				if(iter >= 100) {
					insideJob = false;
				}
				let newDirection = randomDirection();
				if(this.isPlaceAvailable(newDirection) || this.willOverlapPath(newDirection, previousDirection, this.top, this.left, stepPath)) {
					continue;
				}
				if(newDirection == previousDirection) {
					length += this.size;
					this.updateTopLeft(newDirection);
					stepPath.push([this.top, this.left]);
					i += 1;
				} else {
					if (["up", "down"].includes(newDirection) && ["up", "down"].includes(previousDirection)) {
						continue;
					} else if(["left", "right"].includes(newDirection) && ["left", "right"].includes(previousDirection)) {
						continue;
					} else {
						this.updateTopLeft(newDirection);
						stepPath.push([this.top, this.left]);
						this.updateTopLeft(newDirection);
						stepPath.push([this.top, this.left]);
						step.push([previousDirection, length]);
						previousDirection = newDirection;
						length = 2 * this.size;
						i += 2;
					}
				}
			}
			if(i >= nbrTales) {
				doLoop = false;
			}
		}
		return step;
	}

	willOverlapPath(previousDirection, newDirection, top, left, stepPath) {
		let loop = (previousDirection != newDirection) ? 2 : 1;
		let res = []
		for(let i=0; i < loop; i++) {
			switch(newDirection) {
				case "left":
					left -= this.size;
					break;
				case "right":
					left += this.size;
					break;
				case "up":
					top -= this.size;
					break;
				case "down":
					top +=  this.size;
					break;
			}
			res.push(checkArrayIncludes(stepPath, [top, left]));
		}
		
		return (res.includes(true));
	}
	
	updateTopLeft(direction) {
		switch(direction) {
			case "left":
				this.left -= this.size;
				break;
			case "right":
				this.left += this.size;
				break;
			case "up":
				this.top -= this.size;
				break;
			case "down":
				this.top += this.size;
				break;
		}
	}

	isPlaceAvailable(direction) {
		switch(direction) {
			case "left":
				return this.left - 2 * this.size < 0;
			case "right":
				return this.left + 2 * this.size > window.innerWidth;
			case "up":
				return this.top - 2 * this.size < 0;
			case "down":
				return this.top + 2 * this.size > window.innerHeight - 150;
		}
	
	}

	/**
	 * Méthode qui calcule la taille de la zone de jeu
	 */
	calculSizePath() {
		var sizeX = this.start + this.size*2,
			sizeY = this.size;
	
		// Pour chaque étape du chemin :
		for (let i = 0, c = this.step.length; i < c; i++) {
			switch (this.step[i][0]) {
				case 'down':
					sizeY += this.step[i][1];
					break;
	
				case 'right':
					sizeX += this.step[i][1];
					break;
			}
			
		}
	
		// On définit la largeur du jeu :
		$('.game').css('min-width', sizeX + 'px');
	
		// On définit la heuteur du jeu :
		$('.game').css('min-height', (sizeY+250) + 'px');
	}

	/**
 	* Méthode qui déplace les monstres sur le jeu de 1px
 	*/
	runMonsters(monsters, Player) {

		// On déplace tous les monstres en fonction du chemin de 1px
		for (let i = 0; i < monsters.length; i++) {
	
			// SI le monstre est dans une des étapes du chemin
			if (this.step[monsters[i].cStep]) {
	
				// On vérifie si le monstre doit monter, descendre, aller à droite ou à gauche
				switch (this.step[monsters[i].cStep][0]) {
					
					// SI le monstre doit descendre
					case "down":
						if (monsters[i].topTemp < this.step[monsters[i].cStep][1]) {
							monsters[i].topTemp += monsters[i].speed;
							monsters[i].top += monsters[i].speed;
							monsters[i].moveUpDown();
						}
						else {
							monsters[i].topTemp = 0;
							monsters[i].cStep++;
							$(monsters[i].DOM).css("z-index", 2 * (monsters[i].cStep + 1) + 1);
						}
						break;
					
					// SI le monstre doit monter
					case "up":
						if (monsters[i].topTemp < this.step[monsters[i].cStep][1]) {
							monsters[i].topTemp += monsters[i].speed;
							monsters[i].top -= monsters[i].speed;
							monsters[i].moveUpDown();
						}
						else {
							monsters[i].topTemp = 0;
							monsters[i].cStep++;
							$(monsters[i].DOM).css("z-index", 2 * (monsters[i].cStep + 1) + 1);
						}
						break;
	
					// SI le monstre doit aller à droite
					case "right":
						if (monsters[i].leftTemp < this.step[monsters[i].cStep][1]) {
							monsters[i].leftTemp += monsters[i].speed;
							monsters[i].left += monsters[i].speed;
							monsters[i].moveLeftRight();
						}
						else {
							monsters[i].leftTemp = 0;
							monsters[i].cStep++;
							$(monsters[i].DOM).css("z-index", 2 * (monsters[i].cStep + 1) + 1);
						}
						break;
	
					// SI le monstre doit aller à gauche
					case "left":
						if (monsters[i].leftTemp < this.step[monsters[i].cStep][1]) {
							monsters[i].leftTemp += monsters[i].speed;
							monsters[i].left -= monsters[i].speed;
							monsters[i].moveLeftRight();
						}
						else {
							monsters[i].leftTemp = 0;
							monsters[i].cStep++;
							$(monsters[i].DOM).css("z-index", 2 * (monsters[i].cStep + 1) + 1);
						}
						break;
				}
			}
			// SINON le monstre n'a plus d'étape dans le chemin
			else {
				// On supprime le monstre du jeu (coté HTML)
				$(monsters[i].DOM).fadeOut('slow',function(){
					$(this).remove();
				});
	
				// On retire de la vie si le monstre arrive à la fin du chemin
				Player.loseLife(monsters[i].damage);
	
				// On supprime le montre du tableau des monstres
				monsters.splice(i,1);
			}
		}
	}
}
