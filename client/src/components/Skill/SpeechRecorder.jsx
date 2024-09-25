import React, { useState, useEffect } from 'react';
import axios from 'axios';
import questions from './question.json'; 
import '../../pages/Speaking.css';
import ScoreDisplay from './ScoreDisplay';

const SpeechRecorder = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [topic, setTopic] = useState('');
  const [scores, setScores] = useState({
    overall: 0,
    vocabularyComplexity: 'N/A',
    vocabularyRepetition: 'N/A',
    pronunciation: 0,
    taskResponse: 0,
    fluency: 0,
    lexical: 0,
    grammar: 0,
  });

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  useEffect(() => {
    fetchRandomQuestion();

    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      if (result.isFinal) {
        setTranscript(prev => prev + ' ' + result[0].transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

  }, [recognition]);

  const fetchRandomQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setTopic(randomQuestion.topic);
  };


  const startListening = () => {
    if (!recognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    setTranscript(''); // Clear previous transcript
    recognition.start();
  };

  const stopListening = () => {
    recognition.stop();
  };

  const checkMySpeech = () => {
    axios.post('http://localhost:3000/analyze', { text: transcript, topic: topic })
      .then(response => {
        console.log('API response:', response.data); // Log the entire response for debugging
        
        // Safely update state with score values
        if (response.data) {
          setScores({
            overall: response.data.overallScore?.score || 0,
            vocabularyComplexity: response.data.vocabularyComplexity?.score || 'N/A',
            vocabularyRepetition: response.data.vocabularyRepetition?.score || 'N/A',
            pronunciation: response.data.pronunciation?.score || 0,
            taskResponse: response.data.taskResponse?.score || 0,
            fluency: response.data.fluency?.score || 0,
            lexical: response.data.lexicalResource?.score || 0,
            grammar: response.data.grammaticalRangeAccuracy?.score || 0,
          });
          console.log("Score",scores);
        } else {
          console.error('Invalid response format: ', response.data);
        }
      })
      .catch(error => {
        console.error('Error sending text to backend:', error);
      });
  };
  
  
  
  
  
  const handleFeedback = () => {
    alert("Feedback button clicked!");
  };

  return (
    <>
      <div className="speech-recorder" style={{ marginLeft: "150px" }}>
        <div className="input-group">
          <label className="topic-label">Topic:</label>
          <p className="topic-display">{topic}</p>
        </div>
        <div className="input-group">
          <label className="answer-label">Answer</label>
          <textarea
            value={transcript}
            placeholder="Click the mic icon to start recording..."
            readOnly
            className="answer-textarea"
          />
        </div>
        <div className="controls">
          <button onClick={startListening} className={`mic-button ${isListening ? 'active' : ''}`} disabled={isListening}>
            <i className="fa fa-microphone"></i>
            Start
          </button>
          <button onClick={stopListening} className="mic-button stop-button" disabled={!isListening}>Stop</button>
        </div>
        <p className="status-text">{isListening ? 'Recording...' : '0s'}</p>
        <button onClick={checkMySpeech} className="check-button">Check My Speech</button>
        <button onClick={handleFeedback} className="feedback-button">Feedback</button>
      </div>
      <div className="score-container">
        <ScoreDisplay scores={scores} />
      </div>
    </>
  );
};

export default SpeechRecorder;
