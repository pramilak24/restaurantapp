import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Kitchen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:5000/orders')
      .then(response => {
        console.log('Fetched orders:', response.data);
        const openOrders = response.data.filter(order => order.status === 'open');
        setOrders(openOrders);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  const handleCloseOrder = (orderId) => {
    if (!orderId) {
      alert('Invalid order ID');
      return;
    }
    axios.put(`http://localhost:5000/orders/${orderId}/close`)
      .then(response => {
        console.log('Order closed:', response.data);
        fetchOrders();  // Refresh orders after closing
      })
      .catch(error => {
        console.error('Error closing order:', error);
        alert('Failed to close order. Please try again.');
      });
  };

  return (
    <div className="kitchen-container">
      <h1 className="page-title">Kitchen Orders</h1>
      <div className="orders-list">
      {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="order-card">
       
            <h2 className="order-table">Table {order.table_id}</h2>
             {/* Log the items to see their structure */}
             {console.log('Order items in frontend:', order.items)}

            {/* Add check to make sure order.items is an array and not null */}
            <ul className="order-items">
            {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, index) => (

                    <li key={index} className="order-item">{item.name ? `${item.name} - Quantity: ${item.quantity}` : 'No item name available'}
                    </li>
                    
                ))
              ) : (
                <li>No items available</li>
              )}
            </ul>

            <button className="close-button" onClick={() => handleCloseOrder(order.id)}>Close Order</button>
          </div>
        ))
      ) : (
        <p>No open orders</p>
      )}
      </div>
    </div>
  );
}

export default Kitchen;
