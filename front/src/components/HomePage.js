import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Make sure to add your CSS styles here
import heroImage from '../images/restaurant-hero.jpg';

function HomePage() {
  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">Restaurant Booking</div>
        <nav className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/customer-menu">Menu</Link></li>
            <li><Link to="/reservations">Book a Table</Link></li>
            <li><Link to="/customersupport">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>

      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <h1>Welcome to Our Restaurant</h1>
        <p>Your culinary experience awaits! Book your table now.</p>
        <Link to="/reservations" className="book-now-button">Book a Table</Link>
      </section>

      <section className="features">
        <div className="feature">
          <h2>Delicious Menu</h2>
          <p>Explore our diverse and mouthwatering dishes prepared by top chefs.</p>
          <Link to="/customer-menu" className="feature-link">View Menu</Link>
        </div>
        <div className="feature">
          <h2>Quick Reservations</h2>
          <p>Reserve a table in just a few clicks. Enjoy hassle-free dining!</p>
          <Link to="/reservations" className="feature-link">Reserve Now</Link>
        </div>
        <div className="feature">
          <h2>Customer Support</h2>
          <p>Our team is always ready to assist you. Feel free to reach out.</p>
          <Link to="/customersupport" className="feature-link">Contact Us</Link>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Restaurant Booking. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
