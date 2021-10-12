const express = require('express');
const morgan = require('morgan');

const  app = express();

let topMovies = [
{
    title: 'Aliens',
    director: 'James Cameron'
},
{
    title: 'Festen',
    director: 'Thomas Vinterberg'
},
{
    title: 'Blade Runner',
    director: 'Ridley Scot'
},
{
    title: 'Babette Feast',
    director: 'Gabriel Axel'
},
{
    title: 'Breaking the waves',
    director: 'Lars von Trier'
},
{
    title: 'Alien',
    director: 'Ridley Scott'
},
{
    title: 'The Thing',
    director: 'John Carpenter'
},
{
    title: 'The Mummy',
    director: 'Karl Freund'
},
{
    title: 'Fargo',
    director: 'Joel Coen and Ethan Coen'
},
{
    title: 'Léolo',
    director: 'Jean-Claude Lauzon'
}
];

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to my Top 10 movies app!');
  });

app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

app.use(express.static('public'));

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

