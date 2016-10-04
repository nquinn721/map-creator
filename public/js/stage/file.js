app.factory('File', function() {
	function File(stage, obj) {
		this.stage = stage;
		this.name = obj.name || 'untitled.js';
		this.items = obj.items || [];
		this.size = obj.size || {w : stage.baseWidth, h : stage.baseHeight};
		this.type = obj.type || 'tilemap';
		this.frames = obj.frames || [];
		this.animations = obj.animations || [{}];
		this.spritesheet = obj.spritesheet || null;
	}
	File.prototype = {

	}
	return File;
});