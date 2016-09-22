app.controller('ModeMenu', ['$scope', 'watch', 'stage', function($scope, watch, stage) {
	var vm = this;
	vm.stage = stage;

	vm.selectMode = function(mode) {
		stage.setMode(mode);
	}
	vm.setEraserSize = function(size) {
		vm.stage.modes.erase.size = size;
	}
	
}]);