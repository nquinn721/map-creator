app.factory('Erase', ['draw', function(draw) {
	function Erase(stage) {
		this.stage = stage;
		this.size = '2x2';
		this.name = 'erase';
		this.icon = 'eraser';
		this.shortcut = 'E';
	}

	Erase.prototype = {
		eraseFollowMouse : function() {
			var coords = this.stage.mouseMoveMouseCoords;
			this.stage.removeChild(this.square);

			if(this.size === '1x1')
				this.square = draw.square(coords.x - 12.5, coords.y - 12.5, 25, 25, 'white', 'transparent');
			if(this.size === '2x2')
				this.square = draw.square(coords.x - 25, coords.y - 25, 50, 50, 'white', 'transparent');
			if(this.size === '3x3')
				this.square = draw.square(coords.x - 37.5, coords.y - 35.7, 75, 75, 'white', 'transparent');
			this.x = coords.x - 25;
			this.y = coords.y - 25;
			this.w = 50;
			this.h = 50;
		},
		erase : function() {
			var items = this.stage.getItemsByXYWH(this.x, this.y, this.w, this.h);
			for(var i = 0; i < items.length; i++)
				this.stage.destroyItem(items[i]);
		},
		cleanUp : function() {
			this.stage.removeChild(this.square);
		},
		setSize : function(size) {
			this.size = size;
		}
	}
	return Erase;
}])