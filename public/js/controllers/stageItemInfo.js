app.controller('StageItemInfoMenu', ['$scope', 'watch', 'stage', function($scope, watch, stage) {
	var vm = this;
	vm.stage = stage;


	watch(vm, 'element', function(value) {
		for(var i in vm.selectedItems){
			for(var j = 0; j < vm.selectedItems[i].length; j++)
			vm.selectedItems[i][j].element = value;
		}
	});

	watch(stage, 'selectedItems', function(selectedItems) {
		var items = {};
		if(selectedItems.length === 0)
			vm.selectedItems = null;
		else{
			for(var i = 0; i < selectedItems.length; i++){
				if(!items[selectedItems[i].file])items[selectedItems[i].file] = [];
				items[selectedItems[i].file].push(selectedItems[i]);
				vm.element = selectedItems[i].type;
			}
			vm.selectedItems = items;
		}
	});
}]);