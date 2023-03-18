import dotenv from "dotenv";
import express from "express";
dotenv.config();

import send2ChatGPT from "../chatgpt.js";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/translate", async (req, res) => {
  const { message } = req.body;
  const gptResponse = [];
  for (let i = 0; i < 3; i++) {
    gptResponse.push(send2ChatGPT(message));
  }
  const result = await Promise.all(gptResponse);
  let msg = "";
  result.forEach((r, index) => {
    msg += `${r}\n===\n`;
  });
  res.send(msg);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
