const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('../database/index');
const auth = require('./utils/auth');
const gmaps = require('./utils/gmaps');

let app = express();

let PORT = process.env.PORT || 3000;

// Authentication Packages
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Parses JSON, urls and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serves static files to client
app.use(express.static(path.join(__dirname, '../client/dist')));

// Express Session
app.use(session({
  secret: 'This is our secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db.connection,
    ttl: 2 * 24 * 60 * 60
  })
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// creates new user session using Passport Local Strategy, might be dysfunctional
passport.use('local', new LocalStrategy((username, password, done) => {
  console.log("username in passport.use function in serverindex.js", username);
  console.log("password in passport.use function in serverindex.js", password);
  db.getUser(username, password, (err, user) => { // might need to be refactored to have username and password available
    if (err) { console.log('error in passport local strategy get user', err); }
    else if (!user) {
      return done(null, false, {message: 'Unknown user'});
    } else {
      return done(null, user);
    }
  });
}));

//local login, added in later
passport.use('local.login', new LocalStrategy((username, password, done) => {
  db.getUser(username, (err, user) => {
    if (err) { console.log('error in passport local strategy get user', err); }
    else if (!user) {
      return done(null, false, {message: 'Unknown user'});
    } else {
      return done(null, user);
    }
  });
}));

// this function was utilized when making session without passport.  may or may not be utilized with passport depending on what you want to do.
app.use((req, res, next) => {
  next();
});
// validates user and logs user into a session via Express
// app.post('/login', (req, res, next) => { // think this should have authentication
//   console.log("req.body posted to /login", req.body);
//   auth.validateLoginForm(req.body, (result) => {
//     if (result.success) {
//       console.log("result.success is truthy in post /login in serverindex.js");
//       passport.authenticate("local", {
//         successRedirect: '/',
//         failureRedirect: '/login'
//       })(req, res, next);
//     };
//     // () => {
//     //   res.send(result);
//         // db.getUser(req.body.username, req.body.password, (err, result) => {
//         //   if (err) {
//         //     console.log(err);
//         //     res.status(500).send(err);
//         //   } else {
//         //     // first attempt at Express sessions without Passport
//         //     //req.session.user = result[0];
//         //     console.log('ZZZZZZZZZZ', result);
//         //     res.send(result);
//         //   }
//         // })
//   });
// });


app.post('/login', passport.authenticate('local'), function(req, res) {
  console.log('req.user', req.user[0]._doc);
  res.send(req.user[0]._doc);
})
// destroys session and logs user out
app.get('/logout', function (req, res){
  console.log("the current user before sign out", req.user);
  req.logOut();
  // res.clearCookie('connect.sid', {path: '/'}).send('cleared');
  req.session.destroy();
  console.log("if the following is undefined or null, then the logout was successful", req.user);
  res.redirect('/');
});
// checks if user is in database (utilized on first Sign Up page)
app.post('/checkuser', (req, res) => {
  db.checkUser(req.body, function(err, result) {
    if (err) {
      res.status(500).send({ error: 'Error checking username' });
    } else {
      res.send(result);
    }
  });
});
// validates New User Sign Up form and saves new User to database
app.post('/signup', async function(req, res) {
  let formDataRes = await auth.validateSignupForm(req.body);
  if (!formDataRes.success) {
    res.status(500).send(result);
  } else {
    let geoCodesRes = await gmaps.getGeoLocation(req.body);
    console.log('🌏', geoCodesRes)
    let dogParkLocate = await gmaps.getDogParks(geoCodesRes);
    console.log('🐕 line 126 in signup post, dog parks', dogParkLocate);

    db.saveUser(req.body, geoCodesRes, dogParkLocate, (err, result) => {
      if (err) {
        console.log('error saving user data to db:', err);
        res.status(500).send({ error: 'User already exists' });
      } else {
        console.log('in post signup route in serverindex.js, saved user data to the db:', result);
        db.getUser(req.body.username, req.body.password, (err, result) => {
          if (err) { res.send(err); }
          else {
            console.log('result db.getUser', result);
            // creates persisting session with Passport
            const user_id = result._id;
            req.login(user_id, (err) => {
              console.log('logged in...redirecting...');
              // res.redirect('/');
              res.send(result);
            });
          }
        });
      }
    });
  }
});

// authenticates pet owner user upon login and retrieves profile
app.get('/pet-profile', (req, res, next) => {
  console.log("Heard get request for pet-profile.");
  console.log("req.user in get /pet-profile in serverindex.js", req.user);
  if (req.user) {
    res.send(req.user);
  }

  // passport.authenticate('local', function(err, user, info) {
  //   if (err || !user) {
  //     console.log("err in get /pet-profile in serverindex.js", err);
  //     console.log("user in get /pet-profile in serverindex.js", user);
  //     return res.redirect('/login'); }
  //   else {
  //     console.log("req.user in get /pet-profile in serverindex.js", req.user);
  //     console.log("req.body in get /pet-profile in serverindex.js", req.body);
  //     return res.send(req.user);
  //   }
  // })(req, res, next);
  // res.send(req.user);
});
// authenticates host user upon login and retrieves profile
app.get('/host-profile', (req, res, next) => {
  console.log("Heard get request for host-profile.");
  console.log("req.user in get /host-profile in serverindex.js", req.user);
  res.send(req.user);
  // passport.authenticate('local', function(err, user, info) {
  //   if (err || !user) { return res.redirect('/login'); }
  //   else {
  //     console.log(req.user);
  //     console.log(req.body);
  //     return res.send(req.user);
  //   }
  // })(req, res, next);
});

//altering user profiles
app.put("/pet-profile", function(req, res) {
  //db.alterUserFunction(req.body);
  //findOne({}) {
    console.log("Heard put from app");
    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        //do something with error
        console.log(req.body);
        console.log(req.user);
        res.redirect('/login');
      } else {
        console.log(req.body);
        console.log(req.user);
        // return db.alterpetprofile(req.body, req.user)
      }
    })
  // }
});

