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

			googleMap.map = new google.maps.Map(document.getElementById(settings.setup.map), {
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
		 * Callback after Apple MapKit JS API has loaded to setup map,
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
		 * @param  {Object} pinSettings [Position of pin to be added]
		 * @return {?Pin}               [Return Google Maps pin]
		 */
		_library.addPin = function(pinSettings) {
			/*
			 * Google Maps
			 */
			if (settings.setup.platform == "google" && googleMap.loaded == true) {
				var mapPinOptions = {
					position: {
						lat: pinSettings.position.latitude, 
						lng: pinSettings.position.longlitude
					}, 
					map: googleMap.map
				};

				
				// Set title
				var infoHTML = "";
				if (typeof pinSettings.title !== "undefined") {
					mapPinOptions.title = pinSettings.title;

					infoHTML += "<div style='padding: 2px;'>";
					infoHTML += "<h1 style='margin: 0px; font-size: 20px;'>"+pinSettings.title+"</h1>";

					if (typeof pinSettings.subtitle !== "undefined") {
						infoHTML += "<p style='margin: 0px;'>"+pinSettings.subtitle+"</p>";
					}

					infoHTML += "</div>";
				}

				// Set icon
				if (typeof pinSettings.icon !== "undefined") {
					// Get icon
					var icon;
					if (typeof pinSettings.icon["2"] !== "undefined") {
						icon = pinSettings.icon["2"];
					} else {
						icon = pinSettings.icon["1"];
					}

					// Set anchor
					if (typeof pinSettings.anchor !== "undefined" && typeof pinSettings.size !== "undefined") {
						var logoMarker;

						switch(pinSettings.anchor) {
							case "center":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(pinSettings.size.width / 2, pinSettings.size.height / 2)
								);
								break;
							case "centerLeft":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(0, pinSettings.size.height / 2)
								);
								break;
							case "centerRight":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(pinSettings.size.width, pinSettings.size.height / 2)
								);
								break;
							case "bottomCenter":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(pinSettings.size.width / 2, pinSettings.size.height)
								);
								break;
							case "bottomLeft":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(0, pinSettings.size.height)
								);
								break;
							case "bottomRight":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(pinSettings.size.width, pinSettings.size.height)
								);
								break;
							case "topCenter":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(pinSettings.size.width / 2, 0)
								);
								break;
							case "topLeft":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(0, 0)
								);
								break;
							case "topRight":
								logoMarker = new google.maps.MarkerImage(
									icon,
									new google.maps.Size(pinSettings.size.width, pinSettings.size.height),
									new google.maps.Point(0, 0),
									new google.maps.Point(pinSettings.size.width, 0)
								);
								break;
						}

						mapPinOptions.icon = logoMarker;
					} else {
						mapPinOptions.icon = new google.maps.MarkerImage(icon);
					}
				}

				var pin = new google.maps.Marker(mapPinOptions);

				if (infoHTML) {
					var infowindow = new google.maps.InfoWindow({
						content: infoHTML
					});

					pin.addListener("click", function() {
						infowindow.open(googleMap.map, pin);
					});
				}

				return pin;
			} else if (settings.setup.platform == "apple" && appleMap.loaded == true) {
				/*
				 * Apple MapKit JS
				 */
				var coord = new mapkit.Coordinate(pinSettings.position.latitude, pinSettings.position.longlitude);
				var markerSettings = {};
				
				// Set title
				if (typeof pinSettings.title !== "undefined") {
					markerSettings.title = pinSettings.title;
				}

				// Set subtitle
				if (typeof pinSettings.subtitle !== "undefined") {
					markerSettings.subtitle = pinSettings.subtitle;
				}

				if (typeof pinSettings.icon !== "undefined") {
					// Image annotation mode
					
					// Set image
					if (typeof pinSettings.icon !== "undefined") {
						markerSettings.url = pinSettings.icon;
					}

					// Set anchor
					if (typeof pinSettings.anchor !== "undefined" && typeof pinSettings.size !== "undefined") {
						switch(pinSettings.anchor) {
							case "center":
								markerSettings.anchorOffset = new DOMPoint(0, -pinSettings.size.height / 2);
								break;
							case "centerLeft":
								markerSettings.anchorOffset = new DOMPoint(-pinSettings.size.width / 2, -pinSettings.size.height / 2);
								break;
							case "centerRight":
								markerSettings.anchorOffset = new DOMPoint(pinSettings.size.width / 2, -pinSettings.size.height / 2);
								break;
							case "bottomCenter":
								markerSettings.anchorOffset = new DOMPoint(0, 0);
								break;
							case "bottomLeft":
								markerSettings.anchorOffset = new DOMPoint(-pinSettings.size.width / 2, 0);
								break;
							case "bottomRight":
								markerSettings.anchorOffset = new DOMPoint(pinSettings.size.width / 2, 0);
								break;
							case "topCenter":
								markerSettings.anchorOffset = new DOMPoint(0, -pinSettings.size.height);
								break;
							case "topLeft":
								markerSettings.anchorOffset = new DOMPoint(-pinSettings.size.width / 2, -pinSettings.size.height);
								break;
							case "topRight":
								markerSettings.anchorOffset = new DOMPoint(pinSettings.size.width / 2, -pinSettings.size.height);
								break;
						}
					}

					var imageAnnotation = new mapkit.ImageAnnotation(coord, markerSettings);
					appleMap.map.addAnnotation(imageAnnotation);
				} else {
					// Marker annotation mode
					
					if (typeof pinSettings.glyphText !== "undefined" || typeof pinSettings.glyphImage !== "undefined") {
						// Glyph mode

						// Set pin color
						if (typeof pinSettings.color !== "undefined") {
							markerSettings.color = pinSettings.color;
						}

						// Set glyph
						if (typeof pinSettings.glyphText !== "undefined") {
							// Glyph text mode
							
							// Set glyph text
							markerSettings.glyphText = pinSettings.glyphText;
						} else {
							// Glyph image mode
							
							// Set glyph image
							if (typeof pinSettings.glyphImage !== "undefined") {
								markerSettings.glyphImage = pinSettings.glyphImage;
							}

							// Set selected glyph image
							if (typeof pinSettings.selectedGlyphImage !== "undefined") {
								markerSettings.selectedGlyphImage = pinSettings.selectedGlyphImage;
							}
						}
					}

					var MarkerAnnotation = mapkit.MarkerAnnotation;
					var annotation = new MarkerAnnotation(coord, markerSettings);

					appleMap.map.addAnnotation(annotation);
				}

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
