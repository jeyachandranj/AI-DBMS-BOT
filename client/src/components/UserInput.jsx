import React, { useState, useEffect, useRef } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useChatbot } from "./useChatbot";
import debounce from "lodash.debounce";
import SettingsDisplay from "./SettingsDisplay";
import '../pages/Advance.css';

const UserInput = ({ setResponse, isChatbotReady, setIsChatbotReady }) => {
	const urlParams = new URLSearchParams(window.location.search);
	let showSettings = urlParams.get("showSettings") || true;

	const [visible, setVisible] = useState(showSettings);
	const [settings, setSettings] = useState({
		job_title: urlParams.get("job_title") || "Software Engineer",
		company_name: urlParams.get("company_name") || "Google",
		interviewer_name: urlParams.get("interviewer_name") || "Jeyachandran J",
		link_to_resume: "https://jeyachandranj.github.io/resume/Resume.pdf",
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

	const { startListening, stopListening, updateSpeechConfig } = useSpeechRecognition(
		"en-US",
		"en-US-RogerNeural",
		speechText,
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
			console.log("stop listening");
			stopListening();
		} else {
			console.log("start listening");
			startListening();
		}
	};

	const inputRef = useRef(null);

	useEffect(() => {
		if (listening) {
			inputRef.current.focus();
		}
	}, [listening]);

	// When user presses enter, send message
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

	return (
		<div className="chatbotInputWrap">
			{isChatbotReady ? (
				<section className="chatbotInputContainer">
					<div className="chatbotInput" data-listening={listening}>
						<div className="chatbotInput_container">
							<form onSubmit={(e) => e.preventDefault()}>
								<input value={speechText} ref={inputRef} onChange={(e) => setSpeechText(e.target.value)} style={{color:"black",fontSize:"30px"}} placeholder="Type a message..." />
							</form>
							<div className="settingsButton" onClick={() => setVisible(true)}>
								<i className="fas fa-cog"></i>
							</div>
						</div>
					</div>
					<div className="chatbotSettings" data-visible={visible}>
						<SettingsDisplay settings={settings} setSettings={setSettings} visible={visible} setVisible={setVisible} />
					</div>
				</section>
			) : (
				<>
				</>
			)}
		</div>
	);
};

export default UserInput;