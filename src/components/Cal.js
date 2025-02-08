// Ainsworth, B.E., Herrmann, S.D., Jacobs Jr., D.R., Whitt-Glover, M.C. and Tudor-Locke, C., 2024. A brief history of the Compendium of Physical Activities. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

// Herrmann, S.D., Willis, E.A., Ainsworth, B.E., Barreira, T.V., Hastert, M., Kracht, C.L., Schuna Jr., J.M., Cai, Z., Quan, M., Tudor-Locke, C., Whitt-Glover, M.C. and Jacobs, D.R., 2024. 2024 Adult Compendium of Physical Activities: A third update of the energy costs of human activities. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

// Willis, E.A., Herrmann, S.D., Hastert, M., Kracht, C.L., Barreira, T.V., Schuna Jr., J.M., Cai, Z., Quan, M., Conger, S.A., Brown, W.J., Ainsworth, B.E., 2024. Older Adult Compendium of Physical Activities: Energy costs of human activities in adults aged 60 and older. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

// Conger, S.A., Herrmann, S.D., Willis, E.A., Nightingale, T.E., Sherman, J.R., Ainsworth, B.E., 2024. 2024 Wheelchair Compendium of Physical Activities: An update of activity codes and energy expenditure values. Compendium of Physical Activities. Available at: https://pacompendium.com (Accessed: 21 January 2025).

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const useFoodData = () => {
    const [foodData, setFoodData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("/food_calories.csv");
                if (!response.ok) throw new Error("Failed to fetch file");

                const text = await response.text();

                const workbook = XLSX.read(text, { type: "string" });

                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

                setFoodData(data);
            }
            catch (error) {
                console.error("Error reading Excel file: ", error);
            }
        };

        getData();
    }, []);

    return foodData;
};


// MET data to calculate calories burned for workouts
const MET = {
    Cycling: {
        intensities: {
            '< 19 km/h': 6.35,
            '19.1 - 22.5 km/h': 9.17,
            '> 22.6 km/h': 11,
        }
    },
    Running: {
        intensities: {
            '< 6 km/h': 5.22,
            '6 - 15 km/h': 10.17,
            '> 15.1 km/h': 18.62,
        }
    },
    Yoga: {
        intensities: null,
        metValue: 3.46
    },

    Dancing: {
        intensities: null,
        metValue: 6.23
    }
};

// Calculate calories burned for a workout
const calculateCalories = (workoutType, time, intensityLevel, bodyWeight) => {
    let metValue = 0;
    if (MET[workoutType].intensities) {
        metValue = MET[workoutType].intensities[intensityLevel] || 0;
    } else {
        metValue = MET[workoutType].metValue;
    }
    return (time * metValue * 3.5 * bodyWeight) / 200;
};

const handleWorkoutTimeChange = (e, setWorkoutTime, workout, intensity, bodyWeight, setCaloriesBurned) => {
    const time = Number(e.target.value);
    setWorkoutTime(time);
    if (workout) {
        const intensityLevel = intensity || null;
        const calories = calculateCalories(workout, time, intensityLevel, bodyWeight);
        setCaloriesBurned(calories);
    }
};

const handleSelection = (type, setSelection, setShowPopup) => {
    setSelection(type);
    setShowPopup(true);
};

const closePopup = (setShowPopup, setWorkout, setIntensity) => {
    setShowPopup(false);
    setWorkout('');
    setIntensity('');
};

const addMealSelection = (setMeals, meals) => {
    setMeals([...meals, ""]);
};

const removeMealSelection = (index, meals, setMeals) => {
    setMeals(meals.filter((_, i) => i !== index));
};

export {
    MET,
    calculateCalories,
    handleWorkoutTimeChange,
    handleSelection,
    closePopup,
    useFoodData,
    addMealSelection,
    removeMealSelection
};