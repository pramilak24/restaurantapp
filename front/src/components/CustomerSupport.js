// CustomerSupport.js
import React, { useState } from 'react';
import './CustomerSupport.css'; // Add your custom styles for the page

function CustomerSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    // Typically, send the support request to your backend

    setConfirmation('Thank you for reaching out! We will get back to you soon.');
  };

  return (
    <div className="support-container">
      <h1>Customer Support</h1>
      <form className="support-form" onSubmit={handleSupportSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            required
          />
        </div>
        <button type="submit" className="submit-button">Send Message</button>
      </form>

      {confirmation && <p className="confirmation-message">{confirmation}</p>}
    </div>
  );
}

export default CustomerSupport;
