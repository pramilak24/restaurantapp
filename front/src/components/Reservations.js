import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Reservation() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tables');
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
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
    fetchReservations();
  }, []);

  const isTableReserved = (tableId) => {
    const currentTime = new Date();
    return reservations.some(
      (reservation) =>
        reservation.table_id === tableId &&
        new Date(reservation.reservation_time) >= currentTime
    );
  };

  const handleReserve = async () => {
    if (!selectedTableId) {
      setMessage('Please select a table.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reservations/reserve', {
        tableId: selectedTableId,
        customerName,
        reservationTime,
      });
      setMessage(response.data);
    } catch (error) {
      const errorMessage = error.response?.data || 'Error reserving the table';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">Reserve Your Table</h1>

      {/* Table Selection */}
      <div className="tables-grid">
        {tables.map((table) => {
          const reserved = isTableReserved(table.id);
          return (
            <div
              key={table.id}
              className={`table-container ${reserved ? 'reserved' : ''} ${
                selectedTableId === table.id ? 'selected' : ''
              }`}
              onClick={() => !reserved && setSelectedTableId(table.id)}
            >
              <img
                src={`/images/table1.jpg`}
                alt={`Table ${table.id}`}
                className={`table-image ${reserved ? 'table-disabled' : ''}`}
              />
              <p className="table-label">
                {reserved
                  ? `Table ${table.id} - Reserved`
                  : `Table ${table.id}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reservation Form */}
      <div className="reservation-card">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="reservation-form"
        >
          <div className="form-group">
            <label htmlFor="customerName" className="form-label">
              Customer Name:
            </label>
            <input
              type="text"
              id="customerName"
              className="form-control"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reservationTime" className="form-label">
              Reservation Time:
            </label>
            <input
              type="datetime-local"
              id="reservationTime"
              className="form-control"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleReserve}
          >
            Reserve Table
          </button>
        </form>
        {message && (
          <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Reservation;
