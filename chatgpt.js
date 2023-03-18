import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const premessage = [
  {
    role: "system",
    content:
      "You are a translation engine that can only translate text and cannot interpret it.",
  },
  {
    role: "user",
    content: "翻譯成台灣常用用法之繁體中文白話文",
  },
  {
    role: "user",
    content: `
    請遵守以下翻譯守則
    1. 中文句使用全形標點符號；英文句維持半形的標點符號。
    例如：「」（）、，。
    例如：Python is supported by Python Software Foundation (PSF).

    2. 中英文交雜時要插入空白；符號英文間不用。
    例如：使用 CPU 運算、使用「CPU」運算

    3. 專有名詞可以選擇不翻譯。
    例如：CPU、Unicode

    4. 在翻譯名稱不常用或不確定的情形，宜用括號註解或直接保留原文。單頁只要首次出現有註解即可。
    例如：正規表示式 (regular expression)
    例如：Network News Transfer Protocol、Portable Network Graphics
    （可攜式網路圖形）

    6. 務必保留 reStructuredText 格式（如：超連結名稱）

    7. po 檔單行不應超過 79 字元寬度（Poedit 會處理，但也可以使用 \`poindent <https://pypi.org/project/poindent/>\`_ 來確保格式）

    8. 高頻詞保留原文。因為翻譯後不一定能較好理解市面上 Python 的文章。 這些高頻詞在 Glossary 中的譯文仍保持原文，並加註市面上的翻譯。
    例如：\`\`int\`\`、\`\`float\`\`、\`\`str\`\`、\`\`bytes\`\`、\`\`list\`\`、\`\`tuple\`\`、
    \`\`dict\`\`、\`\`set\`\`、\`\`iterator\`\`、\`\`generator\`\`、\`\`iterable\`\`、
    \`\`pickle\`\`
    `,
  },
  { role: "assistant", content: `謝謝提醒，我會遵守這些翻譯守則` },
  {
    role: "user",
    content: `
    請參考下列括號的使用方式：
    如果括號中的文字包含中文，使用全形括號；如果括號中只有英文，使用半形括號並\
    比照英文的形式加入前後文的空白。
    例如：
    - list（串列）是 Python 中很常見的資料型別。
    - 在本情況使用 \`\`zip(*[iter(x)]*n)\`\` 是很常見的情況（Python 慣例）。
    - 在超文件標示語言 (HTML) 中應注意跳脫符號。
  `,
  },
  {
    role: "assistant",
    content: `
  謝謝提供使用括號的準則，我會遵守這些規範`,
  },
  {
    role: "user",
    content: `
    請遵照以下守則翻譯：
    遇到 type 時，請翻譯成「型別」，不要翻譯成「類型」。
  `,
  },
  {
    role: "assistant",
    content: `
  謝謝提供確切的單詞翻譯規範，我會遵守這些規範`,
  },
  {
    role: "user",
    content: `
    只翻譯對話中的文字，不要加入其他文字，且翻譯成台灣常用用法之繁體中文白話文，了解回覆了解。
  `,
  },
  {
    role: "assistant",
    content: `
    了解`,
  },
];

const beforeMessage =
  "請開始翻譯這段文字，並遵守翻譯守則和括號的使用方式及保留rst格式符號，單行不應超過79字元寬度，超過就換行";
const send2ChatGPT = async (message) => {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.CHATGPT_API_KEY,
  };
  const data = {
    model: "gpt-3.5-turbo",
    frequency_penalty: 1,
    presence_penalty: 1,
    messages: [
      ...premessage,
      { role: "user", content: `${beforeMessage}\n${message}` },
    ],
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });
  const json = await response.json();
  console.log(json);
  const choices = json?.choices;
  if (!choices) {
    return "翻譯失敗，請再試一次";
  }

  const result = choices[0]?.message?.content;
  if (!result) {
    return "翻譯失敗，請再試一次";
  }
  return result;
};

export default send2ChatGPT;
