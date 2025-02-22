// Ainsworth, B.E., Herrmann, S.D., Jacobs Jr., D.R., Whitt-Glover, M.C. and Tudor-Locke, C., 2024. A brief history of the Compendium of Physical Activities. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

// Herrmann, S.D., Willis, E.A., Ainsworth, B.E., Barreira, T.V., Hastert, M., Kracht, C.L., Schuna Jr., J.M., Cai, Z., Quan, M., Tudor-Locke, C., Whitt-Glover, M.C. and Jacobs, D.R., 2024. 2024 Adult Compendium of Physical Activities: A third update of the energy costs of human activities. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

// Willis, E.A., Herrmann, S.D., Hastert, M., Kracht, C.L., Barreira, T.V., Schuna Jr., J.M., Cai, Z., Quan, M., Conger, S.A., Brown, W.J., Ainsworth, B.E., 2024. Older Adult Compendium of Physical Activities: Energy costs of human activities in adults aged 60 and older. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

// Conger, S.A., Herrmann, S.D., Willis, E.A., Nightingale, T.E., Sherman, J.R., Ainsworth, B.E., 2024. 2024 Wheelchair Compendium of Physical Activities: An update of activity codes and energy expenditure values. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

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