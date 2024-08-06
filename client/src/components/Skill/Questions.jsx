import React, { useState } from 'react';
import '../../pages/Reading.css';

const Questions = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.questions.length).fill(""));
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, index) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = e.target.value;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.questions.forEach((question, index) => {
      if (question.answer === selectedAnswers[index]) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="questions-container">
      <h2 className="questions-header">Questions</h2>
      {Array.isArray(questions.questions) && questions.questions.length > 0 ? (
        questions.questions.map((q, index) => (
          <div key={index} className="question-block">
            <p className="question-text"><strong>Q{index + 1}:</strong> {q.question}</p>
            <div className="options-container">
              {Object.keys(q.options).map((optionKey, i) => (
                <label key={i} className="option-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optionKey}
                    onChange={(e) => handleChange(e, index)}
                    checked={selectedAnswers[index] === optionKey}
                    className="option-input"
                  />
                  {q.options[optionKey]}
                </label>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No questions available.</p>
      )}
      <button onClick={handleSubmit} className="submit-button">Submit</button>

      {isModalOpen && (
        <div className="score-modal" style={{ display: 'flex' }}>
          <div className="score-modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h3>Your Score: {score} / {questions.questions.length}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
