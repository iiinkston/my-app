import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Quagga from "quagga";
import "../styles/BarcodeScanner.css";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const BarcodeScanner = () => {
    const videoRef = useRef(null);
    const isScanning = useRef(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        if (!videoRef.current) return;

        Quagga.init(
            {
                inputStream: {
                    type: "LiveStream",
                    constraints: { facingMode: "environment" },
                    willReadFrequently: true,
                    target: videoRef.current,
                },
                decoder: { readers: ["ean_reader", "code_128_reader", "upc_reader"] },
                locate: true,
            },
            (err) => {
                if (err) {
                    console.error("Quagga initialization error:", err);
                    setError("Scanner failed to start.");
                    return;
                }
                Quagga.start();
            }
        );

        Quagga.onDetected(handleBarcodeDetected);

        return () => {
            Quagga.stop();
            Quagga.offDetected(handleBarcodeDetected);
        };
    }, []);

    const handleBarcodeDetected = async (data) => {
        if (!data?.codeResult?.code) return;

        const barcode = data.codeResult.code.trim();
        if (isScanning.current) return;
        isScanning.current = true;

        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const result = await response.json();

            if (!result?.product) {
                setError(`No data found for barcode ${barcode}`);
                isScanning.current = false;
                return;
            }

            const foodInfo = {
                barcode,
                product_name: result.product.product_name || "Unknown",
                image_url: result.product.image_url || "",
                brands: result.product.brands || "N/A",
                categories: result.product.categories || "N/A",
                nutriments: {
                    calories: result.product.nutriments["energy-kcal"] || 0,
                    carbohydrates: result.product.nutriments.carbohydrates || 0,
                    protein: result.product.nutriments.protein || 0,
                    fat: result.product.nutriments.fat || 0,
                },
            };

            await saveScannedFood(foodInfo);
            navigate("/food-info", { state: { foodInfo } });
        } catch (error) {
            setError("Failed to fetch food data.");
        } finally {
            isScanning.current = false;
        }
    };

    const saveScannedFood = async (foodInfo) => {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to save data.");
            return;
        }

        try {
            const userDocRef = doc(db, "user_data", user.uid);
            const userDoc = await getDoc(userDocRef);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let newTotalCalories = foodInfo.nutriments.calories || 0;
            let updatedEntries = [];

            if (userDoc.exists()) {
                const existingData = userDoc.data();

               
                updatedEntries = existingData.calorieEntries || [];

                
                const existingEntryIndex = updatedEntries.findIndex(entry =>
                    entry.timestamp.toDate().toDateString() === today.toDateString()
                );

                if (existingEntryIndex !== -1) {
                    
                    updatedEntries[existingEntryIndex].totalCalorieIntake += newTotalCalories;
                } else {
                   
                    updatedEntries.push({
                        totalCalorieIntake: newTotalCalories,
                        caloriesBurned: 0,
                        timestamp: today,
                    });
                }
            } else {
              
                updatedEntries.push({
                    totalCalorieIntake: newTotalCalories,
                    caloriesBurned: 0,
                    timestamp: today,
                });
            }

            await setDoc(userDocRef, {
                calorieEntries: updatedEntries,
                scannedFoods: arrayUnion({ ...foodInfo, timestamp: today }),
            }, { merge: true });

            console.log("Scanned food saved successfully!");
        } catch (error) {
            console.error("Error saving scanned food to Firebase:", error);
        }
    };

    return (
        <div className="scanner-container">
            <h2>Scan a Food Item</h2>
            <div className="scanner-video-wrapper">
                <div ref={videoRef} className="scanner-video"></div>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default BarcodeScanner;
