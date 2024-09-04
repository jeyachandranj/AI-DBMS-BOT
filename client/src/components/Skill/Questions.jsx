import React from 'react';
import '../../pages/Reading.css';

const Question = ({ question, selectedAnswer, onChange, onPrev, onNext, onSeeLater, currentIndex, totalQuestions }) => {
  return (
    <div className="question-container">
      <p className="question-text"><strong>Q{currentIndex + 1}:</strong> {question.question}</p>
      <div className="options-container">
        {Object.keys(question.options).map((optionKey, i) => (
          <label key={i} className="option-label">
            <input
              type="radio"
              name={`question-${currentIndex}`}
              value={optionKey}
              onChange={onChange}
              checked={selectedAnswer === optionKey}
              className="option-input"
            />
            {question.options[optionKey]}
          </label>
        ))}
      </div>
      <div className="question-navigation">
        <button onClick={onPrev} disabled={currentIndex === 0} className="nav-button">Previous</button>
        <button onClick={onSeeLater} className="nav-button">See Later</button>
        <button onClick={onNext} disabled={currentIndex === totalQuestions - 1} className="nav-button">Next</button>
      </div>
    </div>
  );
};

export default Question;
