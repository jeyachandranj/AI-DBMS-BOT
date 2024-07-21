import { useState, useEffect } from "react";

export const speech = (lang, voice, speechText, setSpeechText, setListening) => {
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Web Speech API is not supported in this browser.");
      return;
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.lang = lang;
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechText(transcript);
      setListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error(event.error);
      setListening(false);
    };

    recognitionInstance.onend = () => {
      setListening(false);
    };

    setRecognition(recognitionInstance);
  }, [lang, setListening, setSpeechText]);

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  const updateSpeechConfig = (newLang, newVoice) => {
    if (recognition) {
      recognition.lang = newLang;
    }
  };

  return { startListening, stopListening, updateSpeechConfig };
};
