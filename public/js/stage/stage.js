app.factory('stage', [
	'Preload', 'draw', 'TileMap', 'Item', '$http', 'Selection', 'Paint', 'Erase', 'Move', 
	'keys', 'cursor', '$rootScope', 'snapshot',
	function(Preload, draw, TileMap, Item, $http, Selection, Paint, Erase, Move, keys, cursor, $rootScope, snapshot) {

	function Stage(stageId) {
		this.CELL_WIDTH	= 25;
		this.CELL_HEIGHT = 25;
		// this.currentImage = 'box';
		// this.currentImageName = 'Box';
		// this.currentImageFile = 'box.jpg';
		this.mode = 'paint';
		this.stage = new createjs.Stage(stageId);
		this.snapshotStage = new createjs.Stage(document.createElement('canvas'));

		this.baseWidth = 1600;
		this.baseHeight = 800;

		// Classes
		this.draw = draw;
		this.draw.init(this);
		this.tileMap = new TileMap(this);
		this.preload = new Preload;
		this.snapshot = snapshot;

		// Modes
		this.modes = {
			paint : new Paint(this),
			selection : new Selection(this),
			move : new Move(this),
			erase : new Erase(this)
		}

		this.files = {
			untitled : {
				name : 'untitled',
				items : [],
				size : {w : this.baseWidth, h : this.baseHeight}
			}
		};
		this.currentFile = this.files.untitled;
		this.currentFileName = 'untitled';
		this.rows = this.stage.canvas.height / this.CELL_HEIGHT;
		this.cols = this.stage.canvas.width / this.CELL_WIDTH;


		
	}

	Stage.prototype = {
		init : function() {
			this.preload.init(function(items) {
				console.log(items);
				this.loadedItems = items;
				this.currentItem = items[0];
				this.setupClickEvents();
				this.updateCanvas();
				this.update();
				this.createSnapShot();
				$rootScope.$apply();
			}.bind(this));
		},
		keydown : function(e) {
			if(e.target.localName === 'input')return true;

			var key = keys(e);
			if(key === 'delete')
				this.modes.selection.destroySelectedItems();
			if(key === 'esc')
				this.modes.selection.deselectItems();
			if(key === 'p')
				this.setMode('paint');
			if(key === 's')
				this.setMode('selection');
			if(key === 'm')
				this.setMode('move');
			if(key === 'e')
				this.setMode('erase');
		},
		setupClickEvents : function() {
			this.getStage().on('stagemousedown', this.mouseDown.bind(this));
			this.getStage().on('stagemouseup', 	this.mouseUp.bind(this));
			this.getStage().on('stagemousemove', this.mouseMove.bind(this));
		},
		updateCanvas : function() {
			if(!this.draw)return;
			this.rows = this.currentFile.size.h / this.CELL_HEIGHT;
			this.cols = this.currentFile.size.w / this.CELL_WIDTH;
			this.stage.canvas.width = this.currentFile.size.w;
			this.stage.canvas.height = this.currentFile.size.h;
			this.snapshotStage.canvas.width = this.currentFile.size.w;
			this.snapshotStage.canvas.height = this.currentFile.size.h;
			this.draw.clearLines();
			this.draw.drawCanvasGrid();	
		},
		setCurrentItem : function(id) {
			this.currentItem = this.getLoadedItemById(id);
		},
		mouseDown : function(e) {
			if(e.nativeEvent.button !== 0)return;

			this.currentFile.isDirty = true;
			this.showcontextMenu = false;
			this.drawing = true;
			this.mouseDownMouseCoords = this.getMouseAndRowCoords(e);


			this.setModeFromMouseEvent('MouseDown', e)
		},
		mouseUp : function(e) {
			if(e.nativeEvent.button !== 0)return;
			this.drawing = false;	
			this.savedMode = false;
			this.mouseUpMouseCoords = this.getMouseAndRowCoords(e);
			this.showcontextMenu = false;

			this.setModeFromMouseEvent('MouseUp', e);
		},
		mouseMove : function(e) {
			this.mouseMoveMouseCoords = this.getMouseAndRowCoords(e);
			if(this.modes[this.mode][this.mode + 'FollowMouse'])this.modes[this.mode][this.mode + 'FollowMouse'](e);

			if(!this.drawing)return;
			if(this.isMoving){
				this.overRideMode = 'move';
			} else this.overRideMode = false;

			this.setModeFromMouseEvent('', e);


		},
		setMode : function(mode) {
			cursor.change(mode);
			for(var i in this.modes)
				if(this.modes[i].cleanUp)this.modes[i].cleanUp();
			this.mode = mode;
		},
		setSize : function(size) {
			this.updateCanvas();
		},
		setModeFromMouseEvent : function(mouseEvent, e) {
			if(this.overRideMode){
				if(this.modes[this.overRideMode][this.overRideMode + mouseEvent])
					this.modes[this.overRideMode][this.overRideMode + mouseEvent](e);
			} else{
				if(this.modes[this.mode][this.mode + mouseEvent])
					this.modes[this.mode][this.mode + mouseEvent](e);
			}
		},
		getMouseAndRowCoords : function(e) {
			var obj = {
				x : e.stageX,
				y : e.stageY,
			}
			obj.coords = this.getRowColFromXY(obj.x,obj.y);
			obj.row = obj.coords.row;
			obj.col = obj.coords.col;
			return obj;
		},
		createSnapShot : function() {
			setTimeout(function() {
				this.canvasImage = this.snapshot.create(this.snapshotStage.canvas);
				$rootScope.$apply();
				
			}.bind(this), 100)
		},
		createItemByXYWH : function(x, y, w, h) {
			if(typeof x === 'object'){
				y = x.y;
				w = x.w;
				h = x.h;
				x = x.x;
			}
			var rowCol = this.getRowColFromXY(x, y),
				endRowCol = this.getRowColFromXY(x + w, y + h)
				startRow = rowCol.row,
				startCol = rowCol.col,
				endRow = endRowCol.row,
				endCol = endRowCol.col,
				obj = {
					row : startRow,
					col : startCol,
					file : this.currentItem.file,
					src : this.currentItem.src,
					id : this.currentItem.id,
					y : startRow * this.CELL_HEIGHT,
					x : startCol * this.CELL_WIDTH,
					w : (endCol - startCol + 1) * this.CELL_WIDTH, 
					h : (endRow - startRow + 1) * this.CELL_HEIGHT
				}

			this.createItem(obj);
		},
		updateSelectedItems : function() {
			this.selectedItems = this.modes.selection.getSelectedItems();	
		},
		createItemsFromRaw : function(items) {
			console.log(items);
			for(var i = 0; i < items.length; i++)
				this.createItem(items[i]);
		},
		createItem : function(row, col, x, y, w, h, file, src, id) {
			var obj = row instanceof Object ? row : {
				row : row, 
				col : col, 
				x : x, 
				y : y,
				w : w,
				h : h,
				file : file,
				src : src,
				id : id
			}, item;

			if(this.getItemByXY(x, y))return;

			item = new Item(this, obj);
			item.drawImg();
			
			this.addItem(item);
		},
		
		addItem : function(obj) {
			this.currentFile.items.push(obj);
		},
		save : function() {
			this.currentFile.isDirty = false;
			this.tileMap.jsonTileMap();
			this.currentFile.saved = true;
			setTimeout(function() {
				this.currentFile.saved = false;
			}.bind(this), 1000);
			$rootScope.$apply();
		},
		clearStageItems : function() {
			for(var i = 0; i < this.currentFile.items.length; i++)
				this.currentFile.items[i].destroyImages();
		},
		destroyItem : function(item) {
			item.destroyImages();
			this.currentFile.items.splice(this.currentFile.items.indexOf(item), 1);
		},
		getRowColFromXY : function(x, y) {
			return {row : Math.floor(y / this.CELL_HEIGHT), col : Math.floor(x / this.CELL_WIDTH)};
		},
		getItemsByXYWH : function(x, y, w, h) {
			var els = [];
			for(var i = x; i < x + w; i++)
				for(var j = y; j < y + h; j++){
					var item = this.getItemByXY(i, j);
					if(item && els.indexOf(item) < 0)els.push(item);
				}
			return els;
		},
		getItemByXY : function(x, y) {
			var item;
			for(var i = 0; i < this.currentFile.items.length; i++){
				item = this.currentFile.items[i];
				if( item.x <= x && item.y <= y && item.x + item.w > x && item.y + item.h > y)return item; 
				
			}
		},
		getStage : function() {
			return this.stage;	
		},
		getLoadedItemById : function(id) {
			for(var i = 0; i < this.loadedItems.length; i++)
				if(this.loadedItems[i].id === id)return this.loadedItems[i];	
		},
		addChild : function(child) {
			this.stage.addChild(child);
			if(!this.fileIsLoading)
				this.updateSnapshotCanvas();
		},
		removeChild : function(child) {
			this.stage.removeChild(child);
			if(!this.fileIsLoading)
				this.updateSnapshotCanvas();
		},
		updateSnapshotCanvas : function() {
			var children = [];
			this.snapshotStage.children = null;
			for(var i = 0; i < this.stage.children.length; i++){
				if(!this.stage.children[i].graphics)
					children.push(this.stage.children[i].clone(true));
			}
			this.snapshotStage.children = children;
			this.createSnapShot();
		},
		update : function() {
			setInterval(function() {
				this.stage.update();
				this.snapshotStage.update();
			}.bind(this), 100)
		},




		// File Management
		createFile : function(id, obj) {
			this.fileIsLoading = true;
			this.clearStageItems();
			this.files[id] = {
				name : id,
				items : [],
				size : obj ? ({w : obj.w || obj.width, h : obj.h || obj.height}) : {w : this.baseWidth, h : this.baseHeight}
			};
			this.changeFile(id);
			this.updateCanvas();
			if(obj.data)
				this.createItemsFromRaw(obj.data);
			this.fileIsLoading = false;
			this.updateSnapshotCanvas();
		},
		closeFile : function(id) {
			this.fileIsLoading = true;
			var fileList = Object.keys(this.files),
				prevOpenFile = fileList.indexOf(id) - 1,
				nextOpenFile = fileList.indexOf(id) + 1,
				fileToFocus = fileList[prevOpenFile > -1 ? prevOpenFile : nextOpenFile];

			this.clearStageItems();
			delete this.files[id];

			if(fileToFocus && this.currentFile.name === id){
				this.changeFile(fileToFocus);
				this.drawCurrentFile();
			}
			this.fileIsLoading = false;
			this.updateSnapshotCanvas();
		},
		loadTileMap : function(map) {
			$http.get('/load-tilemap/' + map.id).then(function(data) {
				this.createFile(map.id, data.data);
			}.bind(this));
		},
		changeFile : function(file) {
			this.currentFile = this.files[file];
		},
		drawCurrentFile : function() {
			var items = this.currentFile.items;
			for(var i = 0; i < items.length; i++)
				items[i].drawImg();
			this.updateCanvas();
		},
		drawFile : function(id) {
			this.clearStageItems();	
			this.currentFile = this.files[id];
			this.drawCurrentFile();	
		}
	}

	var stage = new Stage('map-creator');
	stage.init();
	return stage;
}]);
