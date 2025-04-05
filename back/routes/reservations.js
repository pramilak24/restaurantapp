const express = require('express');
const connection = require('../config/db');
const router = express.Router();


// Reserve a table
router.post('/reserve', (req, res) => {
  console.log('Received reservation request:', req.body);
  const { tableId, customerName, reservationTime } = req.body;
  

  // Check if the table is already reserved for the given time
  const query = 'SELECT * FROM reservations WHERE table_id = ? AND reservation_time = ?';
  connection.query(query, [tableId, reservationTime], (err, results) => {
    if (err) {
      console.error('Database error:', err);
    return res.status(500).send('Error checking reservation');
}
    if (results.length > 0) {
      return res.status(400).send('Table already reserved for that time');
    }

    // Insert the reservation into the database
    const insertQuery = 'INSERT INTO reservations (table_id, customer_name, reservation_time) VALUES (?, ?, ?)';
    connection.query(insertQuery, [tableId, customerName, reservationTime], (err, results) => {
      if (err) return res.status(500).send('Error reserving table');
      res.status(200).send('Table reserved successfully');
    });
  });
});

// Get all reservations for a given day
router.get('/', (req, res) => {
  const query = 'SELECT * FROM reservations WHERE reservation_time >= CURDATE()';
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching reservations');
    res.status(200).json(results);
  });
});
module.exports = router;
