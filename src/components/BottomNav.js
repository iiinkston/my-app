// Import React and necessary components from react-bootstrap and react-router-dom
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import "../styles/BottomNav.css"; // Import the CSS file for styling the bottom navigation

// Define the BottomNav functional component
const BottomNav = () => {
  return (
    // Create a Navbar component with a light background and a shadow effect
    <Navbar bg="light" className="shadow-lg">
      {/* Use Nav to contain the navigation links */}
      <Nav className="bottom-nav">
        
        {/* Communities Link */}
        <NavLink to="/communities" className="bottom-nav-link">
          {/* Icon for Communities */}
          <i className="bi bi-people bottom-nav-icon"></i>
          {/* Label for Communities */}
          <div>Communities</div>
        </NavLink> 

        {/* Home Link */}
        <NavLink to="/" className="bottom-nav-link">
          {/* Icon for Home */}
          <i className="bi bi-house bottom-nav-icon"></i>
          {/* Label for Home */}
          <div>Home</div>
        </NavLink> 

        {/* Others Link */}
        <NavLink to="/others" className="bottom-nav-link">
          {/* Icon for Others */}
          <i className="bi bi-list bottom-nav-icon"></i>
          {/* Label for Others */}
          <div>Others</div>
        </NavLink>
      </Nav>
    </Navbar>
  );
};

// Export the BottomNav component as the default export
export default BottomNav;