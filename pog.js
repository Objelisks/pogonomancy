Joy.debug = true;
var engine = new Joy.Engine({canvas2d: document.getElementById('game')});
var plant = new Flora(250,350);

engine.createScene(function(scene) {
	var background = new Joy.Rect({
		position: scene.viewport.position,
		width: engine.width,
		height: engine.height
	});
	background.colorize("#BFE5E5");
	scene.addChild(background);

	scene.addChild(plant);
});