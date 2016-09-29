app.factory('util', function() {
	function  Util() {
		
	}

	Util.prototype = {
		arrayColletionToObjectCollection : function(item) {
			var arr = [];
			for(var i = 0; i < item.length; i++){
				arr.push({x : item[i][0], y : item[i][1], w : item[i][2], h : item[i][3]});
			}
			return arr;
		},

		objectCollectionToArrayCollection : function(item) {
			var arr = [];
			for(var i = 0; i < item.length; i++){
		 		arr.push([item[i].x, item[i].y, item[i].w, item[i].h]);
		 	}
		 	return arr;
		}
	}

	return new Util;
});