app.put("/host-profile", function(req, res) {
  //db.alterUserFunction(req.body);
});

//playmates
app.get("/playmates", function(req, res) {
  //db.getPlaymates;
  //pet owners in the same city as logged in user
  //returning user documents
  console.log(req.user.location.city);
  db.findPetOwnersByCity(req.user.location.city, (err, playmates) => {
    console.log("playmates in get /playmates in serverindex.js", playmates);
    //username, email, profileURL, pet, latLong
    res.send(playmates.map(function(el) {
      return {username: el.username,
              email: el.email,
              profileUrl: el.profileUrl,
              latLong: el.latLong,
              pet: el.pet}
    }));
  });
})

// retrieves all host listings from the database
app.get('/getlistings', (req, res) => {
    db.getAllListings((err, result) => {
      if (err) {
        console.log('error getting all listings from db:', err);
        res.status(500).send({ error: 'Could not retrieve all listings' });
      }
      else {
        console.log('retrieved all listings');
        res.send(result)
      }
    });
});
// retrieves one host listing based on a string search query for either 'Los Angeles' or 'New York'.  Could be substituted with Google Search API.
app.post('/getlistings', (req, res) => {
    db.getListings(req.body, (err, result) => {
      if (err) {
        console.log('error getting listings from db:', err);
        res.status(500).send({ error: 'Could not retrieve listings' });
      }
      else {
        console.log('retrieved listings from', result[0].location);
        res.send(result);
      }
    });
});

// creates passport session for user by serialized ID
passport.serializeUser((user, done) => {
  console.log("user in passport.serializeUser in serverindex.js", user);
  console.log("user[0]._id in passport.serializeUser in serverindex.js", user[0]._id);
  done(null, user[0]._id);
});
// deserializes the user ID for passport to deliver to the session
passport.deserializeUser((id, done) => {
  console.log("id in passport.deserializeUser in serverindex.js", id);
  db.getUserById(id, (err, user) => {
    console.log("currently logged in as ", user.username);
    done(err, user);
  });
});
// wild card routing all pages to the React Router
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });



app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});






















