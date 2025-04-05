import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Tables() {
  const [tables, setTables] = useState([]); // All tables
  const [reservations, setReservations] = useState([]); // Reservations data
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch all tables and reservations
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tables');
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    
    const fetchOrders = () => {
      axios.get('http://localhost:5000/orders/ready-for-delivery')
        .then(response => {
          console.log('Fetched ready-for-delivery orders:', response.data);
          setOrders(response.data); // Set orders for the waiter
        })
        .catch(error => console.error('Error fetching orders:', error));
    };
    
   
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchTables();
    fetchOrders();
    fetchReservations();
  }, []);

  const markAsDelivered = (orderId) => {
    axios
      .put(`http://localhost:5000/orders/${orderId}/deliver`)
      .then((response) => {
        console.log('Order marked as delivered:', response.data);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, delivery_status: 'Delivered' }
              : order
          )
        );
      })
      .catch((error) => console.error('Error marking order as delivered:', error));
  };
  const processBill = (orderId) => {
    navigate(`/billing/${orderId}`); // Redirect to the Billing page
  };
  
  
  



  
  
  
  // Check if a table is reserved
  const isTableReserved = (tableId) => {
    const currentTime = new Date();
    return reservations.some(
      (reservation) =>
        reservation.table_id === tableId &&
        new Date(reservation.reservation_time) >= currentTime // Reserved for now or future
    );
  };

  // Navigate to the menu page for available tables
  const handleTableClick = (tableId) => {
    if (!isTableReserved(tableId)) {
      navigate(`/menu/${tableId}`);
    }
  };

  return (
    <div className="tables-with-reservations">
      {/* Tables Section */}
      <h1 className="page-title">Tables</h1>
      <div className="tables-grid">
        {tables.map((table) => {
          const reserved = isTableReserved(table.id);
          return (
            <div key={table.id} className={`table-container ${reserved ? 'reserved' : ''}`}>
              <img
                src={`/images/table1.jpg`}
                alt={`Table ${table.id}`}
                className={`table-image ${reserved ? 'table-disabled' : ''}`}
                onClick={() => handleTableClick(table.id)}
              />
              <p className="table-label">
                {reserved ? `Table ${table.id} - Reserved` : `Table ${table.id}`}
              </p>
            </div>
          );
        })}
      </div>
      <div className="waiter-container">
      <h1>Orders Ready for Delivery</h1>
      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <h2>Table {order.table_id}</h2>
              <ul>
              {order.items 
              ? JSON.parse(order.items).map((item, index) => (
        <li key={index}>{item.name} - Quantity: {item.quantity}</li>
      ))
  : <li>No items available</li>
}
</ul>
<button
          onClick={() => markAsDelivered(order.id)}
          disabled={order.delivery_status === 'Delivered'}
        >
          {order.delivery_status === 'Delivered'
            ? 'Delivered'
            : 'Mark as Delivered'}
              </button>
              <button
          onClick={() => processBill(order.id)}
          disabled={order.delivery_status !== 'Delivered'}
          >
          Process Bill
        </button>
            </div>
          ))
        ) : (
          <p>No orders ready for delivery</p>
        )}
      </div>
    </div>

      {/* Reservations Section */}
      <div className="reservations-list">
        <h2>Today's Reservations</h2>
        <table>
          <thead>
            <tr>
              <th>Table Number</th>
              <th>Customer Name</th>
              <th>Reservation Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.table_id}</td>
                <td>{reservation.customer_name}</td>
                <td>{new Date(reservation.reservation_time).toLocaleString()}</td>
                <td>{reservation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
  );
}
export default Tables;
