import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/SettingsPage.css";

const SettingsPage = ({ onLogout }) => {
  // Initialize hideProfile state from localStorage; default is false if not set.
  const [hideProfile, setHideProfile] = useState(() => localStorage.getItem("hideProfile") === "true");
  // Initialize units state from localStorage; default is "metric" if not set.
  const [units, setUnits] = useState(localStorage.getItem("units") || "metric");
  // Initialize notifications state from localStorage; default is false if not set.
  const [notifications, setNotifications] = useState(() => localStorage.getItem("notifications") === "true");

  // useNavigate hook for programmatic navigation.
  const navigate = useNavigate();

  // Whenever hideProfile changes, update its value in localStorage.
  useEffect(() => {
    localStorage.setItem("hideProfile", hideProfile);
  }, [hideProfile]);

  // Whenever units changes, update its value in localStorage.
  useEffect(() => {
    localStorage.setItem("units", units);
  }, [units]);

  // Whenever notifications changes, update its value in localStorage.
  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  // Handle user logout by clearing localStorage, calling onLogout, and navigating to the Sign In page.
  const handleLogout = () => {
    localStorage.clear(); // Clears all stored user data
    onLogout();
    navigate("/signIn"); // Redirect to Sign In page
  };

  return (
    <Container className="mt-4 settings-container" style={{ paddingBottom: "120px" }}>
      <Card className="p-4 shadow-sm border-0 rounded-lg">
        <h3 className="text-primary fw-bold text-center mb-4">Settings</h3>

        <Form>
          {/* 🔹 Account Settings Section */}
          <div className="section-title">Account</div>
          <Button
            variant="outline-primary"
            className="w-100 mb-3 rounded-pill"
            onClick={() => navigate("/myprofile")}
          >
            Edit Profile
          </Button>

          {/* 🔹 Privacy & Security Section */}
          <div className="section-title">Privacy</div>
          <Form.Group className="setting-item">
            <Form.Check
              type="switch"
              id="hideProfileToggle"
              label="Hide Profile from Public"
              checked={hideProfile}
              onChange={() => setHideProfile(!hideProfile)}
            />
          </Form.Group>

          {/* 🔹 App Preferences Section */}
          <div className="section-title">Preferences</div>
          <Form.Group className="setting-item">
            <Form.Label>Units of Measurement</Form.Label>
            <Form.Select value={units} onChange={(e) => setUnits(e.target.value)}>
              <option value="metric">Metric (kg, cm)</option>
              <option value="imperial">Imperial (lbs, inches)</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="setting-item">
            <Form.Check
              type="switch"
              id="notificationsToggle"
              label="Enable Notifications"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </Form.Group>

          {/* 🔹 Help & Support Section */}
          <div className="section-title">Help & Support</div>
          <Row>
            <Col>
              <Button variant="outline-secondary" className="w-100 mb-2 rounded-pill">
                Help Center
              </Button>
            </Col>
            <Col>
              <Button variant="outline-secondary" className="w-100 mb-2 rounded-pill">
                About App
              </Button>
            </Col>
          </Row>

          {/* 🔹 Back Button to navigate back to the "Others" page */}
          <Button
            variant="outline-secondary"
            className="w-100 mt-3 rounded-pill"
            onClick={() => navigate("/others")}
          >
            ← Back to Others
          </Button>

          {/* 🔹 Logout Button to clear user data and log out */}
          <Button
            variant="danger"
            className="w-100 mt-3 rounded-pill"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SettingsPage;