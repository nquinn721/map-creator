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

$('.grid').on('scroll', function() {
  setUpMiniMapScrollLocation();
  
});
setTimeout(function() {
  setUpMiniMapScrollLocation();
}, 3000);
function setUpMiniMapScrollLocation() {
  var grid = $('.grid'),
    canvas = grid.find('canvas'),
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

  $('.scroll-location').css({
    width : (width / canvasWidth) * miniMapWidth,
    height : (height / canvasHeight) * miniMapHeight,
    top : (topPercent > 0 ? topPercent + 1 : topPercent) + '%',
    left : (leftPercent > 0 ? leftPercent + 1 : leftPercent) + '%'
  });
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
