const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-id');
const NotUniqueError = require('../errors/unique-err');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new NotUniqueError('Данный email уже зарегестрирован'));
      } else if (err.name === 'ValidationError') {
        next(new NotValidError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};
