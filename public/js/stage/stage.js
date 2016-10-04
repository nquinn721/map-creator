app.factory('stage', [
	'Preload', 'Draw', 'Save', 'Item', 'Frame', 'Spritesheet', '$http', 'Selection', 'Paint', 'Erase', 'Move',  'SheetCutter',
	'keys', 'cursor', '$rootScope', 'Snapshot', 'FileManager', 'Animation', 'File', 'minimap',
	function(Preload, Draw, Save, Item, Frame, Spritesheet, $http, Selection, Paint, Erase, Move, SheetCutter,
			keys, cursor, $rootScope, Snapshot, FileManager, Animation, File, minimap) {

	function Stage(stageId) {
		this.CELL_WIDTH	= 25;
		this.CELL_HEIGHT = 25;
		this.mode = 'paint';
		this.stage = new createjs.Stage(stageId);
		this.stage.enableMouseOver(20);  
		this.baseWidth = 2000;
		this.baseHeight = 2000;

		// Classes
		this.draw = new Draw(this);
		this.save = new Save(this);
		this.snapshot = new Snapshot(this);
		this.fileManager = new FileManager(this);
		this.preload = new Preload;
		this.minimap = minimap;

		// Modes
		this.modes = {
		}
		this.mapModes = {
			paint : new Paint(this),
			selection : new Selection(this),
			move : new Move(this),
			erase : new Erase(this)
		}
		this.spritesheetModes = {
			sheetCutter : new SheetCutter(this),
			animation : new Animation(this)
		}
		this.files = {
			'untitled.js' : new File(this, {name : 'untitled.js', size : {w : this.baseWidth, h : this.baseHeight}, type : 'tilemap'})
		}
		this.currentFile = this.files['untitled.js'];
		this.currentFileName = 'untitled.js';
		this.rows = this.stage.canvas.height / this.CELL_HEIGHT;
		this.cols = this.stage.canvas.width / this.CELL_WIDTH;


		
	}

	Stage.prototype = {
		init : function() {
			this.preload.init(function(items) {
				for(var i = 0; i < items.length; i++){
					items[i].elType = 'floor';
					items[i].body = 'static';
				}
				this.loadedItems = items;
				this.currentItem = items[0];
				this.setupClickEvents();
				this.updateCanvas();
				this.update();
				this.snapshot.createSnapShot();
				this.setupModes();
				$rootScope.$apply();
				this.minimap.update();
			}.bind(this));
		},
		keydown : function(e) {
			if(e.target.localName === 'input')return true;

			var key = keys(e);
			if(key === 'delete')
				this.mapModes.selection.destroyAllSelected();
			if(key === 'esc')
				this.mapModes.selection.deselectItems();
			this.setMode(key);

			for(var i in this.modes)
				if(this.modes[i].keydown)this.modes[i].keydown(key, e);
		},
		keyup : function(e) {
			if(e.target.localName === 'input')return true;

			var key = keys(e);
			for(var i in this.modes)
				if(this.modes[i].keyup)this.modes[i].keyup(key, e);
		},
		setupClickEvents : function() {
			this.getStage().on('stagemousedown', this.mouseDown.bind(this));
			this.getStage().on('stagemouseup', 	this.mouseUp.bind(this));
			this.getStage().on('stagemousemove', this.mouseMove.bind(this));
		},
		updateCanvas : function() {
			if(!this.draw)return;
			this.dontUpdateMiniMap = true;
			this.rows = this.currentFile.size.h / this.CELL_HEIGHT;
			this.cols = this.currentFile.size.w / this.CELL_WIDTH;
			this.stage.canvas.width = this.currentFile.size.w;
			this.stage.canvas.height = this.currentFile.size.h;
			this.snapshot.updateCanvas();
			this.draw.clearLines();
			this.minimap.update();
			if(this.currentFile.type !== 'spritesheet'){
				this.draw.drawCanvasGrid();	
			}
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
			this.dontUpdateMiniMap = false;

			this.setModeFromMouseEvent('MouseUp', e);
		},
		mouseMove : function(e) {
			this.mouseMoveMouseCoords = this.getMouseAndRowCoords(e);
			if(this.modes[this.mode] && this.modes[this.mode][this.mode + 'FollowMouse'])this.modes[this.mode][this.mode + 'FollowMouse'](e);

			if(!this.drawing)return;
			if(this.isMoving){
				this.overRideMode = 'move';
			} else this.overRideMode = false;

			this.setModeFromMouseEvent('', e);
			this.dontUpdateMiniMap = false;

		},
		setMode : function(key) {
			var foundMode,
				reg = new RegExp(key, 'i');
			for(var i in this.modes)
				if(this.modes[i].shortcut.match(reg))
					foundMode = this.modes[i];

			// Leave if the no mode is associated with the key
			if(!foundMode)return;
			
			// cursor.change(key);
			for(var i in this.modes)
				if(this.modes[i].cleanUp)this.modes[i].cleanUp();

			this.mode = foundMode.name;
		},
		setSize : function(size) {
			this.updateCanvas();
		},
		setModeFromMouseEvent : function(mouseEvent, e) {
			if(this.overRideMode){
				if(!this.modes[this.overRideMode])return;
				if(this.modes[this.overRideMode][this.overRideMode + mouseEvent])
					this.modes[this.overRideMode][this.overRideMode + mouseEvent](e);
			} else{
				if(!this.modes[this.mode])return;
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
					element : this.currentItem.element,
					y : startRow * this.CELL_HEIGHT,
					x : startCol * this.CELL_WIDTH,
					w : (endCol - startCol + 1) * this.CELL_WIDTH, 
					h : (endRow - startRow + 1) * this.CELL_HEIGHT
				}

			this.createItem(obj);
		},
		updateSelectedItems : function() {
			this.selectedItems = this.mapModes.selection.getSelectedItems();	
		},
		updateLoadedItem : function(id, attr, value) {
			var item = this.getLoadedItemById(id);
			item[attr] = value;	
		},
		createSpriteSheet : function(spriteSheetName, w, h) {
			var obj = spriteSheetName instanceof Object ? spriteSheetName : {
				spritesheet : spriteSheetName,
				w : w,
				h : h
			}, item;

			item = new Spritesheet(this, obj);
			item.drawImg();
			this.addItem(item);
			this.snapshot.updateSnapshotCanvas();		
		},
		createFrame : function() {
			var frame = new Frame(this);
			return frame;
		},
		createItem : function(row, col, x, y, w, h, file, src, element) {
			var obj = row instanceof Object ? row : {
				row : row, 
				col : col, 
				x : x, 
				y : y,
				w : w,
				h : h,
				file : file,
				src : src,
				element : element
			}, item;

			if(this.getItemByXY(x, y))return;
			obj = $.extend(obj, this.getLoadedItemById(element));
			item = new Item(this, obj);
			item.drawImg(function() {
				this.stage.snapshot.updateSnapshotCanvas();
			}.bind(this));
			
			this.addItem(item);
		},
		
		addItem : function(obj) {
			this.currentFile.items.push(obj);
		},
		destroyItem : function(item) {
			item.destroyImages();
			this.currentFile.items.splice(this.currentFile.items.indexOf(item), 1);
		},
		destroyFrame : function(frame) {
			frame.destroyImages();
			this.currentFile.frames.splice(this.currentFile.frames.indexOf(frame), 1);
		},
		
		clearStageItems : function() {
			this.dontUpdateMiniMap = true;
			for(var i = 0; i < this.currentFile.items.length; i++)
				this.currentFile.items[i].destroyImages();

			for(var i = 0; i < this.currentFile.frames.length; i++)
				this.currentFile.frames[i].destroyImages();
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
			if(!this.dontUpdateMiniMap)
				this.snapshot.updateSnapshotCanvas();
		},
		removeChild : function() {
			this.stage.removeChild.apply(this.stage, arguments);
			if(!this.dontUpdateMiniMap)
				this.snapshot.updateSnapshotCanvas();
		},
		setupModes : function() {
			this.modes = {};
			if(this.currentFile.type === 'tilemap')
				for(var i in this.mapModes)
					this.modes[i] = this.mapModes[i];
			else
				for(var i in this.spritesheetModes)
					this.modes[i] = this.spritesheetModes[i];

			var keys = Object.keys(this.modes);
			this.mode = this.modes[keys[0]].name;
		},
		
		update : function() {
			setInterval(function() {
				this.stage.update();
			}.bind(this), 10);
		},
	}

	var stage = new Stage('map-creator');
	stage.init();
	return stage;
}]);
