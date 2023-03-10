import { Client } from "discord.js-selfbot-v13";
import chalk from "chalk";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

import send2ChatGPT from "./chatgpt.js";

const channelId = process.env.CHANNEL_ID;
const token = process.env.DISCORD_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL;
const ignoreId = process.env.IGNORE_ID;

const client = new Client({
  checkUpdate: false,
});

client.on("ready", () => {
  console.log(
    `${chalk.green("[Discord]")} Logged in as ${
      client.user.tag
    } at ${new Date().toLocaleString()}`
  );
});

client.on("messageCreate", async (message) => {
  if (message.channelId === channelId && message.author.id !== ignoreId) {
    console.log(
      `${chalk.red("[Message]")} ${message.content}, ${
        message.author.username
      } at ${new Date().toLocaleString()}`
    );
    if (message.content.startsWith("```") && message.content.endsWith("```")) {
      const cleanMsg = message.content.slice(3, -3);
      const gptResponse = [];
      for (let i = 0; i < 3; i++) {
        gptResponse.push(send2ChatGPT(cleanMsg));
      }
      const res = await Promise.all(gptResponse);
      let msg = "";
      res.forEach((r, index) => {
        msg += `選項 ${index + 1}\n\`\`\`${r}\`\`\`\n`;
      });
      sendMessage(msg);
    }
  }
});

const sendMessage = async (message) => {
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
    }),
  })
    .then(() =>
      console.log(
        `${chalk.green(
          "[Message]"
        )} Sent message at ${new Date().toLocaleString()}`
      )
    )
    .catch(console.error);
};

client.login(token);
