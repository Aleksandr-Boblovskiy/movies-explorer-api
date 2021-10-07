const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { PORT, MONGO_URL } = require('./config');
const routes = require('./routes');
const errorHandler = require('./errors/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const app = express();
app.use(cors());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://kinopoisk.nomoredomains.rocks',
  'https://kinopoisk.nomoredomains.rocks',
  'localhost:3000',
];

app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
