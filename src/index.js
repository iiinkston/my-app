import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18+
import App from './App';
import './index.css';

// Create a root element and render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
