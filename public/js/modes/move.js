app.factory('Move', function() {
	function Move(stage) {
		this.stage = stage;
		this.name = 'move';
		this.icon = 'arrows';
		this.shortcut = 'M';
	}
	Move.prototype = {
		moveMouseDown : function() {
			this.stage.showcontextMenu = false;
			this.currentRow = this.stage.mouseDownMouseCoords.row;
			this.currentCol = this.stage.mouseDownMouseCoords.col;	
		},
		move : function() {
			this.stage.isMoving = true;
			var items = this.stage.mapModes.selection.getSelectedItems(),
				coords = this.stage.mouseMoveMouseCoords,
				row = coords.row,
				col = coords.col,
				x = coords.x,
				y = coords.y,
				movedObj = {
					row : coords.row - this.currentRow,
					col : coords.col - this.currentCol
				};
			if((this.currentRow !== row || this.currentCol != col) && !this.stage.getItemByXY(x, y)){
				for(var i = 0; i < items.length; i++)
					items[i].move(movedObj);
			}
			this.currentRow = row;
			this.currentCol = col;
		},
		moveMouseUp : function() {
			this.stage.isMoving = false;
		}
	}
	return Move;
});