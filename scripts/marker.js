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

  $('#sidebar').append(createSidebarItem(marker));
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

function createSidebarItem(marker) {
  var item = $('<div>', {class: 'sidebar-item'});
  item.prop('marker', marker);

  item.html('TEST');

  return item;
}

function removeSidebarItem(marker) {
  $('#sidebar div').each(function () {
    if ($(this).prop('marker') == marker) {
      $(this).remove();
    }
  });
}
