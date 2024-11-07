const sdk = require("microsoft-cognitiveservices-speech-sdk");
const dotenv = require("dotenv");
const path = require("path");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const fs = require("fs");
const request = require("request");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

mongoose.connect("mongodb://localhost:27017/live-interview")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const chatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_msg: { type: String, required: true },
    ai: { type: String, required: true },
});

const Chat = mongoose.model("Chat", chatSchema);


class Chatbot {
    constructor(public_path) {
        dotenv.config();
        this.socket_id = null;
        this.groq = new Groq({
            apiKey: "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",
        });

        if (public_path) {
            public_path = 'public';
        }

        this.groqHistory = [];
        this.messages = [];

        this.speechConfig = sdk.SpeechConfig.fromSubscription('093a6e33b5d546e3a622ccfc3cecf337', 'eastus');

        this.publicDir = path.join(process.cwd(), public_path);

        if (!fs.existsSync(this.publicDir + "/temp")) {
            fs.mkdirSync(this.publicDir + "/temp");
        }

        if (!fs.existsSync(this.publicDir + "/temp/audio")) {
            fs.mkdirSync(this.publicDir + "/temp/audio");
        }

        if (!fs.existsSync(this.publicDir + "/temp/chats")) {
            fs.mkdirSync(this.publicDir + "/temp/chats");
        }
    }

    async initialize( settings,round,name, socket_id) {
        this.socket_id = socket_id;

        this.speechConfig.speechSynthesisVoiceName = "en-US-RogerNeural";
        this.speechConfig.speechRecognitionLanguage = "en-US";
        this.audioFilePaths = [];

        this.speechAudioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        this.speechRecognizer = new sdk.SpeechRecognizer(this.speechConfig, this.speechAudioConfig);

        this.groqHistory = [];
        this.messages = [];
        let ai_content = `You are a hiring officer conducting a technical round of a job interview. Follow these rules: 
        1) Never reveal that you are an AI.
        2) Focus on questions related to Database Management Systems (DBMS), including SQL queries, normalization, and theoretical concepts.
        3) Only ask questions—do not provide answers.
        4) When the interviewee responds, evaluate whether the answer is correct or incorrect and provide minimal feedback before moving to the next question.
        5) Avoid asking more than two follow-up questions on any topic before shifting to a new question.
        6) Do not repeat questions.
        7) Keep the tone professional and concise, and avoid lengthy explanations.
        8) Record the interviewee’s performance and rate them if they inquire about it.
        
        From now on, answer in English and never mention that you are an AI. Begin the interview with DBMS-related questions, assessing knowledge of SQL, database design principles, and related concepts based on the interviewee’s resume.
        Here is the resume text to help you tailor your questions: `;
            

        this.messages.push({
            role: "system",
            content: ai_content,
        });

        for (const [input_text, completion_text] of this.groqHistory) {
            this.messages.push({
                role: "user",
                content: input_text,
            });
            this.messages.push({
                role: "assistant",
                content: completion_text,
            });
        }
    }
    

    async chat(userInput, duration, interviewStartTime, name) {
        this.messages.push({
            role: "user",
            content: userInput,
        });        


        const lastMessage = await Chat.findOne().sort({ createdAt: -1 }).lean();  

        let previousUserMsg = '';  
        let previousAiResponse = '';  

        if (lastMessage) {  
            previousUserMsg = lastMessage.user_msg;  
            previousAiResponse = lastMessage.ai;
        }  


        const completion = await this.groq.chat.completions.create({
            messages: this.messages,
            model: "llama3-8b-8192",
        });
 


        if (completion.choices && completion.choices[0] && completion.choices[0].message) {
            const aiResponse = completion.choices[0].message.content;



                // const aiMessage = completion.choices[0].message.content.trim();
                // const parsedResponse = JSON.parse(aiMessage);
                // console.log("response",parsedResponse)
                // const { aiResponse, score, section } = parsedResponse;

                await Chat.create({
                    name: "jeyachandran",
                    user_msg: userInput,
                    ai: aiResponse,
                });

                // Store the assistant's response for the conversation history
                this.messages.push({
                    role: "assistant",
                    content: aiResponse,
                });

                await this.exportChat();

                return aiResponse;

           
        } else {
            console.log("Invalid completion format:", completion);
            throw new Error("Invalid completion format");
        }

    }


    async exportChat() {
        console.log("Exporting chat...");
        const chat = [];
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].role == "user" || this.messages[i].role == "assistant") {
                chat.push({
                    role: this.messages[i].role,
                    content: this.messages[i].content,
                    audio: this.audioFilePaths[i],
                });
            }
        }
        const chat_path = path.join(this.publicDir, "temp/chats", `${this.socket_id}.json`);
        console.log(`Chat path: ${chat_path}`);

        let data = JSON.stringify(chat);

        console.log(`Writing to file: ${chat_path}`);
        await fs.writeFile(chat_path, data, (err) => {
            if (err) throw err;
            console.log("Chat saved to file.");
        });

        return chat_path;
    }


    async textToSpeech(text) {
        let visemes = [];

        const fileName = `${Math.random().toString(36).substring(7)}.wav`;
        const audioFilePath = path.join(__dirname, '..', 'client/public/temp', 'audio', fileName);
        console.log("path", audioFilePath);

        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFilePath);

        const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);

        synthesizer.visemeReceived = (s, e) => {
            visemes.push({ visemeId: e.visemeId, audioOffset: e.audioOffset / 10000 });
        };

        const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${this.speechConfig.speechSynthesisVoiceName}">${text}</voice></speak>`;

        await new Promise((resolve, reject) => {
            synthesizer.speakSsmlAsync(ssml, (result) => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    resolve();
                } else {
                    reject(result);
                }
            });
        });

        //store start time in db

        synthesizer.close();

        return { audioFilePath: audioFilePath, visemes: visemes };
    }

    async speechToText() {
        return new Promise((resolve, reject) => {
            try {
                console.log("[SYSTEM]: Speak into your microphone.");

                let text = "";
                this.speechRecognizer.recognized = (s, e) => {
                    try {
                        const res = e.result;
                        console.log(`recognized: ${res.text}`);
                    } catch (error) {
                        console.log(error);
                    }
                };

                this.speechRecognizer.sessionStarted = (s, e) => {
                    console.log(`SESSION STARTED: ${e.sessionId}`);
                };

                console.log("Starting recognition...");
                try {
                    this.speechRecognizer.recognizeOnceAsync(
                        (result) => {
                            console.log(`RECOGNIZED: Text=${result.text}`);
                            text = result.text;
                            resolve(text);
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                } catch (err) {
                    console.log(err);
                }

                process.stdin.on("keypress", (str, key) => {
                    if (key.name === "space") {
                        stopRecognition();
                    }
                });

                const stopRecognition = async () => {
                    try {
                        console.log("Stopping recognition...");
                        this.speechRecognizer.stopContinuousRecognitionAsync();
                        resolve(text);
                    } catch (error) {
                        console.log(error);
                    }
                };
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    async close() {
        console.log("Closing chatbot...");
        this.speechRecognizer.close();

        for (let i = 0; i < this.audioFilePaths.length; i++) {
            fs.unlinkSync(this.audioFilePaths[i]);
        }
    }
}

module.exports = Chatbot;
