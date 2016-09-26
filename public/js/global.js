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
$(".items-menu .menu-content").mCustomScrollbar();
// $('.grid').mCustomScrollbar();
// $('.grid').scrollbar();

$('.grid').on('scroll', function() {
  setUpMiniMapScrollLocation();
});

setTimeout(function() {
  setUpMiniMapScrollLocation();
}, 1500);
$(window).on('resize', setUpMiniMapScrollLocation);
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
      height : miniMapHeight
    })
  }
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

$('.radio-inline').find(':checked').each(function() {
  $(this).parents('.radio-inline').addClass('radio-selected');
}).end().find('input[type=radio]').on('change', function() {
  $('.radio-inline').removeClass('radio-selected').find(':checked').parents('.radio-inline').addClass('radio-selected');
});


    $('.grid').perfectScrollbar();
