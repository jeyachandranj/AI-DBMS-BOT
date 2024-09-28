import React, { useState, useEffect, useRef } from "react";
import { useChatbot } from "./useChatbot";
import debounce from "lodash.debounce";
import SettingsDisplay from "./SettingsDisplay";
import mic from '../assets/mic.png';
import '../pages/Advance.css';
import { jsPDF } from "jspdf";

const UserInput = ({ setResponse, isChatbotReady, setIsChatbotReady, response }) => {
  const urlParams = new URLSearchParams(window.location.search);
  let showSettings = urlParams.get("showSettings") || true;

  const interviewStartTime = localStorage.getItem('interviewStartTime');
  const name = localStorage.getItem('name');

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
  const [timer, setTimer] = useState(0);
  const recognition = useRef(null);
  const inputRef = useRef(null);
  const [currentStage, setCurrentStage] = useState(1); // Track current stage
  const [completedStages, setCompletedStages] = useState(0); // Track completed stages
  const [popupMessage, setPopupMessage] = useState(""); // Popup message for pass/fail
  const [popupVisible, setPopupVisible] = useState(false);


  useEffect(() => {
    initChatbot().then((ready) => {
      setIsChatbotReady(ready);
    });
  }, [settings]);

  useEffect(() => {
    const apiInterval = setInterval(() => {
      callStageAPI();
    }, 300000); // 300000 ms = 5 minutes

    return () => clearInterval(apiInterval); // Cleanup on unmount
  }, []);

  // Function to call the API to check the current stage
  const callStageAPI = async () => {
    try {
      const currentTime = Date.now();
      const interviewDuration = currentTime-interviewStartTime;
      console.log("currentTime",currentTime)
      console.log("inter startTime",interviewStartTime);
      const result = await fetch(`http://localhost:3000/api/evaluateInterview?name=${name}&interviewDuration=${interviewDuration}`);
      const data = await result.json();

      console.log("api data",data);

      if (data) {
        setCurrentStage(data.currentStage);
        setCompletedStages(data.completedStage);

        if (data.status === "pass") {
          setPopupMessage("Congratulations! You passed the current stage.");
          setPopupVisible(true);
        } else if (data.status === "fail") {
          setPopupMessage("Sorry, you failed the current stage.");
          setPopupVisible(true);
        }
        setTimeout(() => {
          setPopupVisible(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error fetching stage data:", error);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupMessage(""); 
  };

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

  useEffect(() => {
    let interval = null;
    if (!visible && timer < 30 * 60) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [visible, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };




  const generatePDF = () => {
    const score = 34;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Test Score Report", 105, 20, { align: "center" });

    doc.setLineWidth(0.5);
    doc.rect(10, 25, 190, 250); // Box around the entire report

    doc.setFontSize(12);
    let yPos = 30;
    doc.text("Congratulations!! You have successfully completed your interview.", 20, yPos, { maxWidth: 170 });

    yPos += 10;
    doc.text(`Your Score: ${score} / 100`, 20, yPos);

    yPos += 10;
    doc.text("This is a test PDF generated after submitting the test.", 20, yPos, { maxWidth: 170 });

    // Adjusted to prevent overflow
    const longText = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";

    yPos += 10;
    doc.text(longText, 20, yPos, { maxWidth: 170 });

    yPos += 60; // Adjust spacing after the long text
    doc.text("We appreciate your effort.", 20, yPos);

    yPos += 20;
    doc.setFontSize(14);
    doc.text("Skill Report", 20, yPos);

    yPos += 10;
    doc.setFontSize(12);
    doc.text("Skill", 30, yPos);
    doc.text("Score", 120, yPos);

    yPos += 5;
    const rowHeight = 10;
    const tableWidth = 160;

    // Define skill data
    const skills = [
      { name: "Skills", score: "8/10" },
      { name: "Performance", score: "9/10" },
      { name: "Experience", score: "7/10" },
      { name: "Projects", score: "9/10" }
    ];

    // Draw table borders dynamically and fill in skill data
    skills.forEach((skill, index) => {
      const currentY = yPos + (index + 1) * rowHeight;
      doc.rect(30, currentY, tableWidth, rowHeight); // Row border
      doc.text(skill.name, 32, currentY + 7);
      doc.text(skill.score, 122, currentY + 7);
    });

    // Final section for long text after table
    const finalTextStartY = yPos + (skills.length + 1) * rowHeight + 10;
    doc.text(longText, 20, finalTextStartY, { maxWidth: 170 });

    const appreciationTextY = finalTextStartY + 50;
    doc.text("We appreciate your effort.", 20, appreciationTextY);

    // Footer text
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Generated by Listening Shine Logistics", 105, 285, { align: "center" });

    // Save PDF
    doc.save("test_score_3.pdf");
  };

  return (
    <div className="chatbotInputWrap" style={{ width: "300px" }}>
       <div className="stage-info" style={{ position: "absolute", top: "10px", right: "10px" }}>
        <p>Current Stage: {currentStage}</p>
        <p>Completed Stages: {completedStages}</p>
      </div>

      {popupVisible && (
        <div className="popup" style={{ color: "black" }}>
          <div className="popup-content">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}

      {chunks.length > 0 && (
        <div
          className="chatbotResponse"
          style={{
            border: "3px solid black",
            backgroundColor: "white",
            marginLeft: "390px",
            padding: "10px",
            fontSize: "20px",
            whiteSpace: "pre-wrap",
          }}
        >
          {chunks[currentChunkIndex]}
        </div>
      )}
      {isChatbotReady ? (
        <section className="chatbotInputContainer">
          <div className="chatbotInput" data-listening={listening}>
            <div className="chatbotInput_container">
              <form onSubmit={(e) => e.preventDefault()} className="inputForm">
                <div className="microphoneIcon" onClick={toggleListening}>
                  <img
                    src={mic}
                    alt="Mic"
                    style={{
                      width: "100px",
                      height: "100px",
                      marginBottom: "50px",
                      marginLeft: "200px",
                    }}
                  />
                </div>
                <input
                  value={speechText}
                  ref={inputRef}
                  onChange={(e) => setSpeechText(e.target.value)}
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    fontSize: "30px",
                    marginLeft: "550px",
                    width: "900px",
                  }}
                  placeholder="Type a message..."
                />
                <div
                  className="settingsButton"
                  onClick={() => setVisible(true)}
                >
                  <i className="fas fa-cog"></i>
                </div>
              </form>
            </div>
          </div>

          {!visible && (
            <div className="timerDisplay">
              <p className="timerText">{formatTime(timer)}</p>
            </div>
          )}



          <div className="chatbotSettings" data-visible={visible}>
            <SettingsDisplay
              settings={settings}
              setSettings={setSettings}
              visible={visible}
              setVisible={setVisible}
            />
          </div>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserInput;