import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/SignIn.css";

const SignIn = ({ onLogin }) => {
    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
            console.log("User signed in successfully:", userCredential.user.uid);

            // Ensure authentication state is updated
            onAuthStateChanged(auth, (authUser) => {
                if (authUser) {
                    console.log("Authentication state updated:", authUser.uid);
                    const updatedUser = {
                        id: authUser.uid,
                        email: authUser.email,
                        name: authUser.displayName || "User",
                        profilePicture: authUser.photoURL || null,
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    onLogin(updatedUser);
                    navigate("/");
                }
            });
        } catch (error) {
            // Handle specific Firebase auth errors
            let errorMessage = "Login failed. Please try again.";
            if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with this email.";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Incorrect password.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email format.";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Too many failed attempts. Please try again later.";
            }

            console.error("Login error:", error);
            setError(errorMessage);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h1 className="app-title">MyFitDiet</h1>
                <h2 className="signin-header">Welcome Back!</h2>
                <p className="signin-subtext">Log in to continue your fitness journey</p>

                <form onSubmit={handleSubmit} className="signin-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        required
                        className="signin-input"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        required
                        className="signin-input"
                    />
                    <button type="submit" className="signin-button">Sign In</button>
                    {error && <p className="signin-error">{error}</p>}
                </form>

                <p className="signin-link">
                    Don't have an account? <a href="/signUp">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
