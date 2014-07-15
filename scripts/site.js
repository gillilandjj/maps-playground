var geocoder = new google.maps.Geocoder();

// Constructor
function Site(map, location, drop_animation, placeId) {
  // Initialize the instance properties
  var instance = this;
  instance.map = map;
  instance.location = location;
  instance.drop_animation = drop_animation;
  instance.marker_icon = new google.maps.MarkerImage("img/MapMarker.png", null, null, null, new google.maps.Size(21,39));
  instance.marker = {};
  instance.info_window = {};
  instance.geo_results = {};
  instance.sidebar_item = {};

  // Kick off the location
  geocode();
  
  function geocode() {
    
    geocoder.geocode({'latLng': instance.location}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          if(!MURICA(results[0])) {
            return null;
          }
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

  function MURICA(georesults) {
    var address = getAddressItems(georesults.address_components);
    if ('US' == address['country']) {
      return true;
    }
    showError(
      randomFrom(
        [
          'What?!? Foreigners... Get back to \'Murica.',
          'This isn\'t the Land of the Free OR the Home of the Brave...',
          'Hey Christopher Columbus, you missed.',
          'I don\'t see red, white, or blue anywhere around here.',
          '¡Volver a Los Estados Unidos, por favor!',
          '<a href="http://cdn.memegenerator.net/instances/500x/49611893.jpg" target="_blank">\'MURICA! \'MURICA! \'MURICA!</a>',
          'Sorry, we seem to be having a little <a href="http://i2.kym-cdn.com/photos/images/facebook/000/451/444/428.jpg" target="_blank"> trouble...</a>'
        ]
      )
    );
    return false;
  }

  function createMarker() {
    // create and add to map
    instance.marker = new google.maps.Marker({
      position: instance.location,
      map: instance.map,
      title: 'Finding address...',
      icon: instance.marker_icon,
      animation: instance.drop_animation
    });
  }

  function createInfoWindow() {
    instance.info_window = new google.maps.InfoWindow({
      content: '<div class=\'infowindow\'>' + displayAddress(getAddressItems(instance.geo_results.address_components)) + '</div>'
    });
    instance.info_window.open(instance.map, instance.marker);

    google.maps.event.addListener(instance.info_window, 'closeclick', function() {
      removeMe();
    });
  }

  function getAddressItems(components) {
    /*
      street_number
      route
      locality (city)
      administrative_area_level_2 (county)
      administrative_area_level_1 (state)
      country
      zip
    */
    var address = [];

    $.each(components, function(k, v) {
      var type = v.types[0];
      var value = v.short_name; // long_name

      address[type] = value;
    });

    return address;
  }

  function displayAddress(addr) {
    var html = [];
    html.push(
      addr['street_number'], ' ', addr['route'],
      '<br>',
      addr['locality'], ' ', addr['administrative_area_level_1'], ' ', addr['postal_code']
    );
    return html.join('');
  }

  function createProduct(product) {
    return $('<div>',
             { class: 'sidebar-product',
               html: product.name + ' ' + product.transport + '<br>' + product.price
             });
  }

  function createSidebarItem() {

    var addressItems = getAddressItems(instance.geo_results.address_components);

    instance.sidebar_item = $('<div>', {class: 'sidebar-item'});

    var remove = $('<div>', {class: 'remove-button'});
    remove.click(function() {
      removeMe();
    });
    instance.sidebar_item.append(remove);

    instance.sidebar_item.append(
      $('<div>',
        { class: 'address-line',
          html: '<p>' + displayAddress(addressItems) + '</p>'
        })
    );

    var products = getProducts(addressItems['street_number'] + ' ' + addressItems['route'], // Street
                               addressItems['locality'],                                    // City
                               addressItems['administrative_area_level_2'],                 // County
                               addressItems['administrative_area_level_1'],                 // State
                               addressItems['postal_code'],                                 // Zip
                               addressItems['country']);                                    // Country

    if (0 < products.length) {
      var container = $('<div>', { class: 'sidebar-product-container' });
      instance.sidebar_item.append(container);
      $.each(products, function(i, v) {
        var prod = createProduct(v);
        container.append(prod);
        container.append($('<div>',
                { class: 'sidebar-product-border' }));

        prod.click(function(event) {
          var c = 'sidebar-product-selected';
          if ($(this).hasClass(c)) {
            $(this).removeClass(c);
            event.preventDefault();
            return;
          }
          container.children().removeClass(c);
          $(this).addClass(c);
          event.preventDefault();
        });
      });
    }

    $('#sidebar').append(instance.sidebar_item);
  }

  function removeMe() {
    instance.marker.setMap(null);
    instance.sidebar_item.remove();
    removeSite(instance);
  }
}
