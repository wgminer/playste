'use strict';

// imports
const fs = require('fs');

// simple express server
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const multer = require('multer');

const router = express.Router();

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.sendfile('./public/index.html');
});

app.get('/*', (req, res) => {
    res.sendfile('./public/index.html');
});

app.listen(5000);