const rp = require('request-promise');
const API = process.env.API || require('../../config/googleAPI.config.js');
const Promise = require('q').Promise;

var googleMapsClient = require('@google/maps').createClient({
  key: API
});

function getGeoLocation(body) {
  const { address, city, state } = body.location;
  let data = `${address}, ${city} ${state}`;
  return new Promise(resolve => {
    googleMapsClient.geocode({
      address: data
    }, function(err, res) {
      if (!err) {
        console.log('🤡', res.json.results[0].geometry.location);
        const coords = res.json.results[0].geometry.location;
        resolve(coords);
      } else {
        resolve(err);
      }
    });
  });
}

function getDogParks(body) {
  googleMapsClient.placesNearby({
    query: 'dog park',
    language: 'en',
    location: body.location,
    radius: 15000
  })
  .asPromise()
  .then(function(err, res) {
    console.log(res.json.results);
  })
  .catch(err => console.log(err))
  .then(next());
}

function getPlaymates(body) {
  // get city of user
  // query database for same cities
  // get all users within that city
  // add their latLong as markers to a map
  // send map to client
}

module.exports.getDogParks = getDogParks;
module.exports.getGeoLocation = getGeoLocation;
module.exports.getPlaymates = getPlaymates;