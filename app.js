const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config({ path: './.env' });
require('./config/database');


const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const indexRoute = require('./v1/routes/index.route');
app.use('/', indexRoute);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
