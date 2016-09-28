app.factory('ResizableSquare', ['keyEvents', function(keyEvents) {
	function ResizableSquare(stage) {
		this.stage = stage;
		keyEvents.register('keydown', 'spacebar', this.keydown.bind(this));
		keyEvents.register('keyup', 'spacebar', this.keyup.bind(this));
	}

	ResizableSquare.prototype = {
		create : function(x, y, w, h) {
			this.frameNumber = this.stage.currentFile.frames.length + 1;
			this.createElements(x, y, w, h);
		},
		destroy : function() {
			if(!this.body)return;
			this.stage.removeChild(this.body);
		},
		createElements : function(x, y, w, h) {
			this.x = x || this.x;
			this.y = y || this.y;
			this.w = w || this.w;
			this.h = h || this.h;
			this.destroy();
			this.body = this.stage.draw.squareContainer(this.x, this.y, this.w, this.h);
			this.drawFrameNumber();
			this.createCorners(this.x, this.y, this.w, this.h);
			this.createBodyEvents();
			this.stage.addChild(this.body);
		},
		createBodyEvents : function() {
			this.body.on('pressmove', this.bodypressmove.bind(this));
			this.body.on('pressup', this.bodypressup.bind(this));
		},
		drawFrameNumber : function() {
			var text = this.stage.draw.text(this.frameNumber, '11px', '#eee');
			text.x += 8;
			text.y += 1;
			var textbackground = this.stage.draw.square(0,0, 15, 15, 'none', '#222', true);
			this.body.addChild(textbackground, text);
		},
		createCorners : function(x, y, w, h) {
			this.corners = [
				this.createCorner('top-left', -2.5, -2.5),
				this.createCorner('top-right', w - 2.5, -2.5),
				this.createCorner('bottom-left', -2.5, h - 2.5),
				this.createCorner('bottom-right', w - 2.5, h - 2.5)
			];
		},
		createCorner : function(pos, x,y,w,h) {
			var corner = this.stage.draw.rawSquare(x, y, 5, 5, 'black', 'white')	
			corner.on('mouseover', this.mouseover.bind(this, pos));
			corner.on('pressmove', this.pressmove.bind(this, pos));
			corner.on('mouseout', this.mouseout.bind(this, pos));
			corner.on('pressup', this.pressup.bind(this, pos));
			this.body.addChild(corner);
			return corner;
		},
		mouseover : function(pos) {
			if(pos === 'bottom-left' || pos === 'top-right')
				$('body').css('cursor', 'nesw-resize');
			else $('body').css('cursor', 'nwse-resize');
			this.cursorover = pos;
			this.mouseEvent = true;
		},
		mouseout : function() {
			$('body').css('cursor', 'auto');
			this.mouseEvent = false;
		},
		pressmove : function(e) {
			var body = this.body,
				mousePos = this.stage.mouseMoveMouseCoords,
				x = body.x, 
				y = body.y, 
				w = mousePos.x - body.x, 
				h = mousePos.y - body.y;

			this.destroy();
			if(this.cursorover === 'bottom-left'){
				x = mousePos.x;
				w = (body.x + body.w) - x;
			}
			if(this.cursorover === 'top-right'){
				y = mousePos.y;
				h = (body.y + body.h) - y;
			}

			if(this.cursorover === 'top-left'){
				x = mousePos.x;
				y = mousePos.y;
				w = (body.x + body.w) - x;
				h = (body.y + body.h) - y;
			}

			this.create(x,y,w,h);
		},
		pressup : function() {
		},
		bodypressmove : function(e) {
			var el = e.currentTarget;
			if(!this.originalX)this.originalX = e.stageX;
			if(!this.originalY)this.originalY = e.stageY;
			var newx = e.stageX - this.originalX,
				newy = e.stageY - this.originalY,
				canvas = this.stage.getStage().canvas;

			if(this.spacebar){
				if(newx !== 0 && !this.lockedVertical){
					this.lockHorizontal();
					this.unlockVertical();
				} else if (newy !== 0 && !this.lockedHorizontal){
					this.lockVertical();
					this.unlockHorizontal();
				}
			}else{
				this.unlockHorizontal();
				this.unlockVertical();
			}

			if(!this.lockedVertical)
				el.x += newx;
			if(!this.lockedHorizontal)
			    el.y += newy;
		    if(el.x < 0) el.x = 0;
		    if(el.y < 0) el.y = 0;
		    if(el.x + el.w > canvas.width) el.x = canvas.width - el.w;
		    if(el.y +  el.h > canvas.height) el.y = canvas.height - el.h;

		    this.x = el.x;
		    this.y = el.y;
		    this.originalY = e.stageY;
		    this.originalX = e.stageX;
		},
		bodypressup : function() {
			this.originalY = false;
		    this.originalX = false;	
		},
		updateBodyWidth : function() {
			this.create();
		},
		updateBodyHeight : function() {
			this.create();
		},
		keydown : function() {
			this.spacebar = true;
		},
		keyup : function() {
			this.spacebar = false;	
		},
		lockHorizontal : function() {
			this.lockedHorizontal = true;
			if(!this.horizontalLine)
				this.horizontalLine = this.stage.draw.line(0, this.y + (this.h / 2), this.stage.getStage().canvas.width, this.y + (this.h / 2), 'blue');
		},
		unlockHorizontal : function() {
			this.lockedHorizontal = false;
			this.stage.removeChild(this.horizontalLine);
			this.horizontalLine = false;	
		},
		lockVertical : function() {
			this.lockedVertical = true;
			if(!this.verticalLine)
				this.verticalLine = this.stage.draw.line(this.x + (this.w / 2), 0, this.x + (this.w / 2), this.stage.getStage().canvas.height, 'blue');
		},
		unlockVertical : function() {
			this.lockedVertical = false;
			this.stage.removeChild(this.verticalLine);
			this.verticalLine = false;
		}
	}
	return ResizableSquare;
}]);