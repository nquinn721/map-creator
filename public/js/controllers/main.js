
app.controller('main', ['stage', '$scope', '$document', 'watch', '$http', '$timeout', 'keys',
	function(stage, $scope, $doc, watch, $http, $timeout, keys) {
	var vm = this;
	vm.stage = stage;
	vm.maps = [];
	vm.keys = {};

	vm.save = function() {
		if(!vm.stage.currentFile.isDirty)return;


		if(vm.stage.currentFile.name === 'untitled.js')
			vm.showSaveMenu = true;
		else {
			vm.saveTileMap();
		}
	}
	vm.currentImage = function() {
		return vm.stage.currentImageName;
	}
	vm.hideFullScreenImg = function() {
		vm.fullScreenImg = null;
	}
	vm.showFullScreenImg = function(url) {
		vm.fullScreenImg = vm.stage.canvasImage.src;
	}
	vm.showSaved = function() {
		console.log(vm.saved);
		vm.saved = true;
		console.log(vm.saved);
		$timeout(function() {
			vm.saved = false;
			console.log(vm.saved);
		}, 1000);
	}
	vm.saveAs = function() {
		vm.showSaveMenu = true;
	}
	vm.hideSaveMenu = function() {
		vm.showSaveMenu = false;
	}
	vm.saveTileMap = function() {
		vm.hideSaveMenu();
		stage.file.save();
		vm.updateTileMaps();
		vm.showSaved();
	}

	$doc.find('body').on('mousemove', '#map-creator', function(e) {
		vm.currentItemStyle = {left : e.pageX + 20, top : e.pageY + 20};
		$scope.$apply();
	})
	$doc.on('keydown', function(e) {
		if(e.target.localName === 'input')return true;
		if(keys(e) === 'ctrl')
			vm.keys.ctrl = true;
		if(keys(e) === 's')
			if(vm.keys.ctrl)vm.save();
		if(keys(e) === 'esc')
			vm.fullScreenGrid = false;
		if(keys(e) === 'f')
			vm.setGridFullScreen();


		stage.keydown(e);
		return false;
	}).on('keyup', function(e) {
		if(keys(e) === 'ctrl')
			vm.keys.ctrl = false;		
	});
	vm.updateTileMaps = function() {
		vm.maps = [];
		$http.get('/tilemap-names').then(function(data) {
			for(var i = 0; i < data.data.length; i++){
				vm.maps.push({
					label : data.data[i],
					id : data.data[i]
				});
			}
		});
		
	}
	vm.getFAClass = function(mode) {
		return 'fa fa-' + mode.icon;
	}


	vm.updateTileMaps();

	vm.setGridFullScreen = function() {
		vm.fullScreenGrid = !vm.fullScreenGrid;
		if(vm.fullScreenGrid)
			vm.showFullScreenExitText = true;
		$timeout(function() {
			vm.showFullScreenExitText = false;
		}, 3000);
	}
}]);
