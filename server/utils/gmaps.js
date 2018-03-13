const API_KEY = process.env.API_KEY || require('../../config/googleAPI.config.js').KEY;
const axios = require('axios');

function getGeoLocation(body) {
  const { address, city, state } = body.location;
  const street = address.split(' ').join('+');
  const googleApiAddress = `https://maps.google.com/maps/api/geocode/json?address=${street},+${city},+${state}&key=${API_KEY}`;
  return new Promise(resolve => {
    axios.get(googleApiAddress)
    .then(response => {
      response ?
      resolve(response.data.results[0].geometry.location) :
      resolve('WARNING: Zero results from Google Geocode');
    })
  })
}

function getDogParks(location) {
  const { lat, lng } = location;
  const googleDogsAddress = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=7500&keyword=dog+park&key=${API_KEY}`
  return new Promise (resolve => {
    axios.get(googleDogsAddress)
    .then(response => {
      // console.log('🐶', response);
      response ?
        resolve(response.data.results) :
        resolve('WARNING: Zero results from Google Geocode');
    })
  })
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