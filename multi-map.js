(function(window){
	// This function will contain all our code
	function library() {
		var _libraryObject = {};

		// Just create a property to our library object.
		_libraryObject.init = function(prop) {
			
		};

		return _libraryObject;
	}

	// We need that our library is globally accessible, then we save in the window
	if(typeof(window.MultiMap) === "undefined") {
		window.MultiMap = library();
	}

})(window);
