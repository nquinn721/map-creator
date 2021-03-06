
app.controller('MainController', ['stage', '$scope', '$document', 'watch', '$http', '$timeout', 'keys', 'keyEvents',
	function(stage, $scope, $doc, watch, $http, $timeout, keys, keyEvents) {
	var vm = this;
	vm.stage = stage;
	vm.keys = {};

	vm.currentImage = function() {
		return vm.stage.currentImageName;
	}
	
	
	vm.downloadCanvasImage = function() {
		vm.download(vm.stage.snapshot.createSnapShot(), vm.stage.currentFile.name.replace('js', 'png'));
	}

	vm.downloadCanvasJSON = function() {
		vm.download('/getfile/' + vm.stage.currentFile.type + '/' + vm.stage.currentFile.name, vm.stage.currentFile.name)
	}

	vm.download = function(href, name) {
		var link = document.createElement('a');
		link.href = href;
		link.download = name;
		link.click();
	}
	
	keyEvents.register('keydown', 'esc', function(e) {
		vm.fullScreenGrid = false;
	});
	keyEvents.register('keydown', 'f', function(e) {
		vm.setGridFullScreen();
	});
	keyEvents.registerAll('keydown', function(e) {
		vm.stage.keydown(e);
	});


	$doc.find('body').on('mousemove', '#map-creator', function(e) {
		vm.hideCurrentItem = false;
		vm.currentItemStyle = {left : e.offsetX + 80, top : e.offsetY + 40};
		$scope.$apply();
	}).on('mouseleave', '#map-creator', function() {
		vm.hideCurrentItem = true;
		$scope.$apply();
		
	});
	
	
	vm.getFAClass = function(mode) {
		return 'fa fa-' + mode.icon;
	}
	

	vm.setGridFullScreen = function() {
		vm.fullScreenGrid = !vm.fullScreenGrid;
		if(vm.fullScreenGrid)
			vm.showFullScreenExitText = true;
		$timeout(function() {
			vm.showFullScreenExitText = false;
		}, 3000);
	}
}]);
