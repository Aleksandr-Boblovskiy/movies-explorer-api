const movieRouter = require('express').Router();
const { getMovies, saveMovie } = require('../controllers/movies');

// movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', saveMovie);

module.exports = movieRouter;
