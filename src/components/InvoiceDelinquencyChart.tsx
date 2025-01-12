import { Bar } from 'react-chartjs-2';

interface InvoiceDelinquencyChartProps {
  data: any;
}

const InvoiceDelinquencyChart: React.FC<InvoiceDelinquencyChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Morosidad de Facturas</h3>
      {data ? (
        <Bar
          data={data}
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
  );
};

export default InvoiceDelinquencyChart;

