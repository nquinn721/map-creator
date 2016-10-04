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
		this.selectedItems = {};
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

			console.log(items);

			for(var i = 0; i < items.length; i++){
				items[i].body = item.body;
				items[i].type = item.type;
				this.addSelected(items[i]);
				this.removeSelected(selectionName, items[i]);
			}
			console.log(this.selectedItems);
		},
		removeSelected : function(selectionName, item) {
			var f = this.selectedItems[selectionName];
			f.splice(f.indexOf(item), 1);
			this.clearEmptySelecteds();
		},
		addSelected : function(name, item) {
			if(typeof name === 'object'){
				selectionName = this.selectionName(name);
				item = name;
			}else{
				selectionName = name;
			}
			console.log('add');
			if(!this.selectedItems[selectionName])
				this.selectedItems[selectionName] = [];

			this.selectedItems[selectionName].push(item);
		},
		clearEmptySelecteds : function() {
			for(var i in this.selectedItems)
				if(!this.selectedItems[i].length)delete this.selectedItems[i];
		},
		selectionName : function(item) {
			return item.element + item.type + item.body;
		}
	}
	return File;
});