import React, { useState, useEffect, useRef } from "react";
import { useChatbot } from "./useChatbot";
import debounce from "lodash.debounce";
import SettingsDisplay from "./SettingsDisplay";
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
  }, [settings]);

  const [speechText, setSpeechText] = useState("");
  const [listening, setListening] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState([]);

  const recognition = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log("Your browser does not support speech recognition.");
    } else {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log("Speech to Text:", transcript);
        setSpeechText(transcript);
      };
      recognition.current.onerror = (event) => {
        console.log("Speech recognition error:", event.error);
      };
    }
  }, []);

  useEffect(() => { console.log("Updated speechText:", speechText); }, [speechText]);


  const debouncedSendMessage = debounce((message) => {
    if (!message) return;
    if (listening) {
      stopListening();
    }
    sendMessage(message);
  }, 500);

  const startListening = () => {
    setListening(true);
    recognition.current && recognition.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.current && recognition.current.stop();
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (listening && inputRef.current) {
      inputRef.current.focus();
    }
  }, [listening]);

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

  useEffect(() => {
    if (response.response) {
      const words = response.response.split(' ');
      const newChunks = [];
      for (let i = 0; i < words.length; i += 5) { // Group words into chunks of 3
        newChunks.push(words.slice(i, i + 5).join(' '));
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
            setChunks([]); // Clear chunks to hide the box after completion
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
        <div className="chatbotResponse" style={{border:"3px solid black",backgroundColor:"white",marginLeft:"220px", padding: "10px", fontSize: "20px", whiteSpace: "pre-wrap"}}>
          {chunks[currentChunkIndex]}
        </div>
      )}
      {isChatbotReady ? (
        <section className="chatbotInputContainer">
          <div className="chatbotInput" data-listening={listening}>
            <div className="chatbotInput_container">
              <form onSubmit={(e) => e.preventDefault()} className="inputForm">
                  <div className="microphoneIcon" onClick={toggleListening}>
                    <img src={mic} style={{ width: "100px", height: "100px", marginBottom: "50px" }} />
                  </div>
                  <input
                    value={speechText}
                    ref={inputRef}
                    onChange={(e) => setSpeechText(e.target.value)}
                    style={{ color: "black", fontSize: "30px" }}
                    placeholder="Type a message..."
                  />
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
