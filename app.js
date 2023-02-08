const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', async (req, res) => {
  try {
    const response = await punkAPI.getBeers();
    console.log(response);
    res.render('beers.hbs', {
      beers: response
    });
  } catch (error) {
    console.log(error);
  }
});

app.get('/random-beer', async (req, res) => {
  try {
    const response = await punkAPI.getRandom();
    console.log(response[0]);
    res.render('random-beer.hbs', {
      beer: response[0]
    });
  } catch (error) {
    console.log(error);
  }
});
app.get('/beer/:id', async (req, res) => {
  try {
    const response = await punkAPI.getBeer(req.params.id);
    const ingredients = response[0].ingredients;

    const malt = ingredients.malt.map(item => item.name).join(', ');
    const hops = ingredients.hops.map(item => item.name).join(', ');

    res.render('beer.hbs', {
      beer: response[0],
      ingredients: { malt: malt, hops: hops }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
