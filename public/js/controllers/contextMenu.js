app.controller('ContextMenu', ['$document', '$scope', 'watch', 'keys', 'stage', function($document, $scope, watch, keys, stage) {
	var vm = this,
		coords,
		menus = {
			base : {
				modesTitle : true,
				erase : true,
				selection : true,
				paint : true,
				move : true
			},
			selection : {
				selectionTitle : true, 
				delete : true, 
				combine : true
			},
			fill : {
				fill : true
			}
		};

	vm.stage = stage;
	vm.contextMenu = false;

	vm.options = menus.base;

	$document.on('mousemove', function(e) {
		coords = {left :  e.pageX + 20, top : e.pageY};
	}).on('keydown', function(e) {
		if(keys(e) === 'esc'){
			vm.contextMenu = false;
			vm.options = menus.base;
			$scope.$apply();
		}
	});
	$('#map-creator').on('contextmenu', function(e) {
		vm.contextMenu = true;
		vm.contextMenuPos = {left : e.pageX + 20, top : e.pageY};
		$scope.$apply();		
		return false;
	});

	watch(stage, 'showcontextMenu', function(newValue) {
		vm.contextmenu = false;
		if(newValue){
			if(menus[newValue])
				vm.options = menus[newValue];
			else vm.options = menus.base;
			vm.contextMenu = true;
			vm.contextMenuPos = coords;
		}else{
			vm.contextMenu = false;
			vm.options = menus.base;
		}
	});

	vm.deleteSelected = function() {
		stage.modes.selection.destroySelectedItems();
		vm.contextMenu = false;
		vm.options = menus.base;
	};

	vm.combineSelected = function() {
		stage.modes.selection.combineSelectedItems();
		vm.contextMenu = false;
		vm.options = menus.base;
	};

	vm.fillSelected = function() {
		stage.modes.selection.fillSelected();
		vm.contextMenu = false;
		vm.options = menus.base;
	}

	vm.setMode = function(mode) {
		stage.setMode(mode);
		vm.contextMenu = false;
	}
}]);