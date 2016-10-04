String.prototype.capitalize = function() {
  return this.substr(0,1).toUpperCase() + this.substr(1);
}
String.prototype.camelCaseToText = function() {
  return this.replace(/([A-Z])/g, ' $1').capitalize();
}


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

$('.scrollable').perfectScrollbar();
setInterval(function() {
  $('.scrollable').perfectScrollbar('update');
}, 1000);
// $('.scrollable').mCustomScrollbar();
// $('.number').spinner();



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

$('.radio-inline').find(':checked').each(function() {
  $(this).parents('.radio-inline').addClass('radio-selected');
}).end().find('input[type=radio]').on('change', function() {
  $('.radio-inline').removeClass('radio-selected').find(':checked').parents('.radio-inline').addClass('radio-selected');
});


