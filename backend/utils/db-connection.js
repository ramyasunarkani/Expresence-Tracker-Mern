const mongoose = require('mongoose');
require('dotenv').config(); 

const MONGO_URL = process.env.MONGO_DB;

console.log('MONGO_URL:', MONGO_URL); 

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });
