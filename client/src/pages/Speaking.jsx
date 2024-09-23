import React, { useState } from 'react';
import SpeechRecorder from '../components/Skill/SpeechRecorder';
import ScoreDisplay from '../components/Skill/ScoreDisplay';
import './Speaking.css';

function Speaking() {
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

  const handleResult = (data) => {
    setScores(data);
  };

  return (
    <div className="App">
      <SpeechRecorder onResult={handleResult} />
      <ScoreDisplay scores={scores} />
    </div>
  );
}

export default Speaking;
