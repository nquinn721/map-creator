app.factory('SheetCutter', function() {
	function SheetCutter(stage) {
		this.stage = stage;
		this.name = 'sheetCutter';
		this.icon = 'scissors';
		this.cursor = 'crosshairs';


		this.useSetSize = false;
		this.frameWidth = 32;
		this.frameHeight = 32;

	}

	SheetCutter.prototype = {
		sheetCutterMouseDown : function(e) {
			if(!e.relatedTarget)
				this.currentFrame = this.stage.draw.createResizableSquare();
			
		},
		sheetCutter : function() {
			if(!this.currentFrame)return;

			var x = this.stage.mouseDownMouseCoords.x,
				y = this.stage.mouseDownMouseCoords.y, 
				w = this.stage.mouseMoveMouseCoords.x, 
				h = this.stage.mouseMoveMouseCoords.y;


			w = w - x;
			h = h - y;

			if(this.useSetSize){
				w = this.frameWidth;
				h = this.frameHeight;
			}

			if(w > 10 && h > 10){
				console.log('create');
				this.currentFrame.create(x, y, w, h);
				this.destroyFrame = false;
			}else{
				console.log('destroy');
				this.destroyFrame = true;
			}
			
		},
		

		sheetCutterMouseUp : function() {
			console.log(this.destroyFrame);
			if(this.currentFrame && !this.destroyFrame){
				this.stage.currentFile.frames.push(this.currentFrame);

			}
			this.currentFrame = null;
		},
		keydown : function(key) {
		}
	}

	return SheetCutter;
});