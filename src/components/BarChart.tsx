import React from 'react';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: any;
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {data ? (
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: title },
            },
          }}
        />
      ) : (
        <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default BarChart;
