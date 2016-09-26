app.factory('Snapshot', ['$timeout', function($timeout) {
	function Snapshot(stage) {
		this.stage = stage;
		this.snapshotStage = new createjs.Stage('mini-map');//document.createElement('canvas'));
	}

	Snapshot.prototype = {
		create : function(canvas) {
			var image = new Image();
			image.src = this.snapshotStage.canvas.toDataURL();
			return image;
		},
		updateCanvas : function() {
			this.snapshotStage.canvas.width = this.stage.currentFile.size.w;
			this.snapshotStage.canvas.height = this.stage.currentFile.size.h;	
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
			this.snapshotStage.update();
		},
		createSnapShot : function() {
			return this.create().src;
		}
	}

	return Snapshot;
}]);