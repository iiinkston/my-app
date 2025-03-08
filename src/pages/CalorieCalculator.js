import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useFoodData, useActivityData, handleActivityTimeChange } from '../components/Cal';
import { handleSubmit } from '../components/CalorieCal';
import Select from "react-select";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import '../styles/CalorieCalculator.css';

const CalorieCalculator = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selection, setSelection] = useState(null);
  const [activity, setActivity] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [bodyWeight, setBodyWeight] = useState(70);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [meals, setMeals] = useState([]);
  const [mealsCalories, setMealCalories] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const totalFoodCalories = mealsCalories.reduce((total, meal) => total + (meal?.calories || 0), 0);
    setTotalCalories(totalFoodCalories);
  }, [mealsCalories, caloriesBurned]);

  const foodData = useFoodData();
  const activityData = useActivityData();

  useEffect(() => {
    const fetchUserCalories = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setTotalCalories(data.totalCalories || 0);
        setCaloriesBurned(data.caloriesBurned || 0);
      }
    };

    if (foodData && activityData) {
      fetchUserCalories();
    }
  }, [foodData, activityData]);

  // Update total calorie intake dynamically when adding meals
  const updateTotalCalories = () => {
    const totalFoodCalories = mealsCalories.reduce((total, meal) => total + (meal?.calories || 0), 0);
    setTotalCalories(totalFoodCalories - caloriesBurned);
  };

  // This will  run when clicking "Submit"
  const handleSubmitForm = async () => {
    const response = await handleSubmit(totalCalories, caloriesBurned); // Accumulate new values
    if (response.success) {
      alert(response.message);
    } else {
      alert("Error saving data.");
    }
  };



  return (
    <Container className="calorie-container">
      <Card>
        <Card.Body>
          <h2 className="calorie-title">Calorie Calculator</h2>
          <p>Track your daily calorie intake and manage your diet effectively.</p>
          <Form>
            <Form.Group>
              <Form.Label>Weight (in kg):</Form.Label>
              <Form.Control
                type="number"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(Number(e.target.value))}
                min="1"
              />
            </Form.Group>

            <Button className="add-meal-btn" onClick={() => { setSelection("meal"); setShowPopup(true); }}>
              Add Meal
            </Button>
            <Button className="add-activity-btn" onClick={() => { setSelection("activity"); setShowPopup(true); }}>
              Add Activity
            </Button>

            <div className="mt-3">
              <p className="total-calories">Total Calorie Intake: {totalCalories.toFixed(2)} cal</p>
              <p className="calories-burned">Total Calorie Burned: {caloriesBurned.toFixed(2)} cal</p>
            </div>
          </Form>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-container">
                <h3 className="popup-title">What would you like to add?</h3>

                {selection === "meal" && (
                  <div className="popup-section">
                    <label className="popup-label">Select Meal:</label>
                    {meals.map((meal, index) => (
                      <div key={index} className="meal-item">
                        <Select
                          className="meal-select"
                          options={foodData}
                          onChange={(selectedOption) => {
                            const newMeals = [...meals];
                            newMeals[index] = selectedOption.value;

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
                        <button className="remove-btn" onClick={() => {
                          setMeals(meals.filter((_, i) => i !== index));
                          setMealCalories(mealsCalories.filter((_, i) => i !== index));
                          updateTotalCalories(); // Update total calorie intake
                        }}>Remove</button>
                      </div>
                    ))}
                    <button className="add-meal-btn" onClick={() => setMeals([...meals, ""])}>+ Add Meal</button>
                  </div>
                )}

                {selection === "activity" && (
                  <div className="popup-section">
                    <label className="popup-label">Select Activity:</label>
                    <Select
                      className="activity-select"
                      options={activityData}
                      onChange={selectedOption => setActivity(selectedOption ? selectedOption.value : "")}
                      value={activity ? { label: activity, value: activity } : null}
                      placeholder="Search for an activity"
                    />

                    <label className="popup-label">
                      Time (in minutes):
                      <input
                        type="number"
                        className="popup-input"
                        value={activityTime}
                        onChange={(e) => {
                          handleActivityTimeChange(e, setActivityTime, activity, activityData, bodyWeight, setCaloriesBurned);
                          updateTotalCalories(); // Update total calories dynamically
                        }}
                        min="1"
                      />
                    </label>

                    {activityTime && activity && (
                      <p className="calories-burned">Calories Burned: {caloriesBurned.toFixed(2)} cal</p>
                    )}
                  </div>
                )}

                <div className="popup-buttons">
                  <Button className="cancel-btn" onClick={() => setShowPopup(false)}>Finish</Button>
                </div>
              </div>
            </div>
          )}

          <Button className="submit-btn" onClick={handleSubmitForm}>
            Submit
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CalorieCalculator;
