import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import videos from '../components/Skill/videos.json';

function Listening() {
  const [randomVideo, setRandomVideo] = useState(null);
  const [showQuestionPage, setShowQuestionPage] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [paragraph, setParagraph] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, index) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = e.target.value;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((question, index) => {
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

  const fetchParagraphAndGenerateQuestions = async (subtitle) => {
    try {
      const response = await fetch('https://ai-interview-71dz.onrender.com/listen-generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paragraph: subtitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setParagraph(data.paragraph);
      setQuestions(data.questions.questions);
      setShowQuestionPage(true);  // Move this here to ensure it's called after questions are set
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    const selectRandomVideo = () => {
      const randomIndex = Math.floor(Math.random() * videos.length);
      setRandomVideo(videos[randomIndex]);
    };

    selectRandomVideo();
  }, []);

  useEffect(() => {
    if (randomVideo) {
      const timer = setTimeout(() => {
        fetchParagraphAndGenerateQuestions(randomVideo.subtitle);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [randomVideo]);

  return (
    <div className="App">
      {!showQuestionPage ? (
        <>
          <h1>Listening Comprehension</h1>
          {randomVideo && (
            <div className="player-wrapper" style={{ marginBottom: '20px' }}>
              <ReactPlayer
                className="react-player"
                url={randomVideo.url}
                controls={true}
                config={{
                  youtube: {
                    playerVars: { modestbranding: 1, rel: 0, showinfo: 0 },
                  },
                }}
                width="100%"
                height="700px"
              />
            </div>
          )}
        </>
      ) : (
        <div className="question-page">
            <div className="questions-container">
              <h2 className="questions-header">Questions</h2>
              {Array.isArray(questions) && questions.length > 0 ? (
                questions.map((q, index) => (
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
                    <h3>Your Score: {score} / {questions.length}</h3>
                  </div>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
}

export default Listening;
