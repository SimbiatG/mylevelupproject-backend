const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  mname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});


const UsersModel = mongoose.model('users', UsersSchema );

module.exports = UsersModel;