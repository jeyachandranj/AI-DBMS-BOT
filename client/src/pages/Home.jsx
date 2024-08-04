import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


const HomePage = () => {
  return (
    <main className="homepage">
      <section className="main-banner">
        <h1>Master Your Interviews with AI</h1>
        <p>Practice live interviews tailored to your skill level.</p>
      </section>
      <section className="cards">
        <h2>Choose Your </h2>
        <div className="card beginner">
          <h3>SKILLS</h3>
          <p>Start with fundamental questions and build a strong foundation.</p>
          <Link to="/skills"><button>Start Practicing</button></Link>
        </div>
        <div className="card advanced">
          <h3>LIVE INTERVIEW</h3>
          <p>Utilize AI for live interview face-to-text conversion to enhance knowledge.</p>

          <Link to='/advance'><button>Start Interview</button></Link>
        </div>
      </section>

      <section className="extra-content">
        
      </section>
    </main>
  );
};  

export default HomePage;
