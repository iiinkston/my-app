import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BarcodeScanner from "./components/BarcodeScanner";
import SNS from "./components/SNS";
import CalorieCal from "./components/CalorieCal";
import Footer from "./components/Footer";
import "./index.css"; // Import global styles

function App() {
    const [showScanner, setShowScanner] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const [foodData, setFoodData] = useState(null); // 👈 Store food info globally

    return (
        <div className="app-container">
            <Navbar />
            <Home />

            {/* Button to toggle Barcode Scanner */}
            <div className="scanner-btn-container">
                <button onClick={() => setShowScanner(true)} className="scanner-btn">
                    Open Barcode Scanner
                </button>
            </div>

            {/* Scanner Modal */}
            {showScanner && (
                <div className="scanner-modal">
                    <div className="scanner-content">
                        <button className="close-btn" onClick={() => setShowScanner(false)}>✖</button>
                        <BarcodeScanner
                            onScan={(code, data) => {
                                setScannedCode(code);
                                setFoodData(data); // 👈 Store food data in App.js
                                setShowScanner(false); // Close modal after scanning
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Display Scanned Food Information on Homepage */}
            {scannedCode && (
                <div className="scanned-info">
                    <h3>Scanned Product Information</h3>
                    <p><strong>Scanned Barcode:</strong> {scannedCode}</p>

                    {foodData ? (
                        <div className="food-info">
                            <p><strong>Product Name:</strong> {foodData.product_name || "Unknown Product"}</p>
                            <p><strong>Brand:</strong> {foodData.brands || "N/A"}</p>
                            <p><strong>Category:</strong> {foodData.categories || "N/A"}</p>
                            <p><strong>Calories:</strong> {foodData.nutriments?.["energy-kcal"] || "N/A"} kcal</p>
                            <p><strong>Carbs:</strong> {foodData.nutriments?.["carbohydrates"] || "N/A"} g</p>
                            <p><strong>Protein:</strong> {foodData.nutriments?.["proteins"] || "N/A"} g</p>
                            <p><strong>Fat:</strong> {foodData.nutriments?.["fat"] || "N/A"} g</p>
                        </div>
                    ) : (
                        <p>No product information found for this barcode.</p>
                    )}
                </div>
            )}

            <SNS />
            <CalorieCal />
            <Footer />
        </div>
    );
}

export default App;
