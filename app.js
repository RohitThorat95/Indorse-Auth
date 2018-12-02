const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var dotenv = require('dotenv');
const port = 3000;

//load .env file
dotenv.load();

// Requiring our own files
const users = require('./routes/users');

//mlab URL
let mlabURL = process.env.MONGO_URL;

//connect to database
mongoose.connect(mlabURL, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

mongoose.connection.on('error', (err) => {
    console.log("database error : " + err);
});

// enable cors for cross domain
app.use(cors());

// Body Parser Miuddleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', users);

//run app on port 3000
app.listen(port, () => {
    console.log('Magic happens on port ' + port);
});