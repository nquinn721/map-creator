app.factory('cursor', function() {
	function Cursor() {
		this.fonts = {
			paint : "\uf1fc",
			erase : "\uf12d",
			selection : "\uf247",
			move : "\uf047",
		}
	}
	Cursor.prototype = {
		init : function() {
			this.currentFont = this.fonts.paint;
			this.update();	
		},
		change : function(font) {
			this.currentFont = this.fonts[font];
			this.update();
		},
		update : function() {
			var canvas = document.createElement("canvas");
		    canvas.width = 60;
		    canvas.height = 60;
		    //document.body.appendChild(canvas);
		    var ctx = canvas.getContext("2d");
		    ctx.fillStyle = "#ffffff";
		    ctx.font = "14px FontAwesome";
		    ctx.textAlign = "right";
		    ctx.textBaseline = "bottom";
		    ctx.fillText(this.currentFont, 15, 15);
		    var dataURL = canvas.toDataURL('image/png')
		    $('#map-creator').css('cursor', 'url('+dataURL+'), auto');
		}
	}
	var cursor = new Cursor;
	cursor.init();
	return cursor;	
});