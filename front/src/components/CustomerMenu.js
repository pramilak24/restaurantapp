import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerMenu.css';

function CustomerMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the menu items from the backend
    axios.get('http://localhost:5000/menu')
      .then(response => {
        setMenuItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu. Please try again.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="menu-container">
      <h1 className="menu-title">Our Menu</h1>
      <div className="menu-header">
        <span className="menu-header-item">Item</span>
        <span className="menu-header-price">Price</span>
      </div>
      <div className="menu-list">
        {menuItems.map(item => (
          <div key={item.id} className="menu-item">
            <img src={item.image_url} alt={item.name} className="menu-image" />
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <p className="item-description">{item.description}</p>
            </div>
            <span className="item-price">₹{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CustomerMenu;
