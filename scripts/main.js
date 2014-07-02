function initialize() {
  var myLatlng = new google.maps.LatLng(32.9570199,-96.6874151);
  var mapOptions = {
    zoom: 11,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var errdiv = document.getElementById('err-lbl');
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(errdiv);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length <= 0) { return; }

    for (var i = 0, place; place = places[i]; i++) {
      if (place.types[0] == 'street_address') {
        addMarker(map, place.geometry.location, google.maps.Animation.DROP);
      }
    }
  });

  google.maps.event.addListener(map, 'click', function(event) {
    if (map.getZoom() < 15) {
      //document.getElementById('pac-input').val('error');
      showError('TEST');
      console.debug('error');
      return;
    }
    addMarker(map, event.latLng, null);
  });
  
  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
}

function showError(text) {
  //var errdiv = document.getElementById('err-lbl');
  //errdiv.innerHTML = text;
  ////errdiv.slideUp("slow", function() { } );
  var div = $('err-lbl');
  div.innerHTML(text);
  div.slideUp();
}
