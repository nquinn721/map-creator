app.factory('Preload', ['$http', function($http) {
	
	function Preload() {
		$http.get('/manifest');
		this.manifest = [
			{src: "marbleFloor.jpg", id: "marblefloor"},
			{src: "wood.jpg", id: "wood"},
			{src: "box.jpg", id: "box"},
			{src: "rocket.png", id: "rocket"}
		];

		
	}

	Preload.prototype = {
		init : function(cb) {
			this.queue = new createjs.LoadQueue(true);
			this.queue.on("progress", this.handleProgress);
			this.queue.on("complete", this.handleComplete.bind(this, cb));
			this.queue.on("fileload", this.handleFileLoad);
			$http.get('/manifest').then(function(manifest) {
				this.manifest = manifest.data;
				this.queue.loadManifest(manifest.data, true, "tilemaps/img/");
			}.bind(this));
		},
		handleComplete : function(cb, items) {
			setTimeout(function() {
				$('canvas').show();
				$('.grid-tabs').show();
				$('.progress-container').hide();
				cb(this.manifest);
			}.bind(this), 1000);
		},
		handleProgress : function(e) {
			$('.progress-bar').width(100 * e.progress + '%');
		},
		handleFileLoad : function() {
		}
	}
	return Preload
}]);
