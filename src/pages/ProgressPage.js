import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ProgressPage.css";

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

  // Save the selected time period to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedTime", selectedTime);
  }, [selectedTime]);

  // Simulated progress data for each time period
  const progressData = {
    "1_week": { stepCount: 54320, caloriesBurned: 2450 },
    "1_month": { stepCount: 201340, caloriesBurned: 9875 },
    "3_months": { stepCount: 608720, caloriesBurned: 29850 },
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
          {/* Display the calories burned with proper formatting */}
          <h2 className="progress-number">
            {progressData[selectedTime].caloriesBurned.toLocaleString()} kcal
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
