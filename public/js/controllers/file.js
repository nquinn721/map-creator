app.controller('FileController', ['stage', '$scope', '$http', 'keys', '$document', '$timeout', 'keyEvents',
 	function(stage, scope, $http, keys, $doc, $timeout, keyEvents) {

	var vm = this;
	vm.stage = stage;
	vm.keys = {};
	vm.newFileWidth = 2000;
	vm.newFileHeight = 2000;
	vm.newFileExtension = 'js';

	vm.save = function() {
		console.log('save');
		if(!vm.stage.currentFile.isDirty)return;


		if(vm.stage.currentFile.name === 'untitled.js')
			vm.showSaveMenu = true;
		else {
			vm.saveTileMap();
		}
	}

	vm.showSaved = function() {
		vm.saved = true;
		$timeout(function() {
			vm.saved = false;
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

	vm.showCreateFileMenu = function(type) {
		vm.newFileType = type.camelCaseToText();
		vm.showCreateNewFileMenu = true;
	}
	vm.createNewFile = function() {
		vm.newFileName = vm.newFileName.split('.')[0] + '.' + vm.newFileExtension;
		vm.showCreateNewFileMenu = false;
		console.log(vm.newFileExtension);
		vm.stage.file.createFile(vm.newFileName, {
			name : vm.newFileName,
			w : vm.newFileWidth, 
			h : vm.newFileHeight
		});
		vm.newFileName = '';
	}
	vm.hideNewFileMenu = function() {
		vm.showCreateNewFileMenu = false;
	}
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

	vm.updateTileMaps();

	keyEvents.register('keydown', 'ctrl', function() {
		vm.keys.ctrl = true;
	});
	keyEvents.register('keydown', 's', function() {
		if(vm.keys.ctrl)
			vm.save();
	});
	keyEvents.register('keyup', 'ctrl', function() {
		vm.keys.ctrl = false;
	});

}]);