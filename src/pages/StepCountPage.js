import React from "react";
import GraphPage from "../components/GraphPage";
import data from "../data";

// StepCountPage component renders a graph displaying step count data
function StepCountPage() {
  return (
    <GraphPage
      // Title displayed at the top of the graph section
      title="Step Count"
      // Identifier for the type of data being handled by the GraphPage
      dataType="stepCount"
      // Initial data for the graph taken from the global data object
      initialData={data.stepCount}
      // Generate labels for the graph's x-axis using the displayDate property from the last 7 days
      labels={data.last7Days.map(day => day.displayDate)}
      // Callback function to update the stepCount data in the global data object when changes occur
      updateData={(newData) => { data.stepCount = newData; }}
    />
  );
}

export default StepCountPage;