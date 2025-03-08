// Import BrowserRouter from react-router-dom to enable routing in the application.
import { BrowserRouter } from 'react-router-dom';

// Import React to use JSX and create React components.
import React from 'react';

// Import ReactDOM for rendering the React component tree.
import ReactDOM from 'react-dom/client';

// Import the main App component, which contains the application logic.
import App from './App';

// Import the global CSS file for styles.
import './App.css';

// Create a React root and attach it to the DOM element with id "root".
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application wrapped in BrowserRouter to allow client-side routing.
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);