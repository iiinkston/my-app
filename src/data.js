// Define a data object that stores various application data.
const data = {
  // Macro-nutrient information with initial values set to 0.
  macros: {
    calories: 0,       // Initial calories set to 0
    fat: 0,            // Initial fat amount
    protein: 0,        // Initial protein amount
    carbohydrate: 0,   // Initial carbohydrate amount
  },
  // Arrays for storing step counts and calories spent over 7 days, initialized with 0s.
  stepCount: [0, 0, 0, 0, 0, 0, 0], // Default step count values for 7 days
  calSpent: [0, 0, 0, 0, 0, 0, 0],  // Default calories spent values for 7 days
  last7Days: [],       // Array to store date objects for the last 7 days (will be populated later)
};

// Function to format a date relative to today.
// It subtracts a given number of days (daysAgo) from the current date and returns the date in MM/DD format.
const getFormattedDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo); // Subtract the specified number of days
  return `${date.getMonth() + 1}/${date.getDate()}`; // Return date as "MM/DD"
};

// Function to automatically generate dates for the last 7 days.
// It creates an array of 7 objects, each containing a "date" and "displayDate" property in MM/DD format.
export const updateDates = () => {
  data.last7Days = Array.from({ length: 7 }, (_, i) => ({
    date: getFormattedDate(6 - i),         // Calculate the date, starting from 6 days ago to today
    displayDate: getFormattedDate(6 - i),    // Use the same formatted date for display purposes
  }));
};

// Function to update the calories value in the macros object.
export const updateCalories = (newCalories) => {
  data.macros.calories = newCalories; // Set the calories property to the new value
};

// When the app starts, update the last7Days array with the latest dates.
updateDates();

// Export the data object as the default export.
export default data;