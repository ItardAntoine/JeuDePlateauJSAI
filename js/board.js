class Board {
	constructor(elt, weapons, infosBoardElt, players) {
		this.squares = [];
		this.clickableSquares = [];
		this.elt = elt;
		this.infosBoardElt = infosBoardElt;
		this.stopMoving;
		this.init();
		this.disposeObstacles();
		this.disposeWeapons(weapons);
		this.disposePlayers(players);
	}

	// fonction d'initialisation du plateau de jeu dans laquelle les cases sont créées et ajoutées à la grille de jeu
	
	init(){
		let colElt;
		let squareElt;
		let col;
		let square;
		for (let x = 0 ; x < NUMBER_OF_ROWS ; x++) {

			colElt = $("<div>");
			colElt.addClass("board-row");
			col = [];

			for (let y = 0; y < NUMBER_OF_COLUMNS ; y++) {


				squareElt = $("<div>");
				squareElt.addClass("board-square");
				colElt.append(squareElt);
				square = new Square(squareElt, x, y);
				col.push(square);
			}


			this.elt.append(colElt);

			this.squares.push(col);

		 }
	}


	// Disposition aléatoire des différents éléments du plateau : obstacles, armes puis joueurs


	// disposition aléatoire des obstacles
	disposeObstacles () {
		let randomX, randomY;

		for (let i = 0; i < NUMEBR_OF_OBSTACLES; i++) {

			randomX = Math.floor(Math.random() * NUMBER_OF_ROWS);
			randomY = Math.floor(Math.random() * NUMBER_OF_COLUMNS);

			
			// Deux obstacles ne peuvent être disposés l'un par dessus l'autre. 
			// Si la même position aléatoire qu'une précédente est générée pour un obstacle, le tour de boucle est 'annulé' 
			if (this.squares[randomX][randomY].occupied) {
				
				i--; // permet de ne pas compter ce tour de boucle en décrémentant le compteur i.
			
			} else {
				const obstacle = new Obstacle();
				this.squares[randomX][randomY].htmlElt.css("background-image" , "url(" + obstacle.img + ")");
				this.squares[randomX][randomY].occupied = obstacle;
			}

		}
	}

	// disposition aléatoire des armes
	disposeWeapons (weapons) { // le paramètre weapons est un tableau d'armes
		let randomX, randomY, keepsearching;

		weapons.forEach(weapon => { // on parcourt le tableau en positionnant chaque arme une fois dans la grille de jeu

			keepsearching = true;


			while (keepsearching) { 
			// l'arme ne pourra être disposée que sur une case vide
			// tant que la case trouvée est occupée on repart pour un tour de boucle supplémentaire

				randomX = Math.floor(Math.random() * NUMBER_OF_ROWS);
				randomY = Math.floor(Math.random() * NUMBER_OF_COLUMNS);

				if (!this.squares[randomX][randomY].occupied) {

					this.squares[randomX][randomY].htmlElt.css("background-image" , 'url(images/Weapons/'+ weapon.img + '.jpg)');
					this.squares[randomX][randomY].occupied = true;
					this.squares[randomX][randomY].weapon = weapon;
					keepsearching = false;
				}
			}
		});		
	}

	// disposition aléatoire des joueurs
	disposePlayers(players) {
		let randomX; let randomY;
		let keepsearching;

		players.forEach(player => {

			keepsearching = true;

			while (keepsearching) {

				randomX = Math.floor(Math.random() * NUMBER_OF_ROWS);
				randomY = Math.floor(Math.random() * NUMBER_OF_COLUMNS);
						
				// si la case aléatoire trouvée n'est pas occupée et que l'autre joueur n'est pas situé 
				// sur une case en haut en bas à droite ou à gauche de celle-ci, alors on positionne le joueur sur cette case
				if (!this.squares[randomX][randomY].occupied && !this.isplayernearby(randomX,randomY)) {
					
					player.position.x= randomX;
					player.position.y= randomY;
					this.squares[randomX][randomY].htmlElt.css("background-image" , "url(images/Players/" + player.img + ".jpg)");
					keepsearching = false;
					this.squares[randomX][randomY].occupied = player;
				}

			}
		});

	}

	// teste si aucun joueur n'est présent sur une case à côté d'une position donnée
	isplayernearby (x, y){

		if (this.squares[x-1] && this.squares[x-1] [y].occupied.type === 'Player'){

			return true;
		}

		if (this.squares[x+1] && this.squares[x+1] [y].occupied.type === 'Player'){

			return true;
		}

		if (this.squares[x] [y-1] && this.squares[x] [y-1].occupied.type === 'Player'){

			return true;
		}

		if (this.squares[x] [y+1] && this.squares[x] [y+1].occupied.type === 'Player'){

			return true;
		}
		return false;
	}


	// colore et rend clickables, les cases autour de la position du joueur qui représentent un déplacement valide.
	colorCasesNearPlayer(x, y){

		// a chaque changement de tour les cases clickabkes autour d'un joueur sont 'remises à zéro'
		// les cases autour de l'autre joueur qui va pouvoir joué sont initialisées.

		if (this.clickableSquares.length > 0){

			this.clickableSquares.forEach(function(square){

				square.htmlElt.css("background-color" , "white");
				square.clickable = false;

			});

			this.clickableSquares = [];
		}

		

		// si les 2 joueurs sont côte à côte ils ne peuvent plus se déplacer, les cases ne sont plus clickables ni colorées.
		// les joueurs ne peuvent que se battre (défendre/ attaquer)
		if(this.stopMoving) { return;}


		
		// les cases disponibles autour du joueur sont les 3 cases en haut, en bas , à gauche et à droite de sa position
		// si on sort des limites du tableau ou qu'un autre joueur ou un obstacle est rencontré, la recherche est arrété pour la direction en question.
		// on ne peut donc pas passer par dessus un obstacle ou un autre joueur.

		for (let i = 1; i <= 3; i++){
			if (this.squares [x-i] && this.squares[x-i] [y].occupied.type !== 'Player' && this.squares[x-i] [y].occupied.type !== 'Obstacle'){

				this.squares [x-i] [y].htmlElt.css("background-color" , "red");
				this.squares [x-i] [y].clickable = true ;
				this.clickableSquares.push(this.squares [x-i] [y]);
			}
			else {

				break;
			}
		}
		for (let i = 1; i <= 3; i++){
			if (this.squares[x+i] && this.squares[x+i][y].occupied.type !== 'Player' && this.squares[x+i][y].occupied.type !== 'Obstacle'){

				this.squares [x+i] [y].htmlElt.css("background-color" , "red");
				this.squares [x+i] [y].clickable = true ;
				this.clickableSquares.push(this.squares [x+i] [y]);
			}
			else {
				
				break;
			}
		}
		for (let i = 1; i <= 3; i++){
			if (this.squares [x] [y-i] && this.squares[x] [y-i].occupied.type !== 'Player' && this.squares[x] [y-i].occupied.type !== 'Obstacle'){

				this.squares [x] [y-i].htmlElt.css("background-color" , "red");
				this.squares [x] [y-i].clickable = true ;
				this.clickableSquares.push(this.squares [x] [y-i]);
			}
			else {
				
				break;
			}
		}
		for (let i = 1; i <= 3; i++){
			if (this.squares [x] [y+i] && this.squares[x] [y+i].occupied.type !== 'Player' && this.squares[x] [y+i].occupied.type !== 'Obstacle'){

				this.squares [x] [y+i].htmlElt.css("background-color" , "red");
				this.squares [x] [y+i].clickable = true ;
				this.clickableSquares.push(this.squares [x] [y+i]);
			}
			else {
				
				break;
			}
		}

	}
}
