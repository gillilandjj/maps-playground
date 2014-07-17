var mySites = [];
var plano = new google.maps.LatLng(32.9570199,-96.6874151);
var zoom = { region: 6, city: 12, street: 14, optimal: 16 };
var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var browserSupportFlag = new Boolean();

function initialize() {
  var mapOptions = {
    zoom: zoom.region,
    center: plano
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  // Create the search box
  var input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Create the globe
  var globe = document.getElementById('globe');
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(globe);

  // Create the error popover box
  var errdiv = document.getElementById('err-lbl');
  map.controls[google.maps.ControlPosition.BOTTOM].push(errdiv);

  var searchBox = new google.maps.places.SearchBox(input);

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length <= 0) { return; }
    if (places[0].geometry.location) {
      addPlace(map, places[0].geometry.location, google.maps.Animation.DROP, places[0].place_id);
    }

    /*for (var i = 0, place; place = places[i]; i++) {
      if (place.types[0] == 'street_address') {
        addSite(map, place.geometry.location, google.maps.Animation.DROP);
      }
    }*/
  });

  google.maps.event.addListener(map, 'click', function(event) {
    // Zoom to region
    if (map.getZoom() < zoom.region) {
      map.panTo(event.latLng);
      map.setZoom(zoom.region);
      return;
    }
    // Zoom to city
    if (map.getZoom() < zoom.city) {
      map.panTo(event.latLng);
      map.setZoom(zoom.city);
      return;
    }
    // Zoom to street
    if (map.getZoom() < zoom.street) {
      map.panTo(event.latLng);
      map.setZoom(zoom.street);
      return;
    }
    //Zoom to optimal
    if (map.getZoom() < zoom.optimal) {
      map.panTo(event.latLng);
      map.setZoom(zoom.optimal);
      return;
    }
    /*
    if (map.getZoom() < 15) {
      //document.getElementById('pac-input').val('error');
      showError(
        randomFrom(
          [
           'That… is why you fail. Zoom in.',
           'Try not. Do… or do not. There is no try. Zoom in.',
           'Everything is proceeding as I have foreseen. Zoom in.',
           'It’s against my programming to impersonate a deity. Zoom in.',
           'Great, kid. Don’t get cocky. Zoom in.',
           'I saw… a city in the clouds. Zoom in.',
           'You don’t have to do this to impress me. Zoom in.',
           'You are a member of the rebel alliance, and a traitor. Zoom in.',
           'STAY ON TARGET. Zoom in.',
           '…Scoundrel. I like that. Zoom in.',
           'That’s no moon. Zoom in.'
          ]
        )
      );
      return;
    }*/
    addSite(map, event.latLng, null, null);
  });
  
  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  google.maps.event.addListenerOnce(map, 'idle', function(){
    // do something only the first time the map is loaded
    $('#err-lbl').hide();
  });

  // Try W3C Geolocation (Preferred)
  setTimeout(function() {
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
  }, 3000);

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      showError("Geolocation service failed.");
      initialLocation = plano;
    } else {
      showError("Your browser doesn't support geolocation. Are you still using IE?? We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }

  showSidebarTip();
}

function showSidebarTip() {
  $('#sidebar-tip').show();
}

function hideSidebarTip() {
  $('#sidebar-tip').hide();
}

function addSite(map, location, animation, placeId) {
  mySites.push(new Site(map, location, animation, placeId));
  map.getBounds().extend(location);
  hideSidebarTip();
}

function addPlace(map, place_id, animation) {

  var service = new google.maps.places.PlacesService(map);
  service.getDetails({ placeId: place_id }, function(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      addSite(map, place.geometry.location, animation);
      //map.getBounds().extend(location);
    }
  }); 
}

function removeSite(site) {
  // remove from array of sites
  var index = mySites.indexOf(site);
  if (index > -1) {
    mySites.splice(index, 1);
  }
  if (mySites.length == 0) {
    showSidebarTip();
  }
}

function hideError() {
  setTimeout(function() {
    var div = $('#err-lbl');
    div.slideToggle(500);
  }, 3000);
}

function showError(text) {
  var div = $('#err-lbl');
  div.html(text);
  div.slideToggle(150, 'swing', hideError);
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
