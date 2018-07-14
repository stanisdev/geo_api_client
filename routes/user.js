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

app.use('/users', router);
