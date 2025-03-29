// import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
// import { desktopOS, valueFormatter } from './webUsageStats';
// import axios from 'axios'
// import { styled } from '@mui/material/styles';
// import { useDrawingArea } from '@mui/x-charts/hooks';
// import { Box } from '@mui/material';
// import {useState,useEffect} from 'react'

// export default function PieArcLabel({title,chartData,totalParcels}) {
//   console.log("Pie Chart MUI",chartData)
  
//   // const [chartData, setChartData] = useState([]);
//   // const [totalParcels, setTotalParcels] = useState(0);


//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await axios.get('http://localhost:8000/admin/pieChart/data',{ withCredentials:true });
//   //       const rawData = response.data;
//   //       console.log("Raw data",rawData);
//   //       // Filter out statuses with count > 0 and process data for PieChart
//   //       const filteredData = rawData
//   //         .filter(item => item.count > 0)
//   //         .map(item => ({
//   //           id: item.status,
//   //           value: item.percentage,
//   //           label: item.status.replace(/([A-Z])/g, ' $1').trim(), // Format labels
//   //         }));

//   //       // Calculate total parcels
//   //       const total = rawData.reduce((sum, item) => sum + item.count, 0);

//   //       setChartData(filteredData);
//   //       setTotalParcels(total);
//   //     } catch (error) {
//   //       console.error('Error fetching pie chart data:', error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);
  

//   return (
//     // <Box
//     //   sx={{
//     //     backgroundColor: '#ffffff', // Light grey background
//     //     padding: 0,
//     //     borderRadius: 3,
//     //     boxShadow: 3,
//     //     display: 'flex',
//     //     flexDirection:'column',
//     //     justifyContent: 'center',
//     //     alignItems: 'center',
//     //   }}
//     // >
//     // </Box>
//     <div className="flex flex-col">
//       <h1 className="text-2xl font-semibold">{title}</h1>
//       <PieChart
//         series={[
//           {
//             data:chartData,
//             arcLabel: (item) => `${item.value}%`,
//             arcLabelMinAngle: 35,
//             arcLabelRadius: '50%', // Center labels within each pie section
//             innerRadius: 40,
//             outerRadius: 110,
//             paddingAngle: 1,
//             cornerRadius: 5,
//             startAngle: -180,
//             endAngle: 225,
//             cx: 150,
//             cy: 150,      
//           },
//         ]}
//         sx={{
//           [`& .${pieArcLabelClasses.root}`]: {
//             fontWeight: 'normal',
//             textAnchor: 'middle',
//             fill: '#FFFFFF', // Ensures the label is centered in each section
            
//           },
//         }}
//         {...size}
//       >
//         <PieCenterLabel totalParcels={totalParcels}/>
//       </PieChart>
//     </div>
//   );
// }

// const StyledText = styled('text')(({ theme }) => ({
//   fill: theme.palette.text.primary,
//   textAnchor: 'middle',
//   dominantBaseline: 'central',
//   fontSize: 15,
//   fontWeight: 'bold',
  
// }));

// function PieCenterLabel({totalParcels}) {
//   const { width, height, left, top } = useDrawingArea();
//   return (
//     <StyledText x={left + width / 2 } y={top + height / 2 - 5}>
//       <tspan x={left + width / 2} dy="-8" dx="-24 " fontSize="30" fontWeight="bold">{totalParcels}</tspan>
//       <tspan x={left + width / 2} dy="30" dx="-24" fontSize="14" fill="grey" fontWeight="normal">Parcels</tspan>
//     </StyledText>
//   );
// }

// const size = {
//   width: 450,
//   height: 310,
// };

// // const data = {
// //   data: desktopOS,
// //   valueFormatter,
// // };


import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';


export default function PieArcLabel({ title, chartData, totalParcels,statusParcelCount }) {
  
  return (
    <div className="flex flex-col items-center bg-background p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <div className="relative flex flex-col items-center">
        {/* Pie Chart */}
        <PieChart
          series={[
            {
              data: chartData,
              arcLabel: (item) => `${item.value}%`,
              arcLabelMinAngle: 35,
              arcLabelRadius: '50%',
              innerRadius: 50,
              outerRadius: 110,
              paddingAngle: 1,
              cornerRadius: 5,
              startAngle: -180,
              endAngle: 225,
              cx: 150,
              cy: 150,
            },
          ]}

          
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: 'normal',
              textAnchor: 'middle',
              fill: '#FFFFFF',
            },
          }}
          {...size}
        >
          <PieCenterLabel totalParcels={`${((statusParcelCount / totalParcels) * 100).toFixed(2)}%`} />

        </PieChart>

        {/* Labels Below */}
        <div className="flex flex-col items-baseline mt-4">
          {chartData.map((item, index) => (
            <div key={index} className="text-sm font-medium text-gray-700">
              {item.label}: {item.count}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Styled component for the center label inside the pie chart
const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 15,
  fontWeight: 'bold',
}));

function PieCenterLabel({ totalParcels }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2 - 5}>
      <tspan x={left + width / 2} dy="-8" dx="-20" fontSize="23" fontWeight="bold">
        {totalParcels}
      </tspan>
      <tspan x={left + width / 2} dy="30" dx="-24" fontSize="14" fill="grey" fontWeight="normal">
        Parcels
      </tspan>
    </StyledText>
  );
}

const size = {
  width: 450,
  height: 310,
};

