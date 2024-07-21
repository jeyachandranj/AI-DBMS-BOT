import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import BeginnerPage from './pages/Beginner';
import Advance from './pages/Advance';
import  Audio  from './components/audio';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/beginner" element={<BeginnerPage/>} />
          <Route path="/advance" element={<Advance/>} /> 
          <Route path="/audio" element={<Audio/>}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
