import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import HomeSkills from './pages/HomeSkills';
import Advance from './pages/Advance';
import Reading from './pages/Reading';
import Writing from './pages/Writing';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/skills" element={<HomeSkills/>} />
          <Route path="/advance" element={<Advance/>} /> 
          <Route path="/read" element={<Reading/>}/>
          <Route path="/write" element={<Writing/>}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
