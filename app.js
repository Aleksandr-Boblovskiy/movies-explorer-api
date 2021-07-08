const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, MONGO_URL } = require('./config');
const routes = require('./routes');
const errorHandler = require('./errors/error-handler');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);
app.use(errorHandler);
app.listen(PORT);
