var markers = [];
var markerIcon = new google.maps.MarkerImage("img/site_icon.png", null, null, null, new google.maps.Size(59,68));
var geocoder = new google.maps.Geocoder();

function addMarker(map, location, animation) {

  // create and add to map
  var marker = createMarker(map, location, animation);

  // add to array of markers
  markers.push(marker);

  var infowindow = createInfoWindow(map, marker, location);
   
  // extend the map to include the new location
  map.getBounds().extend(location);

  //var bounds = new google.maps.LatLngBounds();
  //map.fitBounds(bounds);

}

function createInfoWindow(map, marker, location) {
  var infowindow = new google.maps.InfoWindow({
    content: 'Hi H8rz'
  });

  geocoder.geocode({'latLng': location}, function(results, status) {
    console.debug(results);
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        infowindow.setContent('Hi H8rz<br>' + results[0].formatted_address + '</br>');
        $('#sidebar').append(createSidebarItem(results[0], marker));
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });

  infowindow.open(map,marker);

  google.maps.event.addListener(infowindow,'closeclick',function(){
    removeMarker(marker);
  });

  return infowindow;
}

function geocode(location) {

  geocoder.geocode({'latLng': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        return results[0].formatted_address;
      } else {
        console.debug('No results found');
        return null;
      }
    } else {
      console.debug('Geocoder failed due to: ' + status);
      return null;
    }
  });
}

function removeMarker(marker) {

  // remove from map
  marker.setMap(null);
  
  // remove from array of markers
  var index = markers.indexOf(marker);
  if (index > -1) {
    markers.splice(index, 1);
  }

  // remove from sidebar
  removeSidebarItem(marker);
}

function createMarker(map, location, animation) {

  // create and add to map
  return new google.maps.Marker({
    position: location,
    map: map,
    title: 'Hi H8rz',
    icon: markerIcon,
    animation: animation
  });
}

function createSidebarItem(geo, marker) {
  var street_number, route, city, county, state, country, zip;

  $.each(geo.address_components, function(k, v) {
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


  var item = $('<div>', {class: 'sidebar-item'});
  item.prop('marker', marker);

  item.append($('<div>', {class: 'address-line', html: street_number + ' ' + route + '<br>' + city + ' ' + state + ' ' + zip}));

  return item;
}

function removeSidebarItem(marker) {
  $('#sidebar div').each(function () {
    if ($(this).prop('marker') == marker) {
      $(this).remove();
    }
  });
}
