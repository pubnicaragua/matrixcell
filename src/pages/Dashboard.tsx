import React from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
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
  PointElement,
  LineElement,
} from 'chart.js';

import Sidebar from '../components/Sidebar';

// Registrar elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Graph data
  const monthlyRevenueData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Ingresos ($)',
        data: [5000, 7000, 8000, 6000, 9000, 10000],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

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

  const serviceByStoreData = {
    labels: ['Tienda 1', 'Tienda 2', 'Tienda 3'],
    datasets: [
      {
        label: 'Servicios Completados',
        data: [120, 95, 60],
        backgroundColor: ['#ffcc00', '#00cc99', '#cc0000'],
        borderColor: ['#e6b800', '#009966', '#990000'],
        borderWidth: 1,
      },
    ],
  };

  const serviceStatusData = {
    labels: ['Pendientes', 'En Proceso', 'Completados'],
    datasets: [
      {
        data: [40, 30, 60],
        backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
        hoverBackgroundColor: ['#e0a800', '#138496', '#218838'],
      },
    ],
  };

  const storeStatusData = {
    labels: ['Activas', 'Inactivas'],
    datasets: [
      {
        data: [5, 2],
        backgroundColor: ['#28a745', '#dc3545'],
        hoverBackgroundColor: ['#218838', '#c82333'],
      },
    ],
  };

  const activities = [
    { id: 1, action: 'Bloqueo', device: 'Dispositivo 1', date: '2024-12-20' },
    { id: 2, action: 'Pago', device: 'Cliente 2', date: '2024-12-22' },
    { id: 3, action: 'Desbloqueo', device: 'Dispositivo 3', date: '2024-12-23' },
    { id: 4, action: 'Cambio de pantalla', device: 'Dispositivo 4', date: '2024-12-24' },
    { id: 5, action: 'Mantenimiento', device: 'Dispositivo 5', date: '2024-12-25' },
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
    <table className="activity-table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
          <th style={{ padding: '10px', fontWeight: 'bold' }}>Acción</th>
          <th style={{ padding: '10px', fontWeight: 'bold' }}>Dispositivo/Cliente</th>
          <th style={{ padding: '10px', fontWeight: 'bold' }}>Fecha</th>
        </tr>
      </thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );

  const quickActions = (
    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
      <button
        style={styles.button}
        onClick={() => handleNavigation('/BlockDevice')}
      >
        Bloquear Dispositivo
      </button>
      <button
        style={styles.button}
        onClick={() => handleNavigation('/add-client')}
      >
        Agregar Cliente
      </button>
      <button
        style={styles.button}
        onClick={() => handleNavigation('/generate-invoice')}
      >
        Generar Factura
      </button>
      <button
        style={{ ...styles.button, backgroundColor: '#ffc107', color: 'var(--color-black)' }}
        onClick={() => handleNavigation('/technical-services')}
      >
        Registrar Servicio Técnico
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title as React.CSSProperties}>Dashboard</h1>

        <div style={styles.chartContainer}>
          <Bar data={barChartData} options={styles.barChartOptions} />
          <Pie data={pieChartData} options={styles.pieChartOptions} />
          <Bar data={deviceData} options={styles.deviceChartOptions} />
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Dispositivos Bloqueados</h3>
            <ul>
              <li>Dispositivo 1 - IMEI: 123456789</li>
              <li>Dispositivo 2 - IMEI: 987654321</li>
            </ul>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Facturas Pendientes</h3>
            <ul>
              <li>Factura #001 - $200</li>
              <li>Factura #002 - $150</li>
            </ul>
          </div>
        </div>

        <div style={styles.activityContainer}>
          <h2>Últimas Actividades</h2>
          {activityTable}
        </div>

        <div style={styles.quickActionsContainer}>
          <h2>Acciones Rápidas</h2>
          {quickActions}
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
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  chartContainer: {
    marginTop: '40px',
    padding: '20px',
    background: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  statCard: {
    flex: 1,
    padding: '20px',
    backgroundColor: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  statTitle: {
    fontSize: '1.5rem',
    fontFamily: 'var(--font-secondary)',
  },
  activityContainer: {
    marginTop: '40px',
  },
  quickActionsContainer: {
    marginTop: '40px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
  barChartOptions: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Facturas Pendientes por Mes',
      },
    },
  },
  pieChartOptions: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Estado de las Facturas',
      },
    },
  },
  deviceChartOptions: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Estado de los Dispositivos',
      },
    },
  },
};

export default Dashboard;
