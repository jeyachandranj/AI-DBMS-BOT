import React, { useState } from 'react';
import Card from '../components/Skill/card.jsx';
import { useNavigate } from 'react-router-dom';
import i1 from '../assets/read.png';
import i2 from '../assets/write.png';
import i3 from '../assets/listen.png';
import i4 from '../assets/speak.png';
import './HomeSkills.css';
import Radio from '../components/Skill/Ratio.jsx';  
import styled from 'styled-components';

function HomeSkills() {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
  const navigate = useNavigate();

  // Handle when a skill card is clicked
  const handleCardClick = (skill) => {
    console.log('Selected skill:', skill);  // Debug log
    setSelectedSkill(skill);
    setIsModalOpen(true);  // Open the modal when a skill is clicked
  };

  // Handle difficulty change and navigate to next page
  const handleDifficultyChange = (difficulty) => {
    console.log('Selected difficulty:', difficulty);  // Debug log
    setIsModalOpen(false);  // Close modal after selection
    // navigate(`/${selectedSkill}?difficulty=${difficulty}`);
    navigate(`/${selectedSkill}`);

  };

  // Skill descriptions for display
  const skillDescriptions = {
    listen: 'Enhance your listening skills with exercises designed to improve comprehension of accents, tones, and contexts.',
    speak: 'Build confidence in speaking through guided tasks that help you articulate your thoughts clearly in both casual and formal settings.',
    read: 'Boost your reading comprehension and vocabulary with a diverse selection of texts that challenge your understanding and reveal complex ideas.',
    write: 'Enhance your writing skills with practical exercises that guide you through brainstorming, drafting, and editing to effectively communicate your ideas.'
  };

  return (
    <>
      {/* Display the skill cards */}
      <div className='skills-container'>
        {Object.keys(skillDescriptions).map(skill => (
          <div
            key={skill}
            className='skill-card'
            onClick={() => handleCardClick(skill)}
          >
            <Card 
              img={{ listen: i3, speak: i4, read: i1, write: i2 }[skill]} 
              name={skill.charAt(0).toUpperCase() + skill.slice(1)} 
              description={skillDescriptions[skill]}
            />
          </div>
        ))}
      </div>
      {isModalOpen && (
        <StyledModal>
          <div class = "modal-full">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Select Difficulty for {selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1)}</h2>
            <Radio onDifficultyChange={handleDifficultyChange} />
            </div>
            </div>
        </StyledModal>
      )}
    </>
  );
}

// Styled component for the modal
const StyledModal = styled.div`
  position: fixed;
  z-index: 1000;
  left: 10;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    background-color: #fff;
    padding: 90px;
    border-radius: 10px;
    width: 500px;
    text-align: center;
    position: relative;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
  }

  h2 {
    margin-bottom: 20px;
  }
`;

export default HomeSkills;