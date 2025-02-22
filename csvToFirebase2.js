import { db } from './firebase-admin.js';
import fs from 'fs';
import csvParser from 'csv-parser';

// path to the CSV file
const filePath = './public/food_calories.csv';

// Read the CSV file and organize data
async function parseCSV(file) {
    const foodMap = {};

    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(csvParser())
            .on('data', (row) => {
                if (!row.Food_Code || !row.Display_Name) {
                    console.warn("Skipping row due to missing required fields:", row);
                    return;
                }

                const foodCode = row.Food_Code.trim();
                const foodName = row.Display_Name.trim();
                const portionKey = row.Portion_Display_Name?.trim() || "Default";
                const portionAmount = row.Portion_Amount ? parseFloat(row.Portion_Amount) : 1;
                const calories = row.Calories ? parseFloat(row.Calories) : 0;

                // Initialize food entry if not exists
                if (!foodMap[foodCode]) {
                    foodMap[foodCode] = {
                        name: foodName,
                        portions: {}
                    };
                }

                foodMap[foodCode].portions[portionKey] = {
                    portionAmount: portionAmount,
                    calories: calories
                };
            })
            .on('end', () => {
                resolve(foodMap);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Upload the processed data to Firebase Firestore
async function uploadToFirebase(foodMap) {
    try {
        for (const [foodCode, data] of Object.entries(foodMap)) {
            const foodRef = db.collection('calorie-cal').doc('food').collection('foodList').doc(foodCode);

            await foodRef.set({
                name: data.name,
                portions: data.portions
            },
                // Merge to avoid overwriting other data 
                { merge: true });
        }
    } catch (error) {
        console.error("Error uploading data to Firebase:", error);
    }
}

// Main function
async function main() {
    try {
        const foodMap = await parseCSV(filePath);
        await uploadToFirebase(foodMap);
    } catch (error) {
        console.error("Error processing CSV:", error);
    }
}

main();
