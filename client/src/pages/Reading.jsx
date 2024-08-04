import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paragraph from '../components/Skill/Para';
import Questions from '../components/Skill/Questions';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {showParagraph && <Paragraph text={paragraph} />}
      {showQuestions && <Questions questions={questions} />}
    </div>
  );
};

export default Reading;
