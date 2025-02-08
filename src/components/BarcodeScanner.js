import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import "./BarcodeScanner.css";

const BarcodeScanner = ({ onScan }) => {
    const videoRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            Quagga.init(
                {
                    inputStream: {
                        type: "LiveStream",
                        constraints: { facingMode: "environment" },
                        willReadFrequently: true,
                        target: videoRef.current,
                    },
                    decoder: {
                        readers: ["ean_reader", "code_128_reader", "upc_reader"],
                    },
                },
                (err) => {
                    if (err) {
                        console.error("Quagga initialization error:", err);
                        return;
                    }
                    Quagga.start();
                }
            );

            Quagga.onDetected(async (data) => {
                if (data.codeResult && data.codeResult.code) {
                    const barcode = data.codeResult.code.trim();
                    console.log("Scanned Barcode:", barcode);

                    if (barcode.length < 6) {
                        console.warn("Invalid barcode detected:", barcode);
                        return;
                    }

                    Quagga.stop();
                    fetchFoodData(barcode, onScan);
                } else {
                    console.warn("No valid barcode detected.");
                }
            });
        }

        return () => {
            Quagga.stop();
        };
    }, []);

    // Fetch food data and pass it to App.js
    const fetchFoodData = async (barcode, callback) => {
        if (!barcode || barcode.length < 6) {
            console.error("Skipping API call. Invalid barcode:", barcode);
            return;
        }

        setLoading(true);
        console.log("Fetching data for barcode:", barcode);

        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const result = await response.json();

            console.log("API Response:", result);

            if (result.status === 1) {
                const foodInfo = {
                    product_name: result.product.product_name || "Unknown Product",
                    brands: result.product.brands || "N/A",
                    categories: result.product.categories || "N/A",
                    nutriments: {
                        "energy-kcal": result.product.nutriments?.["energy-kcal"] || "N/A",
                        carbohydrates: result.product.nutriments?.["carbohydrates"] || "N/A",
                        proteins: result.product.nutriments?.["proteins"] || "N/A",
                        fat: result.product.nutriments?.["fat"] || "N/A"
                    }
                };

                callback(barcode, foodInfo); // Send barcode & food data to App.js
            } else {
                console.warn("No food data found for this barcode.");
                callback(barcode, null);
            }
        } catch (error) {
            console.error("Error fetching food data:", error);
            callback(barcode, null);
        }
        setLoading(false);
    };

    return (
        <div className="scanner-container">
            <h2>Scanning...</h2>
            <div className="scanner-video-wrapper">
                <div ref={videoRef} className="scanner-video"></div>
            </div>
            {loading && <p>Loading food information...</p>}
        </div>
    );
};

export default BarcodeScanner;
