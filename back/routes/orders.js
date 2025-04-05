const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Ensure this path is correct

// Fetch all open orders, grouped by table_id
router.get('/', (req, res) => {
  const sql = `
   SELECT *
    FROM orders
    WHERE status = "open";
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message });
    }
    try {
      const orders = results.map(order => {
        const items = JSON.parse(order.items); // Ensure that the items are correctly parsed
        const flattenedItems = items.flat(); // Flatten the items array if needed
        return {
          id: order.id,
          table_id: order.table_id,
          items: flattenedItems, // Send flat items array
          status: order.status
        };
      });
      res.json(orders);
    } catch (parseError) {
      console.error('Error processing orders:', parseError);
      res.status(500).json({ error: 'Failed to process orders data' });
    }
  });
});

// Submit a new order or update an existing one
router.post('/', (req, res) => {
  const { table_id, items } = req.body;

  if (!table_id || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if there's already an open order for this table
  const checkSql = 'SELECT id, items FROM orders WHERE table_id = ? AND status = "open" LIMIT 1';
  connection.query(checkSql, [table_id], (err, results) => {
    if (err) {
      console.error('Error checking for existing order:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length > 0) {
      // Order exists, update it with new items
      const existingItems = JSON.parse(results[0].items);
      const updatedItems = existingItems.concat(items);
      const updateSql = 'UPDATE orders SET items = ? WHERE id = ?';
      connection.query(updateSql, [JSON.stringify(updatedItems), results[0].id], (err, updateResults) => {
        if (err) {
          console.error('Error updating order:', err);
          return res.status(500).json({ error: 'Database update failed' });
        }
        res.json({ success: true, order_id: results[0].id });
      });
    } else {
      // No existing order, create a new one
      const insertSql = 'INSERT INTO orders (table_id, items, status) VALUES (?, ?, "open")';
      connection.query(insertSql, [table_id, JSON.stringify(items)], (err, insertResults) => {
        if (err) {
          console.error('Error submitting order:', err);
          return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.json({ success: true, order_id: insertResults.insertId });
      });
    }
  });
});

// Close an order
router.put('/:orderId/close', (req, res) => {
  const orderId = req.params.orderId;

  console.log('Attempting to close order with ID:', orderId);

  if (!orderId || isNaN(orderId)) {
    console.error('Invalid order ID:', orderId);
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const query = 'UPDATE orders SET status = "closed", delivery_status="pending" WHERE id = ?';
  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Error closing order:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    if (results.affectedRows === 0) {
      console.warn('No order found with ID:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('Order successfully closed:', results);
    res.json({ message: 'Order marked as closed' });
  });
});


router.put('/:orderId/close', (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId || isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const query = `
    UPDATE orders
    SET status = "closed", delivery_status = "Pending"
    WHERE id = ?
  `;

  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Error closing order:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order marked as closed and sent to waiter' });
  });
});
router.put('/:orderId/deliver', (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId || isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const query = `
    UPDATE orders
    SET delivery_status = "Delivered"
    WHERE id = ?
  `;

  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Error marking order as delivered:', err);
      return res.status(500).json({ error: 'Failed to update delivery status' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order marked as delivered' });
  });
});
router.get('/ready-for-delivery', (req, res) => {
  const query = 'SELECT * FROM orders WHERE status = "closed" AND delivery_status = "Pending"';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching ready-for-delivery orders:', err);
      return res.status(500).json({ error: 'Failed to fetch ready-for-delivery orders' });
    }

    res.json(results);
  });
});
router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;
  console.log(`[Orders Backend] Fetching order details for Order ID: ${orderId}`);

  const query = 'SELECT * FROM orders WHERE id = ?';
  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error(`[Orders Backend] Database query error: ${err}`);
      return res.status(500).json({ error: 'Failed to fetch order details' });
    }

    if (results.length === 0) {
      console.error(`[Orders Backend] Order not found for ID: ${orderId}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = results[0];
    console.log(`[Orders Backend] Successfully fetched order:`, order);

    res.json({
      orderId: order.id,
      table_id: order.table_id,
      items: JSON.parse(order.items), // Ensure the `items` column is valid JSON
    });
  });
});
module.exports = router;
