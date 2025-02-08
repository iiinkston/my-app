import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BarcodeScanner from './components/BarcodeScanner';
import SNS from './components/SNS';
import CalorieCal from './components/CalorieCal';
import Footer from './components/Footer';

function App() {
    return (
        <div>
            <Navbar />
            <Home />
            <BarcodeScanner />
            <SNS />
            <CalorieCal />
            <Footer />
        </div>
    );
}

export default App;