import { db, auth } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const handleSubmitForm = async (totalCalorieIntake, caloriesBurned) => {
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

        let updatedEntries = [];

        if (userDoc.exists()) {
            const existingData = userDoc.data();
            updatedEntries = existingData.calorieEntries || [];

            
            const existingEntryIndex = updatedEntries.findIndex(entry =>
                entry.timestamp.toDate().toDateString() === today.toDateString()
            );

            if (existingEntryIndex !== -1) {
                
                updatedEntries[existingEntryIndex].totalCalorieIntake += totalCalorieIntake;
                updatedEntries[existingEntryIndex].caloriesBurned += caloriesBurned;
            } else {
               
                updatedEntries.push({
                    totalCalorieIntake,
                    caloriesBurned,
                    timestamp: today,
                });
            }
        } else {
           
            updatedEntries.push({
                totalCalorieIntake,
                caloriesBurned,
                timestamp: today,
            });
        }

    
        await setDoc(userDocRef, { calorieEntries: updatedEntries }, { merge: true });

        console.log("Calories saved successfully!");
    } catch (error) {
        console.error("Error saving calorie data to Firebase:", error);
    }
};




// Handle Firebase data submission (store under `user_data/{user.uid}`)
export const handleSubmit = async (totalCalories, caloriesBurned) => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to save data.");
        return;
    }

    try {
        // Reference to Firestore document for the user
        const userDocRef = doc(db, "user_data", user.uid);
        const userDoc = await getDoc(userDocRef);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day

        if (userDoc.exists()) {
            // If user data exists, append today's data to `calorieEntries`
            await setDoc(userDocRef, {
                calorieEntries: arrayUnion({
                    totalCalorieIntake: totalCalories,
                    caloriesBurned: caloriesBurned,
                    timestamp: today,
                }),
            }, { merge: true });

            console.log("Calories accumulated for today!");
        } else {
            // If no document exists, create a new user document
            await setDoc(userDocRef, {
                calorieEntries: [{
                    totalCalorieIntake: totalCalories,
                    caloriesBurned: caloriesBurned,
                    timestamp: today,
                }],
            });

            console.log("New user document created with calorie entry!");
        }

        return { success: true, message: "Calories saved and accumulated successfully!" };
    } catch (error) {
        console.error("Error saving data to Firebase: ", error);
        return { success: false, message: "Error submitting data." };
    }
};

