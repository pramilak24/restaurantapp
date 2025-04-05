import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Menu() {
  const { tableId } = useParams();  // Get the tableId from the URL
  const [menuItems, setMenuItems] = useState([]);  // Store the menu items
  const [order, setOrder] = useState({});  // Store the current order
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the menu items from the backend
    axios.get('http://localhost:5000/menu')
      .then(response => {
        setMenuItems(response.data);  // Store menu items
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu. Please try again.');
        setLoading(false);
      });
  }, []);

  // Add item to the order and increase quantity if it already exists
  const handleAddItem = (item) => {
    setOrder(prevOrder => {
      const newOrder = { ...prevOrder };
      if (newOrder[item.id]) {
        newOrder[item.id] = {
          ...newOrder[item.id],
          quantity: newOrder[item.id].quantity + 1
        };
      } else {
        // If item does not exist, add it with quantity 1
        newOrder[item.id] = { ...item, quantity: 1 };
      }
      return newOrder;
    });
  };
  // Remove item or decrease its quantity
  const handleRemoveItem = (itemId) => {
    setOrder(prevOrder => {
      const newOrder = { ...prevOrder };
      if (newOrder[itemId] && newOrder[itemId].quantity > 1) {
        // Decrease the quantity by exactly 1
        newOrder[itemId] = { ...newOrder[itemId], quantity: newOrder[itemId].quantity - 1 };
      } else {
        // Remove the item if quantity is 1 or less
        delete newOrder[itemId];
      }
  
      return newOrder;
    });
  };

  // Submit the order to the backend
  const handleSubmitOrder = () => {
    const orderItems = Object.values(order);  // Get all items in the order
    if (orderItems.length === 0) {
      alert('No items in the order.');
      return;
    }

    // Send the order to the backend
    axios.post('http://localhost:5000/orders', { table_id: tableId, items: orderItems })
      .then(response => {
        console.log('Order submitted:', response.data);
        setOrderSubmitted(true);  // Mark order as submitted
      })
      .catch(error => {
        console.error('Error submitting order:', error);
        alert('Failed to submit order. Please try again.');
      });
  };

  // Handle "Take Another Order" button click
  const handleTakeAnotherOrder = () => {
    setOrder({});  // Reset the order
    setOrderSubmitted(false);
    navigate(`/tables`);  // Redirect to the tables page
  };
  const handleLogout = () => {
    // Remove token or session storage item
    window.location.href = '/login';   // Redirect to login page
  };
  

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="menu-container">
      <h1 className="page-title">Menu for Table {tableId}</h1>
      {!orderSubmitted ? (
        <div className="menu-content">
          <div className="menu-items">
            {menuItems.map(item => (
              <div key={item.id} className="menu-item">
                <span className="item-name">{item.name}</span>
                <button className="add-button" onClick={() => handleAddItem(item)}>Add</button>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h2 className="order-title">Order Summary</h2>
            {Object.values(order).length === 0 && <p>No items added yet.</p>}
            {Object.values(order).map(item => (
              <div key={item.id} className="order-item">
                <span className="item-name">{item.name} (x{item.quantity})</span>
                <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>Remove</button>
              </div>
            ))}
            {Object.values(order).length > 0 && (
              <button className="submit-button" onClick={handleSubmitOrder}>Submit Order</button>
            )}
          </div>
        </div>
      ) : (
        <div className="order-confirmation">
          <h2 className="confirmation-title">Order Submitted Successfully!</h2>
          <p className="confirmation-message">The food is being prepared.</p>
          <button className="new-order-button" onClick={handleTakeAnotherOrder}>Take Another Order</button>
          <button onClick={handleLogout}>Logout</button>

        </div>
      )}
    </div>
  );
}

export default Menu;
