var geocoder = new google.maps.Geocoder();

// Constructor
function Site(map, location, drop_animation) {
  // Initialize the instance properties
  var instance = this;
  instance.map = map;
  instance.location = location;
  instance.drop_animation = drop_animation;
  instance.marker_icon = new google.maps.MarkerImage("img/site_icon.png", null, null, null, new google.maps.Size(59,68));
  instance.marker = {};
  instance.info_window = {};
  instance.geo_results = {};
  instance.sidebar_item = {};

  // Kick off the location
  geocode();
  
  function geocode() {
    
    geocoder.geocode({'latLng': instance.location}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          instance.geo_results = results[0];
          createMarker();
          createInfoWindow();
          createSidebarItem();
        } else {
          showError('No results found');
          return null;
        }
      } else {
        showError('Geocoder failed due to: ' + status);
        return null;
      }
    });
  }

  function createMarker() {
    // create and add to map
    instance.marker = new google.maps.Marker({
      position: instance.location,
      map: instance.map,
      title: 'Hi H8rz',
      icon: instance.marker_icon,
      animation: instance.drop_animation
    });
  }

  function createInfoWindow() {
    instance.info_window = new google.maps.InfoWindow({
      content: 'Hi H8rz<br><p>' + instance.geo_results.formatted_address + '</p>'
    });
    instance.info_window.open(instance.map, instance.marker);

    google.maps.event.addListener(instance.info_window, 'closeclick', function() {
      removeMe();
    });
  }

  function createSidebarItem() {
    var street_number, route, city, county, state, country, zip;

    $.each(instance.geo_results.address_components, function(k, v) {
      var type = v.types[0];
      var value = v.long_name; // short_name

      if ('street_number' == type) {
        street_number = value;
      } else if ('route' == type) {
        route = value;
      } else if ('locality' == type) {
        city = value;
      } else if ('administrative_area_level_2' == type) {
        county = value;
      } else if ('administrative_area_level_1' == type) {
        state = value;
      } else if ('country' == type) {
        country = value;
      } else if ('postal_code' == type) {
        zip = value;
      }
    });

    instance.sidebar_item = $('<div>', {class: 'sidebar-item'});

    var remove = $('<div>', {class: 'remove-button'});
    remove.click(function() {
      removeMe();
    });
    instance.sidebar_item.append(remove);

    instance.sidebar_item.append($('<div>', {class: 'address-line', html: street_number + ' ' + route + '<br>' + city + ' ' + state + ' ' + zip}));

    $('#sidebar').append(instance.sidebar_item);
  }

  function removeMe() {
    instance.marker.setMap(null);
    instance.sidebar_item.remove();
    removeSite(instance);
  }
}
