import React, { useState } from 'react';
import SpeechRecorder from './SpeechRecorder';
import '../../pages/Speaking.css';

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
    <div className="App" style={{color:"black",marginLeft:"300px"}}>
      
      <div className="ScoreDisplay">
        <h3>Overall Band Score</h3>
        <div className="ScoreItem">
          <span>Vocabulary Complexity</span>
          <span className={`ScoreValue ${scores.vocabularyComplexity === 'N/A' ? 'NA' : ''}`}>
            {scores.vocabularyComplexity}
          </span>
        </div>
        <div className="ScoreItem">
          <span>Vocabulary Repetition</span>
          <span className={`ScoreValue ${scores.vocabularyRepetition === 'N/A' ? 'NA' : ''}`}>
            {scores.vocabularyRepetition}
          </span>
        </div>
        <div className="ScoreItem">
          <span>Pronunciation</span>
          <span className="ScoreValue">{scores.pronunciation}</span>
        </div>
        <div className="ScoreItem">
          <span>Task Response</span>
          <span className="ScoreValue">{scores.taskResponse}</span>
        </div>
        <div className="ScoreItem">
          <span>Fluency & Coherence</span>
          <span className="ScoreValue">{scores.fluency}</span>
        </div>
        <div className="ScoreItem">
          <span>Lexical Resource</span>
          <span className="ScoreValue">{scores.lexical}</span>
        </div>
        <div className="ScoreItem">
          <span>Grammatical Range & Accuracy</span>
          <span className="ScoreValue">{scores.grammar}</span>
        </div>
      </div>
    </div>
  );
}

export default Speaking;
