import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
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

interface Invoice {
  status: string;
  [key: string]: any; // Agrega las propiedades reales si las conoces
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState({
    labels: ['Pagadas', 'Pendientes'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
      },
    ],
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/invoices');
        const invoices = response.data;

        // Contar facturas por estado
        const paidCount = invoices.filter((invoice: { status: string }) => invoice.status === 'Pagada').length;
        const pendingCount = invoices.filter((invoice: { status: string }) => invoice.status === 'Pendiente').length;

        setChartData((prevData: typeof chartData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [paidCount, pendingCount],
            },
          ],
        }));


        setInvoices(invoices);
      } catch (err: any) {
        setError(err.message || 'Error fetching invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Obtener los dispositivos bloqueados desde la API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/devices');
        setDevices(response.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Filtrar dispositivos bloqueados
  const blockedDevices = devices.filter(device => device.status === 'Bloqueado');

  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

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
        data: [50, 100, 200, 150, 350, 300, 400, 250],
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
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left font-bold">Acción</th>
          <th className="px-4 py-2 text-left font-bold">Dispositivo/Cliente</th>
          <th className="px-4 py-2 text-left font-bold">Fecha</th>
        </tr>
      </thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );

  const quickActions = (
    <div className="flex gap-4 mt-6">
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={() => handleNavigation('/blockdevice')}
      >
        Bloquear Dispositivo
      </button>
      <button
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        onClick={() => handleNavigation('/addclient')}
      >
        Agregar Cliente
      </button>
      <button
        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        onClick={() => handleNavigation('/generate-invoice')}
      >
        Generar Factura
      </button>
      <button
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        onClick={() => handleNavigation('/technicalservices')}
      >
        Registrar Servicio Técnico
      </button>
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Facturas Pendientes por Mes' } } }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Estado de las Facturas</h3>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Facturas: Pagadas vs Pendientes',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={deviceData} options={{ responsive: true, plugins: { title: { display: true, text: 'Estado de los Dispositivos' } } }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Dispositivos Bloqueados</h3>
            {blockedDevices.length > 0 ? (
              <ul className="list-disc pl-6">
                {blockedDevices.map((device) => (
                  <li key={device.id}>IMEI: {device.imei}</li>
                ))}
              </ul>
            ) : (
              <p>No hay dispositivos bloqueados.</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Últimas Actividades</h2>
          {activityTable}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          {quickActions}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
