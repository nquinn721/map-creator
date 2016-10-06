app.factory('File', function() {
	function File(stage, obj) {
		this.stage = stage;
		this.name = obj.name || 'untitled.js';
		this.items = obj.items || [];
		this.size = obj.size || {w : stage.baseWidth, h : stage.baseHeight};
		this.type = obj.type || 'tilemap';
		this.frames = obj.frames || [];
		this.animations = obj.animations || [{}];
		this.spritesheet = obj.spritesheet || null;
		this.background = obj.background || null;
		this.prefabs = obj.prefabs || null;
		this.selectedItems = {};
		this.colors = ['red', 'green', 'pink', 'yellow', 'orange', 'blue']
	}
	File.prototype = {
		updateSelectedItems : function() {
			var items = this.stage.mapModes.selection.getSelectedItems(),
				item;

			// Reset currentfile selectd items
			this.selectedItems = {};
			
			for(var i = 0; i < items.length; i++){
				item = items[i];

				this.addSelected(item);
			}

			if(items.length)
				this.hasSelected = true;
			else this.hasSelected = false;


			this.stage.applyRootScope();
		},
		updateSelected : function(selectionName, item) {
			var items = this.selectedItems[selectionName].slice();


			for(var i = 0; i < items.length; i++){
				items[i].body = item.body;
				items[i].type = item.type;
				this.addSelected(items[i]);
				this.removeSelected(selectionName, items[i]);
			}
		},
		removeSelected : function(selectionName, item) {
			var f = this.selectedItems[selectionName];
			f.splice(f.indexOf(item), 1);
			this.clearEmptySelecteds();
		},
		addSelected : function(name, item) {
			var color;
			if(typeof name === 'object'){
				selectionName = this.selectionName(name);
				item = name;
			}else{
				selectionName = name;
			}
			if(!this.selectedItems[selectionName]){
				color = this.colors[Object.keys(this.selectedItems).length];
				this.selectedItems[selectionName] = {
					config : {
						color : color,
						background : color + '-border'
					},
					items : []
				};
			}else{
				color = this.selectedItems[selectionName].config.color;
			}
			item.addSelectedBackground(color);
			this.selectedItems[selectionName].items.push(item);
		},
		clearEmptySelecteds : function() {
			for(var i in this.selectedItems)
				if(!this.selectedItems[i].length)delete this.selectedItems[i];
		},
		selectionName : function(item) {
			return item.element + item.type + item.body;
		},
		cleanup : function () {
			this.stage.dontUpdateMiniMap = true;
			for(var i = 0; i < this.items.length; i++)
				this.items[i].destroyImages();

			for(var i = 0; i < this.frames.length; i++)
				this.frames[i].destroyImages();
		}
	}
	return File;
});