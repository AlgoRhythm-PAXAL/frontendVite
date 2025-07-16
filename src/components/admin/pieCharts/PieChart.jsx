// PieChart.jsx
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ labels, data, total, groupName }) => {

  const colors = [
    "#1E3A8A", // Navy Blue (Completed/Success)
    "#0047AB", // Cobalt Blue (Notifications)
    "#4F46E5", // Royal Blue (Priority)
    "#2563EB", // Primary Blue (Actions/Processing)
    "#0EA5E9", // Sky Blue (In Transit)
    "#0077B6", // Cerulean Blue (Documentation)
    "#0047AB", // Cobalt Blue (Notifications)
  ];

  const totalCenterPlugin = {
    id: "totalCenter",
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
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
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl pt-2 w-fit">
      <h1 className="text-md font-semibold text-center px-2">{groupName}</h1>
      <div className="relative h-[380px] w-[295px]">
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                label: "Shipments",
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderRadius: 10,
                spacing: 1,
              },
            ],
            hoverOffset: 4,
          }}
          options={{
            cutout: "60%",
            maintainAspectRatio: false,
            layout: {
              padding: { bottom: 150, left: 5, right: 5 },
            },
            plugins: {
              legend: { display: false },
              datalabels: {
                color: "#fff",
                font: { size: 12, weight: "normal" },
                formatter: (value) => ` ${((value / total) * 100).toFixed(1)}%`,
              },
            },
          }}
          plugins={[totalCenterPlugin]}
        />
      </div>
    </div>
  );
};

export default PieChart;
