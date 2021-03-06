app.factory('Draw', [function() {
		
	function Draw(stage) {
		this.stage = stage;
		this.lines = [];

		this.selectedItems = [];
	}

	Draw.prototype = {
		line : function (x, y, endX, endY, color, alpha) {
			var g = new createjs.Shape();
			g.graphics.beginStroke(color || "rgba(255,255,255,0.5)");
			g.graphics.moveTo(x,y); 
			g.graphics.lineTo(endX,endY);
			g.graphics.alpha = alpha || 1;
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
		spritesheet : function(spritesheet, cb) {
			if(this.currentSpriteSheet)this.stage.removeChild(this.currentSpriteSheet);
			var img = new createjs.Bitmap('spritesheets/' + spritesheet);
			img.image.onload =function() {
				img.scaleY = this.stage.getStage().canvas.height / img.image.height;
				img.scaleX = this.stage.getStage().canvas.width / img.image.width;
				cb && cb();
			}.bind(this);
			this.currentSpriteSheet = img;
			this.stage.addChild(img);
			return img;
		},
		text : function(text, font, color, align) {
			var label = new createjs.Text(text, font || "bold 14px Arial", color || "#FFFFFF");
			label.textAlign = align || "center";
			return label;
		},
		square : function(x, y, w, h, stroke, color, alpha, strokeWidth) {
			var g = new createjs.Shape();
			g.graphics.setStrokeStyle(strokeWidth || 1);
			g.graphics.beginStroke(stroke || "blue");
			g.graphics.beginFill(color || "rgba(18, 30, 185, 0.58)");
			g.graphics.drawRect(x, y, w, h);
			var shape = new createjs.Shape(g.graphics);
	        shape.alpha = alpha || 1;
			return shape;
		},
		rawSquare : function(x, y, w, h, stroke, color) {
			return this.square(x,y,w,h, stroke, color, true);
		},
		squareContainer : function(x, y, w, h, stroke, color) {
			var g = new createjs.Shape(),
				container = new createjs.Container();

			g.graphics.beginStroke(stroke || "blue")
				.beginFill(color || "rgba(18, 30, 185, 0.58)")
				.drawRect(0, 0, w, h);
			container.x = x;
			container.y = y;
			container.w = w;
			container.h = h;
			container.addChild(g);
			this.stage.addChild(container);
			return container;
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
			if(!this.stage.showGrid)return;

			for(var i = 1; i < this.stage.rows; i++)
				this.line(0, i * this.stage.CELL_HEIGHT, this.stage.getStage().canvas.width, i * this.stage.CELL_HEIGHT, this.stage.gridColor, 0.5);
			for(var i = 1; i < this.stage.cols; i++)
				this.line(i * this.stage.CELL_WIDTH, 0, i * this.stage.CELL_WIDTH, this.stage.getStage().canvas.height, this.stage.gridColor);
		}
	}

	return Draw;
}]);
