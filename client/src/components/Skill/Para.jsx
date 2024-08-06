import React from 'react';
import '../../pages/Reading.css';

const Para = ({ text }) => {
  return (
    <div className="reading-body">
      <div className="reading-container">
        <h1 className="reading-header">Reading Comprehension</h1>
        <p className="reading-paragraph">{text}</p>
      </div>
    </div>
  );
};

export default Para;
