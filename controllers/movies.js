const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-id');
const NotEnoughRightsError = require('../errors/not-enough-rights');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  const owner = req.user._id;
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

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((delcard) => res.send(delcard))
          .catch(next);
      } else {
        next(new NotEnoughRightsError('Нет прав на удаление карточки'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidError('Неправильный id запроса'));
      } else {
        next(err);
      }
    });
};
