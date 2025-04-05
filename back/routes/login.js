const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../config/db'); // Ensure this path is correct

// Login a user
router.post('/', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fetch the user from the database
  const sql = 'SELECT * FROM users WHERE username = ? AND role = ?';
  connection.query(sql, [username, role], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length > 0) {
      const user = results[0];
      
      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ error: 'Error comparing passwords' });
        }

        if (isMatch) {
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      });
    } else {
      res.json({ success: false });
    }
  });
});

module.exports = router;
