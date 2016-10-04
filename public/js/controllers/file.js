app.controller('FileController', ['stage', '$scope', '$http', 'keys', '$document', '$timeout', 'keyEvents',
 	function(stage, scope, $http, keys, $doc, $timeout, keyEvents) {

	var vm = this;
	vm.stage = stage;
	vm.keys = {};
	vm.newFileWidth = 2000;
	vm.newFileHeight = 2000;
	vm.newFileExtension = 'js';

	vm.save = function() {
		if(!vm.stage.currentFile.isDirty)return;


		if(vm.stage.currentFile.name === 'untitled.js'){
			vm.keys.ctrl = false;
			vm.showSaveMenu = true;
		} else {
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
		vm.keys.ctrl = false;
		vm.showSaveMenu = true;
	}
	
	vm.saveTileMap = function() {
		vm.hideSaveMenu();
		stage.fileManager.save();
		vm.updateTileMaps();
		vm.showSaved();
	}

	vm.showCreateFileMenu = function(type) {
		vm.newFileType = type;
		vm.newFileTypeText = type.camelCaseToText();
		vm.showCreateNewFileMenu = true;
	}
	vm.createNewFile = function() {
		vm.newFileName = vm.newFileName.split('.')[0] + '.' + vm.newFileExtension;
		vm.showCreateNewFileMenu = false;
		vm.stage.fileManager.createFile(vm.newFileName, {
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
	vm.updateSpriteSheets = function() {
		vm.spritesheets = [];
		$http.get('/spritesheet-names').then(function(data) {
			for(var i = 0; i < data.data.length; i++){
				vm.spritesheets.push(data.data[i]);
			}
		});
	}
	vm.saveAndCloseFile = function() {
		vm.save();
	}

	vm.closeFile = function(name, dirty) {
		vm.currentFileNameToClose = name;
		if(!dirty)
			vm.stage.fileManager.closeFile(name);
		else {
			vm.stage.fileManager.drawFile(name);
			vm.closeUnsaved = true;
		}
	}


	vm.updateTileMaps();
	vm.updateSpriteSheets();

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