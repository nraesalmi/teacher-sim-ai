const dotenv = require("dotenv"); 
const express = require("express"); 
const cors = require("cors"); 
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const tasks = [
  "Counting & number recognition",
  "Basic operations",
  "Factors & multiples",
  "Odd & even numbers"
];

const chosenTask = tasks[Math.floor(Math.random() * tasks.length)];

const apiEndpoint = process.env.APIENDPOINT

// POST /api/chat
app.post("/api/chat", async (req: { body: { conversation: any; disability: any; }; }, res: { json: (arg0: { answer: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { answer: string; }): void; new(): any; }; }; }) => {
  const { conversation, disability } = req.body;

  // System prompt
  const sys_prompt = `You are acting as Oscar, an elementary school child with this disability: ${disability}.
You are having troubles with understanding the math problem: ${chosenTask}
Keep answers maximum 4 sentences and the flow natural and easily readable.
You will make some small mistakes and be unsure.
Once it is explained, ask to give a task to try.
In this conversation, Oscars is labeled BOT: and the user is USER:.
This is the conversation so far, answer to the latest USER: question without using the labels:\n`;


  try {
    // Combine prompt and conversation
    const conversationText = conversation
    .map((m: { sender: string; text: string }) => `${m.sender.toUpperCase()}: ${m.text}`)
    .join("\n");

    const fullPrompt = `${sys_prompt}${conversationText}`;

    console.log(fullPrompt)
    const aiResponse = await axios.post(apiEndpoint, {
      model: "llama2:7b",
      prompt: fullPrompt,
      stream: false,
    });

    const answer = aiResponse.data.response;

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error: could not reach Ollama LLM service :(" });
  }
});


// POST /api/evaluate
app.post("/api/evaluate", async (req: { body: { conversation: any; disability: any; }; }, res: { json: (arg0: { answer: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { answer: string; }): void; new(): any; }; }; }) => {
  const { conversation, disability } = req.body;

  // System prompt
  const sys_prompt = `Your task is to evaluate how well the USER has done in teaching a child named Oscar (labeled BOT) with ${disability}.
The child was given the math problem: ${chosenTask}.
Give a short report on how they did and what they could improve on.
At the end give them a rating out of ten (x/10) on how well they did with the teaching.
Here is the conversation to evaluate:\n`


  try {
    // Combine prompt and conversation
    const conversationText = conversation
    .map((m: { sender: string; text: string }) => `${m.sender.toUpperCase()}: ${m.text}`)
    .join("\n");

    const fullPrompt = `${sys_prompt}${conversationText}`;

    console.log(fullPrompt)
    const aiResponse = await axios.post(apiEndpoint, {
      model: "llama2:7b",
      prompt: fullPrompt,
      stream: false,
    });

    const answer = aiResponse.data.response;
    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error: could not reach Ollama LLM service :(" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
