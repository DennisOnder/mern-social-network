const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// User Model
const user = require('../../models/User');

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) => res.json({
  message: "Users Works!"
}));

// @route  POST api/users/register
// @desc   Register a user
// @access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'Email Already Exists.'
        });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            } else {
              newUser.password = hash;
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            }
          })
        })
      }
    })
});

// @route  POST api/users/register
// @desc   Login User / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  user.findOne({ email })
    .then(user => {
      // Check for user
      if (!user) {
        return res.status(404).json({ email: 'User not found.' });
      }
      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatched => {
          if (isMatched) {
            res.json({ msg: 'Success!' })
          } else {
            return res.status(400).json({ password: 'Password Incorrect!' });
          }
        });
    })
})

module.exports = router;