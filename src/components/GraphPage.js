import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "../styles/GraphPage.css";

// GraphPage component renders a bar chart with editable data and optional macros data.
function GraphPage({ title, dataType, initialData, labels, updateData, showMacros = false, macrosData, updateMacros }) {
  // State to store the current data values for the graph.
  const [dataValues, setDataValues] = useState([...initialData]);
  
  // State to store the macros data, if provided.
  const [macros, setMacros] = useState(macrosData ? { ...macrosData } : null);
  
  // State to control visibility of the data editing modal.
  const [showModal, setShowModal] = useState(false);
  
  // State to control visibility of the macros editing modal.
  const [showMacrosModal, setShowMacrosModal] = useState(false);
  
  // Function to open the data editing modal.
  const toggleModal = () => setShowModal(true);
  
  // Generic function to close a modal if the click occurs outside the modal content.
  // The modalSetter parameter determines which modal's state to update.
  const closeModal = (event, modalSetter) => {
    if (event.target.classList.contains("graph-modal")) {
      modalSetter(false);
    }
  };

  //  Saving the Data
  // Function to handle input changes for graph data.
  // It updates the dataValues state and calls the updateData callback with the new data array.
  const handleInputChange = (index, value) => {
    const newData = [...dataValues];
    newData[index] = Number(value);
    setDataValues(newData);
    updateData(newData);
  };

  //  Saving the Macros Data 
  // Function to handle input changes for macros data.
  // It updates the macros state and calls the updateMacros callback with the updated macros object.
  const handleMacroChange = (type, value) => {
    if (macros) {
      const updatedMacros = { ...macros, [type]: Number(value) };
      setMacros(updatedMacros);
      updateMacros(updatedMacros);
    }
  };

  //  Graph Data
  // Construct the data object to be passed to the Bar chart.
  const graphData = {
    labels, // X-axis labels for the chart.
    datasets: [
      {
        data: dataValues,  // Data values for the chart.
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color.
      },
    ],
  };

  // Chart options for customizing the appearance.
  const graphOptions = {
    scales: {
      y: { display: false }, // Hide Y-axis labels.
      x: { grid: { display: false } },  // Hide grid lines on X-axis.
    },
    plugins: {
      legend: { display: false }, // Hide the legend.
    },
  };

  return (
    <div className="page-container">
      {/* Display the title of the graph */}
      <h2>{title}</h2>

      {/* Render the bar chart with the specified data and options */}
      <Bar data={graphData} options={graphOptions} />

      {/* Button to open the modal for editing the graph data */}
      <button className="graph-add-button" onClick={toggleModal}>
        Add Data
      </button>
      
      {/* Modal for editing graph data */}
      {showModal && (
        <div className="graph-modal" onClick={(e) => closeModal(e, setShowModal)}>
          <div className="graph-modal-content">
            <h3>Edit {title}</h3>
            {/* Render an input field for each label */}
            {labels.map((label, index) => (
              <div key={index} className="input-section">
                <label>{label}: </label>
                <input
                  type="number"
                  value={dataValues[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for editing macros data (conditionally rendered if showMacros is true) */}
      {showMacros && showMacrosModal && (
        <div className="modal" onClick={(e) => closeModal(e, setShowMacrosModal)}>
          <div className="modal-content">
            <h3>Edit Macros</h3>
            {/* Map over the macros keys (fat, protein, carbohydrate) to create input fields */}
            {["fat", "protein", "carbohydrate"].map((macro) => (
              <div key={macro} className="input-section">
                <label>{macro.charAt(0).toUpperCase() + macro.slice(1)} (g): </label>
                <input
                  type="number"
                  value={macros[macro]}
                  onChange={(e) => handleMacroChange(macro, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphPage;