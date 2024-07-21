const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { createServer } = require("http");
const Chatbot = require("./chatEngine.js");
const process = require("process");
const cors = require('cors')
dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const chatbot = new Chatbot("public" === "public");

app.use(express.static("dist"));

io.on("connection", (socket) => {
    console.log(`CONNECTED ${socket.id}`);

    socket.on("disconnect", (reason) => {
        console.log(`DISCONNECTED ${socket.id}: ${reason}`);
    });

    socket.on("init", (settings) => {
        try {
            chatbot.initialize(settings, socket.id);
            socket.emit("responseInit", true);
            console.log(`INITIALIZED ${socket.id}`);
        } catch (err) {
            console.log(err);
            socket.emit("responseInit", false);
            console.log(`INIT FAILED ${socket.id}`);
        }
    });

    socket.on("message", async (data) => {
        try {
            console.log("Received data:", data);
    
            if (!data || typeof data.question !== "string") {
                throw new TypeError("The 'question' property must be a string.");
            }
    
            console.log("Processing question:", data.question);
            const response = await chatbot.chat(data.question);
            const speechData = await chatbot.textToSpeech(response);
    
            console.log(`RESPONSE (${socket.id}): ${response}`);
            console.log(`AUDIO (${socket.id}): ${speechData.audioFilePath}`);
    
            socket.emit("responseMessage", {
                response: response,
                speechData: speechData,
            });
        } catch (err) {
            console.error(`ERROR (${socket.id}):`, err.message);
    
            socket.emit("responseMessage", {
                response: "Sorry, I don't understand that.",
                speechData: null,
            });
        }
    });
    
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
