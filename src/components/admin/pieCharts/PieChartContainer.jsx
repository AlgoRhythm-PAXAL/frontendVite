// PieChartContainer.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from './PieChart';

const PieChartContainer = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/admin/pieChart/data',
          { withCredentials: true }
        );
        setChartData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const processGroupData = (group) => ({
  //   labels: group.subStages.map(sub => sub.status),
  //   counts: group.subStages.map(sub => sub.count),
  //   total: group.totalCount,
  //   groupName: group.group
  // });


    // In PieChartContainer.js
const processGroupData = (group) => ({
  labels: group.subStages.map(sub => sub.status),
  counts: group.subStages.map(sub => sub.count),
  total: group.percentage, // Pass percentage instead of totalCount
  groupName: group.group
});
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <div className="flex w-full justify-between items-center">
      {chartData.map((group, index) => {
        const processedData = processGroupData(group);
        return (
          <div key={index} className="bg-white p-0 rounded-lg shadow-md">
            <PieChart
              labels={processedData.labels}
              data={processedData.counts}
              total={processedData.total}
              groupName={processedData.groupName}
            />
          </div>
        );
      })}
    </div>
    
  );
};

export default PieChartContainer;