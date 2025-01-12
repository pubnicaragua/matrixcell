interface Activity {
  id: number;
  action: string;
  device: string;
  date: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
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
        <tbody>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>{activity.action}</td>
              <td>{activity.device}</td>
              <td>{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivities;

