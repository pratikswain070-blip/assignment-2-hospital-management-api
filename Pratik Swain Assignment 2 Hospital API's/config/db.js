const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://swainpratik12345_db_user:nUcquGAum90IkFoa@itmemployeeapi.fg5hvvy.mongodb.net/?appName=itmemployeeapi');
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Database connected successfully');
});

db.on('disconnected', () => {
    console.log('Database disconnected');
});

db.on('error', (error) => {
    console.log('Database connection error', error);
});
module.exports = db;