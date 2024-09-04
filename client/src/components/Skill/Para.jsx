import React from 'react';
import '../../pages/Reading.css';

const Para = ({ text, onNext }) => {
  return (
    <div className="reading-body">
      <div className="reading-container">
        <h1 className="reading-header">Reading Comprehension</h1>
        <p className="reading-paragraph">{text}</p>
        <button onClick={onNext} className="next-button">Next</button>
      </div>
    </div>
  );
};

export default Para;
