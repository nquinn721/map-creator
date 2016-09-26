app.factory('ResizableSquare', function() {
	function ResizableSquare(stage) {
		this.stage = stage;
	}

	ResizableSquare.prototype = {
		create : function(x, y, w, h) {
			this.destroy();
			this.body = this.stage.draw.square(x, y, w, h);
			this.createCorners(x, y, w, h);

			this.createBodyEvents();
		},
		destroy : function() {
			if(!this.body)return;
			this.stage.removeChild(this.body);
			this.stage.removeChild.apply(this.stage, this.corners);
		},
		createBodyEvents : function() {
			this.body.on('pressmove', this.bodypressmove.bind(this));
			this.body.on('pressup', this.bodypressup.bind(this));
		},
		createCorners : function(x, y, w, h) {
			this.corners = [
				this.createCorner('top-left', x - 2.5, y - 2.5),
				this.createCorner('top-right', x + w - 2.5, y - 2.5),
				this.createCorner('bottom-left', x - 2.5, y + h - 2.5),
				this.createCorner('bottom-right', x + w - 2.5, y + h - 2.5)
			];
		},
		createCorner : function(pos, x,y,w,h) {
			var corner = this.stage.draw.square(x, y, 5, 5, 'black', 'white')	
			corner.on('mouseover', this.mouseover.bind(this, pos));
			corner.on('pressmove', this.pressmove.bind(this, pos));
			corner.on('mouseout', this.mouseout.bind(this, pos));
			corner.on('pressup', this.pressup.bind(this, pos));
			
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
			var body = this.body.graphics.command,
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

			this.body = this.stage.draw.square(x, y, w, h);
			this.createCorners(x, y, w, h);
			this.createBodyEvents();
		},
		pressup : function() {
		},
		bodypressmove : function(e) {
			if(!this.originalX)this.originalX = e.stageX;
			if(!this.originalY)this.originalY = e.stageY;
			var newx = e.stageX - this.originalX,
				newy = e.stageY - this.originalY,
				targetX = e.target.graphics.command.x,
				targetY = e.target.graphics.command.y,
				targetW = e.target.graphics.command.w,
				targetH = e.target.graphics.command.h,
				canvas = this.stage.getStage().canvas,
				xDidntMove, yDidntMove;



			targetX += newx;
		    targetY += newy;

		    if(targetX < 0){
		    	targetX = 0;
		    	xDidntMove = true;
		    }
		    if(targetY < 0){
		    	targetY = 0;
		    	yDidntMove = true;
		    }
		    if(targetX + targetW > canvas.width){
		    	targetX = canvas.width - targetW;
		    	xDidntMove = true;
		    }
		    if(targetY +  targetH > canvas.height){
		    	targetY = canvas.height - targetH;
		    	yDidntMove = true;
		    }

		    for(var i = 0 ; i < this.corners.length; i++){
		    	if(!xDidntMove)
			    	this.corners[i].graphics.command.x += newx;
			    if(!yDidntMove)
			    	this.corners[i].graphics.command.y += newy;
		    }

		    this.originalY = e.stageY;
		    this.originalX = e.stageX;
		},
		bodypressup : function() {
			this.originalY = false;
		    this.originalX = false;	
		}
	}
	return ResizableSquare;
});