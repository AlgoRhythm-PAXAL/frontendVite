// PieChartContainer.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from './PieChart';
import LoadingAnimation from '../../../utils/LoadingAnimation';

const PieChartContainer = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/pieChart/data`,{ withCredentials: true });
        setChartData(response.data);
        setLoading(false);
      } catch (err) {
        const errorMessage=error.response?.data.message||'Failed to load chart data';
        TransformStream.error('Data loading error',{
          description:errorMessage,
          action:{
            label:'Retry',
            onClick:() => fetchData()
          }
        });
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


const processGroupData = (group) => ({
  labels: group.subStages.map(sub => sub.status),
  counts: group.subStages.map(sub => sub.count),
  total: group.percentage, 
  groupName: group.group
});
  if (loading) return (
    <LoadingAnimation/>
  );
  if (error) return <div>Error: {error}</div>;

  return (

    <div className="flex flex-wrap w-full justify-between items-center gap-y-6 gap-x-0 mt-4">
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