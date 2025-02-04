import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import "./BarcodeScanner.css"; // Import the new CSS file

const BarcodeScanner = ({ onScan }) => {
    const videoRef = useRef(null);
    const [scannedCode, setScannedCode] = useState("");

    useEffect(() => {
        if (videoRef.current) {
            Quagga.init(
                {
                    inputStream: {
                        type: "LiveStream",
                        constraints: {
                            facingMode: "environment",
                        },
                        target: videoRef.current,
                    },
                    decoder: {
                        readers: ["ean_reader", "code_128_reader", "upc_reader"],
                    },
                },
                (err) => {
                    if (err) {
                        console.error("Quagga init error:", err);
                        return;
                    }
                    Quagga.start();
                }
            );

            Quagga.onDetected((data) => {
                if (data.codeResult.code) {
                    setScannedCode(data.codeResult.code);
                    onScan && onScan(data.codeResult.code);
                    Quagga.stop();
                }
            });
        }

        return () => {
            Quagga.stop();
        };
    }, []);

    return (
        <div className="scanner-container">
            <h2>Barcode Scanner</h2>
            <div className="scanner-video-wrapper">
                <div ref={videoRef} className="scanner-video"></div>
            </div>
            <p className="scanner-result">Scanned Code: <span>{scannedCode || "Waiting..."}</span></p>
        </div>
    );
};

export default BarcodeScanner;
