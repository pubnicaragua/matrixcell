import { Bar } from 'react-chartjs-2';

interface PendingInvoicesChartProps {
  data: any;
}

const PendingInvoicesChart: React.FC<PendingInvoicesChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Facturas Pendientes por Mes</h3>
      {data ? (
        <Bar
          data={data}
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
  );
};

export default PendingInvoicesChart;

