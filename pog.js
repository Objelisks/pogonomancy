/* DEPENDENCIES
	Joy
	Flora
	Terrain
	Entites
*/


// global stuff (mostly for testing)
Joy.debug = false;
var engine = new Joy.Engine({canvas2d: document.getElementById('game')});
var plant = new Flora(50,350);
var terrain;
var player;

// Game Scene
engine.createScene(function(scene) {
	var background = new Joy.Rect({
		position: scene.viewport.position,
		width: engine.width,
		height: engine.height
	});
	background.colorize(Colors.sky);
	scene.addChild(background);

	terrain = new Joy.DisplayObjectContainer();
	for(var i=0; i<6; i++) {
		var newTile = new Tile(i*100 + 25, 400, 100, 50);
		terrain.addChild(newTile);
	}
	terrain.addChild(new Tile(590, 200, 50, 200));
	terrain.addChild(new Tile(0, 200, 50, 200));
	scene.addChild(terrain);

	player = new Wizard(175, 350, "#bb00aa").behave(PlayerBehaviour);

	scene.addChild(plant);
	plant.setColor(Colors.green);
	plant.allowCollisionFrom(terrain.children);
	for(var i=0; i<5; i++) {
		var newPlant = new Flora(150+i*75, 350);
		newPlant.setColor(Colors.palette((2 + i) % 7));
		newPlant.allowCollisionFrom(terrain.children);
		newPlant.allowCollisionFrom(player);
		scene.addChild(newPlant);
	}

	//plant.growSeed();
	var testSeed = new Seed(175, 200);
	testSeed.allowCollisionFrom(terrain.children);
	testSeed.allowCollisionFrom(player);
	scene.addChild(testSeed);
	scene.addChild(player);

	// TODO set up some system for collision groups (ie. making it easier and in one place)
	player.allowCollisionFrom(terrain.children);
});