const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const  app = express();
const Bands = Models.Band;
const Genres = Models.Genre;
const Labels = Models.Label;
const Users = Models.User;


app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/myBandsDB', { useNewUrlParser: true, useUnifiedTopology: true });


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


// ensures that Express is available in your “auth.js” file as well
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send('Welcome to my metal bands app!');
  });


//Get array of all bands
app.get('/bands', passport.authenticate('jwt', {session: false}) ,(req, res) => {
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
app.get('/bands/:bandName', (req, res) => {
  Bands.findOne( {Name: req.params.bandName})
  .then((band) => {
    res.status(201).json(band);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error" + err);
  });
});

//GET full list of genres
  app.get('/genres', (req, res) => {
    Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });


//GET full list of users
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

  //GET a specific genre name information
  app.get('/genres/:genreName', (req, res) => {
    Genres.findOne( {Name: req.params.genreName})
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
  });


//GET information about specific Music Label
app.get('/labels/:labelInfo', (req, res) => {
  Labels.findOne( {Name: req.params.labelInfo})
  .then((label) => {
    res.status(201).json(label);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error" + err);
  });
});

//Post a new band
app.post('/bands', (req, res) => {
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
          labelCountry: req.body.Label.Country
        },
        Country: req.body.Country,
        Continent: req.body.Continent,
        Creation: req.body.creation,
        Imagepath: req.body.Imagepath,
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
app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate ({ Username: req.params.username}, {
      $set:
      {
        Username: req.body.Username,
        Firstname: req.body.FirstName,
        Lastname: req.body.LastName,
        Password: req.body.Password,
        Email: req.body.Email,
        DOB: req.body.Birthday
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

//Post a new band to  user specific user profile
app.post('/users/:username/bands/:bandID', (req, res) => {
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
app.delete('/users/:username', (req, res) => {
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
app.delete('/users/:username/bands/:bandID', (req, res) => {
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
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + " already exist");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Firstname: req.body.FirstName,
        Lastname: req.body.LastName,
        Email: req.body.Email,
        DOB: req.body.Birthday
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
app.delete('/bands/:bandname', (req, res) => {
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

