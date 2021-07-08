const Movie = require('../models/movie');
const NotValidError = require('../errors/not-valid-id');

module.exports.saveMovie = (req, res, next) => {
  const owner = '1f525cf06e02630312f3fed7';
  const movieId = '1f525cf06e02630312f3fed9';
  const {
    country, director, duration, year, description, image,
    trailer, thumbnail, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidError('Переданы некорректные данные фильма'));
      } else {
        next(err);
      }
    });
};
