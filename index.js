require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const path = require('path');
const apiRoute = require('./routes/api.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));

app.use(express.static(path.join(__dirname,'public')));

app.use('/api', apiRoute);

app.listen(PORT, () => console.log('Server is listening on', PORT));
