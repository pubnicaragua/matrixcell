import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';
import {
  ChartOptions,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import Sidebar from '../components/Sidebar';

// Registrar elementos de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


const Dashboard = () => {
  // Datos del gráfico de barras
  const barChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        label: 'Facturas Pendientes',
        data: [200, 150, 300, 400, 250],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const navigate = useNavigate();

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as 'top', // Explicitamente tipado
      },
      title: {
        display: true,
        text: 'Facturas Mensuales',
      },
    },
  };
  
  // Datos del gráfico circular
  const pieChartData = {
    labels: ['Pagadas', 'Pendientes'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
      },
    ],
  };

  const pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right', // Cambia el valor si necesitas otro
      },
      title: {
        display: true,
        text: 'Estado de las Facturas',
      },
    },
  } as const;

  const deviceData = {
    labels: ['Bloqueados', 'Desbloqueados', 'Morosidad'],
    datasets: [
      {
        label: 'Estadísticas',
        data: [30, 70, 15],
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
      },
    ],
  };

  const deviceOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as 'top',
      },
      title: {
        display: true,
        text: 'Dispositivos y Morosidad',
      },
    },
  };
  
  

  const activities = [
    { id: 1, action: 'Bloqueo', device: 'Dispositivo 1', date: '2024-12-20' },
    { id: 2, action: 'Pago', device: 'Cliente 2', date: '2024-12-22' },
    { id: 3, action: 'Desbloqueo', device: 'Dispositivo 3', date: '2024-12-23' },
  ];
  
  const renderTableRows = () =>
    activities.map((activity) => (
      <tr key={activity.id}>
        <td>{activity.action}</td>
        <td>{activity.device}</td>
        <td>{activity.date}</td>
      </tr>
    ));
  
  const activityTable = (
    <table className="activity-table">
      <thead>
        <tr>
          <th>Acción</th>
          <th>Dispositivo/Cliente</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );

  const quickActions = (
<div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
  <button
    style={{
      padding: '10px 20px',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={() => navigate('/block-device')}
  >
    Bloquear Dispositivo
  </button>
  <button
    style={{
      padding: '10px 20px',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={() => navigate('/add-client')}
  >
    Agregar Cliente
  </button>
  <button
    style={{
      padding: '10px 20px',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={() => navigate('/generate-invoice')}
  >
    Generar Factura
  </button>
</div>
  );
  

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-primary)' }}>Dashboard</h1>

        {/* Estadísticas */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div
            style={{
              flex: 1,
              padding: '20px',
              background: 'var(--color-white)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)' }}>Dispositivos Bloqueados</h3>
            <ul>
              <li>Dispositivo 1 - IMEI: 123456789</li>
              <li>Dispositivo 2 - IMEI: 987654321</li>
            </ul>
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
              background: 'var(--color-white)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)' }}>Facturas Pendientes</h3>
            <ul>
              <li>Factura #001 - $200</li>
              <li>Factura #002 - $150</li>
            </ul>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ marginTop: '40px' }}>
          <div
            style={{
              padding: '20px',
              background: 'var(--color-white)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)', marginBottom: '20px' }}>
              Facturas Mensuales
            </h3>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div
            style={{
              padding: '20px',
              background: 'var(--color-white)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)', marginBottom: '20px' }}>
              Estado de las Facturas
            </h3>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
  <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)', marginBottom: '20px' }}>
    Dispositivos y Morosidad
  </h3>
  <Bar data={deviceData} options={deviceOptions} />
</div>

<div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', padding: '20px' }}>
  <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-primary)', textAlign: 'center' }}>
    Métricas
  </h1>

  {/* Tabla de actividades */}
  <div style={{ marginTop: '20px' }}>
    <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)' }}>Últimas Actividades</h2>
    {activityTable}
  </div>

  {/* Acciones rápidas */}
  <div style={{ marginTop: '20px' }}>
    <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)' }}>Acciones Rápidas</h2>
    {quickActions}
  </div>

  {/* Gráfico de barras */}
  <div style={{ marginTop: '40px' }}>
    <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)' }}>Facturas Mensuales</h2>
    <Bar data={barChartData} options={barChartOptions} />
  </div>
</div>



        <div style={{ padding: '20px' }}>
  <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)' }}>
    Panel de Administración
  </h1>
  <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
    <div
      style={{
        flex: 1,
        padding: '20px',
        backgroundColor: 'var(--color-white)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ color: 'var(--color-secondary)' }}>Gestión de Usuarios</h3>
      <p>Administra los usuarios registrados en el sistema.</p>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => (window.location.href = '/users')}
      >
        Agregar Usuario
      </button>
    </div>
    <div
      style={{
        flex: 1,
        padding: '20px',
        backgroundColor: 'var(--color-white)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ color: 'var(--color-secondary)' }}>Reportes Financieros</h3>
      <p>Consulta reportes sobre ingresos y facturación.</p>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => (window.location.href = '/reports')}
      >
        Generar Reporte
      </button>
    </div>
  </div>
</div>


        <div style={styles.actionsContainer}>
  <button
    style={styles.button}
    onClick={() => (window.location.href = '/invoices')}
  >
    Ver Facturas
  </button>
  <button
    style={styles.button}
    onClick={() => (window.location.href = '/notifications')}
  >
    Notificaciones
  </button>
</div>

{/* Facturas Pendientes */}
<div style={styles.card}>
  <h3 style={styles.cardTitle}>Facturas Pendientes</h3>
  <ul>
    <li>
      <a href="/invoices/001" style={styles.link}>Factura #001 - $200</a>
    </li>
    <li>
      <a href="/invoices/002" style={styles.link}>Factura #002 - $150</a>
    </li>
  </ul>
</div>

      </div>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    backgroundColor: 'var(--color-background)',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    padding: '20px',
  },
  title: {
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-primary)',
  },
  cardsContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    flex: 1,
    padding: '20px',
    background: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-secondary)',
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  statCard: {
    flex: 1,
    padding: '20px',
    background: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
  },
  statTitle: {
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-secondary)',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
  },
  chartContainer: {
    marginTop: '40px',
    padding: '20px',
    background: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  link: {
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
};

export default Dashboard;
