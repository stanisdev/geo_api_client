const express = require('express');
const router = express.Router();
const app = require(process.env.APP_FILE_PATH);

/**
 * Deposit
 */
router.get('/deposit', (req, res, next) => {
  res.render('cash/deposit.html', {
    title: 'Deposit cash'
  });
});

app.use('/cash', router);
