/* DEPENDENCIES
	Joy
*/

// Right now, not any different from a Joy.Rect TODO
var Tile = Joy.Rect.extend({
	init: function(x, y, w, h) {
		this._super({width: w, height: h});
		this.position.x = x;
		this.position.y = y;
		this.color = Colors.earth;
	}
});