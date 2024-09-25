
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import videos from '../components/Skill/videos.json';
import './Listening.css';
import Confetti from 'react-confetti'; 
import img from "../assets/tropy.jpg"

function Listening() {
  const [randomVideo, setRandomVideo] = useState(null);
  const [showQuestionPage, setShowQuestionPage] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [paragraph, setParagraph] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // New state for current question

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
      const response = await fetch('http://localhost:3000/listen-generate-content', {
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };
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
        <div className="center-container">
        <div className="question-page">
          <div className="questions-container">
            <h2 className="questions-header">Question {currentQuestionIndex + 1} of {questions.length}</h2>
            {questions && questions.length > 0 && (
              <div className="question-block">
                <p className="question-text"><strong>Q{currentQuestionIndex + 1}:</strong> {questions[currentQuestionIndex].question}</p>
                <div className="options-container">
                  {Object.keys(questions[currentQuestionIndex].options).map((optionKey, i) => (
                    <label key={i} className="option-label">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={optionKey}
                        onChange={(e) => handleChange(e, currentQuestionIndex)}
                        checked={selectedAnswers[currentQuestionIndex] === optionKey}
                        className="option-input"
                      />
                      {questions[currentQuestionIndex].options[optionKey]}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="nav-button1">
                Prev
              </button>
              <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="nav-button2">
                Next
              </button>
            </div>

            {currentQuestionIndex === questions.length - 1 && (
              <button onClick={handleSubmit} className="submit-button">Submit</button>
            )}

            {isModalOpen && (
      <div className="score-modal"> 
         <Confetti />
      
      <div className="score-modal-content">
      <div className="close-button" onClick={closeModal}>X</div>
      <img src={img} alt="Score Image" className="score-image" />
      <h3 className="score">Your Score: {score} / {questions.length}</h3>
      </div>
      </div>
            )}
          </div>
        </div>
      </div>)}
    </div>
  );
}

export default Listening;
