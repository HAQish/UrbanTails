const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //adds pre-save validation for unique fields within a Mongoose schema.
const passportLocalMongoose = require('passport-local-mongoose'); //simplifies building username and password login with Passport.
const bcrypt = require('bcrypt'); // handles password hashing in the database
const saltRounds = 5;
let Schema = mongoose.Schema;
let uristring = process.env.MONGODB_URI || 'mongodb://localhost:27017/users';
//establish connection
mongoose.connect(uristring, (err) => {
  if (err) { console.log('mongodb not connected', err); }
  else {
    console.log('connected to database');
  }
});

//set schema
const UserSchema = new Schema({
  username: { type: String, unique: true },
  email: String,
  password: String,
  profileUrl: String,
  type: String,
  location: {
    address: String,
    city: String,
    state: String
  },
  latLong: {lat: Number, lng: Number},
  dogParks: Array,
  pet: {
    animal: String,
    friendly: Boolean,
    description: String,
    needs: String
  },
  host: {
    homeType: String,
    yard: String,
    otherAnimals: Boolean,
    description: String
  }
});

//compile schema into a model
let User = mongoose.model('User', UserSchema);


module.exports = {
//database search function to ID whether uniq user exist in the db returns boolean
  checkUser: (data, callback) => {
    User.find({})
      .where('username').equals(data.username)
      .exec((err, user) => {
        if (err) {
          callback(err, null);
        } else if (!user.length) {
          console.log('User does not exist in the database');
          callback(null, false);
        } else {
          console.log('User already exists in the database');
          callback(null, true);
        }
      });
  },
//database search function to get user information
  getUser: (username, password, callback) => {
    let attemptedPassword = password;
    console.log("username in getUser function in databaseindex.js", username);
    console.log("password in getUser function in databaseindex.js", password);
    // console.log("data.password in getUser function in databaseindex.js", data.password);
    // console.log("data.username in getUser function in databaseindex.js", data.username);
    User.find({})
      .where('username').equals(username)
      .exec((err, user) => {
        if (user.length === 0) {
          err = {
            errors: { username: 'User does not exist' }
          };
          callback(err, null);
        } else if (user[0]) {
          let message = { errors: { password: 'Incorrect submission, try again'} };
          console.log("results in getUser function in databaseindex.js after .exec", user);
          bcrypt.compare(attemptedPassword, user[0].password, (err, isMatch) => {
            if (err) { callback(err, null); }
            if (isMatch) {
              return callback(null, user);
            } else if (!isMatch) {
              callback(message, null);
            }
          });
        }
    });
  },
  //get user by id to feed deserialize user.
  getUserById: (id, callback) => {
    User.findById(id, callback);
  },

  //save user data
  saveUser: (data, coords, parks, callback) => {
    let plainTextPassword = data.password;
    console.log("data in saveUser in databaseindex.js", data);
    //bcrypt password before saving it to database
    bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
      let user = new User ({
        username: data.username,
        email: data.email,
        password: hash,
        profileUrl: data.profileUrl,
        type: data.type,
        location: data.location,
        latLong: coords,
        dogParks: parks,
        pet: {
          animal: data.pet.animal,
          friendly: data.pet.friendly,
          description: data.pet.description,
          needs: data.pet.needs
        },
        host: {
          homeType: data.host.homeType,
          yard: data.host.yard,
          otherAnimals: data.host.otherAnimals,
          description: data.host.description
        }
      });

      user.save((err, user) => {
        if (err) {
          console.log('database error saving user', err);
          callback(err, null);
        } else {
          callback(null, user);
        }
      });
    });
  },
  // retrieve host listings by a specific location
  getListings: (data, callback) => {
    User.find({type: 'host'})
      .where('location').equals(data.query)
      .exec((err, listings) => {
        if (err) {
          console.log('Error getting listings');
          callback('Error getting listings');
        } else {
          callback(null, listings);
        }
      });
  },
  // retrieve all host listings in the database
  getAllListings: (callback) => {
    User.find({type: 'host'})
      .sort({location:1})
      .exec((err, listings) => {
        if (err) {
          console.log('Error getting all listings');
          callback('Error getting all listings');
        } else {
          callback(null, listings);
        }
      });
  },
  findPetOwnersByCity: (city, callback) => {
    User.find({type: "petOwner"})
      .where("location.city").equals(city)
      .exec((err, documents) => {
        if (err) {
          throw err;
        }
        console.log("the returned documents in findPetOwnersByCity in databaseindex.js", documents);
        callback(null, documents);
      })
  },
  // utilized by seed.js file to drop database when re-seeding
  dropDatabase: () => {
    mongoose.connection.dropDatabase();
  },
  // exports mongoose connection for server to reference
  connection: mongoose.connection
};





















