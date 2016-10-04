app.directive('droppable', function() {
	return {
		restrict : 'A',
		link : function ($scope, $el, $attrs) {
			$( $el ).droppable({
		      classes: {
		        "ui-droppable-active": "state-active",
		        "ui-droppable-hover": "drop-hover"
		      },
		      drop: function( event, ui ) {
		      	$(this).find('.draggable-placeholder-text').remove();
		      	$(this).prepend(ui.draggable);
		      }
		    });
		}
	}
})