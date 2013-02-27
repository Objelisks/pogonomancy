var Genetics = {
	clone: function(dna) {
		var ret = {};
		for(var property in dna) {
			ret[property] = dna[property];
		}
		return ret;
	},

	cross: function(dna1, dna2) {

	}
}

var DNA = {
	Grass: {
		start: "X", // meta branching
		branching: new Object({
			"X": "F-[[X]+X]+F[+FX]-X", // where on growth to branch
			"F": "FF" // simulates growing
		}), // 
		line: "LINE", // LINE, ARC, RECT
		angle: 0.21, // amount to spread at each branch
		color: "#59AA60", // #RRGGBB
		width: 1.0, // width of line segments
		depth: 3, // recursive depth
		length: 10, // length of line segments (lengthen to grow tree)
		seedShape: "circle" // shape of seeds, maybe make this a polygon for editability
	},

	Water: {
		start: "X", // meta branching
		branching: new Object({
			"X": "F-[[X]+X]+F[+FX]-X", // where on growth to branch
			"F": "FF" // simulates growing
		}), // 
		line: "ARC", // LINE, ARC, RECT
		angle: 0.21, // amount to spread at each branch
		color: "#59AA60", // #RRGGBB
		width: 1.0, // width of line segments
		depth: 3, // recursive depth
		length: 10, // length of line segments (lengthen to grow tree)
		seedShape: "circle" // shape of seeds, maybe make this a polygon for editability
	}
}