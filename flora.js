/* DEPENDENCIES
	Joy
	Entities
*/

// eventually have a bunch of different base plant types
// main part of dna is branching lsystem
// TODO proc gen genetic combination of branching factors
// decide on dominant traits
// these are initial traits, and genetic material
// flora should have duplicate variables for most of these

// seeds fall and roll around and can be picked up
var SeedBehaviour = Joy.Behaviour.extend({
	UPDATE: function() {
		if(!this.willCollideAt(new Joy.Vector2d(this.collider.width/2, this.collider.height))) {
			this.velocity.y = 2;
		}
		else {
			this.velocity.y = 0;
		}
	},

	COLLISION: function(other) {
		if(other instanceof Wizard) {
			other.take(this);
			this._parent.removeChild(this);
		}
	}
});

// seeds can be TODO picked up and TODO planted
// they are both inventory items and physical world objects
var Seed = Joy.DisplayObject.extend({
	init: function(x, y) {
		this._super({width:10, height:10});
		this.position.x = x;
		this.position.y = y;
		this.behave(Joy.Behaviour.Movimentation);
		this.collider = new Joy.RectCollider(new Joy.Vector2d(0,0), 10, 10);

		this.dna = Genetics.clone(DNA.Grass);
		this.behave(SeedBehaviour);
	},

	render: function() {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(this.width/2, this.height/2, 5, 0, Math.PI*2, false);
		this.ctx.fill();
		this.ctx.restore();
	}
});

// flora grow based on dna, generate seeds to propagate dna, and have sex with other flora
// initialized with root position and dna sequence
var Flora = Joy.DisplayObjectContainer.extend({
	init: function(x, y, dna) {
		this._super({width:50, height:50});
		this.position.x = x;
		this.position.y = y;
		this.dna = Genetics.clone(DNA.Grass);
		this.delta = Math.random() * 50;
		this.deltadelta = Math.random() * 20;

		this.bind(Joy.Events.KEY_PRESS, function(evt) {
			if(evt.keyCode == Joy.Keyboard.LEFT) {
				if(this.dna.length > 0.2) {
					this.dna.length -= 0.01;
				}
			}
			if(evt.keyCode == Joy.Keyboard.RIGHT) {
				if(this.dna.length < 20) {
					this.dna.length += 0.01;
				}
			}
			if(evt.keyCode == Joy.Keyboard.Q) {
				this.growSeed();
			}
		});

		// listens for update trigger events
		this.bind('update', this.update);
		
		this.fullsystem = this.dna.branching[this.dna.start];
		for(var i=1; i<this.dna.depth; i++) {
			// F-[[F-[[X]+X]+F[+FX]-X]+F-[[X]+X]+F[+FX]-X]+F[+FF-[[X]+X]+F[+FX]-X]-F-[[X]+X]+F[+FX]-X
			this.fullsystem = this.fullsystem.replace(/X/g, this.dna.branching["X"]);
			this.fullsystem = this.fullsystem.replace(/F/g, this.dna.branching["F"]);
		}

		this.particles = new ParticleSystem();
		var p = this.particles;
		p.maxLife = 3;
		p.spawnRate = 1;
		p.velocityVariation.x = 0.2;
		p.velocityVariation.y = 0.2;
		p.initAcceleration.y = 0.005;
	},

	setColor: function(color) {
		this.dna.color = color;
		this.particles.colors = [this.dna.color];
	},

	growSeed: function() {
		//TODO broken
		var newSeed = new Seed(this.position.x + this.width*Math.random(), this.position.y + this.height*1/3*Math.random());
		newSeed.allowCollisionFrom(this._collisionTargets);
		this.parent.addChild(newSeed); // add to the scene
	},

	update: function() {
		// these are mostly arbitrary right now TODO clean up
		this.delta += 1.0 / 60.0;
		this.deltadelta += (Math.sin(this.delta) + Math.random()) / 60.0;
		this.particles.update();
	},

	// only for seeds TODO probably for flowers too
	addChild: function(displayObject) {
		this._super(displayObject);
		displayObject.allowCollisionFrom(this._collisionTargets);
	},

	render: function() {
		this.ctx.save();
		//this.drawFlowers(); TODO

		if(!this.particles.ctx)
			this.particles.ctx = this.ctx;
		this.drawLSystem();
		this.particles.render();
		this.ctx.restore();
	},

	// draws the fancy tree recursively
	// this is kind of slow, so only do it for low recursion depths
	drawLSystem: function() {
		this.ctx.save();
		var flow = Math.sin(this.deltadelta) * 0.1;

		this.ctx.lineWidth = this.dna.width;
		this.ctx.strokeStyle = this.dna.color;
		this.ctx.shadowBlur = 3.0;
		this.ctx.shadowColor = this.dna.color;
		// maybe shadow
		// maybe colored shadow

		this.ctx.beginPath();
		this.ctx.translate(this.width/2, this.height);
		this.ctx.moveTo(0,0);

		// for each symbol defined, do a thing
		// grammar could be specified somewhere else, and operate on a context
		// TODO if braces are mismatched, shit gets fucked, maybe check for that
		var pindex = 0;
		var angle = 0;
		var relx = this.width/2;
		var rely = this.height;
		var stack = [];
		var prev = "";
		for (var i = 0; i < this.fullsystem.length; i++) {
			switch(this.fullsystem[i]) {
				case "F":
					this.ctx.moveTo(0,0);
					this.ctx.lineTo(0, -(this.dna.length + flow));
					relx -= Math.sin(angle) * -(this.dna.length + flow);
					rely += Math.cos(angle) * -(this.dna.length + flow);
					this.ctx.translate(0, -(this.dna.length + flow));
					break;
				case "-":
					this.ctx.rotate(-this.dna.angle - flow);
					angle += -this.dna.angle - flow;
					break;
				case "+":
					this.ctx.rotate(this.dna.angle);
					angle += this.dna.angle;
					break;
				case "[":
					this.ctx.save();
					stack.push({x:relx, y:rely, a:angle});
					break;
				case "]":
					this.ctx.restore();
					var last = stack.pop();
					relx = last.x;
					rely = last.y;
					angle = last.a;
					break;
				default:
					break;
			}

			if(this.fullsystem[i] == "X" && this.fullsystem[i-1] == "F") {
				if(this.particles.spawnPoints[pindex]) {
					this.particles.spawnPoints[pindex].x = relx;
					this.particles.spawnPoints[pindex].y = rely;
				} else {
					this.particles.spawnPoints[pindex] = {x:relx, y:rely};
				}
				this.ctx.arc(0,0,7,-Math.PI*3/2,Math.PI/2);
				pindex++;
			}
			prev = this.fullsystem[i];
		};

		// draw the whole thing
		this.ctx.stroke();
		this.ctx.restore();
	}
});