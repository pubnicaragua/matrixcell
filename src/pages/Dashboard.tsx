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
  // Datos y opciones para el gráfico de barras

  const navigate = useNavigate(); // Asegúrate de inicializar useNavigate dentro de la función


  // Gráfico de ingresos mensuales (línea)
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

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Facturas Mensuales',
      },
    },
  };

  // Datos y opciones para el gráfico circular
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
        position: 'right',
      },
      title: {
        display: true,
        text: 'Estado de las Facturas',
      },
    },
  };

  // Datos y opciones para el gráfico de dispositivos
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

  const deviceOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dispositivos y Morosidad',
      },
    },
  };

const monthlyRevenueOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Ingresos Mensuales',
    },
  },
};

// Gráfico de barras: Servicios completados por tienda
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

const serviceByStoreOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Servicios Completados por Tienda',
    },
  },
};

// Gráfico circular: Estados de servicios técnicos
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

const serviceStatusOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'right',
    },
    title: {
      display: true,
      text: 'Estados de Servicios Técnicos',
    },
  },
};


// Gráfico circular: Tiendas activas vs inactivas
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

const storeStatusOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'right',
    },
    title: {
      display: true,
      text: 'Estado de las Tiendas',
    },
  },
};

// Datos para actividades recientes
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
    <button
      style={{
        padding: '10px 20px',
        backgroundColor: '#ffc107',
        color: 'var(--color-black)',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      onClick={() => navigate('/technical-services')}
    >
      Registrar Servicio Técnico
    </button>
  </div>
);


  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-primary)' }}>Dashboard</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Aquí irían los gráficos, utilizando las variables definidas */}
      <Bar data={barChartData} options={barChartOptions} />
      <Pie data={pieChartData} options={pieChartOptions} />
      <Bar data={deviceData} options={deviceOptions} />
    </div>
  
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

        <div style={{ flex: 1, padding: '20px' }}>
  <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-primary)' }}>Dashboard</h1>

  {/* Gráfico: Servicios completados por tienda */}
  <div style={{ marginTop: '40px' }}>
    <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)', marginBottom: '20px' }}>
      Servicios Completados por Tienda
    </h3>
    <Bar data={serviceByStoreData} options={serviceByStoreOptions} />
  </div>

  {/* Gráfico: Estados de servicios técnicos */}
  <div style={{ marginTop: '40px' }}>
    <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)', marginBottom: '20px' }}>
      Estados de Servicios Técnicos
    </h3>
    <Doughnut data={serviceStatusData} options={serviceStatusOptions} />
    </div>

  {/* Gráfico: Tiendas activas vs inactivas */}
  <div style={{ marginTop: '40px' }}>
    <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-secondary)', marginBottom: '20px' }}>
      Estado de las Tiendas
    </h3>
    <Pie data={storeStatusData} options={storeStatusOptions} />
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
  
        {/* Panel de Administración */}
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
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '20px',
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
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
    },
  },
  cardTitle: {
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-secondary)',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '10px',
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
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    marginTop: '10px',
  },
  chartContainer: {
    marginTop: '40px',
    padding: '20px',
    background: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chartTitle: {
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-secondary)',
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  tableContainer: {
    marginTop: '40px',
    padding: '20px',
    background: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: 'var(--color-secondary)',
    color: 'var(--color-white)',
    textAlign: 'left' as const,
    padding: '10px',
  },
  tableRow: {
    borderBottom: '1px solid var(--color-background)',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'left' as const,
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: 'var(--color-light-background)',
    borderRadius: '8px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: 'var(--color-primary-dark)',
    },
  },
  link: {
    color: 'var(--color-primary)',
    textDecoration: 'none',
    fontWeight: 'bold',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  quickActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
    justifyContent: 'center',
  },
  quickActionButton: {
    padding: '15px 25px',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  metricsSection: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: 'var(--color-white)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  metricsTitle: {
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-secondary)',
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
};


export default Dashboard;
