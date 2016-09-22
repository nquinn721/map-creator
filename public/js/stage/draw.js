app.factory('draw', [function() {
		
	function Draw() {
		this.lines = [];

		this.selectedItems = [];
	}

	Draw.prototype = {
		init : function(stage) {
			this.stage = stage;
		},
		line : function (x, y, endX, endY) {
			var g = new createjs.Shape();
			g.graphics.beginStroke("rgba(255,255,255,0.5)");
			g.graphics.moveTo(x,y); 
			g.graphics.lineTo(endX,endY);
			this.stage.getStage().addChild(g);
			this.lines.push(g);
			return g;
		},
		selection : function(x, y, w, h) {
			w = w - x;
			h = h - y;
			this.destroySelection();
			this.selectionBox = this.square(x, y, w, h);
			return this.selectionBox;
		},
		destroySelection : function() {
			if(this.selectionBox)this.stage.getStage().removeChild(this.selectionBox);
		},
		square : function(x, y, w, h, stroke, color) {
			var g = new createjs.Shape();
			g.graphics.beginStroke(stroke || "blue")
				.beginFill(color || "rgba(18, 30, 185, 0.58)")
				.drawRect(x, y, w, h);
			this.stage.getStage().addChild(g);

			return g;
		},
		img : function(obj) {
			var img = new createjs.Bitmap(this.stage.preload.queue.getResult(obj.id)),
				stage = this.stage;
			img.x = obj.x;
			img.y = obj.y;
			img.scaleY = (obj.h || stage.Cl.CELL_HEIGHT) / img.image.height;
			img.scaleX = (obj.w || stage.Cl.CELL_WIDTH) / img.image.width;
			stage.addChild(img);
			return img;
		},
		clearLines : function() {
			for(var i = 0; i < this.lines.length; i++){
				this.stage.getStage().removeChild(this.lines[i]);	
			}
			this.lines = [];
		},
		drawCanvasGrid : function() {
			for(var i = 1; i < this.stage.rows; i++)
				this.line(0, i * this.stage.CELL_HEIGHT, this.stage.getStage().stage.canvas.width, i * this.stage.CELL_HEIGHT);
			for(var i = 1; i < this.stage.cols; i++)
				this.line(i * this.stage.CELL_WIDTH, 0, i * this.stage.CELL_WIDTH, this.stage.getStage().stage.canvas.height);
		}
	}

	return new Draw;
}]);
