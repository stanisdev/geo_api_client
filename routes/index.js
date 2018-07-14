const express = require('express');
const router = express.Router();
const app = require(process.env.APP_FILE_PATH);

/**
 * Main page
 */
router.get('/', (req, res, next) => {
  res.render('main/index.html', {
    title: 'Get information about the IP address'
  });
});

app.use('/', router);
