import React, { useState } from 'react';

const Questions = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.questions.length).fill(""));
  const [score, setScore] = useState(0);

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
  };

  return (
    <div>
      <h2>Questions</h2>
      {Array.isArray(questions.questions) && questions.questions.length > 0 ? (
        questions.questions.map((q, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <p><strong>Q{index + 1}:</strong> {q.question}</p>
            <div>
              {Object.keys(q.options).map((optionKey, i) => (
                <div key={i} style={{ marginBottom: '5px' }}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={optionKey}
                      onChange={(e) => handleChange(e, index)}
                      checked={selectedAnswers[index] === optionKey}
                    />
                    {q.options[optionKey]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No questions available.</p>
      )}
      <button onClick={handleSubmit}>Submit</button>
      {score !== null && <h3>Your Score: {score} / {questions.questions.length}</h3>}
    </div>
  );
};

export default Questions;
