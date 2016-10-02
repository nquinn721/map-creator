app.factory('File', ['$http', '$rootScope', 'util',  function($http, $rootScope, util) {
	function File(stage) {
		this.stage = stage;
	}

	File.prototype = {
		createFile : function(id, type, obj) {
			if(this.getFileById(id))return;
			this.stage.dontUpdateMiniMap = true;
			this.stage.clearStageItems();
			this.stage.files[id] = {
				name : id,
				items : [],
				size : obj && obj.w && obj.h ? ({w : obj.w, h : obj.h}) : {w : this.stage.baseWidth, h : this.stage.baseHeight},
				type : type || 'tilemap',
				frames : obj && obj.frames || [],
				spritesheet : obj && obj.spritesheet || null
			};
			this.changeFile(id);

			if(type === 'spritesheet'){
				this.stage.createSpriteSheet({spritesheet : obj.spritesheet, w : 800, h : 600})
				this.stage.files[id].frames =  this.createFramesFromRaw(obj.frames);
			}

			this.stage.updateCanvas();
			if(obj && obj.data)
				this.createItemsFromRaw(obj.data);
			this.stage.snapshot.updateSnapshotCanvas();
		},
		closeFile : function(id) {
			this.stage.dontUpdateMiniMap = true;
			var fileList = Object.keys(this.stage.files),
				prevOpenFile = fileList.indexOf(id) - 1,
				nextOpenFile = fileList.indexOf(id) + 1,
				fileToFocus = fileList[prevOpenFile > -1 ? prevOpenFile : nextOpenFile];

			delete this.stage.files[id];
			if(fileToFocus && this.stage.currentFile.name === id){
				this.stage.clearStageItems();
				this.changeFile(fileToFocus);
				this.drawCurrentFile();
			}
			this.stage.snapshot.updateSnapshotCanvas();
		},
		loadTileMap : function(map) {
			$http.get('/load-tilemap/' + map.id).then(function(data) {
				this.createFile(map.id, 'map', data.data);
			}.bind(this));
		},
		loadSpriteSheet : function(spritesheet) {
			$http.get('/load-spritesheet/' + spritesheet).then(function(data) {
				if(!this.getFileById(spritesheet)){
					// this.stage.draw.spritesheet('img/' + data.data.images[0], function() {
						
					// }); 
					
					this.createFile(spritesheet, 'spritesheet', {w : 800, h : 600, frames : data.data.frames, spritesheet : data.data.images[0]});
					this.stage.setupModes();
				}
			}.bind(this));
		},
		changeFile : function(file) {
			this.stage.currentFile = this.stage.files[file];
			this.stage.setupModes();
		},
		drawCurrentFile : function() {
			var items = this.stage.currentFile.items;
			for(var i = 0; i < items.length; i++)
				items[i].drawImg();
			if(this.stage.currentFile.frames){
				var frames = this.stage.currentFile.frames;
				for(var i = 0; i < frames.length; i++)
					frames[i].create();
			}
			this.stage.updateCanvas();
		},
		drawFile : function(id) {
			this.stage.clearStageItems();	
			this.stage.currentFile = this.getFileById(id);
			this.drawCurrentFile();	
			this.stage.snapshot.updateSnapshotCanvas();		
			this.stage.setupModes();
		},
		createItemsFromRaw : function(items) {
			for(var i = 0; i < items.length; i++)
				this.stage.createItem(items[i]);
		},
		createFramesFromRaw : function(frames) {
			var frameCol = [];
			for(var i = 0; i < frames.length; i++){
				var obj = frames[i],
					frame = this.stage.createFrame();
				frame.create(i + 1, obj[0], obj[1], obj[2], obj[3]);
				frameCol.push(frame);
			}
			return frameCol;
		},
		getFileById : function(id) {
			for(var i in this.stage.files)
				if(this.stage.files[i].name === id)return this.stage.files[i];
		},
		save : function() {
			this.stage.currentFile.isDirty = false;
			if(this.stage.currentFile.type === 'tilemap')
				this.stage.save.jsonTileMap();
			else
				this.stage.save.spritesheet();
			this.stage.currentFile.saved = true;
			setTimeout(function() {
				this.stage.currentFile.saved = false;
			}.bind(this), 1000);
		}
	}

	return File;
}]);