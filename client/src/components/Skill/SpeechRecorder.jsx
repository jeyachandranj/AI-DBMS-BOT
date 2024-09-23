import React, { useState, useEffect } from 'react';
import axios from 'axios';
import questions from './question.json'; 
import '../../pages/Speaking.css'

const SpeechRecorder = ({ onResult }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [topic, setTopic] = useState('');
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
        onResult(response.data);
      })
      .catch(error => {
        console.error('Error sending text to backend:', error);
      });
  };

  return (
    <div className="speech-recorder">
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
        <button onClick={stopListening} className={`mic-button stop-button`} disabled={!isListening}>Stop</button>
      </div>
      <p className="status-text">{isListening ? 'Recording...' : '0s'}</p>
      <button onClick={checkMySpeech} className="check-button">Check My Speech</button>
    </div>
  );
};

export default SpeechRecorder;
