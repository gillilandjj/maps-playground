function getProducts(street, city, county, state, zip, country) {
  
  var products = [];

  var avpn_eth = {
    name: 'AVPN',
    transport: 'ETHERNET',
    price: randomIntFromInterval(218, 645)
  };
  var mis_eth = {
    name: 'MIS',
    transport: 'ETHERNET',
    price: randomIntFromInterval(274, 523)
  };
  var ase = {
    name: 'ASE',
    transport: 'ETHERNET',
    price: randomIntFromInterval(76, 287)
  };
  var avpn_prv = {
    name: 'AVPN',
    transport: 'PRIVATELINE',
    price: randomIntFromInterval(350, 987)
  };
  var mis_prv = {
    name: 'MIS',
    transport: 'PRIVATELINE',
    price: randomIntFromInterval(418, 2216)
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

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
