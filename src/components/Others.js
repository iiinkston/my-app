import React, { useState } from "react";
import { Card, Container, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Others.css";
import BarcodeScanner from "./BarcodeScanner";

const Others = () => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showFoodInfo, setShowFoodInfo] = useState(false); // Controls food info display

  const categories = [
    { id: 1, name: "My Profile", path: "/myprofile", icon: "person-circle", color: "#0d6efd" },
    { id: 2, name: "Barcode Scanner", path: "#", icon: "qr-code-scan", color: "#28a745" },
    { id: 6, name: "Calorie Calculator", path: "/calorie-calculator", icon: "calculator", color: "#ff5722" },
    { id: 3, name: "Goals", path: "/goals", icon: "check-circle", color: "#ffc107" },
    { id: 4, name: "Progress", path: "/progress", icon: "graph-up-arrow", color: "#17a2b8" },
    { id: 5, name: "Settings", path: "/settings", icon: "gear-fill", color: "#dc3545" },
  ];

  const handleScan = (barcode, foodInfo) => {
    if (foodInfo) {
      setScannedData(foodInfo);
      setShowFoodInfo(true); // Open food info page after scan
    } else {
      console.log("No food data found for barcode:", barcode);
    }
    setScannerVisible(false); // Close scanner after scanning
  };

  return (
    <>
      <div className="categories-title-container">
        <Container>
          <h3 className="categories-title">Categories</h3>
        </Container>
      </div>

      <Container className="others-container">
        {categories.map((category) => (
          <Card key={category.id} className="others-card">
            <Card.Body className="others-card-body">
              <Link
                to={category.path !== "#" ? category.path : "#"}
                className="others-link"
                onClick={() => {
                  if (category.name === "Barcode Scanner") {
                    setScannerVisible(true);
                  }
                }}
              >
                <div className="others-icon" style={{ color: category.color }}>
                  <i className={`bi bi-${category.icon}`}></i>
                </div>
                <Card.Title className="others-title">{category.name}</Card.Title>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </Container>

      {/* Barcode Scanner component */}
      {scannerVisible && (
        <div className="scanner-container">
          <Button
            variant="danger"
            onClick={() => setScannerVisible(false)}
            className="close-button"
          >
            Close Scanner
          </Button>
          <BarcodeScanner onScan={handleScan} />
        </div>
      )}

      {/* Food Information Modal */}
      <Modal show={showFoodInfo} onHide={() => setShowFoodInfo(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Food Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {scannedData ? (
            <>
              <h5>{scannedData.product_name}</h5>
              {scannedData.image_url && (
                <img
                  src={scannedData.image_url}
                  alt={scannedData.product_name}
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginBottom: "10px" }}
                />
              )}
              <p><strong>Brand:</strong> {scannedData.brands}</p>
              <p><strong>Category:</strong> {scannedData.categories}</p>
              <h6>Nutrition Info (per 100g)</h6>
              <p><strong>Calories:</strong> {scannedData.nutriments["energy-kcal"]} kcal</p>
              <p><strong>Carbohydrates:</strong> {scannedData.nutriments.carbohydrates} g</p>
              <p><strong>Proteins:</strong> {scannedData.nutriments.proteins} g</p>
              <p><strong>Fat:</strong> {scannedData.nutriments.fat} g</p>
            </>
          ) : (
            <p>No food data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFoodInfo(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Others;
