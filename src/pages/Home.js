import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import { db, auth } from "../firebase";
import UserInfo from "../components/UserInfo";
import "../styles/Home.css";
import "../utils/chartConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const navigate = useNavigate();
  const [last7Days, setLast7Days] = useState([]);
  const [calorieIntake, setCalorieIntake] = useState([]);
  const [caloriesBurned, setCaloriesBurned] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log("User authenticated:", authUser.uid);
        setUser(authUser);
        fetchWeeklyCalories(authUser.uid);
      } else {
        console.warn("No user found, redirecting to sign-in.");
        navigate("/signIn", { replace: true });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchWeeklyCalories = async (userId) => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "user_data", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log("No calorie data found for this user.");
        return;
      }

      const userData = userDoc.data();
      const entries = userData.calorieEntries || [];

      const dataMap = {};

      entries.forEach((entry) => {
        const date = new Date(entry.timestamp.toDate()).toLocaleDateString();
        if (!dataMap[date]) {
          dataMap[date] = { calorieIntake: 0, calorieBurned: 0 };
        }
        dataMap[date].calorieIntake += entry.totalCalorieIntake || 0;
        dataMap[date].calorieBurned += entry.caloriesBurned || 0;
      });

      const sortedData = Object.keys(dataMap)
        .map(date => ({
          date,
          calorieIntake: dataMap[date].calorieIntake,
          calorieBurned: dataMap[date].calorieBurned
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setLast7Days(sortedData.map(d => d.date));
      setCalorieIntake(sortedData.map(d => d.calorieIntake));
      setCaloriesBurned(sortedData.map(d => d.calorieBurned));
    } catch (error) {
      console.error("Error fetching calorie data:", error);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="content">
      <UserInfo userId={user?.uid} />

      {/* Total Calorie Intake Chart */}
      <section className="chart-section">
        <h3>Total Calorie Intake (Last 7 Days)</h3>
        <div className="chart-container">
          <Bar
            data={{
              labels: last7Days,
              datasets: [{
                label: "Total Calorie Intake",
                data: calorieIntake,
                backgroundColor: "rgba(75, 192, 192, 0.6)"
              }]
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </section>

      {/* Total Calories Burned Chart */}
      <section className="chart-section">
        <h3>Calories Burned (Last 7 Days)</h3>
        <div className="chart-container">
          <Line
            data={{
              labels: last7Days,
              datasets: [{
                label: "Calories Burned",
                data: caloriesBurned,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.3)",
                fill: true
              }]
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </section>
    </div>
  );
}

export default Home;
