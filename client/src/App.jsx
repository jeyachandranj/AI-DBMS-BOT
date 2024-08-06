import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import HomeSkills from './pages/HomeSkills';
import Advance from './pages/Advance';
import Reading from './pages/Reading';
import Writing from './pages/Writing';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/skills" element={<HomeSkills />} />
        <Route path="/advance" element={<Advance />} />
        <Route path="/read" element={<Reading />} />
        <Route path="/write" element={<Writing />} />
      </Routes>
      {location.pathname !== '/advance' && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
