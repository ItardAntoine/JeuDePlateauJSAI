class Game {
	constructor(boardEltId, infosPlayersBoardId, weapons, player1Name, player1Image, player2Name, player2Image, startWeapon) {
		
		const boardElt = $(`#${boardEltId}`);
		this.infosPlayersBoardElt = $(`#${infosPlayersBoardId}`);
		this.startWeapon = startWeapon;
		this.player1 = new Player(player1Name, player1Image, this.startWeapon, this.infosPlayersBoardElt);
		this.player2 = new Player(player2Name, player2Image, this.startWeapon, this.infosPlayersBoardElt);
		this.init(boardElt, weapons, this.infosPlayersBoardElt);
	}

	init(boardElt, weapons, infosPlayersBoardElt) {
		this.over = false;
		this.board = new Board(boardElt, weapons, infosPlayersBoardElt, [this.player1, this.player2]);
		this.selectwhostart();
		const playerwhobegins = this.getPlayerWhoCanPlay();

		this.board.colorCasesNearPlayer(playerwhobegins.position.x, playerwhobegins.position.y);
	}


	// choix aléatoire de quel joueur va commencer à jouer.
	selectwhostart (){
			const randomNumber = Math.random();
			if (randomNumber < 0.5){

				this.player1.canPlay = true;
			}
			else {

				this.player2.canPlay = true;
		}
	}

	// retourne le joueur autour duquel c'est de jouer.
	getPlayerWhoCanPlay (){

		if(this.player1.canPlay === true){

			return this.player1 ;
		}

		else {

			return this.player2 ;
		}

	}

	// changement de tour
	switchPlayerWhoCanPlay() {

		this.player1.canPlay = !this.player1.canPlay;
		this.player2.canPlay = !this.player2.canPlay;
	}

	// retourne l'autre joueur que celui duquel on a donné le prénom en paramêtre 
	getOtherPlayer(name) {

		if (name === 'Les Daltons') {

			return this.player1;
		}

		else {

			return this.player2;
		}
	}

	// redémarrer une partie
	restart() {

		const restart = confirm("Partie terminée : Voulez-vous rejouer ?");

		
		if (restart){

			document.location.reload(true);

		}	

		else {
			
			alert("Merci d'avoir joué à mon jeu !")
		}

	}
}
