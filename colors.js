var Colors = {
	// 95ec010 60deg
	earth: "#7a6a53",
	sky: "#99b2b7",
	green: "#80B12C",
	blue: "#1F6B75",
	yellow: "#BFA930",
	orange: "#BF7530",
	purple: "#9D2763",
	allcolors: [],

	init: function() {
		this.allcolors = [this.earth, this.sky, this.orange, this.yellow, this.green, this.blue, this.purple];
	},

	palette: function(index) {
		return this.allcolors[index];
	},

	variate: function(color) {

	}

};

Colors.init();