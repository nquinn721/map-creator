app.factory('SheetCutter', function() {
	function SheetCutter(stage) {
		this.stage = stage;
		this.name = 'sheetCutter';
		this.icon = 'scissors';
		this.cursor = 'crosshairs';
		this.shortcut = 'S';


		this.useSetSize = false;
		this.frameWidth = 32;
		this.frameHeight = 32;

	}

	SheetCutter.prototype = {
		sheetCutterMouseDown : function(e) {
			if(!e.relatedTarget)
				this.currentFrame = this.stage.createFrame();
			
		},
		sheetCutter : function() {
			if(!this.currentFrame)return;

			this.creatingFrame = true;

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
				this.currentFrame.create(this.stage.currentFile.frames.length + 1, x, y, w, h);
				this.destroyFrame = false;
			}else{
				this.destroyFrame = true;
			}
			
		},
		
		
		sheetCutterMouseUp : function() {
			if(this.currentFrame && !this.destroyFrame && this.creatingFrame){
				this.stage.currentFile.frames.push(this.currentFrame);

			}
			this.currentFrame = null;
			this.creatingFrame = false;
		},
		keydown : function(key) {
		}
	}

	return SheetCutter;
});