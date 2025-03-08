import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/FoodInfo.css";

const FoodInfoPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const foodInfo = location.state?.foodInfo;

    if (!foodInfo) {
        return <p>Error: No food data found.</p>;
    }

    return (
        <div className="food-info-container">
            <button className="close-button" onClick={() => navigate("/")}>✖</button>
            <h2>{foodInfo.product_name}</h2>
            {foodInfo.image_url && <img src={foodInfo.image_url} alt={foodInfo.product_name} />}
            <p><strong>Brand:</strong> {foodInfo.brands}</p>
            <p><strong>Category:</strong> {foodInfo.categories}</p>
            <h3>Nutrition Info (per 100g)</h3>
            <p><strong>Calories:</strong> {foodInfo.nutriments.calories} kcal</p>
            <p><strong>Carbohydrates:</strong> {foodInfo.nutriments.carbohydrates} g</p>
            <p><strong>Protein:</strong> {foodInfo.nutriments.protein} g</p>
            <p><strong>Fat:</strong> {foodInfo.nutriments.fat} g</p>
            <button className="back-button" onClick={() => navigate("/")}>Back to Scanner</button>
        </div>
    );
};

export default FoodInfoPage;
