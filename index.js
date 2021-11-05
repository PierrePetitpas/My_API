const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

const  app = express();
const Bands = Models.Band;
const Users = Models.User;


app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose.connect('mongodb://localhost:27017/myBandsDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


// ensures that Express is available in your “auth.js” file as well
const passport = require('passport');
require('./passport');
app.use(passport.initialize());
const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);


app.get('/', (req, res) => {
    res.send('Welcome to my metal bands app!');
  });


//Get array of all bands
app.get('/bands', passport.authenticate('jwt', {session: false}), (req, res) => {
    Bands.find()
    .then((bands) => {
      res.status(201).json(bands);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
  });

//GET a specific band name information
app.get('/bands/:bandName', passport.authenticate('jwt', {session: false}), (req, res) => {
  Bands.findOne( {Name: req.params.bandName})
  .then((band) => {
    res.status(201).json(band);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error" + err);
  });
});


//GET full list of users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//GET info on one user
app.get('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({'user.Username': req.params.username})
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

  //GET a specific genre name information
  app.get('/genres/:genreName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Bands.findOne( {'Genre.Name': req.params.genreName})
    .then((band) => {
      res.status(201).json(band.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
  });


//GET information about specific Music Label
app.get('/labels/:labelInfo', passport.authenticate('jwt', {session: false}), (req, res) => {
  Bands.findOne( {'Label.Name': req.params.labelInfo})
  .then((band) => {
    res.status(201).json(band.Label);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error" + err);
  });
});

//Post a new band
app.post('/bands',  [
  check('Name', 'Band name is required').not().isEmpty(),
  check('Description', 'Description is required').not().isEmpty(),
  ],  
  passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
    }
    Bands.findOne({Name: req.body.Name})
    .then((band) => {
      if (band) {
        return res.status(400).send(req.body.Name + " already exist");
      } else {
        Bands.create({
          Name: req.body.Name,
          Description: req.body.Description,
          Genre: {
            Name: req.body.Genre.Name,
            Description: req.body.Genre.Description
          },
        Label: {
          Name: req.body.Label.Name,
          Bio: req.body.Label.Bio,
          Creation: req.body.Label.Creation,
          Country: req.body.Label.Country
        },
        Country: req.body.Country,
        Continent: req.body.Continent,
        Creation: req.body.Creation,
        ImagePath: req.body.ImagePath,
        Active: req.body.Active
        })
        .then((band) =>{res.status(201).json(band)})
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error' + err);
    });
  });

//Update user information
app.put('/users/:username', [
  check('Username', 'Username Lenght need to have minimum 5 characters').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
  ],
  passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    Users.findOneAndUpdate ({ Username: req.params.username}, {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Firstname: req.body.FirstName,
        Lastname: req.body.LastName,
        Email: req.body.Email,
        DOB: req.body.DOB
      }
    },
    { new: true},
    (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send ('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
    });
  });

//Post a new favorite band to  user specific user profile
app.post('/users/:username/bands/:bandID',  [
  check('username', 'Username Lenght need to have minimum 5 characters').isLength({min: 5}),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
  ], 
   passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate (
      { Username: req.params.username},
      { $push: { Favorites: req.params.bandID}},
      { new: true},
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    )
  });

//Delete a user from app
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndDelete ({ Username: req.params.username})
    .then ((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was delete');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });  
});

//Delete a favorite from user
app.delete('/users/:username/bands/:bandID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username}, {
    $pull: { Favorites: req.params.bandID}
  },
  {new: true},
  (err, updatedFav) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedFav);
    }
  });
});

//Post information on a new user
app.post('/users',   [
  check('Username', 'Username Lenght need to have minimum 5 characters').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // check the validation object for errors
  let errors = validationResult(req);
 
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + " already exist");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Firstname: req.body.FirstName,
        Lastname: req.body.LastName,
        Email: req.body.Email,
        DOB: req.body.DOB
      })
      .then((user) =>{res.status(201).json(user)})
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Delete a band from app
app.delete('/bands/:bandname', passport.authenticate('jwt', {session: false}), (req, res) => {
  Bands.findOneAndDelete ({ Name: req.params.bandname})
    .then ((band) => {
      if (!band) {
        res.status(400).send(req.params.bandname + ' was not found');
      } else {
        res.status(200).send(req.params.bandname + ' was delete');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });  
});

/*app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });*/

  const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

