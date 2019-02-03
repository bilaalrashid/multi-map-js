# Multi Map
Automatic wrapper for Google Maps API and MapKit JS based upon OS

## Usage

### Load map
The following code loads a plain map into the DOM.
``` HTML
<div id="map"></div>
<script src="multi-map.js"></script>
<script>
  var settings = {
      setup: {
          platform: "auto", // Specifies which service to use. Options: "auto", "google", "apple"
          mapID: "map", // ID of map container div
          center: { // Coordinates of the center of the map when first loaded
              latitude: 0,
              longlitude: 0
          }
      },
      google: {
          apiKey: "API_KEY", // Google Maps API key
          zoom: 8 // Google Maps zoom level. Higher values cause greater zoom.
      },
      apple: {
          jwt: "/services/jwt", // JWT authentication URL
          centerSpan: {      // Latitude and longlitude delta to display on screen when loaded.
              latitude: 0.1, // Measured in degrees. 1 degree = 111km at equator, 0km at poles.
              longlitude: 0.1
          }
      }
  };

  MultiMap.init(settings);
</script>
```
The settings are split into three sections: `setup`, which contains all of the generic options for both maps, `google`, which contains all of settings specific to Google Maps, and `apple`, which contains all of the settings specific to MapKit JS.

### Add pin
The following code adds a basic pin to the map. A pin identifier is returned.
``` HTML
<script>
  var settings = {
      ...
  };

  MultiMap.init(settings, function() {
      // Map loaded
      var pinSettings = {
          position: {
              latitude: 0,
              longlitude: 0
          }
      }
  
      var pin = MultiMap.addPin(pinSettings);
  });
</script>
```

### Remove pin
The following code adds a basic pin to the map. A pin identifier is returned.
``` HTML
<script>
  var settings = {
      ...
  };

  MultiMap.init(settings, function() {
      // Map loaded
      var pinSettings = {
          ...
      }
  
      var pin = MultiMap.addPin(pinSettings);
  
      MultiMap.removePin(pin);
  });
</script>
```

## Future Development
- Custom HTML info window callout
- Routing
- Map overlays
- Customise map
