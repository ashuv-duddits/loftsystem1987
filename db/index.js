const mongoose = require('mongoose');
const config = require('../config.json');

// use native promise

mongoose.Promise = global.Promise;

const connectionURL = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;

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
