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
    const [barcode, setBarcode] = useState("");

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
                        <BarcodeScanner onScan={(code) => {
                            setBarcode(code);
                            setShowScanner(false);
                        }} />
                    </div>
                </div>
            )}

            {/* Display scanned barcode */}
            {barcode && (
                <p className="scanned-result">Scanned Barcode: <strong>{barcode}</strong></p>
            )}

            <SNS />
            <CalorieCal />
            <Footer />
        </div>
    );
}

export default App;
