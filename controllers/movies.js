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

  const {
    country, director, duration, year, description, image,
    trailer, thumbnail, movieId, nameRU, nameEN,
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
        movie.remove()
          .then(() => res.send({ message: movie }))
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
