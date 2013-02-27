/* DEPENDENCIES
	Joy
	Flora
*/

// majic is an effect that objects give off
// the way this is going to be structured, any object can have majic effects,
// but in practice only flora/flora by-products will actually do this
var Majic = Joy.Behaviour.extend({
	init: function(type) {

	},

	makeSeed: function() {

	},

	makeFlora: function() {
		var flora = new Flora();
		flora.behave(this);
		return flora;
	},

	cross: function(other) {

	},

	UPDATE: function() {
		//based on combinations
		// primary element secondary element
	}
});