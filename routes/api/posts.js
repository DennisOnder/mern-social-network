const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

// @route  GET api/posts/test
// @desc   Tests posts route
// @access Public
router.get('/test', (req, res) => res.json({
  message: "Posts Works!"
}));

// @route  GET api/posts
// @desc   Get posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPostsFound: 'No Post Found With That ID.' }));
});

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ noPostFound: 'No Post Found With That ID.' }));
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }, (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });
  newPost.save().then(post => res.json(post));
}));

// @route  DELETE api/posts/:id
// @desc   Delete post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ notAuthorized: 'User not authorized.' });
          }
          // Delete post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postNotFound: 'No Post Found.' }));
    });
}));

module.exports = router;