import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const PORT = process.env.PORT || 8001;
const app = express();
app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/chat", (req, res) => {
    const prompt = req.body.prompt;
    const history = req.body.history;

    async function run() {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-pro",
            });

            const chat = model.startChat({
                history,
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(prompt);
            const response = result.response;
            const text = response.text();
            res.status(200).json(text);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }
    run();
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
