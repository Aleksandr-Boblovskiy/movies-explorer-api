const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, saveMovie } = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri(),
    trailer: Joi.string().required().uri(),
    thumbnail: Joi.string().required().uri(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), saveMovie);

module.exports = movieRouter;
