import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ProgressPage.css";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProgressPage = () => {
  // Initialize navigation for redirecting the user to different pages
  const navigate = useNavigate();

  // Define dropdown options for different time periods
  const timeOptions = [
    { label: "Past 1 Week", value: "1_week" },
    { label: "Past 1 Month", value: "1_month" },
    { label: "Past 3 Months", value: "3_months" },
  ];

  // Load the selected time period from localStorage or default to "1_week" if not found
  const [selectedTime, setSelectedTime] = useState(() => {
    return localStorage.getItem("selectedTime") || "1_week";
  });

  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [user, setUser] = useState(null);

  // Save the selected time period to localStorage whenever it changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchCalorieData(authUser.uid, selectedTime);
      }
    });

    return () => unsubscribe();
  }, [selectedTime]);

  const fetchCalorieData = async (userId, timePeriod) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "user_data", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log("No calorie data found for this user.");
        setCaloriesBurned(0);
        return;
      }

      const userData = userDoc.data();
      const entries = userData.calorieEntries || [];

      let totalCaloriesBurned = 0;
      const now = new Date();
      let days = 7;

      if (timePeriod === "1_week") days = 7;
      else if (timePeriod === "1_month") days = 30;
      else if (timePeriod === "3_months") days = 90;

      const cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - days);

      entries.forEach((entry) => {
        const entryDate = new Date(entry.timestamp.toDate());
        if (entryDate >= cutoffDate) {
          totalCaloriesBurned += entry.caloriesBurned || 0;
        }
      });

      setCaloriesBurned(totalCaloriesBurned);
    } catch (error) {
      console.error("Error fetching calorie data:", error);
      setCaloriesBurned(0);
    }
  };

  // Simulated progress data for each time period
  const progressData = {
    "1_week": { stepCount: 54320 },
    "1_month": { stepCount: 201340 },
    "3_months": { stepCount: 608720 },
  };

  return (
    <Container className="progress-container">
      {/* Page Title */}
      <h3 className="text-center progress-title">Fitness Progress</h3>

      {/* Time Selection Dropdown */}
      <Form.Group className="time-filter">
        <Form.Label>Select Time Period:</Form.Label>
        <Form.Select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="custom-select"
        >
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Step Count Display Card */}
      <Card className="progress-card step-card">
        <Card.Body>
          <h5>Step Count</h5>
          {/* Display the step count with proper formatting */}
          <h2 className="progress-number">
            {progressData[selectedTime].stepCount.toLocaleString()} steps
          </h2>
        </Card.Body>
      </Card>

      {/* Calories Burned Display Card */}
      <Card className="progress-card calorie-card">
        <Card.Body>
          <h5>Calories Burned</h5>
          <h2 className="progress-number">
            {caloriesBurned.toLocaleString()} kcal
          </h2>
        </Card.Body>
      </Card>

      {/* Back Button to navigate to the "Others" page */}
      <Button
        variant="outline-secondary"
        className="w-100 mt-3"
        onClick={() => navigate('/others')}
      >
        ← Back to Others
      </Button>

      {/* Calorie Calculator Button */}
      <Button
        variant="primary"
        className="w-100 mt-3"
        onClick={() => navigate('/calorie-calculator')}
      >
        Open Calorie Calculator
      </Button>
    </Container>
  );
};

export default ProgressPage;
