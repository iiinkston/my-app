import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/UserInfo.css";

function UserInfo() {
  const navigate = useNavigate();
  const [macros, setMacros] = useState({ calories: 0, fat: 0, protein: 0, carbohydrate: 0 });
  const [profilePicture, setProfilePicture] = useState("/userpic.jpeg"); // Default profile picture
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not logged in. Skipping Firestore fetch.");
      return;
    }

    const userId = user.uid;
    setLoading(true);
    console.log(`Fetching Firestore data for userId: ${userId}`);

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "user_data", userId); // 🔹 修正 Firestore 查询路径
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Firestore Data Retrieved:", userData);

          // 读取头像
          setProfilePicture(userData.profilePicture || "/userpic.jpeg");

          // 🔹 计算今日的总摄入量
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 设为当天 00:00:00

          const todayEntries = userData.calorieEntries?.filter(entry =>
            entry.timestamp.toDate().getTime() === today.getTime()
          ) || [];

          // 🔹 计算累加的 macros
          const totalMacros = todayEntries.reduce((acc, entry) => ({
            calories: acc.calories + (entry.totalCalorieIntake || 0),
            fat: acc.fat + (entry.fat || 0),
            protein: acc.protein + (entry.protein || 0),
            carbohydrate: acc.carbohydrate + (entry.carbohydrate || 0),
          }), { calories: 0, fat: 0, protein: 0, carbohydrate: 0 });

          setMacros(totalMacros);
        } else {
          console.warn(`No document found for userId: ${userId}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user data.");
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <section className="macro-section">
      <div className="profile-header">
        <img
          src={profilePicture}
          className="profile-img"
          onClick={() => navigate("/myprofile")}
          alt="Profile"
        />
        <h2 className="macro-title">Today's Macros</h2>
      </div>

      <div className="macro-content">
        <div className="macro-item">
          <span className="label">Fat: {macros.fat} g / 70 g</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${Math.min(100, (macros.fat / 70) * 100)}%`, backgroundColor: "#D77A61" }}></div>
          </div>
        </div>

        <div className="macro-item">
          <span className="label">Protein: {macros.protein} g / 130 g</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${Math.min(100, (macros.protein / 130) * 100)}%`, backgroundColor: "#6A994E" }}></div>
          </div>
        </div>

        <div className="macro-item">
          <span className="label">Carbs: {macros.carbohydrate} g / 300 g</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${Math.min(100, (macros.carbohydrate / 300) * 100)}%`, backgroundColor: "#F4A261" }}></div>
          </div>
        </div>

        <div className="macro-item">
          <span className="label">Calories: {macros.calories} kcal</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${Math.min(100, (macros.calories / 2500) * 100)}%`, backgroundColor: "#E76F51" }}></div>
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default UserInfo;
