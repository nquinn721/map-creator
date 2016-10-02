app.factory('Spritesheet', function() {
	function Spritesheet(stage, obj) {
		this.stage = stage;
		this.file = 'img/' + obj.spritesheet;
		this.frames = [];
		this.animations = {};
	}
	Spritesheet.prototype = {
		drawImg : function(cb) {
			this.img = this.stage.draw.spritesheet(this.file, function() {
				this.stage.snapshot.updateSnapshotCanvas();
			}.bind(this));
		},
		createAnimation : function (name) {
			this.animations[name] = [];
		},
		addAnimationFrame : function(name, frame) {
			this.animation[name].push(frame);	
		},
		createFrame : function() {
			
		},
		destroyImages : function() {
			this.stage.removeChild(this.img);
		}
	}

	return Spritesheet;
})