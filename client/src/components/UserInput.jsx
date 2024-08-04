import React, { useState, useEffect, useRef } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useChatbot } from "./useChatbot";
import debounce from "lodash.debounce";
import SettingsDisplay from "./SettingsDisplay";
import { FaMicrophone } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import mic from '../assets/mic.png';
import '../pages/Advance.css';

const UserInput = ({ setResponse, isChatbotReady, setIsChatbotReady, response }) => {
  const urlParams = new URLSearchParams(window.location.search);
  let showSettings = urlParams.get("showSettings") || true;

  const [visible, setVisible] = useState(showSettings);
  const [settings, setSettings] = useState({
    job_title: urlParams.get("job_title") || "Software Engineer",
    company_name: urlParams.get("company_name") || "Google",
    interviewer_name: urlParams.get("interviewer_name") || "Jeyachandran J",
    link_to_resume: "https://jeyachandranj.github.io/resume/Resume.pdf",
    resume_title: urlParams.get("resume_title") || 'all'
  });

  const { initChatbot, sendMessage, error } = useChatbot(setResponse, settings, setIsChatbotReady);

  useEffect(() => {
    initChatbot().then((ready) => {
      setIsChatbotReady(ready);
    });

    updateSpeechConfig("en-US", "en-US-RogerNeural");
  }, [settings]);

  const [speechText, setSpeechText] = useState("");
  const [listening, setListening] = useState(false);
  const [isClicked, setIsClicked] = useState(false);


  const { startListening, stopListening, updateSpeechConfig } = useSpeechRecognition(
    "en-US",
    "en-US-RogerNeural",
    speechText,
    (text) => {
      console.log("Speech to Text:", text);
      setSpeechText(text);
    },
    setSpeechText,
    setListening
  );

  const debouncedSendMessage = debounce((message) => {
    if (!message) return;
    if (listening) {
      stopListening();
    }
    sendMessage(message);
  }, 500);

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (listening && inputRef.current) {
      inputRef.current.focus();
    }
  }, [listening, isClicked]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (speechText !== "") {
          debouncedSendMessage(speechText);
          setSpeechText("");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [speechText]);


  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    if (response.response) {
      const words = response.response.split(' ');
      const newChunks = [];
      for (let i = 0; i < words.length; i += 7) {
        newChunks.push(words.slice(i, i + 7).join(' '));
      }
      setChunks(newChunks);
      setCurrentChunkIndex(0);
    }
  }, [response.response]);

  useEffect(() => {
    if (chunks.length > 0) {
      const timer = setInterval(() => {
        setCurrentChunkIndex((prevIndex) => {
          if (prevIndex + 1 < chunks.length) {
            return prevIndex + 1;
          } else {
            clearInterval(timer);
            return prevIndex;
          }
        });
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [chunks]);

  return (
    <div className="chatbotInputWrap">
      {chunks.length > 0 && (
        <div className="chatbotResponse">
          {chunks[currentChunkIndex]}
        </div>
      )}
      {isChatbotReady ? (
        <section className="chatbotInputContainer">
          <div>
            <div className="icons-container">
              <button
                className={`btn-class-name ${isClicked ? 'chat-active' : 'microphone-active'}`}
                onClick={handleClick}
              >
                <span className="back"></span>
                <span className="front">
                  {isClicked ? <BsChatTextFill /> : <FaMicrophone />}
                </span>
              </button>
            </div>
          </div>
          <div className="chatbotInput" data-listening={listening}>
            <div className="chatbotInput_container">
              <form onSubmit={(e) => e.preventDefault()} className="inputForm">
                {isClicked ? (
                  <div className="microphoneIcon" onClick={toggleListening}>
                    <img src={mic} style={{ width: "100px", height: "100px", marginBottom: "50px" }} />
                  </div>
                ) : (
                  <input
                    value={speechText}
                    ref={inputRef}
                    onChange={(e) => setSpeechText(e.target.value)}
                    style={{ color: "black", fontSize: "30px" }}
                    placeholder="Type a message..."
                  />
                )}
                <div className="settingsButton" onClick={() => setVisible(true)}>
                  <i className="fas fa-cog"></i>
                </div>
              </form>
            </div>
          </div>
          <div className="chatbotSettings" data-visible={visible}>
            <SettingsDisplay settings={settings} setSettings={setSettings} visible={visible} setVisible={setVisible} />
          </div>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserInput;
