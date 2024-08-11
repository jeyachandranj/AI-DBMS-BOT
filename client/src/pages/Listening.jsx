import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import videos from '../components/Skill/videos.json';
import Questions from '../components/Skill/Questions';

function Listening() {
  const [randomVideo, setRandomVideo] = useState(null);
  const [showQuestionPage, setShowQuestionPage] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [paragraph, setParagraph] = useState('');

  useEffect(() => {
    const selectRandomVideo = () => {
      const randomIndex = Math.floor(Math.random() * videos.length);
      setRandomVideo(videos[randomIndex]);
    };

    selectRandomVideo();

    const timer = setTimeout(() => {
      setShowQuestionPage(true);
      if (randomVideo) {
        fetchParagraphAndGenerateQuestions(randomVideo.subtitle);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [randomVideo]); 

  const fetchParagraphAndGenerateQuestions = async (subtitle) => {
    try {
      const response = await fetch('http://localhost:3000/listen-generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paragraph: subtitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setParagraph(data.paragraph);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="App">
      {!showQuestionPage ? (
        <>
          <h1>Listening Comprehension</h1>
          {randomVideo && (
            <div className="player-wrapper" style={{ marginBottom: '20px' }}>
              <ReactPlayer
                className="react-player"
                url={randomVideo.url}
                controls={true}
                config={{
                  youtube: {
                    playerVars: { modestbranding: 1, rel: 0, showinfo: 0 },
                  },
                }}
                width="100%"
                height="700px"
              />
            </div>
          )}
        </>
      ) : (
        <div className="question-page">
            <Questions questions={questions}/>
        </div>
      )}
    </div>
  );
}

export default Listening;
