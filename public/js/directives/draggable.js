app.directive('draggable', function() {
	return {
		restrict : 'A',
		link : function($scope, $el, $attrs) {
			var obj = {},
				parsed = $attrs.draggable.replace(/[{}'\s]/g, '').split(",").map(function(v){
					return v.split(':');
				});

			if($attrs.draggable)
				for(var i = 0; i < parsed.length; i++)
					obj[parsed[i][0]] = parsed[i][1];

			$($el).draggable(obj);
		}
	}
});