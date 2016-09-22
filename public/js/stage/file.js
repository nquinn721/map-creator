app.factory('File', ['$http', '$rootScope', function($http, $rootScope) {
	function File(stage) {
		this.stage = stage;
	}

	File.prototype = {
		createFile : function(id, obj) {
			this.stage.fileIsLoading = true;
			this.stage.clearStageItems();
			this.stage.files[id] = {
				name : id,
				items : [],
				size : obj ? ({w : obj.w || obj.width, h : obj.h || obj.height}) : {w : this.baseWidth, h : this.baseHeight}
			};
			this.changeFile(id);
			this.stage.updateCanvas();
			if(obj.data)
				this.createItemsFromRaw(obj.data);
			this.stage.fileIsLoading = false;
			this.stage.snapshot.updateSnapshotCanvas();
		},
		closeFile : function(id) {
			this.stage.fileIsLoading = true;
			var fileList = Object.keys(this.stage.files),
				prevOpenFile = fileList.indexOf(id) - 1,
				nextOpenFile = fileList.indexOf(id) + 1,
				fileToFocus = fileList[prevOpenFile > -1 ? prevOpenFile : nextOpenFile];

			this.stage.clearStageItems();
			delete this.stage.files[id];

			if(fileToFocus && this.currentFile.name === id){
				this.changeFile(fileToFocus);
				this.drawCurrentFile();
			}
			this.stage.fileIsLoading = false;
			this.stage.snapshot.updateSnapshotCanvas();
		},
		loadTileMap : function(map) {
			$http.get('/load-tilemap/' + map.id).then(function(data) {
				this.createFile(map.id, data.data);
			}.bind(this));
		},
		changeFile : function(file) {
			this.currentFile = this.stage.files[file];
		},
		drawCurrentFile : function() {
			var items = this.stage.currentFile.items;
			for(var i = 0; i < items.length; i++)
				items[i].drawImg();
			this.stage.updateCanvas();
		},
		drawFile : function(id) {
			this.stage.clearStageItems();	
			this.currentFile = this.stage.files[id];
			this.drawCurrentFile();	
		},
		createItemsFromRaw : function(items) {
			for(var i = 0; i < items.length; i++)
				this.stage.createItem(items[i]);
		},
		save : function() {
			console.log('save', this.stage.currentFile);
			this.stage.currentFile.isDirty = false;
			// this.stage.tileMap.jsonTileMap();
			this.stage.currentFile.saved = true;
			setTimeout(function() {
				this.stage.currentFile.saved = false;
			}.bind(this), 1000);
			$rootScope.$apply();
		}
	}

	return File;
}]);