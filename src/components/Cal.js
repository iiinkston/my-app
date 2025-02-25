import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

// Fetch food data from firebase
const useFoodData = () => {
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

// Fetch activity data from firebase
const useActivityData = () => {
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

// Calculate calories burned for a activity
const calculateCalories = (metValue, time, bodyWeight) => {
    return (time * metValue * 3.5 * bodyWeight) / 200;
};

// Handle input time change
const handleActivityTimeChange = (e, setActivityTime, activity, activityOptions, bodyWeight, setCaloriesBurned) => {
    const time = Number(e.target.value);
    setActivityTime(time);

    if (activity) {
        const selectedActivity = activityOptions.find(opt => opt.value === activity);
        if (selectedActivity) {
            const metValue = selectedActivity.cal;
            const calories = calculateCalories(metValue, time, bodyWeight);
            setCaloriesBurned(calories);
        }
        else {
            setCaloriesBurned(0);
        }
    }
};

// Handle selection of meal or activity
const handleSelection = (type, setSelection, setShowPopup) => {
    setSelection(type);
    setShowPopup(true);
};

// Close the popup
const closePopup = (setShowPopup, setActivity) => {
    setShowPopup(false);
    setActivity('');
};

// Add meal selection
const addMealSelection = (setMeals, meals) => {
    setMeals([...meals, ""]);
};

// Remove meal selection
const removeMealSelection = (index, meals, setMeals) => {
    setMeals(meals.filter((_, i) => i !== index));
};

// Export functions
export {
    calculateCalories,
    handleActivityTimeChange,
    handleSelection,
    closePopup,
    useFoodData,
    addMealSelection,
    removeMealSelection,
    useActivityData
};
