import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";

//Fetch food data from Firebase
export const useFoodData = () => {
    const [foodData, setFoodData] = useState([]);

    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const foodCollection = collection(db, "calorie-cal", "food", "foodList");
                const foodSnapshot = await getDocs(foodCollection);
                const foodItems = [];

                foodSnapshot.forEach(doc => {
                    const foodItem = doc.data();
                    const portions = foodItem.portions;

                    Object.keys(portions).forEach((portion) => {
                        foodItems.push({
                            value: `${foodItem.name}, ${portions[portion].portionAmount} ${portion}`,
                            label: `${foodItem.name}, ${portions[portion].portionAmount} ${portion}`,
                            cal: portions[portion].calories,
                        });
                    });
                });

                setFoodData(foodItems);
            }
            catch (error) {
                console.error("Error fetching food data:", error);
            }
        };

        fetchFoodData();
    }, []);

    return foodData;
};

//Fetch activity data from Firebase
export const useActivityData = () => {
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const activitiesCollection = collection(db, "calorie-cal", "activities", "activityList");
                const activitiesSnapshot = await getDocs(activitiesCollection);
                const activityItems = [];

                activitiesSnapshot.forEach(doc => {
                    const activityItem = doc.data();
                    const intensities = activityItem.intensities;

                    Object.keys(intensities).forEach((intensity) => {
                        activityItems.push({
                            value: `${doc.id}, ${intensity}`,
                            label: `${doc.id} (${intensity})`,
                            cal: intensities[intensity],
                        });
                    });
                });

                setActivityData(activityItems);
            }
            catch (error) {
                console.error("Error fetching activity data:", error);
            }
        };

        fetchActivityData();
    }, []);

    return activityData;
};

//Calculate calories burned for an activity
export const calculateCalories = (metValue, time, bodyWeight) => {
    return (time * metValue * 3.5 * bodyWeight) / 200;
};

//Handle input time change for activities
export const handleActivityTimeChange = (e, setActivityTime, activity, activityOptions, bodyWeight, setCaloriesBurned) => {
    const time = Number(e.target.value);
    setActivityTime(time);

    if (activity) {
        const selectedActivity = activityOptions.find(opt => opt.value === activity);
        if (selectedActivity) {
            const metValue = selectedActivity.cal;
            const calories = calculateCalories(metValue, time, bodyWeight);
            setCaloriesBurned(calories);
        } else {
            setCaloriesBurned(0);
        }
    }
};

// Handle selection of meal or activity
export const handleSelection = (type, setSelection, setShowPopup) => {
    setSelection(type);
    setShowPopup(true);
};

//  Close the popup
export const closePopup = (setShowPopup, setActivity) => {
    setShowPopup(false);
    setActivity('');
};

//  Add meal selection
export const addMealSelection = (setMeals, meals) => {
    setMeals([...meals, ""]);
};

//  Remove meal selection and update total calories
export const removeMealSelection = (index, meals, setMeals, mealsCalories, setMealCalories, setTotalCalories) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    const updatedCalories = mealsCalories.filter((_, i) => i !== index);

    setMeals(updatedMeals);
    setMealCalories(updatedCalories);

    // Recalculate total calories after removal
    const total = updatedCalories.reduce((sum, meal) => sum + (meal?.calories || 0), 0);
    setTotalCalories(total);
};

//  Save calorie data with accumulation logic
export const handleSubmit = async (totalCalories, caloriesBurned) => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to save data.");
        return;
    }

    try {
        // Reference to Firestore collection
        const userCollectionRef = collection(db, "user_data");

        // Get today's date in the same format used in Firestore
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day

        // Query for an existing entry with today's date
        const q = query(userCollectionRef, where("timestamp", ">=", today));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // If an entry exists, update the first one found
            const docRef = querySnapshot.docs[0].ref;
            const existingData = querySnapshot.docs[0].data();

            // Add new values to existing ones
            const updatedCalories = existingData.totalCalorieIntake + totalCalories;
            const updatedBurned = existingData.caloriesBurned + caloriesBurned;

            await setDoc(docRef, {
                totalCalorieIntake: updatedCalories,
                caloriesBurned: updatedBurned,
                timestamp: new Date(),
            }, { merge: true });

            console.log("Calories accumulated for today!");
        } else {
            // If no entry exists, create a new one
            const newDocRef = doc(userCollectionRef);
            await setDoc(newDocRef, {
                totalCalorieIntake: totalCalories,
                caloriesBurned: caloriesBurned,
                timestamp: new Date(),
            });

            console.log("New calorie entry created for today!");
        }

        return { success: true, message: "Calories saved and accumulated successfully!" };
    } catch (error) {
        console.error("Error saving data to Firebase: ", error);
        return { success: false, message: "Error submitting data." };
    }
};