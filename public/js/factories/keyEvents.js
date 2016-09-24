app.factory('keyEvents', ['keys', '$document', '$rootScope', function(keys, $document, $rootScope) {
	function KeyEvents() {
		this.keyupEvents = {};
		this.keydownEvents = {};
	}

	KeyEvents.prototype = {
		init : function() {
			this.setupListener();
		},
		setupListener : function() {
			$document.on('keyup', this.keyUp.bind(this))
				.on('keydown', this.keyDown.bind(this));
		},
		register : function (type, key, cb) {
			if(!this[type + 'Events'][key])this[type + 'Events'][key] = [];
			this[type + 'Events'][key].push(cb);
		},
		keyDown : function(e) {
			if(e.target.localName === 'input')return true;
			var key = keys(e),
				event = this.keydownEvents[key];

			if(event)
				for(var i = 0; i < event.length; i++)
					event[i](e);
			$rootScope.$apply();
			
			return false;
		},
		keyUp : function(e) {
			if(e.target.localName === 'input')return true;
			var key = keys(e),
				event = this.keyupEvents[key];

			if(event)
				for(var i = 0; i < event.length; i++)
					event[i](e);	
			$rootScope.$apply();

			return false;
		}
	}

	var keyEvents = new KeyEvents;
	keyEvents.init();
	return keyEvents;
}]);