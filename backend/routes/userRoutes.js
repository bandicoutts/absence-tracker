const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

const saltRounds = 10; // Number of salt rounds for bcrypt

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login User
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Get User Profile
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ msg: 'Please log in to view this resource' });
}

module.exports = router;
