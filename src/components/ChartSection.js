import React, { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

function ChartSection({ title, data }) {
  // Create a ref to hold a reference to the rendered Bar chart component
  const chartRef = useRef(null);

  // This effect runs every time the 'data' prop changes
  useEffect(() => {
    // Check if the chart has been rendered (i.e., chartRef.current is not null)
    if (chartRef.current !== null) {
      // Retrieve the Chart.js instance associated with the Bar component
      // If an instance exists, destroy it to clean up before re-rendering with new data
      Chart.getChart(chartRef.current)?.destroy();
    }
  }, [data]);

  return (
    <section className="chart-section">
      {/* Display the provided title */}
      <h2>{title}</h2>
      <div className="chart-container">
        {/* Render a responsive Bar chart using react-chartjs-2.
            The 'ref' is attached to access the underlying chart instance */}
        <Bar ref={chartRef} data={data} options={{ responsive: true }} />
      </div>
    </section>
  );
}

export default ChartSection;