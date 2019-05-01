const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv =  require('dotenv').config();
const UserRoute = require('./routes/usersroute');

const env = require('./env');
const app = express();


app.listen(env.port).on('listening', () => {
  console.log(' Your server is now running');
});
// to Connect to MongoDB


app.get('/', function (req, res) {
  res.send('hello world')
});

mongoose
  
.connect(env.mongodb_url, {useNewUrlParser: true, useCreateIndex: true})
.then(() => {
  console.log('MongoDB is connected and ready for use');
})
.catch(err => {
  console.log('An error occured while connecting to MongoDB', err);
});

app.use(cors());
//logger middleware

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(`[${new Date().toTimeString()}]: ${req.method} ${req.url}`);
  next();
});

// Add middlewares for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/users', UserRoute);
