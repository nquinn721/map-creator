app.factory('Item', function () {
	function Item(stage, obj) {
		this.stage = stage;
		this.row = obj.row;
		this.col = obj.col;
		this.rows = obj.rows;
		this.cols = obj.cols;
		this.x = obj.x;
		this.y = obj.y;
		this.w = obj.w;
		this.h = obj.h;
		this.file = obj.file;
		this.src = obj.src;
		this.id = obj.id
		this.element = obj.element;
		this.body = obj.body;
		this.type = obj.elType;

	}

	Item.prototype = {
		drawImg : function() {
			this.img = this.stage.draw.img(this);
			this.stage.addChild(this.img);
			this.img.on('click', this.click.bind(this));
			this.img.on('pressmove', this.pressmove.bind(this));
		},
		click : function() {
			if(!this.isMoving){
				if(this.selected)
					this.deselect();
				else
					this.select();
			}
			this.isMoving = false;
		},
		pressmove : function(e) {
			this.isMoving = true;
			this.stage.mapModes.move.move();
		},
		move : function (obj) {
			if(isNaN(obj.row) || isNaN(obj.col))return;
			this.y = (this.row + obj.row) * this.stage.CELL_HEIGHT;
			this.img.y = this.y;
			this.selectionBox.y = this.selectionBox.y + (obj.row * this.stage.CELL_HEIGHT);
			this.row += obj.row;
		
			this.x = (this.col + obj.col) * this.stage.CELL_WIDTH;
			this.img.x = this.x;
			this.selectionBox.x = this.selectionBox.x +  (obj.col * this.stage.CELL_WIDTH);
			this.col += obj.col;
		},
		select : function() {
			if(this.selected)return;
			console.log('selecting');
			this.selectionBox = this.stage.draw.square(this.x, this.y, this.w, this.h, 'red', 'transparent');
			this.stage.addChild(this.selectionBox);
			this.selected = true;
			this.stage.updateSelectedItems();
		},
		destroy : function() {
			this.destroyImages();
			this.stage.destroyItem(this);
			this.selected = false;
			this.stage.updateSelectedItems();
		},
		destroyImages : function() {
			this.stage.removeChild(this.img);
			if(this.selectionBox)
				this.stage.removeChild(this.selectionBox);
			this.selected = false;

		},
		deselect : function() {
			this.stage.removeChild(this.selectionBox);
			this.selected = false;
			this.stage.updateSelectedItems();
		}
	}

	return Item;
});