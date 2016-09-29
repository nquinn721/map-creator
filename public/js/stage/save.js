app.factory('Save', ['$http', 'util', function($http, util) {
	
	function Save(stage) {
		this.stage = stage;
	}

	Save.prototype = {
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
		spritesheet : function() {
			// var data = {
		 //        images: ["sprites.jpg"],
		 //        frames: [[40, 40, 100, 400]],
		 //        animations: {
		 //            stand:0,
		 //            run:[1,5],
		 //            jump:[6,8,"run"]
		 //        }
		 //    };
			var arr = [],
			 	file = this.stage.currentFile,
			 	data = {
			 		images : [file.spritesheet],
			 		frames : util.objectCollectionToArrayCollection(file.frames),
			 		animations : {}
			 	};


		 	console.log(file, data);

		 	$http.post('/save-spritesheet', {name : file.name, data : data});
		}
	}

	return Save;
}]);
