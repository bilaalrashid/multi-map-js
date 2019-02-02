(function(window){
	// This function will contain all our code
	function library() {
		var _library = {};

		var settings = {};
		var googleMap = {};
		var initCallback;


		_library.init = function(options, callback) {
			settings = options;

			initCallback = callback;

			_library.load();
		};

		_library.load = function() {
			if (settings.setup.platform == "google") {
				var script = document.createElement("script");
				script.src = "https://maps.googleapis.com/maps/api/js?key="+settings.google.apiKey+"&callback=MultiMap.setupGoogle";
				document.head.appendChild(script);
			}
		};

		_library.setupGoogle = function() {
			googleMap.loaded = true;

			googleMap.map = new google.maps.Map(document.getElementById("map"), {
				center: {
					lat: settings.setup.center.latitude, 
					lng: settings.setup.center.longlitude
				},
				zoom: settings.google.zoom
			});

			if (typeof(initCallback) == "function") {
				initCallback();
			}
		};

		_library.addPin = function(position) {
			if (settings.setup.platform == "google" && googleMap.loaded == true) {
				var pin = new google.maps.Marker({
					position: {
						lat: position.latitude, 
						lng: position.longlitude
					}, 
					map: googleMap.map
				});

				return pin;
			}

			return null;
		};

		return _library;
	}

	// We need that our library is globally accessible, then we save in the window
	if (typeof(window.MultiMap) === "undefined") {
		window.MultiMap = library();
	}

})(window);
