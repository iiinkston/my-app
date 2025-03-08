// Import necessary modules and components from React, React Bootstrap, and React Router
import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../styles/AuthPage.css"; // Import the CSS for styling the authentication page

// Define the AuthPage functional component which accepts an onLogin prop (a callback to handle a successful login)
const AuthPage = ({ onLogin }) => {
  // Manage local state for user information (name, email, password)
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  
  // Toggle between Sign Up and Sign In modes
  const [isSignUp, setIsSignUp] = useState(false);
  
  // State to indicate if a request is in progress, to disable the button and show proper text
  const [loading, setLoading] = useState(false);
  
  // useNavigate hook from react-router-dom to programmatically navigate between routes
  const navigate = useNavigate();

  // Handle input changes by updating the corresponding field in the user state
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submission asynchronously
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set the loading state to true while processing the request

    // Determine the URL based on whether the user is signing up or signing in
    const url = isSignUp ? "http://localhost:8080/signUp" : "http://localhost:8080/signIn";
    
    // Prepare the request body based on the current mode:
    // If signing up, include name, email, and password; otherwise, only email and password
    const requestBody = isSignUp 
      ? { name: user.name, email: user.email, password: user.password }
      : { email: user.email, password: user.password };

    try {
      // Make a POST request to the server with the appropriate URL and request body
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Check if the response is not OK (status code outside the 200-299 range)
      if (!response.ok) {
        // If an error occurs, attempt to parse the error message from the response
        const errorMessage = await response.json();
        // Throw an error with a custom message based on the current mode
        throw new Error(errorMessage.message || (isSignUp ? 'Sign Up Failed' : 'Invalid email or password'));
      }

      // If the response is successful, parse the result (expected to contain user information)
      const result = await response.json();
      
      // Save the user data in localStorage so that it can be used for session management
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Call the onLogin callback function to update the parent component's state with the logged-in user
      onLogin(result.user);
      
      // Navigate to the home page after successful authentication
      navigate('/');
    } catch (error) {
      // Display an alert with the error message if the request fails
      alert(error.message);
    } finally {
      // Reset the loading state regardless of success or failure
      setLoading(false);
    }
  };

  // Render the authentication page with a form for signing in or signing up
  return (
    <Container className="container-auth">
      <Card className="auth-card">
        {/* Display the appropriate header based on whether it's Sign Up or Sign In */}
        <h3 className="text-center">{isSignUp ? 'Sign Up' : 'Sign In'}</h3>

        <Form onSubmit={handleSubmit}>
          {/* If in Sign Up mode, show the Name input field */}
          {isSignUp && (
            <Form.Group className="auth-form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={user.name} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
          )}

          {/* Email input field (always shown) */}
          <Form.Group className="auth-form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={user.email} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          {/* Password input field (always shown) */}
          <Form.Group className="auth-form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              name="password" 
              value={user.password} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          {/* Submit button with conditional text based on loading state and mode */}
          <Button 
            type="submit" 
            variant="success" 
            className="auth-btn" 
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </Form>

        {/* Button to toggle between Sign Up and Sign In modes */}
        <Button 
          variant="link" 
          className="auth-btn-link" 
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </Card>
    </Container>
  );
};

export default AuthPage;