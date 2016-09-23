app.factory('TileMap', ['$http', function($http) {
	
	function TileMap(stage) {
		this.stage = stage;
	}

	TileMap.prototype = {
		jsonTileMap : function() {
			var arr = [],
				file = this.stage.currentFile;
			for(var i = 0; i < file.items.length; i++){
					var item = file.items[i];
					arr.push({
						row : item.row, 
						col : item.col, 
						x : item.x,
						y : item.y,
						w : item.w,
						h : item.h,
						el : item.element,
						sprite : item.fileName,
						file : item.file,
						element : item.element,
						src : item.src
					});
			}
			

			var obj = {
				w : file.size.w,
				h : file.size.h,
				data : arr
			}
			$http.post('/save-tilemap', {name : file.name, data: obj});
			return obj;

		},
	}

	return TileMap;
}]);
