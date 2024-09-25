import React from 'react';
import '../../pages/Speaking.css';

function Speaking({ scores }) {
  console.log("Scores passed to Speaking component:", scores);

  return (
    <div className="App" style={{color:"black", width:"600px"}}>
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
