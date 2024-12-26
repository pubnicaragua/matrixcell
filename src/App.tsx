import React from 'react';
import { Routes, Route } from 'react-router-dom';
import supabase from './api/supabase';
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




const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/reports" element={<Reports />} /> {/* Ruta añadida */}
      <Route path="/settings" element={<Settings />} /> {/* Ruta añadida */}
      <Route path="/users" element={<Users />} /> {/* Ruta añadida */}
      <Route path="/blockdevice" element={<BlockDevice />} /> {/* Ruta añadida */}
      <Route path="/addclient" element={<AddClient />} /> {/* Ruta añadida */}
      <Route path="/invoicedetail" element={<InvoiceDetail />} /> {/* Ruta añadida */}


    </Routes>
  );
};

export default App;
