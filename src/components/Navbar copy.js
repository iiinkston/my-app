import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2>Social Media App</h2>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/post">
                    <i className="fa-solid fa-circle-plus"></i> Post
                </Link>
                <Link to="/profile"></Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
