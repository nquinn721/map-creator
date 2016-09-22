app.controller('ItemsMenu', ['$scope', 'stage', function($scope, stage) {
	var vm = this;
	vm.selected = 'box';

	vm.selectItem = function(item, file, itemName) {
		console.log(item);
		vm.selected = item;
		stage.setCurrentItem(item);
	}
}]);