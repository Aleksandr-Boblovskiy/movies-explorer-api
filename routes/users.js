const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, patchUser } = require('../controllers/users');

userRouter.get('/users/me', getUser);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), patchUser);

module.exports = userRouter;
