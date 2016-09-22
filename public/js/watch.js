app.factory('watch', ['$rootScope', function($rootScope) {
	return function(cl, key, cb) {
		$rootScope.$watch(function() {
			return cl[key];
		}, function(newValue, oldValue) {
			if(newValue === oldValue)return;
			cb(newValue, oldValue);
		});
		
	}
}]);