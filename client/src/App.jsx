import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import HomeSkills from './pages/HomeSkills';
import Interview from './pages/Interview';
import Reading from './pages/Reading';
import Writing from './pages/Writing';
import Listen from './pages/Listening';
import Speaking from './pages/Speaking';
function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/skills" element={<HomeSkills />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/read" element={<Reading />} />
        <Route path="/write" element={<Writing />} />
        <Route path="/listen" element={<Listen/>}/>
        <Route path="/speak" element={<Speaking/>}/>
      </Routes>
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
