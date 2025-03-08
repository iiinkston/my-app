import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// GoalsPage component manages a list of fitness goals, allowing the user to add,
// toggle completion, and delete individual goals. The goals are stored in localStorage.
const GoalsPage = () => {
  const navigate = useNavigate();

  // State for the new goal input and the list of goals.
  // When initializing goals, attempt to load from localStorage; if none found, default to an empty array.
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  // Update localStorage whenever the 'goals' state changes.
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // Add a new goal to the list if the input is not empty.
  const handleAddGoal = () => {
    if (goal.trim()) {
      // Create a new goal object with 'completed' status as false.
      const newGoals = [...goals, { text: goal, completed: false }];
      setGoals(newGoals);
      setGoal(""); // Reset the input field.
    }
  };

  // Toggle the completion status of a goal at a given index.
  const handleToggleComplete = (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    setGoals(updatedGoals);
  };

  // Delete a goal from the list by filtering it out.
  const handleDeleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  return (
    <Container className="mt-4" style={{ paddingBottom: "120px" }}>
      <Card className="p-4 shadow-sm">
        <h3 className="text-primary fw-bold text-center">Fitness Goals</h3>

        {/* Form to add a new goal */}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Set a New Goal</Form.Label>
            <Form.Control
              type="text"
              placeholder="E.g., Run 5km, Lose 5kg..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" className="w-100 mb-3" onClick={handleAddGoal}>
            Add Goal
          </Button>
        </Form>

        {/* Display the list of goals */}
        <ListGroup>
          {goals.length > 0 ? (
            goals.map((g, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                {/* Display goal text; if completed, apply a line-through style */}
                <span style={{ textDecoration: g.completed ? "line-through" : "none" }}>
                  {g.text}
                </span>
                <div>
                  {/* Button to toggle the goal's completed status */}
                  <Button
                    variant={g.completed ? "secondary" : "primary"}
                    size="sm"
                    className="me-2"
                    onClick={() => handleToggleComplete(index)}
                  >
                    {g.completed ? "Undo" : "Complete"}
                  </Button>
                  {/* Button to delete the goal */}
                  <Button variant="danger" size="sm" onClick={() => handleDeleteGoal(index)}>
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            // Message shown when there are no goals
            <p className="text-center text-muted">No goals set. Start adding goals!</p>
          )}
        </ListGroup>

        {/* Button to navigate back to the 'Others' page */}
        <Button variant="outline-secondary" className="w-100 mt-3" onClick={() => navigate('/others')}>
          ← Back to Others
        </Button>
      </Card>
    </Container>
  );
};

export default GoalsPage;