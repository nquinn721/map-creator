app.factory('keyEvents', ['keys', '$document', '$rootScope', function(keys, $document, $rootScope) {
	function KeyEvents() {
		this.keyupEvents = {};
		this.keydownEvents = {};
		this.allkeydownEvents = [];
		this.allkeyupEvents = [];
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
		registerAll : function(event, cb) {
			this['all' + event + 'Events'].push(cb);
		},
		keyDown : function(e) {
			if(e.target.localName === 'input')return true;
			var key = keys(e),
				event = this.keydownEvents[key];

			if(event)
				for(var i = 0; i < event.length; i++)
					event[i](e);
			$rootScope.$apply();

			for(var i = 0; i < this.allkeydownEvents.length; i++)
				this.allkeydownEvents[i](e);
			
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

			for(var i = 0; i < this.allkeyupEvents.length; i++)
				this.allkeyupEvents[i](e);

			return false;
		}
	}

	var keyEvents = new KeyEvents;
	keyEvents.init();
	return keyEvents;
}]);