import { db } from './firebase-admin.js';
import fs from 'fs';
import csvParser from 'csv-parser';

// path to the CSV file
const filePath = './public/workout.csv';

// Read the CSV file and organize data
async function parseCSV(file) {
    const activitiesMap = {};

    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(csvParser())
            .on('data', (row) => {
                if (!row.Activity) {
                    console.warn("Skipping row due to missing required fields:", row);
                    return;
                }

                const activityName = row.Activity.trim();
                // Default to "General" if missing
                const intensity = row.Intensity?.trim() || "General";
                // Default to 0 if missing
                const value = row.Value ? parseFloat(row.Value) : 0;

                // Initialize the activity in the map if it doesn't exist
                if (!activitiesMap[activityName]) {
                    activitiesMap[activityName] = { intensities: {} };
                }

                activitiesMap[activityName].intensities[intensity] = value;
            })
            .on('end', () => {
                resolve(activitiesMap);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Upload the processed data to Firebase Firestore
async function uploadToFirebase(activitiesMap) {
    try {
        for (const [activity, data] of Object.entries(activitiesMap)) {
            const activityRef = db.collection('calorie-cal').doc('activities').collection('activityList').doc(activity);

            await activityRef.set({
                intensities: data.intensities
            },
                // Merge to prevent overwriting other data 
                { merge: true });
        }
    } catch (error) {
        console.error("Error uploading data to Firebase:", error);
    }
}

// Main function
async function main() {
    try {
        const activitiesMap = await parseCSV(filePath);
        await uploadToFirebase(activitiesMap);
    } catch (error) {
        console.error("Error processing CSV:", error);
    }
}

main();
