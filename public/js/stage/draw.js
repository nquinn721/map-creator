app.factory('Draw', ['ResizableSquare', function(ResizableSquare) {
		
	function Draw(stage) {
		this.stage = stage;
		this.lines = [];

		this.selectedItems = [];
	}

	Draw.prototype = {
		line : function (x, y, endX, endY) {
			var g = new createjs.Shape();
			g.graphics.beginStroke("rgba(255,255,255,0.5)");
			g.graphics.moveTo(x,y); 
			g.graphics.lineTo(endX,endY);
			this.stage.addChild(g);
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
		spritesheet : function(spritesheet) {
			if(this.currentSpriteSheet)this.stage.removeChild(this.currentSpriteSheet);
			var img = new createjs.Bitmap('spritesheets/' + spritesheet);
			img.image.onload =function() {
				img.scaleY = this.stage.getStage().canvas.height / img.image.height;
				img.scaleX = this.stage.getStage().canvas.width / img.image.width;
			}.bind(this);
			this.currentSpriteSheet = img;
			this.stage.addChild(img);
			return img;
		},
		createResizableSquare : function() {
			var rs = new ResizableSquare(this.stage, this);
			return rs;
		},

		square : function(x, y, w, h, stroke, color) {
			var g = new createjs.Shape();
			g.graphics.beginStroke(stroke || "blue")
				.beginFill(color || "rgba(18, 30, 185, 0.58)")
				.drawRect(x, y, w, h);
			this.stage.addChild(g);
			return g;
		},
		img : function(obj) {
			var img = new createjs.Bitmap(this.stage.preload.queue.getResult(obj.element));
			img.x = obj.x;
			img.y = obj.y;
			img.scaleY = (obj.h || this.stage.CELL_HEIGHT) / img.image.height;
			img.scaleX = (obj.w || this.stage.CELL_WIDTH) / img.image.width;
			this.stage.addChild(img);
			return img;
		},
		clearLines : function() {
			for(var i = 0; i < this.lines.length; i++){
				this.stage.removeChild(this.lines[i]);	
			}
			this.lines = [];
		},
		drawCanvasGrid : function() {
			for(var i = 1; i < this.stage.rows; i++)
				this.line(0, i * this.stage.CELL_HEIGHT, this.stage.getStage().canvas.width, i * this.stage.CELL_HEIGHT);
			for(var i = 1; i < this.stage.cols; i++)
				this.line(i * this.stage.CELL_WIDTH, 0, i * this.stage.CELL_WIDTH, this.stage.getStage().canvas.height);
		}
	}

	return Draw;
}]);
