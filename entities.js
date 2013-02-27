/* DEPENDENCIES
	Joy
*/

// PlayerBehaviour depends of keyboard input, moves the object around like a thing
// holds movement related variables like speed, jump height, etc TODO
var PlayerBehaviour = Joy.Behaviour.extend({
	moveSpeed: 2,

	KEY_DOWN: function(evt) {
		if(evt.keyCode == Joy.Keyboard.UP) {
			this.jump();
		}
		if(evt.keyCode == Joy.Keyboard.X) {
			this.activate();
		}
	},

	// each frame
	KEY_PRESS: function(evt) {
		if(evt.keyCode == Joy.Keyboard.LEFT) {
			this.moveLeft();
		}
		if(evt.keyCode == Joy.Keyboard.RIGHT) {
			this.moveRight();
		}
	},

	KEY_UP: function(evt) {
		if(evt.keyCode == Joy.Keyboard.LEFT || evt.keyCode == Joy.Keyboard.RIGHT) {
			this.acceleration.x = 0;
		}
	},

	moveLeft: function() {
		// TODO maybe pick some better collision points
		if(!this.willCollideAt(new Joy.Vector2d(0, this.collider.height/2))) {
			this.acceleration.x = -this.moveSpeed;
		} else {
			this.acceleration.x = 0;
			this.velocity.x = 0;
		}
	},

	moveRight: function() {
		if(!this.willCollideAt(new Joy.Vector2d(this.collider.width, this.collider.height/2))) {
			this.acceleration.x = this.moveSpeed;
		} else {
			this.acceleration.x = 0;
			this.velocity.x = 0;
		}
	},

	jump: function() {
		if(this.grounded) {
			this.velocity.y -= 100;
		}
	},

	UPDATE: function() {
		if(this.willCollideAt(new Joy.Vector2d(5, this.collider.height)) ||
			this.willCollideAt(new Joy.Vector2d(this.collider.width-5, this.collider.height))) {
			this.acceleration.y = 0;
			this.velocity.y = 0;
			this.grounded = true;
		} else {
			this.grounded = false;
		}

		if(this.willCollideAt(new Joy.Vector2d(0, this.collider.height/2)) || 
		this.willCollideAt(new Joy.Vector2d(this.collider.width+5, this.collider.height/2))) {
			this.acceleration.x = 0;
			this.velocity.x = 0;
		}

		if(!this.grounded) {
			this.acceleration.y += .098;
		}
	}
});

// Wizards are either players or netplayers or bots (maybe?)
// input decided by behaviours
// dynamically coloured TODO
var Wizard = Joy.DisplayObject.extend({
	init: function(x, y, color) {
		this._super({width:25, height:50});
		this.behave(Joy.Behaviour.Movimentation);
		this.position.x = x;
		this.position.y = y;
		this.color = color;
		this.collider = new Joy.RectCollider(new Joy.Vector2d(0,0), this.width, this.height);
		this.inventory = [];

		this.maxVelocity.set(3, 10);
		this.friction.set(0.5, 0);
		this.grounded = true;
	},

	render: function() {
		this.ctx.save();
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(0,0,this.width, this.height);
		this.ctx.restore();
	},

	take: function(thing) {
		console.log("taking");
		this.inventory.push(thing);
	},

	activate: function() {
		if(this.inventory.length > 0) {
			var item = this.inventory.pop();
			this._parent.addChild(item);
		}
	}
});