import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Billing() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  // Fetch order details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/orders/${orderId}`)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
        alert('Failed to fetch order details. Please try again.');
      });
  }, [orderId]);

  const handlePrint = () => {
    window.print(); // Browser print functionality
  };

  if (!order) return <p>Loading...</p>;

  // Calculate total
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="billing-page">
      <div className="bill-container">
        <h1 className="restaurant-name">My Restaurant</h1>
        <p className="bill-header">Bill</p>
        <p>Table Number: {order.table_id}</p>
        <p>Order ID: {order.orderId}</p>
        <hr />
        <div className="bill-details">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <p className="total-amount">
          <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
        </p>
        <p className="thank-you">Thank you for dining with us!</p>
        <button className="print-bill-btn" onClick={handlePrint}>
  Print Bill
</button>

      </div>
    </div>
  );
}

export default Billing;
