
import React, { useState } from "react";
import './Ratio.css';

const Radio = ({ onDifficultyChange }) => {
  const [selectedOption, setSelectedOption] = useState("easy");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleConfirm = () => {
    onDifficultyChange(selectedOption);
  };

  return (
    <div className="radio-input">
      <div className="glass">
        <div className="glass-inner"></div>
      </div>
      <div className="selector">
        <div className="choice">
          <div>
            <input
              className="choice-circle"
              value="easy"
              name="difficulty-selector"
              id="easy"
              checked={selectedOption === "easy"}
              onChange={handleChange}
              type="radio"
            />
            <div className="ball"></div>
          </div>
          <label className="choice-name" htmlFor="easy">Easy</label>
        </div>
        <div className="choice">
          <div>
            <input
              className="choice-circle"
              value="medium"
              name="difficulty-selector"
              id="medium"
              checked={selectedOption === "medium"}
              onChange={handleChange}
              type="radio"
            />
            <div className="ball"></div>
          </div>
          <label className="choice-name" htmlFor="medium">Medium</label>
        </div>
        <div className="choice">
          <div>
            <input
              className="choice-circle"
              value="hard"
              name="difficulty-selector"
              id="hard"
              checked={selectedOption === "hard"}
              onChange={handleChange}
              type="radio"
            />
            <div className="ball"></div>
          </div>
          <label className="choice-name" htmlFor="hard">Hard</label>
        </div>
      </div>
      <button className="confirm-button" onClick={handleConfirm}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    ></path>
  </svg>
      </button>
    </div>
  );
};

export default Radio;
