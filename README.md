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
### Customising a pin

Pins have lots of options to customise them. All settings can be added as attributes to the pin settings object.

#### Titles and subtitles

In Apple's MapKit JS, the `title` and `subtitle` settings attributues directly map to attributes of the same name for a Marker Annotation and appear below the marker. If the `icon` settings attribute is defined, an Image Annotation is used in MapKit JS, so the title and subtitle appear as a 'speech mark' box, much like a Google Maps Info Window. In Google Maps, there are no title or subtitle equivalents, so the title and subtitle are implemented using a custom HTML Info Window.

``` JavaScript
var pinSettings = {
    position: {
        latitude: 0,
        longlitude: 0
    },
    title: "Title",
    subtitle: "Subtitle"
}
```

#### MapKit JS Glyphs and Marker Customisation

Apple's MapKit JS has the ablity to customise the glyph that is displayed inside the red pin. These properties do not affect Google Maps. Glyphs can either be in the form of a string, using the `glyphText` propety.

``` JavaScript
var pinSettings = {
    position: {
        latitude: 0,
        longlitude: 0
    },
    glyphText: "ABC"
}
```

To specify the glyph as an image, the `glyphImage` can be used. To support Retina displays, an optional, but recomened, 2x sized imaged can be specified. The `selectedGlyphImage` can also be used to specify a different image to be used when the pin is selected.

``` JavaScript
var pinSettings = {
    position: {
        latitude: 0,
        longlitude: 0
    },
    glyphImage: {
      1: "image.png",
      2: "image_2x.png", // Optional 2x sized image for Retina displays
    },
    selectedGlyphImage: {
      1: "image.png",
      2: "image_2x.png", // Optional 2x sized image for Retina displays
    }
}
```

The colour of the pins in MapKit JS can also be specified.

``` JavaScript
var pinSettings = {
    position: {
        latitude: 0,
        longlitude: 0
    },
    color: "#969696"
}
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
