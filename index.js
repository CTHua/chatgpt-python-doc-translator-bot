import { Client } from "discord.js-selfbot-v13";
import chalk from "chalk";
import dotenv from "dotenv";
import send2ChatGPT from "./chatgpt.js";
dotenv.config();

const channelId = process.env.CHANNEL_ID;
const token = process.env.DISCORD_TOKEN;

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
  if (message.channelId === channelId) {
    console.log(
      `${chalk.red("[Message]")} ${message.content}, ${
        message.author.username
      } at ${new Date().toLocaleString()}`
    );
    if (message.content.startsWith("```") || message.content.endsWith("```")) {
      return;
    }
    const response = await send2ChatGPT(message.content);
    sendMessage(response);
  }
});

const sendMessage = async (message) => {
  return client.channels
    .fetch(channelId)
    .then((channel) =>
      channel
        .send(`\`\`\`${message}\`\`\``)
        .then(() =>
          console.log(
            `${chalk.green(
              "[Message]"
            )} Sent message at ${new Date().toLocaleString()}`
          )
        )
    )
    .catch(console.error);
};

client.login(token);
