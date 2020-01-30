class Square {

	constructor(htmlElt, x , y){

		this.htmlElt= htmlElt;
		this.occupied = false;
		this.addListener();
		this.clickable = false;
		this.x = x;
		this.y = y;
	}


	// ajout d'un écouteur d'événement au clique de chaque case du plateau.
	addListener(){

		this.htmlElt.click(()=> {

			if(game.over){

				game.restart();
			}
			else if (this.clickable && !game.board.stopMoving) {
				let player = game.getPlayerWhoCanPlay();

				game.board.stopMoving = player.player_Moving(this);
				
				game.switchPlayerWhoCanPlay();
				player = game.getPlayerWhoCanPlay();
				game.board.colorCasesNearPlayer(player.position.x , player.position.y);
				
			}	
		})
	}	
}
