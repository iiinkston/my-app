import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, FormControl, InputGroup } from "react-bootstrap";
import "../styles/Navbar.css";

const AppNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar-title-container">
        <Container className="navbar-title-content">
          <Navbar.Brand className="navbar-title">MyFitDiet</Navbar.Brand>
        </Container>
      </div>
    </>
  );
};

export default AppNavbar;
