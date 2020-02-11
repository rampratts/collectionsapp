const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./database');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/users', require('./routes/users'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/collection_items', require('./routes/collection_items'));


app.listen(port, console.log('Server is up!'));
