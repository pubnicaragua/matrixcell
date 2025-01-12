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
import PendingInvoicesChart from '../components/PendingInvoicesChart';
import InvoiceStatusChart from '../components/InvoiceStatusChart';
import BlockedDevices from '../components/BlockedDevices';
import InvoiceDelinquencyChart from '../components/InvoiceDelinquencyChart';
import RecentActivities from '../components/RecentActivities';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface Invoice {
  status: string;
  created_at: string;
  operation_id: number; // Añadir esta propiedad
}


interface Device {
  id: number;
  imei: string;
  status: string;
}

interface Operations {
  id?: number;
  operation_number: string;
  operation_value: number;
  due_date: string;
  prox_due_date: string;
  amount_due: number;
  amount_paid: number;
  days_overdue: number;
  cart_value: number;
  refinanced_debt: string;
  judicial_action: number;
  client_id: number;
  client?: { // Agrega esta propiedad opcional
    id: number;
    name: string;
    phone: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);
  const [morosityChartData, setMorosityChartData] = useState<any>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [operations, setOperations] = useState<Operations[]>([]);
  // Para agrupar facturas por mes y año
  const invoicesByMonthYear: Record<string, number> = {};

  // Para contar facturas por estado
  const statusCounts: Record<string, number> = {};


  useEffect(() => {
    const fetchInvoicesAndDevices = async () => {
      try {
        const invoicesResponse = await api.get('/invoices');
        const devicesResponse = await api.get('/devices');
        const operationsResponse = await api.get('/operations');

        setDevices(devicesResponse.data);
        setInvoices(invoicesResponse.data);
        setOperations(operationsResponse.data)

        // Merge invoices with operations by operation_id
        const mergedData = invoices.map((invoice) => {
          const operation = operations.find(op => op.id === invoice.operation_id);
          return {
            ...invoice,
            due_date: operation ? operation.due_date : null,
            days_overdue: operation ? operation.days_overdue : null,
          };
        });

        // Filter pending invoices
        const pendingInvoices = mergedData.filter(invoice => invoice.status === 'Pendiente');

        // Group pending invoices by month and year based on due_date
        const invoicesByMonthYear: Record<string, number> = {};
        pendingInvoices.forEach(invoice => {
          if (invoice.due_date) {
            const date = new Date(invoice.due_date);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM format
            invoicesByMonthYear[key] = (invoicesByMonthYear[key] || 0) + 1;
          }
        });

        const barLabels = Object.keys(invoicesByMonthYear).sort();
        const barData = barLabels.map(label => invoicesByMonthYear[label]);

        // Data for Pending Invoices Chart
        setBarChartData({
          labels: barLabels,
          datasets: [
            {
              label: 'Facturas Pendientes',
              data: barData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Contar facturas por estado
        const statusCounts: Record<string, number> = {};
pendingInvoices.forEach(invoice => {
  statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1;
});

const pieLabels = Object.keys(statusCounts);
const pieData = pieLabels.map(label => statusCounts[label]);

        setPieChartData({
          labels: pieLabels,
          datasets: [
            {
              data: pieData,
              backgroundColor: ['#4caf50', '#f44336'],
              hoverBackgroundColor: ['#45a049', '#e53935'],
            },
          ],
        });


        // Calculate delinquency buckets
        const delinquencyBuckets = [0, 0, 0, 0]; // [0-30 days, 31-60 days, 61-90 days, >90 days]

        pendingInvoices.forEach(invoice => {
          if (invoice.days_overdue !== null) {
            const overdue = invoice.days_overdue;

            if (overdue <= 30) delinquencyBuckets[0]++;
            else if (overdue <= 60) delinquencyBuckets[1]++;
            else if (overdue <= 90) delinquencyBuckets[2]++;
            else delinquencyBuckets[3]++;
          }
        });

        // Data for Invoice Delinquency Chart
        setMorosityChartData({
          labels: ['0-30 días', '31-60 días', '61-90 días', '>90 días'],
          datasets: [
            {
              label: 'Morosidad de Facturas',
              data: delinquencyBuckets,
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
        onClick={() => navigate('/invoices')}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PendingInvoicesChart data={barChartData} />
          <InvoiceStatusChart data={pieChartData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <BlockedDevices devices={devices} />
          <InvoiceDelinquencyChart data={morosityChartData} />
        </div>

        <RecentActivities activities={activities} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          {quickActions}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

