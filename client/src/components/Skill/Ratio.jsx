import React from "react";
import styled from "styled-components";
import './Ratio.css';
const Radio = ({ onDifficultyChange }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    onDifficultyChange(value);
  };

  return (
    <div>
      <div className="custom-radio-group">
        <label className="custom-radio-container">
          <input 
            type="radio" 
            name="custom-radio" 
            value="Easy" 
            onChange={handleChange} 
          />
          <span className="custom-radio-checkmark" />
          Easy
        </label>
        <label className="custom-radio-container">
          <input 
            type="radio" 
            name="custom-radio" 
            value="Normal" 
            onChange={handleChange} 
            defaultChecked 
          />
          <span className="custom-radio-checkmark" />
          Normal
        </label>
        <label className="custom-radio-container">
          <input 
            type="radio" 
            name="custom-radio" 
            value="Hard" 
            onChange={handleChange} 
          />
          <span className="custom-radio-checkmark" />
          Hard
        </label>
      </div>
   
    </div>
  );
};
export default Radio;