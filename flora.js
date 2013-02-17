var basedna = {
	start: "X",
	branching: {
		"X": "F-[[X]+X]+F[+FX]-X", // where on growth to branch
		"F": "FF" // simulates growing
	}, // 
	line: "LINE", // LINE, ARC, RECT
	angle: 0.21, // amount to spread at each branch
	color: "0xff4234", // 0xRRGGBB
	width: 1.0,
	depth: 4,
	length: 2
};

var Flora = Joy.DisplayObject.extend({
	ticks: 0,
	init: function(x, y) {
		this._super({width:50, height:50});
		this.position.x = x;
		this.position.y = y;
		this.dna = basedna;
		this.ticks = 0;
	},

	render: function() {
		//this.dna
		this.drawLSystem(this.ctx, this.dna);
		//drawParticles(context, this.dna);
		//drawFlowers(context, this.dna);
	},

	drawLSystem: function(context, dna) {
		var fullsystem = dna.branching[dna.start];
		for(var i=1; i<dna.depth; i++) {
			// F-[[F-[[X]+X]+F[+FX]-X]+F-[[X]+X]+F[+FX]-X]+F[+FF-[[X]+X]+F[+FX]-X]-F-[[X]+X]+F[+FX]-X
			fullsystem = fullsystem.replace(/X/g, dna.branching["X"]);
			fullsystem = fullsystem.replace(/F/g, dna.branching["F"]);
		}
		//console.log(fullsystem);
		context.save();
		context.lineWidth = dna.width;
		context.strokeStyle = dna.color;
		//context.globalAlpha = 0.6;
		context.beginPath();
		context.moveTo(0,0);
		this.ticks += Joy.Support.deltaTime;
		var flow = Math.random()*0.1-0.05;
		for (var i = 0; i < fullsystem.length; i++) {
			switch(fullsystem[i]) {
				case "F":
					//context.beginPath();
					context.moveTo(flow,0);
					context.lineTo(flow, -dna.length);
					//context.stroke();
					context.translate(0, -dna.length);
					break;
				case "-":
					context.rotate(-dna.angle);
					break;
				case "+":
					context.rotate(dna.angle);
					break;
				case "[":
					context.save();
					break;
				case "]":
					context.restore();
					break;
				default:
					break;
			}
		};
		context.stroke();
		context.restore();
	}
});