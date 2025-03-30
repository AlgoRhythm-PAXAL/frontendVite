
// // export default PieChart;
// // Import required Chart.js components
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
// import { Doughnut } from "react-chartjs-2";
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// // Register Chart.js components and plugins
// ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// const PieChart = () => {


  






//   // Custom plugin for center total and bottom labels
//   const totalCenterPlugin = {
//     id: "totalCenter",
//     afterDraw(chart) {
//       const { ctx, chartArea } = chart;
//       if (!chartArea) return; // Exit if chart area not available

//       // ------ CENTER TOTAL DISPLAY ------
//       const data = chart.config.data.datasets[0].data;
//       const total = data.reduce((acc, value) => acc + value, 0);

//       ctx.save(); // Save current canvas state
//       // Styling for center text
//       ctx.font = "bold 36px 'Segoe UI', sans-serif";
//       ctx.fillStyle = "#1F2937"; // Dark gray color
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       // Calculate center position
//       const centerX = (chartArea.left + chartArea.right) / 2;
//       const centerY = (chartArea.top + chartArea.bottom) / 2;
//       ctx.fillText(total, centerX, centerY); // Draw total
//       ctx.restore(); // Restore canvas state

//       // ------ BOTTOM LABELS WITH COLOR BOXES ------
//       const labels = chart.config.data.labels;
//       const colors = chart.config.data.datasets[0].backgroundColor;
//       const values = chart.config.data.datasets[0].data;
      
//       // Label positioning
//       const labelStartX = chartArea.left + 20; // Left margin
//       let labelStartY = chartArea.bottom + 30; // Start below chart

//       labels.forEach((label, index) => {
//         ctx.save(); // Save state for each label
        
//         // Draw color indicator box
//         const boxY = labelStartY;
//         ctx.fillStyle = colors[index];
//         ctx.fillRect(labelStartX, boxY, 15, 15); // 15x15px box

//         // Create label text with count
//         const labelText = `${label}: ${values[index]}`;
        
//         // Label text styling
//         ctx.font = "14px 'Segoe UI', sans-serif";
//         ctx.fillStyle = "#374151"; // Dark gray text
//         ctx.textAlign = "left";
//         ctx.textBaseline = "top";
//         ctx.fillText(labelText, labelStartX + 25, labelStartY);

//         ctx.restore(); // Restore state
//         labelStartY += 30; // Vertical spacing between labels
//       });
//     }
//   };

//   return (
//     // Container styling with Tailwind CSS
//     <div className="flex flex-col gap-5 bg-white rounded-2xl border border-gray-300 shadow-lg min-w-[400px] p-4">
//       <h1 className="text-lg font-semibold">Shipment Status</h1>
      
//       {/* Chart container with fixed dimensions */}
//       <div className="relative h-[500px] min-h-[400px]">
//         <Doughnut
//           data={{
//             labels: ["In Transit", "Arrived to Distribution Center", "Arrived to Collection Center", "Picked Up"],
//             datasets: [
//               {
//                 label: "Shipments",
//                 data: [200, 300, 701, 632],
//                 backgroundColor: [
//                   "#4F46E5", // Indigo
//                   "#10B981", // Emerald
//                   "#3B82F6", // Blue
//                   "#8B5CF6"  // Purple
//                 ],
//                 borderRadius: 10, // Rounded segment edges
//                 spacing: 3, // Space between segments
//               }
//             ],
//             hoverOffset: 4 // Hover animation distance
//           }}
//           options={{
//             // Chart configuration
//             cutout: '65%', // Doughnut hole size
//             maintainAspectRatio: false, // Manual size control
            
//             // Layout padding for labels
//             layout: {
//               padding: {
//                 bottom: 180, // Space for bottom labels
//                 left: 20,
//                 right: 20
//               }
//             },
            
//             // Plugins configuration
//             plugins: {
//               legend: { display: false }, // Disable default legend
//               datalabels: {
//                 color: '#fff', // White text for contrast
//                 font: {
//                   size: 16,
//                   weight: 'normal'
//                 },
//                 // Percentage calculation (1833 = total of all values)
//                 formatter: (value) => ` ${((value / 1833) * 100).toFixed(1)}%`,
//               }
//             }
//           }}
//           plugins={[totalCenterPlugin]} // Add custom plugin
//         />
//       </div>
//     </div>
//   );
// };

// export default PieChart;


// PieChart.jsx
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ labels, data, total, groupName }) => {
  // Generate dynamic colors
  // const colors = [
  //   '#4F46E5', '#10B981', '#3B82F6', '#8B5CF6',
  //   '#EF4444', '#F59E0B', '#EC4899', '#6EE7B7'
  // ];

  const colors = [
    '#1E3A8A', // Navy Blue (Completed/Success)
    '#0047AB', // Cobalt Blue (Notifications)
    '#4F46E5', // Royal Blue (Priority)
    '#2563EB', // Primary Blue (Actions/Processing)
    
    '#0EA5E9', // Sky Blue (In Transit)
    
    // '#2DD4BF', // Teal Blue (Special Handling)
    '#0077B6', // Cerulean Blue (Documentation)
    
   
    '#0047AB', // Cobalt Blue (Notifications)

    
  ];
   

  const totalCenterPlugin = {
    id: "totalCenter",
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
  
      // ------ CENTER TOTAL ------
      // const data = chart.config.data.datasets[0].data;
      // const total = data.reduce((acc, value) => acc + value, 0);
  
      ctx.save();
      ctx.font = "bold 25px 'Segoe UI', sans-serif";
      ctx.fillStyle = "#1F2937";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.fillText(`${total}%`, centerX, centerY);
      ctx.restore();
  
      // ------ BOTTOM LABELS WITH COLOR BOXES ------
      const labels = chart.config.data.labels;
      const colors = chart.config.data.datasets[0].backgroundColor;
      const values = chart.config.data.datasets[0].data;
      
      // Label positioning
      const labelStartX = chartArea.left + 15; // Left margin
      let labelStartY = chartArea.bottom + 20; // Start below chart
  
      labels.forEach((label, index) => {
        ctx.save();
        
        // Draw color box
        ctx.fillStyle = colors[index];
        ctx.fillRect(labelStartX, labelStartY, 12, 12);
  
        // Create label text with count
        const labelText = `${label}: ${values[index]}`;
        
        // Draw text
        ctx.font = "14px 'Segoe UI', sans-serif";
        ctx.fillStyle = "#374151";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(labelText, labelStartX + 25, labelStartY);
  
        ctx.restore();
        labelStartY += 28; // Vertical spacing between labels
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl pt-2 w-fit">
      <h1 className="text-md font-semibold text-center px-2">{groupName}</h1>
      <div className="relative h-[380px] w-[295px]">
        <Doughnut
          data={{
            labels,
            datasets: [{
              label: "Shipments",
              data,
              backgroundColor: colors.slice(0, labels.length),
              borderRadius: 10,
              spacing: 3,
            }],
            hoverOffset: 4
          }}
          options={{
            cutout: '60%',
            maintainAspectRatio: false,
            layout: {
              padding: { bottom: 150, left: 5, right: 5 }
            },
            plugins: {
              legend: { display: false },
              datalabels: {
                color: '#fff',
                font: { size: 12, weight: 'normal' },
                formatter: (value) => ` ${((value / total) * 100).toFixed(1)}%`,
              }
            }
          }}
          plugins={[totalCenterPlugin]}
        />
      </div>
    </div>
  );
};

export default PieChart;


