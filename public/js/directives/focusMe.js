app.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
      	return attrs.focusMe;
      }, function(value) {
          $timeout(function() {
            element[0].focus(); 
          });
      });
    }
  };
});