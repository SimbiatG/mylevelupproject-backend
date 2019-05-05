const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UsersModel = require('../models/usersmodel');
const AuthMiddleware = require('../middlewares/auth');
const router = express.Router();
const env = require('../env');


// to Sign up a user


router.post('/', async function(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 7);


    console.log(req.body)

    const user = await UsersModel.create(req.body);

    const result = user.toJSON();

    delete result.password;

    const token = jwt.sign({ id: user.id }, env.jwt_secret, { expiresIn: '1h' });

    res.status(200).json({
      status: 'success',
      data: { user: result, token },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: 'error',
      message: 'An error occured while creating your account',
    });
  }
});

// to get a user's profile

router.get('/dashboard', AuthMiddleware, async function(req, res) {
    try {
      
      const user = await UsersModel.findById(req.employee);
  
      res.json({ status: 'success', data: user });
    } catch (err) {
      console.log(err);
  
      res.status(401).json({ status: 'error', message: err.message });
    }
  });

  
// to signin a user

  router.post('/signin', async function(req, res) {
    try {
      const user = await UsersModel.findOne(
        { email: req.body.email },
        '+password'
      );
  
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'Invalid login details' });
  
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
  
      if (!isPasswordValid)
        return res
          .status(401)
          .json({ status: 'error', message: 'Invalid login details' });
  
      const token = jwt.sign({ id: user.id }, env.jwt_secret);
      res.json({ status: 'success', data: { token} });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'An error occured' });
    }
  });

  // to Update a user
router.put('/:email', async function(req, res) {
    try {
      const updatedUser = await UsersModel.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        { new: true }
      );
  
      //to  Check if the user was found and updated
      if (!updatedUser) {
        res.status(404).json({
          status: 'error',
          message: 'Sorry that user does not exist',
        });
      }
  
      res.json({
        status: 'success',
        data: updatedUser,
      });
    } catch (err) {
      console.log(err);
  
      res.status(500).json({
        status: 'error',
        message: 'An error occured while updating the user',
      });
    }
  });
  
  //to Delete a user
  router.delete('/:email', async function(req, res) {
    try {
      const deletedUser = await UsersModel.findOneAndDelete({
        email: req.params.email,
      });
  
      if (!deletedUser) {
        res.status(404).json({
          status: 'error',
          message: 'Sorry you cannot delete a user that does not exist',
        });
        return;
      }
  
      res.json({
        status: 'success',
        message: 'you have successfully deleted this user',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 'error',
        message: 'An error occured while deleting the user',
      });
    }
  });




  module.exports = router;