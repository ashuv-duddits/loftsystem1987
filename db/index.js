require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config.json');

// use native promise

mongoose.Promise = global.Promise;
let connectionURL = "";
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV == 'production') {
  connectionURL = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;
}
if (process.env.NODE_ENV == 'development') {
  connectionURL = `mongodb://${config.db.user}@${config.db.host}:${config.db.port}/${config.db.name}`;
}

mongoose.connect(connectionURL, {useCreateIndex: true, useNewUrlParser: true}).catch((e) => {
  console.error(e)
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Mongoose connection open on ${connectionURL}`)
});

db.on('error', (err) => {
  console.error(err)
});

db.on('disconnected', () => {
  console.log('Mongoose disconnected')
});

module.exports = db;
