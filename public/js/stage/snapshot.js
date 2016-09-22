app.factory('Snapshot', ['$timeout', function($timeout) {
	function Snapshot(stage) {
		this.stage = stage;
		this.snapshotStage = new createjs.Stage(document.createElement('canvas'));
	}

	Snapshot.prototype = {
		create : function(canvas) {
			var image = new Image();
			image.src = canvas.toDataURL("image/png");
			return image;
		},
		updateSnapshotCanvas : function() {
			var children = [],
				stage = this.stage.getStage();

			this.snapshotStage.children = null;
			for(var i = 0; i < stage.children.length; i++){
				if(!stage.children[i].graphics)
					children.push(stage.children[i].clone(true));
			}
			this.snapshotStage.children = children;
			this.createSnapShot();
		},
		createSnapShot : function() {
			$timeout(function() {
				this.stage.canvasImage = this.create(this.snapshotStage.canvas);
			}.bind(this), 100)
		}
	}

	return Snapshot;
}]);