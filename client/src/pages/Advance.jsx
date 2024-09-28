import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import UserInput from "../components/UserInput";
import { useState } from "react";
import './Advance.css';
import logo from '../assets/loding.gif';

function App() {
  const [response, setResponse] = useState({
    response: "Hello, thank you for having me here today. I'm excited to learn more about this opportunity.",
    speechData: {
      audioFilePath: "",
      visemes: null,
    },
  });

  

  

  const [isChatbotReady, setIsChatbotReady] = useState(false);

  return (
    <div className="main-container" data-chatbot-ready={isChatbotReady}>
      {!isChatbotReady && (
        <div className="loading-overlay">
          <img src = {logo} alt="Loading..." className="loading-gif" />
        </div>
      )}
      <div className="canvas-wrapper">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }} className="canvas">
          <color attach="background" args={["#ececec"]} />
          <Experience response={response} />
        </Canvas>
        <UserInput setResponse={setResponse} isChatbotReady={isChatbotReady} setIsChatbotReady={setIsChatbotReady} response={response} />
      </div>
    </div>
  );
}

export default App;
