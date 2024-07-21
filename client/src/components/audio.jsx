import React, { useRef } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
        console.log("a",audioRef.current);
      audioRef.current.play()
        .then(() => {
          console.log('Audio played successfully');
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  };

  return (
    <div>
      <audio ref={audioRef} controls>
        <source src="/temp/audio/2jyeb.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      <button onClick={playAudio}>Play Audio</button>
    </div>
  );
};

export default AudioPlayer;
