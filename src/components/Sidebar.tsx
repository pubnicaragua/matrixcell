import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaFileInvoiceDollar, FaBell } from 'react-icons/fa'; // Íconos

const Sidebar = () => {
  return (
    <nav style={{ width: '250px', background: 'var(--color-primary)', height: '100vh', color: 'var(--color-white)', padding: '20px' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', marginBottom: '20px' }}>MatrixCell Admin</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
          <FaHome style={{ marginRight: '10px' }} />
          <Link to="/dashboard" style={{ color: 'var(--color-white)', textDecoration: 'none' }}>Dashboard</Link>
        </li>
        <li style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
          <FaFileInvoiceDollar style={{ marginRight: '10px' }} />
          <Link to="/invoices" style={{ color: 'var(--color-white)', textDecoration: 'none' }}>Facturas</Link>
        </li>
        <li style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
          <FaBell style={{ marginRight: '10px' }} />
          <Link to="/notifications" style={{ color: 'var(--color-white)', textDecoration: 'none' }}>Notificaciones</Link>
        </li>
      </ul>
    </nav>
    
  );
};

export default Sidebar;
