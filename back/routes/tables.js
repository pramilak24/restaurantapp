const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM tables', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

module.exports = router;
