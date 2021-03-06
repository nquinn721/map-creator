app.factory('Selection', ['$rootScope', function($rootScope) {
	function Selection(stage) {
		this.stage = stage;
		this.name = 'selection';
		this.icon = 'object-group';
		this.shortcut = 'S';
	}	

	Selection.prototype = {
		selection : function() {
			this.stage.selectionBox = this.stage.draw.selection(
				this.stage.mouseDownMouseCoords.x, 
				this.stage.mouseDownMouseCoords.y, 
				this.stage.mouseMoveMouseCoords.x, 
				this.stage.mouseMoveMouseCoords.y
			);
			this.stage.addChild(this.stage.selectionBox);
		},
		selectionMouseUp : function() {
			if(!this.stage.selectionBox)return;
			var down = this.stage.mouseDownMouseCoords,
				up = this.stage.mouseUpMouseCoords,
				items, x, y, w, h;

			this.stage.draw.destroySelection();
			x = down.x < up.x ? down.x : up.x;
			w = down.x > up.x ? down.x - up.x : up.x - down.x;
			y = down.y > up.y ? up.y : down.y;
			h = down.y < up.y ? up.y - down.y : down.y - up.y;

			items = this.stage.getItemsByXYWH(x, y, w, h);

			if(items.length){
				this.select(items);
				$rootScope.$apply();
				this.showSelectionMenu();
			}else{
				this.currentFillSelectedObj = {
					x : x, 
					y : y, 
					w : w, 
					h : h
				}
				if(w > 10 && h > 10)
					this.showFillMenu();
			}
		},
		
		combineSelectedItems : function() {
			var items = this.getSelectedItems(),
				item, obj;

			if(!items.length)return;

			for(var i = 0; i < items.length; i++){
				item = items[i];
				if(!obj)obj = item;
				else{
					if(item.row !== obj.row && obj.col === item.col){
						obj.h += item.h;
					}
					if(item.col !== obj.col && obj.row === item.row){
						obj.w += item.w;
					}
				}
				this.stage.destroyItem(item);
			}
			delete obj.img;
			delete obj.selectionBox;
			delete obj.stage;

			this.stage.createItem(obj);	
		},
		showSelectionMenu : function() {
			this.stage.showcontextMenu = 'selection';
		},
		showFillMenu : function() {
			this.stage.showcontextMenu = 'fill';
			$rootScope.$apply();
		},
		fillSelected : function() {
			this.stage.createItemByXYWH(this.currentFillSelectedObj);
		},
		deselectItems : function() {
			var items = this.getSelectedItems(),
				item;
				
			for(var i = 0; i < items.length; i++)
				items[i].deselect();
			
			this.stage.showcontextMenu = false;
		},
		destroyAllSelected : function() {
			this.destroySelectedItems();
			this.destroySelectedFrames();	
		},
		destroySelectedItems : function() {
			var items = this.getSelectedItems(),
				item;
			for(var i = 0; i < items.length; i++){
				item = items[i];
				item.destroy();
			}	
			this.stage.showcontextMenu = false;
		},
		destroySelectedFrames : function() {
			var frames = this.getSelectedFrames(),
				frame;
			for(var i = 0; i < frames.length; i++){
				frame = frames[i];
				frame.destroy();
			}
			this.stage.showcontextMenu = false;
		},
		getSelectedItems : function() {
			var items = [],
				stage = this.stage.currentFile;
			for(var i = 0; i < stage.items.length; i++)	
				if(stage.items[i].selected)items.push(stage.items[i]);
			return items;
		},
		getSelectedFrames : function() {
			var frames = [];
				stage = this.stage.currentFile;
			for(var i = 0; i < stage.frames.length; i++)
				if(stage.frames[i].selected)frames.push(stage.frames[i]);
			return frames;	
		},
		select : function(els) {
			if(!Array.isArray(els))els = [els];

			for(var i = 0; i < els.length; i++)
				els[i].select();
		}
	}

	return Selection;
}]);