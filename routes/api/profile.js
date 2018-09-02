const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();
const validateProfileInput = require('../../validation/profile');

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', (req, res) => res.json({
  message: "Profile Works!"
}));

// @route  GET api/profile
// @desc   Get user profile data
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'This user has no profile.';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route  POST api/profile
// @desc   Create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  // Check validation
  if (!isValid) {
    // Return errors with status code 400
    return res.status(400).json(errors);
  }
  // Get fields
  const profileFields = {};
  profileFields.social = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  };
  if (req.body.youtube) profileFields.youtube = req.body.social.youtube;
  if (req.body.linkedin) profileFields.linkedin = req.body.social.linkedin;
  if (req.body.twitter) profileFields.twitter = req.body.social.twitter;
  if (req.body.facebook) profileFields.facebook = req.body.social.facebook;
  if (req.body.instagram) profileFields.instagram = req.body.social.instagram;
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
          .then(profile => res.json(profile));
      } else {
        // Create
        // Check if the handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists.';
              res.status(400).json(errors);
            }
            // Save Profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          });
      }
    });
});

// @route  GET api/profile/all
// @desc   Get profile data from all profiles
// @access Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = 'No profiles have been found.';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({noprofiles: 'No profiles have been found.'}));
})

// @route  GET api/profile/handle/:handle
// @desc   Get profile data from other users by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'There is no profile for this user.';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile data from other users by ID
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'There is no profile for this user.';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user.' }));
});

module.exports = router;