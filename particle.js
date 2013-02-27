var ParticleSystem = Joy.DisplayObject.extend({
	spawnPoints: [],
	spawnArea: {x:0, y:0, w:0, h:0},
	colors: [],
	//particles: [],
	deadParticles: [],
	liveParticles: 0,
	maxParticles: 100,
	spawnRate: 10,
	lastSpawn: 0,
	maxLife: 10,
	lifeVariation: 0,

	init: function() {
		//this.bind('update', this.update);
		this.particles = [];
		this.colors = [];
		this.deadParticles = [];
		this.spawnPoints = [];
		this.initVelocity = {x:0, y:0};
		this.initAcceleration = {x:0, y:0};
		this.velocityVariation = {x:0, y:0};
		this.accelerationVariation = {x:0, y:0};
	},

	update: function() {
		if(this.liveParticles < this.maxParticles && (Date.now() > this.lastSpawn + 1000.0/this.spawnRate)) {
			if(this.deadParticles.length > 0) {
				var index = this.deadParticles.pop();
				this.createParticle(this.particles[index]);
			} else {
				this.createParticle(null);
			}
			this.lastSpawn = Date.now();
			this.liveParticles++;
		}
	},

	render: function() {
		this.ctx.save();

		this.ctx.beginPath();
		for(var index in this.particles) {

			var particle = this.particles[index];
			if(!particle.dead) {
				this.ctx.fillStyle = particle.color;
				this.ctx.moveTo(particle.oldx, particle.oldy);
				this.ctx.fillRect(particle.x-1, particle.y-1, 3, 3);

				this.updateParticle(particle);
				if(particle.dead) {
					this.deadParticles.push(index);
					this.liveParticles--;
				}
			}

		}

		this.ctx.restore();
	},

	createParticle: function(particle) {
		if(!particle) {
			particle = {
				dead: false,
				life: 0,
			};
			this.particles.push(particle);
		} else {
			particle.dead = false;
			particle.life = 0;
		}

		particle.maxLife = this.maxLife + Math.random() * this.lifeVariation;

		if(this.spawnPoints.length > 0) {
			var pos = this.spawnPoints[Math.floor(Math.random()*(this.spawnPoints.length))];
			particle.x = pos.x;
			particle.y = pos.y;
		} else {
			particle.x = this.spawnArea.x + Math.random()*this.spawnArea.w;
			particle.y = this.spawnArea.y + Math.random()*this.spawnArea.h;
		}

		particle.vel = {x: this.initVelocity.x + this.velocityVariation.x*2 * Math.random() - this.velocityVariation.x, 
						y: this.initVelocity.y + this.velocityVariation.y*2 * Math.random() - this.velocityVariation.y};
		particle.acc = {x: this.initAcceleration.x + this.accelerationVariation.x*2 * Math.random() - this.accelerationVariation.x, 
						y: this.initAcceleration.y + this.accelerationVariation.y*2 * Math.random() - this.accelerationVariation.y};

		particle.oldx = particle.x;
		particle.oldy = particle.y;
		if(this.colors.length > 0) {
			particle.color = this.colors[Math.floor(Math.random()*(this.colors.length))];
		} else {
			particle.color = "black";
		}
	},

	updateParticle: function(particle) {
		particle.oldx = particle.x;
		particle.oldy = particle.y;

		particle.x += particle.vel.x;
		particle.y += particle.vel.y;

		particle.vel.x += particle.acc.x;
		particle.vel.y += particle.acc.y;

		particle.life += 1.0 / 60.0;
		if(particle.life > particle.maxLife) {
			particle.dead = true;
		}
	}

});