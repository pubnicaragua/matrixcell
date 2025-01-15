import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import React, { useState, useEffect } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface Invoice {
  status: string;
  created_at: string;
}
interface Device {
  id: number;
  imei: string;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);
  const [morosityChartData, setMorosityChartData] = useState<any>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchInvoicesAndDevices = async () => {
      try {
        const token = localStorage.getItem('token');
        const [invoicesResponse, devicesResponse] = await Promise.all([
          api.get('/invoices', {

          }),
          api.get('/devices', {

          }),
        ]);
        const invoices: Invoice[] = invoicesResponse.data;
        const devices: Device[] = devicesResponse.data;
        setDevices(devices);
        // Filtrar facturas pendientes
        const pendingInvoices = invoices.filter(invoice => invoice.status === 'Pendiente');
        // Agrupar por mes
        const invoicesByMonth = Array(12).fill(0);
        pendingInvoices.forEach(invoice => {
          const month = new Date(invoice.created_at).getMonth();
          invoicesByMonth[month]++;
        });
        // Datos para el gráfico de barras
        setBarChartData({
          labels: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
          ],
          datasets: [
            {
              label: 'Facturas Pendientes',
              data: invoicesByMonth,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Contar facturas por estado
        const paidCount = invoices.filter(invoice => invoice.status === 'Pagada').length;
        const pendingCount = invoices.filter(invoice => invoice.status === 'Pendiente').length;

        // Datos para el gráfico de pastel
        setPieChartData({
          labels: ['Pagadas', 'Pendientes'],
          datasets: [
            {
              data: [paidCount, pendingCount],
              backgroundColor: ['#4caf50', '#f44336'],
              hoverBackgroundColor: ['#45a049', '#e53935'],
            },
          ],
        });

        // Calcular morosidad
        const currentDate = new Date();
        const morosityBuckets = [0, 0, 0, 0]; // [0-30 días, 31-60 días, 61-90 días, >90 días]

        pendingInvoices.forEach(invoice => {
          const createdDate = new Date(invoice.created_at);
          const diffInDays = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffInDays <= 30) morosityBuckets[0]++;
          else if (diffInDays <= 60) morosityBuckets[1]++;
          else if (diffInDays <= 90) morosityBuckets[2]++;
          else morosityBuckets[3]++;
        });
        // Datos para el gráfico de morosidad
        setMorosityChartData({
          labels: ['0-30 días', '31-60 días', '61-90 días', '>90 días'],
          datasets: [
            {
              label: 'Morosidad de Facturas',
              data: morosityBuckets,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
          ],
        });
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoicesAndDevices();
  }, []);

  const activities = [
    { id: 1, action: 'Bloqueo', device: 'Dispositivo 1', date: '2024-12-20' },
    { id: 2, action: 'Pago', device: 'Cliente 2', date: '2024-12-22' },
    { id: 3, action: 'Desbloqueo', device: 'Dispositivo 3', date: '2024-12-23' },
    { id: 4, action: 'Cambio de pantalla', device: 'Dispositivo 4', date: '2024-12-24' },
    { id: 5, action: 'Mantenimiento', device: 'Dispositivo 5', date: '2024-12-25' },
  ];

  const renderTableRows = () =>
    activities.map(activity => (
      <tr key={activity.id}>
        <td>{activity.action}</td>
        <td>{activity.device}</td>
        <td>{activity.date}</td>
      </tr>
    ));

  const quickActions = (
    <div className="flex gap-4 mt-6">
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={() => navigate('/blockdevice')}
      >
        Bloquear Dispositivo
      </button>
      <button
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        onClick={() => navigate('/addclient')}
      >
        Agregar Cliente
      </button>
      <button
        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        onClick={() => navigate('/generate-invoice')}
      >
        Generar Factura
      </button>
      <button
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        onClick={() => navigate('/technicalservices')}
      >
        Registrar Servicio Técnico
      </button>
    </div>
  );

  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Dashboard</h1>

        <div>
            <img src="/assets/qr.jpg" alt="Descripción de la imagen" className="w-32 h-32 object-cover rounded-lg" />
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Facturas Pendientes por Mes</h3>
            {barChartData ? (
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Facturas Pendientes por Mes' },
                  },
                }}
              />
            ) : (
              <p>No hay datos para mostrar.</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Estado de las Facturas</h3>
            {pieChartData ? (
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Facturas: Pagadas vs Pendientes' },
                  },
                }}
              />
            ) : (
              <p>No hay datos para mostrar.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Dispositivos Bloqueados</h3>
            {devices.filter(device => device.status === 'Bloqueado').length > 0 ? (
              <ul className="list-disc pl-6">
                {devices
                  .filter(device => device.status === 'Bloqueado')
                  .map(device => (
                    <li key={device.id}>IMEI: {device.imei}</li>
                  ))}
              </ul>
            ) : (
              <p>No hay dispositivos bloqueados.</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Morosidad de Facturas</h3>
            {morosityChartData ? (
              <Bar
                data={morosityChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Morosidad de Facturas' },
                  },
                }}
              />
            ) : (
              <p>No hay datos para mostrar.</p>
            )}
          </div>
          
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Últimas Actividades</h2>
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