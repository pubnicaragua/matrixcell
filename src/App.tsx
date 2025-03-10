import { Routes, Route } from "react-router-dom"
import Notifications from "./pages/Notifications"
import Invoices from "./pages/Invoices"
import Login from "./pages/Login"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Users from "./pages/Users"
import BlockDevice from "./pages/BlockDevice"
import AddClient from "./pages/AddClient"
import UserSettings from "./pages/UserSettings"
import Stores from "./pages/Stores"
import TechnicalServices from "./pages/TechnicalServices"
import AuditLogs from "./pages/AuditLogs"
import ExportSicom from "./components/ExportSicom"
import Inventory from "./components/Inventory"
import Profile from "./pages/Profile"
import Security from "./pages/Security"
import { AuthProvider } from "./context/AuthContext"
import Layout from "../src/layouts/Layout" // Importar el Layout
import RegisterForm from "./components/RegisterForm"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute"
import Capacitacion from './pages/Capacitacion'
// @ts-ignore
import DescargarApk from "./pages/DescargarApk"
import QuotePage from "./pages/QuotePage"
import DevicesPage from "./pages/DevicesPage"
import { ThemeProvider } from "./context/ThemeContext" // Añade esta línea

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {" "}
        {/* Añade este componente */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Layout>
                  <Reports />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Layout>
                  <Users />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/blockdevice"
            element={
              <PrivateRoute>
                <Layout>
                  <BlockDevice />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/quote"
            element={
              <PrivateRoute>
                <Layout>
                  <QuotePage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/addclient"
            element={
              <PrivateRoute>
                <Layout>
                  <AddClient />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/usersettings"
            element={
              <PrivateRoute>
                <Layout>
                  <UserSettings />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/stores"
            element={
              <PrivateRoute>
                <Layout>
                  <Stores />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/technicalservices"
            element={
              <PrivateRoute>
                <Layout>
                  <TechnicalServices />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/auditlogs"
            element={
              <PrivateRoute>
                <Layout>
                  <AuditLogs />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/exportsicom"
            element={
              <PrivateRoute>
                <Layout>
                  <ExportSicom />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/security"
            element={
              <PrivateRoute>
                <Layout>
                  <Security />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/apk"
            element={
              <PrivateRoute>
                <Layout>
                  <DescargarApk />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/quote-page"
            element={
              <PrivateRoute>
                <Layout>
                  <QuotePage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/capacitacion"
            element={
              <PrivateRoute>
                <Layout>
                  <Capacitacion />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/devices-page"
            element={
              <PrivateRoute>
                <Layout>
                  <DevicesPage />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

