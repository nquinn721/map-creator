app.factory('minimap', ['$timeout', '$window', function($timeout, $window) {
	function MiniMap() {
		
	}
	MiniMap.prototype = {
		init : function() {
			this.updateTimes();
		},
		updateTimes : function() {
			
			$('.grid').on('scroll', function() {
			  	this.update();
			}.bind(this));

			$(window).on('resize', this.update);
		},
		update : function() {
		  var grid = $('.grid'),
		    canvas = grid.find('#map-creator'),
		    canvasHeight = canvas.height() + 40,
		    canvasWidth = canvas.width(),
		    height = grid.height(),
		    width = grid.width(),
		    miniMap = $('.mini-map-img'),
		    miniMapHeight = miniMap.height(),
		    miniMapWidth = miniMap.width(),
		    top = grid.scrollTop(),
		    left = grid.scrollLeft(),
		    topPercent = top / canvasHeight * 100,
		    leftPercent = left / canvasWidth * 100;

		  if(width < canvasWidth && height < canvasHeight){
		    $('.scroll-location').css({
		      width : (width / canvasWidth) * miniMapWidth,
		      height : (height / canvasHeight) * miniMapHeight,
		      top : (topPercent > 0 ? topPercent + 1 : topPercent) + '%',
		      left : (leftPercent > 0 ? leftPercent + 1 : leftPercent) + '%'
		    });
		  }else{
		    $('.scroll-location').css({
		      width : miniMapWidth,
		      height : miniMapHeight,
		      top : 0,
		      left : 0
		    })
		  }
		}
	}
	var minimap = new MiniMap;
	minimap.init();
	return minimap;
}]);