// routes/register.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../config/db'); // Ensure this path is correct

router.post('/', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Hash the password before saving
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Error processing registration' });
    }

    // Insert new user into the users table
    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    connection.query(sql, [username, hashedPassword, role], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Error registering user' });
      }

      res.json({ success: true, message: 'Registration successful' });
    });
  });
});

module.exports = router;
