class Player {

	constructor (name, img, startWeapon, infosPlayersBoardElt){
  		this.type = 'Player';
  		this.name = name ;
  		this.img = img ;
  		
  		this.introducecharacter();

  		this.position = {
    		x: null,
	    	y: null,
	  	};
  		this.health = 100;
  		this.weapon = startWeapon;
  		this.shield = false;
  		this.canPlay = false;

  		this.initBoardInfos(infosPlayersBoardElt);
  	}

  	introducecharacter(){

  		console.log("Bonjour, je m'appelle " + this.name);
  	}

	
	// 'dessine' et ajoute les sections contenant les champs qui contiendront les infos pour chaque joueur
	// 'santé', 'arme', 'dégats', 'image' et 'nom'
	initBoardInfos(infosPlayersBoardElt) {

		const infosJoueurElt = $("<div>");
	    infosJoueurElt.addClass("infos-joueur");

		const nomElt = $("<p>");
		nomElt.html(this.name) ;
		infosJoueurElt.append(nomElt);

		this.santeElt =$("<p>");
		infosJoueurElt.append(this.santeElt);

		this.armeElt = $("<p>");
		infosJoueurElt.append(this.armeElt);

		this.degatsElt = $("<p>");
		infosJoueurElt.append(this.degatsElt);

		this.updateBoardInfos();


		const imgElt = $("<img src =\"images/Players/"  +  this.img   +  ".jpg\" alt = \"icône du joueur\" />");
		
		infosJoueurElt.append(imgElt);

		const attackButtonElt = $("<input type = \"button\" value = \"Attaquer autre joueur\"/>");
		
		infosJoueurElt.append(attackButtonElt);


		// ajout d'un bouton d'attaque et de défense.


		attackButtonElt.click(() => {

			if(game.over){

				game.restart();
			}
			else{
				const otherPlayer = game.getOtherPlayer(this.name);
				this.attack(otherPlayer);
			}
		});

		const defendButtonElt = $("<input type = \"button\" value = \"Se défendre contre l'adversaire\"/>");
		
		infosJoueurElt.append(defendButtonElt);
		
		defendButtonElt.click(() => {

			if(game.over){

				game.restart();
			}
			else {
				const otherPlayer = game.getOtherPlayer(this.name);
				this.defend(otherPlayer);
			}
		});



	 	infosPlayersBoardElt.append(infosJoueurElt);

	}

	// mise à jour les infos d'un joueur (diminution de la santé, changement d'arme)
	updateBoardInfos() {

		this.santeElt.html(this.health);
		this.armeElt.html(this.weapon.img);
		this.degatsElt.html(this.weapon.damage);
	}
  	

  	// déplacement d'un joueur
  	player_Moving(newsquare){
  		let mustfight = false;

  		const oldsquare = game.board.squares[this.position.x][this.position.y];
  		if(oldsquare.weapon){

  			oldsquare.htmlElt.css("background-image" , 'url(images/Weapons/'+ oldsquare.weapon.img + '.jpg)');
  		}
  		else{
			oldsquare.htmlElt.css("background-image" , "");
		}
		oldsquare.occupied = false;
  		this.position.x = newsquare.x;
  		this.position.y = newsquare.y;
  			
		// si le joeueur se retrouve à côté de l'autre joueur il ne peut plus se délplaer. 
  		if(game.board.isplayernearby(this.position.x , this.position.y)){
  			mustfight = true;
 		}
  		if(newsquare.weapon){	

  			const actualWeapon = this.weapon ;
  			this.weapon = newsquare.weapon;
  			this.updateBoardInfos();
  			newsquare.weapon = actualWeapon;
  		}
  		newsquare.htmlElt.css("background-image" , "url(images/Players/" + this.img + ".jpg)");
  		newsquare.occupied = this;
  		console.log (this.name + ' possède un ' + this.weapon.img);
  		return mustfight;
  	} 

  	// attaquer l'autre joueur
  	attack(otherPlayer){

		if(!this.canPlay){

			alert("Ce n'est pas votre tour !");
			return;
		}


  		if (this.health <= 0){
  			// si l'attaquant n'a déjà plus de santé.
  			alert(this.name + ' a perdu');

  			return;
  		}
  		if(otherPlayer.health <= 0){
  			// si le joueur attaqué a erdu toute sa santé, la partie est finie.
  			alert(otherPlayer.name + ' a perdu');

  			return;
  		}
		if(game.board.isplayernearby(this.position.x , this.position.y)){

			if(otherPlayer.shield){
				// si le joueur attaqué se défend (a préalablement appuyé sur le bouton défense)
				// sa santé ne sera diminué que par la moitié des dégats de l'arme de l'attaquant
				otherPlayer.health = otherPlayer.health - this.weapon.damage / 2;
				otherPlayer.shield = false;
			}
			else{

				otherPlayer.health = otherPlayer.health - this.weapon.damage;
			}

			otherPlayer.updateBoardInfos();

			if(otherPlayer.health <= 0){

				alert(otherPlayer.name  + ' a perdu');
				game.restart();
				game.over = true;

			}
			
			game.switchPlayerWhoCanPlay();
			game.board.colorCasesNearPlayer(otherPlayer.position.x , otherPlayer.position.y);
			
		}
		else {

			alert('Les deux joueurs sont trop loin pour pouvoir s\'attaquer');
		}
  	
	}

	// se défendre
	defend(otherPlayer){

		if(!this.canPlay){

			alert("Ce n'est pas votre tour !");
		
		}
		else if (this.shield){

			alert("Bouclier déjà activé!");
		}
		else {

			this.shield = true;
			game.switchPlayerWhoCanPlay();
			game.board.colorCasesNearPlayer(otherPlayer.position.x , otherPlayer.position.y);

		}

	}
}
