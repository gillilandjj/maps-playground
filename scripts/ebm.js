function getProducts(street, city, county, state, zip, country) {
  var products = {};
  products.ethernet = [];
  products.privateline = [];

  var ethernet = true;
  var privateline = true;

  if (ethernet == true) {
    products.ethernet.push(avpn);
    products.ethernet.push(mis);
    products.ethernet.push(ase);
  }
  if (privateline == true) {
    products.privateline.push(avpn);
    products.privateline.push(mis);
  }

  return products;
}
