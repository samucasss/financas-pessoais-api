const config = require('./config');
const mongoose = require('mongoose');

module.exports = app => {
    console.log('iniciando mongo database: ' + config.mongoDBURL)
    mongoose.connect(config.mongoDBURL);
};
