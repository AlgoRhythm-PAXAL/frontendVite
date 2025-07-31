// PieChart.jsx
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ labels, data, total, groupName }) => {
  // const colors = [
  //   "#1E3A8A", // Navy Blue (Completed/Success)
  //   "#0047AB", // Cobalt Blue (Notifications)
  //   "#4F46E5", // Royal Blue (Priority)
  //   "#2563EB", // Primary Blue (Actions/Processing)
  //   "#0EA5E9", // Sky Blue (In Transit)
  //   "#0077B6", // Cerulean Blue (Documentation)
  //   "#0047AB", // Cobalt Blue (Notifications)
  // ];

  const colors = [
    '#206b67', // Deep Teal (Completed/Success)
    '#1f818c', // Primary Teal (Notifications) — your base color
    '#2ca3a8', // Bright Teal (Priority)
    '#3cbcc3', // Light Teal (Actions/Processing)
    '#64d3d5', // Sky Aqua (In Transit)
    '#94e7e4', // Pale Aqua (Documentation)
    '#1f818c', // Reused Primary Teal (Notifications)
  ];

  const totalCenterPlugin = {
    id: 'totalCenter',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      ctx.save();
      ctx.font = "bold 25px 'Segoe UI', sans-serif";
      ctx.fillStyle = '#1F2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.fillText(`${total}%`, centerX, centerY);
      ctx.restore();

      // // ------ BOTTOM LABELS WITH COLOR BOXES ------
      // const labels = chart.config.data.labels;
      // const colors = chart.config.data.datasets[0].backgroundColor;
      // const values = chart.config.data.datasets[0].data;

      // Bottom labels with color boxes
      const labels = chart.config.data.labels;
      const colors = chart.config.data.datasets[0].backgroundColor;
      const values = chart.config.data.datasets[0].data;

      // Responsive label sizing
      const labelFontSize = Math.max(11, Math.min(14, chartArea.width * 0.04));
      const boxSize = Math.max(10, Math.min(14, chartArea.width * 0.04));
      const lineHeight = labelFontSize + 14;

      // Label positioning
      const labelStartX = chartArea.left + 10; // Left margin
      let labelStartY = chartArea.bottom + 15; // Start below chart

      labels.forEach((label, index) => {
        ctx.save();

        // Draw color box
        ctx.fillStyle = colors[index];
        ctx.fillRect(labelStartX, labelStartY, boxSize, boxSize);

        // Create label text with count
        const labelText = `${label}: ${values[index]}`;

        // Draw text
        ctx.font = "14px 'Segoe UI', sans-serif";
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(labelText, labelStartX + 25, labelStartY);

        ctx.restore();
        labelStartY += lineHeight; // Vertical spacing between labels
      });
    },
  };

  // Calculate dynamic height based on number of labels
  const baseHeight = 200;
  const labelHeight = labels.length * 25;
  const totalHeight = baseHeight + labelHeight + 60;

  return (
    <div className="flex flex-col items-center justify-start gap-4 rounded-2xl pt-2 bg-white p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 cursor-pointer w-full h-full min-h-0">
      <h1 className="text-sm md:text-base font-semibold text-center text-gray-800 mb-3 px-2 line-clamp-2">
        {groupName}
      </h1>
      <div className="relative  h-[380px] w-[295px]  ">
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                label: 'Shipments',
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderRadius: 10,
                spacing: 1,
              },
            ],
            hoverOffset: 4,
          }}
          options={{
            responsive: true,
            cutout: '60%',
            maintainAspectRatio: false,
            layout: {
              padding: {
                bottom: labelHeight + 40,
                left: 30,
                right: 30,
                top: 0,
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
              },
              datalabels: {
                color: '#fff',
                font: { size: 12, weight: 'normal' },
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${percentage}%`;
                },
              },
            },
            interaction: {
              intersect: false,
            },
          }}
          plugins={[totalCenterPlugin]}
        />
      </div>
    </div>
  );
};

export default PieChart;
