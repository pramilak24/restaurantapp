// Create a new file in your backend like `billing.js` or add this to your existing routes file.
const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Ensure the database connection is correctly imported
router.post('/billing', (req, res) => {
  const { orderId } = req.body;

  console.log('Billing request received for orderId:', orderId);

  if (!orderId) {
    console.error('Missing orderId in request body');
    return res.status(400).json({ error: 'Missing order ID' });
  }

  const query = 'SELECT * FROM orders WHERE id = ?';
  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to fetch order details' });
    }

    if (results.length === 0) {
      console.error('No order found for orderId:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = results[0];
    const items = JSON.parse(order.items || '[]');
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log('Order details:', {
      orderId: order.id,
      table_id: order.table_id,
      totalAmount,
      items,
    });

    res.json({
      orderId: order.id,
      table_id: order.table_id,
      totalAmount,
      items,
    });
  });
});

// Example function to calculate the total bill based on items
function calculateBill(order) {
  // Example calculation logic, you might need to adjust this based on your order structure
  return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Export this router so it can be used in your main server file
module.exports = router;
