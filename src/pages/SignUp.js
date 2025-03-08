import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "../styles/SignUp.css";

const SignUp = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const firebaseUser = userCredential.user;

            // Set display name in Firebase Auth
            await updateProfile(firebaseUser, { displayName: user.name });

            // Store extra user info in Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), {
                name: user.name,
                email: user.email,
                profilePicture: null
            });

            alert("Sign-Up Successful!");
            navigate("/signIn");
        } catch (error) {
            setError(error.message || "Sign-Up failed");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="app-title">MyFitDiet</h1>
                <h2 className="signup-header">Create an Account</h2>
                <p className="signup-subtext">Join us and start your fitness journey!</p>

                <form onSubmit={handleSubmit} className="signup-form">
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="signup-input" />
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="signup-input" />
                    <input type="password" name="password" placeholder="Create Password" onChange={handleChange} required className="signup-input" />
                    <button type="submit" className="signup-button">Sign Up</button>
                    {error && <p className="signup-error">{error}</p>}
                </form>

                <button className="signup-back-button" onClick={() => navigate("/signIn")}>← Back to Sign In</button>
            </div>
        </div>
    );
};

export default SignUp;
