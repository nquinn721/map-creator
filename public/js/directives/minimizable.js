app.directive('minimizable', function() {
	return {
		restrict : 'C',
		link : function($scope, $el, $attrs) {
			var minimized, height;

			$($el).find('.minimize').on('click', function() {
				if(!minimized){
					height = $($el).find('.menu-content').height()
					$($el).find('.menu-content').animate({
						height : 0
					}, 500).end().find('.minus').addClass('none').end().find('.plus').removeClass('none');
					minimized = true;
				}else{
					$($el).find('.menu-content').animate({
						height : height
					}, 500, function() {
						$($el).find('.menu-content').css({
							height :'auto',
						});
					}).end().find('.plus').addClass('none').end().find('.minus').removeClass('none');
					minimized = false;
				}
			});
		}
	}
});