/**
 * MultiMap JS
 * Version 0.0
 * Created by Bilaal Rashid
 */

(function(window){
	// Library class function
	function library() {
		var _library = {};

		/**
		 * Instance variables
		 */
		var settings = {};
		var googleMap = {};
		var appleMap = {};
		var initCallback;

		/**
		 * Initialises the map
		 * @param  {Object}   options  [Config options for map]
		 * @param  {Function} callback [Optional callback after map has been setup]
		 */
		_library.init = function(options, callback) {
			settings = options;

			initCallback = callback;

			// Load map API
			if (settings.setup.platform == "google") {
				_library.loadScript("https://maps.googleapis.com/maps/api/js?key="+settings.google.apiKey+"&callback=MultiMap.setupGoogle");
			} else {
				_library.loadScript("https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js", function() {
					// Initialises MapKit JS using JWT authentication code
					mapkit.init({
						authorizationCallback: function(done) {
							var xhr = new XMLHttpRequest();
							xhr.open("GET", settings.apple.jwt);
							xhr.addEventListener("load", function() {
								done(this.responseText);
							});
							xhr.send();
						}
					});

					_library.setupApple();
				});

			}
		};

		/**
		 * Loads script into DOM
		 * @param  {String}   path     [Path of script to be loaded]
		 * @param  {Function} callback [Optional callback function]
		 */
		_library.loadScript = function(path, callback) {

			var done = false;
			var scr = document.createElement('script');

			scr.onload = handleLoad;
			scr.onreadystatechange = handleReadyStateChange;
			scr.onerror = handleError;
			scr.src = path;
			document.body.appendChild(scr);

			function handleLoad() {
				if (!done) {
					done = true;
					if (typeof(callback) == "function") {
						callback(path, "ok");
					}
				}
			}

			function handleReadyStateChange() {
				var state;

				if (!done) {
					state = scr.readyState;
					if (state === "complete") {
						handleLoad();
					}
				}
			}
			function handleError() {
				if (!done) {
					done = true;
					if (typeof(callback) == "function") {
						callback(path, "error");
					}
				}
			}
		};

		/**
		 * Callback after Google Maps API has loaded to setup map,
		 * runs initCallback once map has been setup
		 */
		_library.setupGoogle = function() {
			googleMap.loaded = true;

			googleMap.map = new google.maps.Map(document.getElementById(setting.setup.map), {
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

		/**
		 * Callback after MapKit JS API has loaded to setup map,
		 * runs initCallback once map has been setup
		 */
		_library.setupApple = function() {
			appleMap.loaded = true;

	        var region = new mapkit.CoordinateRegion(
	            new mapkit.Coordinate(settings.setup.center.latitude, settings.setup.center.longlitude),
	            new mapkit.CoordinateSpan(settings.apple.coordinateSpan.latitude, settings.apple.coordinateSpan.longlitude)
	        );

	        appleMap.map = new mapkit.Map(settings.setup.map);
	        appleMap.map.region = region;

			if (typeof(initCallback) == "function") {
				initCallback();
			}
		};

		/**
		 * Adds pin to map
		 * @param  {Object} position [Position of pin to be added]
		 * @return {?Pin}            [Return Google Maps pin]
		 */
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
			} else if (settings.setup.platform == "apple" && appleMap.loaded == true) {
				var coord = new mapkit.Coordinate(position.latitude, position.longlitude);
				var MarkerAnnotation = mapkit.MarkerAnnotation;
				var annotation = new MarkerAnnotation(coord);

				appleMap.map.addAnnotation(annotation);

				return null;
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
