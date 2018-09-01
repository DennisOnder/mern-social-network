const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const passport = require('passport');

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('Database Connected.'))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Router
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

// Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
