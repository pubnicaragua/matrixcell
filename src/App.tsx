import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import AuditLogs from './pages/AuditLogs';
import ExportSicom from "./components/ExportSicom";
import Inventory from "./components/Inventory";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import { AuthProvider } from './context/AuthContext';
import Layout from '../src/layouts/Layout'; // Importar el Layout
import RegisterForm from './components/RegisterForm';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/users" element={<Layout><Users /></Layout>} />
        <Route path="/blockdevice" element={<Layout><BlockDevice /></Layout>} />
        <Route path="/addclient" element={<Layout><AddClient /></Layout>} />
        <Route path="/invoicedetail" element={<Layout><InvoiceDetail /></Layout>} />
        <Route path="/usersettings" element={<Layout><UserSettings /></Layout>} />
        <Route path="/stores" element={<Layout><Stores /></Layout>} />
        <Route path="/technicalservices" element={<Layout><TechnicalServices /></Layout>} />
        <Route path="/auditlogs" element={<Layout><AuditLogs /></Layout>} />
        <Route path="/exportsicom" element={<Layout><ExportSicom /></Layout>} />
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/security" element={<Layout><Security /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path='/forgot-password' element={< ForgotPassword />} />
        <Route path='/reset-password' element={< ResetPassword />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
