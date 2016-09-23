app.directive('slider', function() {
	return {
		restrict : 'A',
		link : function($scope, $el, $attrs) {
			var hidden = false,
				width = $el.width(),
				dir = $attrs.slider;
			$el.find('.slide-button').on('click', function() {
				var obj = {}
				if(hidden){
					if(dir === 'right'){
						obj.right = 0;
						$(this).addClass('fa-caret-right').removeClass('fa-caret-left');
					}
					$el.animate(obj, 1000);
					hidden = false;
				}else{
					if(dir === 'right'){
						obj.right = -width + 20;
						$(this).addClass('fa-caret-left').removeClass('fa-caret-right');
					}
					$el.animate(obj, 1000);
					hidden = true;
				}
			});
		}
	}
});