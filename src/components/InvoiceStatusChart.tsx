import { Pie } from 'react-chartjs-2';

interface InvoiceStatusChartProps {
  data: any;
}

const InvoiceStatusChart: React.FC<InvoiceStatusChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Estado de las Facturas</h3>
      {data ? (
        <Pie
          data={data}
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
  );
};

export default InvoiceStatusChart;

