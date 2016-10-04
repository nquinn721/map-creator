app.factory('Animation', function() {
	function Animation(stage) {
		this.stage = stage;
		this.name = 'animation';
		this.icon = 'gamepad';
		this.shortcut = 'A';
	}

	Animation.prototype = {
		create : function() {
			this.stage.currentFile.animations.push({});
		}
	}

	return Animation;
});