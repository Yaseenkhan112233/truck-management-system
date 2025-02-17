import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register necessary Chart.js components
Chart.register(...registerables);

const ChartComponent = ({ chartData }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Truck Data Overview</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
