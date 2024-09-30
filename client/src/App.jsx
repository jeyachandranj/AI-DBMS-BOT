import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Advance from './pages/Advance';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Advance />} />
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
