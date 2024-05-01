import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import "./BarChart.css";
import moment from "moment";

const BarChart = () => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const fetchChartData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/chart-data");
      const formattedData = response.data.map((item) => ({
        date: moment(item.date).format("YYYY-MM-DD"),
        value: item.idCount,
      }));
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  useEffect(() => {
    const chartElement = chartRef.current;
    const chartInstance = new Chart(chartElement, {
      type: "bar",
      data: {
        labels: chartData.map((dataPoint) => dataPoint.date),
        datasets: [
          {
            label: "Number of IDs",
            data: chartData.map((dataPoint) => dataPoint.value),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    chartInstanceRef.current = chartInstance;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="bar-chart-container">
      <h2 className="chart-">Bar Chart</h2>
      <canvas ref={chartRef} id="bar-chart" className="canvas-container" />
    </div>
  );
};

export default BarChart;
