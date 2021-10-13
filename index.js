const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');


const  app = express();


let topBands = [
{
    name: 'Black Sabbath',
    origin: 'UK'
},
{
    name: 'Exodus',
    origin: 'US'
},
{
    name: 'Igorrr',
    origin: 'France'
},
{
    name: 'Rammstein',
    origin: 'Germany'
},
{
    name: 'Opeth',
    origin: 'Sweden'
},
{
    name: 'Ne Obliviscaris',
    origin: 'Australia'
},
{
    name: 'Mayhem',
    origin: 'Norway'
},
{
    name: 'Mora Prozaka',
    origin: 'Belarus'
},
{
    name: 'Vader',
    origin: 'Poland'
},
{
    name: 'Devin Townsend',
    origin: 'Canada'
}
];

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to my metal bands app!');
  });


//Get array of all bands
app.get('/bands', (req, res) => {
    res.json(topBands);
  });

//GET a specific band name
app.get('/bands/:bandName', (req, res) => {
  res.send('Successful GET request returning data on one specific band');
});

//GET full list of genres
  app.get('/genres/:genre', (req, res) => {
    res.send('Successful GET request returning data on all genres in metal bands app');
  });

//GET information about specific band
app.get('/bands/:bandInfo', (req, res) => {
    res.send('Successful GET request returning data on information on a specific band');
  });

//Post information on a new user
app.post('/register', (req, res) => {
    res.send('Successful POST request add new user in metal bands db');
  });

//Update user information
app.put('/users/:ID/:infoUpdate/:newValue', (req, res) => {
    res.send('Successful PUT request update user inoformation');
  });

//Post a new band to  user specific user profile
app.post('/users/:ID/favorites/:newFavorite', (req, res) => {
    res.send('Successful POST request Add a band to a specific user profile');
  });

//Delete a user from app
app.delete('/users/:id/unregister', (req, res) => {
  res.send('Successful DELETE request remove user from app');
});

//Delete a user from app
app.delete('/users/:ID/favorites/:deleteFavorite', (req, res) => {
  res.send('Successful DELETE request remove band from user specific favorites');
});

app.use(express.static('public'));

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

