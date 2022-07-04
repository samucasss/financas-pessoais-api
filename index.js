require('module-alias/register')

const express = require('express');
const consign = require('consign');

const app = express();

consign()
    .include('db.js')
    .then('auth.js')
    .then('middlewares.js')
    .then('routes')
    .then('boot.js')
    .into(app);

module.exports = app;
