app.controller('ItemsMenu', ['$scope', 'stage', function($scope, stage) {
	var vm = this;

	vm.selectItem = function(item, file, itemName) {
		vm.selected = item;
		stage.setCurrentItem(item);
	}
}]);