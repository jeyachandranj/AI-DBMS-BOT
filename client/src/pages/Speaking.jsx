import React, { useState } from 'react';
import SpeechRecorder from '../components/Skill/SpeechRecorder';
import './Speaking.css';

function Speaking() {
  return (
    <div className="speaking-container">
      <div className="recorder-container">
        <SpeechRecorder />
      </div>
    </div>
  );
}

export default Speaking;
