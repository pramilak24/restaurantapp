import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Tables from './components/Tables';
import Menu from './components/Menu';
import Register from './components/Register';
import Kitchen from './components/Kitchen';
import Login from './components/Login';
import HomePage from './components/HomePage';
import './App.css';
import Reservations from './components/Reservations';
import CustomerSupport from './components/CustomerSupport';
import CustomerMenu from './components/CustomerMenu';
import Billing from './components/Billing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/customersupport" element={<CustomerSupport />} />
      <Route path="/customer-menu" element={<CustomerMenu />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/tables" element={<Tables />} />
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu/:tableId" element={<Menu />} />
      <Route path="/billing/:orderId" element={<Billing />} />
    </Routes>
  );
}
export default App;
