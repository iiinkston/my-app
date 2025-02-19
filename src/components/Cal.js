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
    },

    Batminton: {
        intensities: {
            'General': 5.5,
            'Competitive': 8
        }
    },

    Basketball: {
        intensities: {
            'Game': 8,
            'General': 6.75,
            'Practice, drills': 9.3,
            'Shooting baskets': 5
        }
    },

    Bowling: {
        intensities: null,
        metValue: 3.4
    },

    Boxing: {
        intensities: {
            'Sparring': 7.8,
            'Punching bag': 8.025,
        }
    },

    Cheerleading: {
        "Cheerleading, gymnastic moves, competitive": 6.0
    },

    Coaching: {
        "football, soccer, basketball, baseball, swimming, etc.": 4.0,
        'Playing with Players Actively': 8
    },

    Cricket: {
        intensities: null,
        metValue: 4.8
    },

    Curling: {
        intensities: null,
        metValue: 4
    },

    Fencing: {
        intensities: {
            'General': 6,
            'Competitive': 9.8
        }
    },

    Floorball: {
        intensities: null,
        metValue: 10.5
    },

    Football: {
        intensities: {
            "Competitive": 8,
            "Light Effort": 4
        }
    },

    Frisbee: {
        intensities: {
            "General": 3,
            "Ultimate Frisbee": 8
        },

    },

    FrisbeeGolf: {
        intensities: null,
        metValue: 3
    },

    Golf: {
        intensities: null,
        metValue: 4.06
    },

    Gymnastics: {
        intensities: null,
        metValue: 3.8
    },

    Handball: {
        intensities: null,
        metValue: 10
    },

    Hockey: {
        intensities: {
            'General': 8,
            'Competitive': 10
        },
    },

    HorsebackRiding: {
        intensities: {
            'General': 5.5,
            "Trotting": 5.8,
            "Walking": 3.8,
            'Jumping': 9,
            'Reining': 6
        }
    },

    Taekwondo: {
        intensities: null,
        metValue: 14.3
    },

    Kendo: {
        intensities: {
            'kihon-keiko style, moderate intensity': 6.5,
            'kirikaeshi style, high intensity': 9.6,
            'kakari keiko style, very high intensity': 11.3
        }
    },

    Judo: {
        intensities: null,
        metValue: 11.3
    },

    Kickboxing: {
        intensities: null,
        metValue: 7.3
    },

    Netball: {
        intensities: null,
        metValue: 7
    },

    Paddleball: {
        intensities: {
            'Casual': 6.0,
            'Competitive': 10
        }
    },

    RaceWalking: {
        intensities: {
            "3.1 m/s (6.9 mph)": 10.3,
            "3.7 m/s (8.3 mph)": 13.8,
            "4.0 m/s (8.95 mph)": 15.5
        }
    },

    Racquetball: {
        intensities: {
            "General": 7.0,
            "Competitive": 10
        }
    },

    Climbing: {
        intensities: {
            'Rock or mountain climbing': 8,
            'Rock climbing, free boulder': 8.8,
            'Rock climbing, ascending rock, high difficulty': 7.3,
            'Rock climbing, speed climbing, very difficult': 10.5,
            'Rock climbing, ascending or traversing rock, low-to-moderate difficulty': 5.9,
            'Rock climbing, treadwall, 7-10 m/min': 10.5,
            'Rock climbing, rappelling': 5
        }
    },

    RopeJumping: {
        intensities: {
            'fast pace, 120-160 skips/min': 12.3,
            'moderate pace 100 - 120 skips/min': 11.8,
            'slow pace, < 100 skips/min': 8.3
        }
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