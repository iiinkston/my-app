

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Categories from './components/Others';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MyProfile from './pages/MyProfile';
import GoalsPage from "./pages/GoalsPage";
import SettingsPage from "./pages/SettingsPage";
import ProgressPage from "./pages/ProgressPage";
import StepCountPage from './pages/StepCountPage';
import SocialMediaPage from "./pages/SocialMediaPage";
import CalorieCalculator from "./pages/CalorieCalculator";
import SearchResults from "./pages/SearchResults";
import FoodInfo from "./pages/FoodInfo";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      fetch("http://127.0.0.1:8080/checkUserExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: JSON.parse(storedUser).email }),
      })
        .then(response => {
          if (!response.ok) {
            console.warn("User does not exist in database. Logging out...");
            localStorage.clear();
            setUser(null);
          } else {
            return response.json();
          }
        })
        .then(data => {
          if (data) setUser(data.user);
        })
        .catch(error => {
          console.error("Network error while checking user:", error);
          localStorage.clear();
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const authPages = ["/signIn", "/signUp"];
      if (!user && !authPages.includes(location.pathname)) {
        navigate('/signIn');
      }
    }
  }, [user, navigate, location.pathname, loading]);

  if (loading) {
    return <div style={{ textAlign: "center", paddingTop: "50px" }}>Loading...</div>;
  }

  return (
    <>
      <div className="app-container">
        {user && <AppNavbar />}

        <div className="content-container">
          <Routes>
            <Route path="/signIn" element={<SignIn onLogin={setUser} />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/settings" element={user ? (
              <SettingsPage
                user={user}
                onLogout={() => {
                  localStorage.clear();
                  setUser(null);
                  navigate('/signIn');
                }}
              />
            ) : (
              <Navigate to="/signIn" />
            )} />
            <Route path="/" element={user ? <Home /> : <Navigate to="/signIn" />} />
            <Route path="/step-count" element={user ? <StepCountPage /> : <Navigate to="/signIn" />} />
            <Route path="/others" element={user ? <Categories /> : <Navigate to="/signIn" />} />
            <Route path="/communities" element={user ? <SocialMediaPage /> : <Navigate to="/signIn" />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/calorie-calculator" element={<CalorieCalculator />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/food-info" element={<FoodInfo />} />
          </Routes>
        </div>

        {user && (
          <div className="bottom-nav-wrapper">
            <BottomNav />
          </div>
        )}
      </div>
    </>
  );
};

export default App;