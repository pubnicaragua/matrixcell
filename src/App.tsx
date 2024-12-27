import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Invoices from './pages/Invoices';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Users from './pages/Users';
import BlockDevice from './pages/BlockDevice';
import AddClient from './pages/AddClient';
import InvoiceDetail from './pages/InvoiceDetail';
import UserSettings from './pages/UserSettings';
import Stores from './pages/Stores';
import TechnicalServices from './pages/TechnicalServices';
import Register from './pages/Register';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} /> {/* Listo */}
      <Route path="/register" element={<Register />} /> {/* Listo */}
      <Route path="/login" element={<Login />} /> {/* Listo */}
      <Route path="/notifications" element={<Notifications />} /> {/* Listo */}
      <Route path="/invoices" element={<Invoices />} /> {/* Listo */}
      <Route path="/reports" element={<Reports />} /> 
      <Route path="/settings" element={<Settings />} />
      <Route path="/users" element={<Users />} /> {/* Listo */}
      <Route path="/blockdevice" element={<BlockDevice />} />
      <Route path="/addclient" element={<AddClient />} />
      <Route path="/invoicedetail" element={<InvoiceDetail />} />
      <Route path="/usersettings" element={<UserSettings />} />
      <Route path="/stores" element={<Stores />} />
      <Route path="/technicalservices" element={<TechnicalServices />} />
    </Routes>
  );
};

export default App;
