const knife 		= new Weapon ( "couteau", 10);
const arc 			= new Weapon ( "arc", 15);
const gun 			= new Weapon ( "pistolet", 20);
const winchester 	= new Weapon ( "Winchester", 25);
const weapons 		= [arc,gun,winchester];

let game = new Game('board', 'infos-joueurs', weapons, "Lucky Luke", "lucky_luke", "Les Daltons", "Les_daltons", knife);
