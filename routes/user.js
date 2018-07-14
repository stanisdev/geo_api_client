const express = require('express');
const router = express.Router();
const app = require(process.env.APP_FILE_PATH);

/**
 * Registration
 */
router.get('/registration', (req, res, next) => {
  res.render('users/registration.html', {
    title: 'Registration'
  });
});

/**
 * Auth
 */
router.get('/auth', (req, res, next) => {
  res.render('users/auth.html', {
    title: 'Authorization'
  });
});

app.use('/users', router);
