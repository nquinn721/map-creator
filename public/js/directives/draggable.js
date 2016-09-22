app.directive('draggable', function() {
	return {
		restrict : 'C',
		link : function($scope, $el, $attrs) {
			$($el).draggable({handle : '.menu-title'});
		}
	}
});