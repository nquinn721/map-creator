app.factory('Paint', function() {
	function Paint(stage) {
		this.stage = stage;
		this.name = 'paint';
		this.icon = 'paint-brush';
		this.shortcut = 'P';
	}

	Paint.prototype = {
		paint : function(mouse) {
			if(this.stage.isMoving)return;
			mouse = mouse.col ? mouse : this.stage.mouseMoveMouseCoords;
			var x = mouse.x, 
				y = mouse.y,
				row = mouse.row,
				col = mouse.col,
				el;
			
			this.stage.createItem(
				row, 
				col, 
				col * this.stage.CELL_WIDTH , 
				row * this.stage.CELL_HEIGHT, 
				this.stage.CELL_WIDTH, 
				this.stage.CELL_HEIGHT, 
				this.stage.currentItem.file, 
				this.stage.currentItem.src,
				this.stage.currentItem.element
			  );

		},
		paintFollowMouse : function(e) {
			if(this.stage.getItemByXY(e.stageX, e.stageY))
				this.stage.noPaint = true;
			else this.stage.noPaint = false;
		},
		paintMouseDown : function() {
			if(this.stage.isMoving)return;
			this.paint(this.stage.mouseDownMouseCoords);
		}
	}
	return Paint;
});