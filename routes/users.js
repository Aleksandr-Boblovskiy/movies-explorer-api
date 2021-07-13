const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, patchUser } = require('../controllers/users');

userRouter.get('/me', getUser);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
}), patchUser);

module.exports = userRouter;
