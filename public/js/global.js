var app = angular.module('app', ['ui.uploader']);
$( document ).tooltip({
  position: {
    my: "center bottom-20",
    at: "center top",
    using: function( position, feedback ) {
      $( this ).css( position );
      $( "<div>" )
        .addClass( "arrow" )
        .addClass( feedback.vertical )
        .addClass( feedback.horizontal )
        .appendTo( this );
    }
  }
});
$('.file-loader').on('click', function() {
	var self = $(this);
	$('input[type=file]#' + $(this).attr('id')).click().on('change', function() {
		console.log($(this));
		var filename = $(this).val().split('\\').slice(-1);
		self.val(filename);
	});
});
$(".items-menu .menu-content").mCustomScrollbar();
// $('.grid').mCustomScrollbar();
// $('.grid').scrollbar();
String.prototype.capitalize = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1);
}
// $('canvas').on('contextmenu', function() {
// 	return false;
// });
// $('.grid').on('mousemove', function(e) {
// 	var left = $(this).scrollLeft(),
// 		top = $(this).scrollTop();

//     if(e.clientY > $(this).height() * .8) 
//         $(this).scrollTop($(this).find('canvas').height() - e.clientY / 2);
//     if(e.clientY < 100){
//         console.log('scrolling up');
//         $(this).scrollTop(100);
//     }

// });




    $('.grid').perfectScrollbar();
