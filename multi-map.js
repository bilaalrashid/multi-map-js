(function(window){
	// This function will contain all our code
	function library() {
		var _library = {};

		var settings;

		_library.init = function(options) {
			settings = options;

			_library.load();
		};

		_library.load = function() {
			if (settings.setup.platform == "google") {
				var script = document.createElement("script");
				script.src = "https://maps.googleapis.com/maps/api/js?key="+settings.google.apiKey+"&callback=MultiMap.setup";
				document.head.appendChild(script);
			}
		};

		_library.setup = function() {
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: settings.google.center.latitude, lng: settings.google.center.longlitude},
				zoom: settings.google.zoom
			});
		};

		return _library;
	}

	// We need that our library is globally accessible, then we save in the window
	if (typeof(window.MultiMap) === "undefined") {
		window.MultiMap = library();
	}

})(window);
