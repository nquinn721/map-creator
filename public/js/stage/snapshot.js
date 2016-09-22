app.factory('snapshot', function() {
	function Snapshot() {
		
	}

	Snapshot.prototype = {
		create : function(canvas) {
			var image = new Image();
			image.src = canvas.toDataURL("image/png");
			return image;
		}
	}

	return new Snapshot;
});