function getProducts(street, city, county, state, zip, country) {
  var products = [];

  var avpn_eth = {
    name: 'AVPN',
    transport: 'ETHERNET',
    price: '$99.99'
  };
  var mis_eth = {
    name: 'MIS',
    transport: 'ETHERNET',
    price: '$89.99'
  };
  var ase = {
    name: 'ASE',
    transport: 'ETHERNET',
    price: '$79.99'
  };
  var avpn_prv = {
    name: 'AVPN',
    transport: 'PRIVATELINE',
    price: '$98.88'
  };
  var mis_prv = {
    name: 'MIS',
    transport: 'PRIVATELINE',
    price: '$78.88'
  };

  var ethernet = true;
  var privateline = true;

  if (ethernet == true) {
    products.push(avpn_eth);
    products.push(mis_eth);
    products.push(ase);
  }
  if (privateline == true) {
    products.push(avpn_prv);
    products.push(mis_prv);
  }

  return products;
}
