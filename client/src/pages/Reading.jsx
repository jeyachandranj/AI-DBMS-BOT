import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paragraph from '../components/Skill/Para';
import Questions from '../components/Skill/Questions';
import '../pages/Reading.css';
import logo from '../assets/loding.gif';
import backgroundSvg from '../assets/backGround.svg'; // Import the SVG
import Footer from '../components/Footer';

const Reading = () => {
  const [loading, setLoading] = useState(true);
  const [showParagraph, setShowParagraph] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [paragraph, setParagraph] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.post('http://localhost:3000/generate-content');
        const data = response.data;

        setParagraph(data.paragraph);
        setQuestions(data.questions);

        setLoading(false);
        setShowParagraph(true);

        setTimeout(() => {
          setShowParagraph(false);
          setShowQuestions(true);
        }, 12000);
      } catch (error) {
        console.error("Error fetching data from backend", error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className={loading ? 'page-center' : 'reading-background'}>
      {loading ? (
        <img src={logo} alt="Loading" className="loading-img" />
      ) : (
        <>
          {showParagraph && <Paragraph text={paragraph} />}
          {showQuestions && <Questions questions={questions} />}
        </>
      )}
    </div>
  );
};

export default Reading;
