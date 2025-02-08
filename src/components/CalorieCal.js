import React, { useState } from "react";
import * as CalFunctions from "./Cal";
import "../index.css";
import Select from "react-select";

// States for the calorie calculator
const CalorieCal = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selection, setSelection] = useState(null);
    const [workout, setWorkout] = useState("");
    const [intensity, setIntensity] = useState("");
    const [workoutTime, setWorkoutTime] = useState("");
    const [bodyWeight, setBodyWeight] = useState(70);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [meals, setMeals] = useState([]);
    const [mealsCalories, setMealCalories] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);

    // Get food data from the CSV file/database
    const foodData = CalFunctions.useFoodData();
    if (!foodData) return null;

    // Map food data to options for the select component
    const foodOptions = foodData.slice(1).map(row => ({
        value: `${row[1]}, ${row[3]} ${row[4]}`,
        label: `${row[1]}, ${row[3]} ${row[4]}`,
        cal: `${row[5]}`
    }));

    // Map workout data to options for the select component
    const workoutOptions = Object.keys(CalFunctions.MET).map(exercise => ({
        value: exercise,
        label: exercise
    }));

    // UI for the calorie calculator
    return (
        <div>
            <h2>Calorie Calculator</h2>
            <p>Track your daily calorie intake and manage your diet effectively.</p>
            <label>
                Weight (in kg):
                <input
                    type="number"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(Number(e.target.value))}
                    min="1"
                />
            </label>

            <button onClick={() => CalFunctions.handleSelection("meal", setSelection, setShowPopup)}>Add Meal</button>
            <button onClick={() => CalFunctions.handleSelection("workout", setSelection, setShowPopup)}>Add Workout</button>

            {totalCalories > 0 && <p>Total Calorie Intake: {totalCalories.toFixed(2)} cal</p>}
            {caloriesBurned > 0 && <p>Total Calorie Burned: {caloriesBurned.toFixed(2)} cal</p>}

            {/* Popup for adding meal or workout */}
            {showPopup && (
                <div className="popup-background">
                    <div className="popup-content">
                        <h3>What would you like to add?</h3>

                        {/* Popup for choosing meal */}
                        {selection === "meal" && (
                            <div>
                                <label>Select Meal:</label>
                                {meals.map((meal, index) => (
                                    <div key={index} className="a_meal">
                                        <Select className="meal_select"
                                            options={foodOptions}
                                            onChange={(selectedOption) => {
                                                const newMeals = [...meals];
                                                newMeals[index] = selectedOption ? selectedOption.value : "";

                                                const newMealsCalories = [...mealsCalories];
                                                newMealsCalories[index] = {
                                                    name: selectedOption.label,
                                                    calories: parseFloat(selectedOption.cal),
                                                };

                                                setMeals(newMeals);
                                                setMealCalories(newMealsCalories);
                                            }}
                                            value={meal ? { label: meal, value: meal } : null}
                                            placeholder="Search for a meal"
                                        />
                                        <button className="r_button" onClick={() => CalFunctions.removeMealSelection(index, meals, setMeals)}>Remove</button>
                                    </div>
                                ))}
                                <button onClick={() => CalFunctions.addMealSelection(setMeals, meals)}>Add Meal</button>
                            </div>
                        )}

                        {/* Popup for choosing workout */}
                        {selection === "workout" && (
                            <div>
                                <label>
                                    Select Workout:
                                    <Select
                                        options={workoutOptions}
                                        onChange={selectedOption => setWorkout(selectedOption ? selectedOption.value : "")}
                                        value={workout ? { label: workout, value: workout } : null}
                                        placeholder="Search for a workout"
                                    />
                                </label>

                                {workout && CalFunctions.MET[workout].intensities && (
                                    <Select
                                        options={Object.keys(CalFunctions.MET[workout].intensities).map(
                                            (intensity) => ({
                                                value: intensity,
                                                label: intensity
                                            }))}
                                        onChange={(selectedOption) => setIntensity(selectedOption ? selectedOption.value : "")}
                                        value={intensity ? { label: intensity, value: intensity } : null}
                                        placeholder="Select intensity"
                                    />
                                )}

                                <br />
                                <label>
                                    Time (in minutes):
                                    <input
                                        type="number"
                                        value={workoutTime}
                                        onChange={(e) => CalFunctions.handleWorkoutTimeChange(e, setWorkoutTime, workout, intensity, bodyWeight, setCaloriesBurned)}
                                        min="1"
                                    />
                                </label>

                                {workoutTime && workout && (intensity || workout != null) && (
                                    <p>Calories Burned: {caloriesBurned.toFixed(2)} cal</p>
                                )}
                            </div>
                        )}


                        {/* Button container for Submit and Cancel */}
                        <div className="button-container">
                            <button onClick={() => {
                                const total = mealsCalories.reduce((sum, meal) => sum + (meal?.calories || 0), 0);
                                setTotalCalories(total);

                                setShowPopup(false)
                            }
                            }>Submit</button>
                            <button onClick={CalFunctions.closePopup.bind(null, setShowPopup, setWorkout, setIntensity)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalorieCal;
