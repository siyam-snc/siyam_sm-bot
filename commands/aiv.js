const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");

const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const API_BASE = "https://xrahat-gen.vercel.app";
const GENERATE_ENDPOINT = `${API_BASE}/api/generate`;

module.exports = {
  config: {
    name: "aiv",
    aliases: ["aivideo"],
    version: "1.0.0",
    role: 0,
    author: LOCKED_AUTHOR,
    description: "ছবিতে রিপ্লাই দিয়ে prompt লিখে AI ভিডিও generate করে",
    category: "AI",
    guide: { en: "[একটা ছবিতে reply দিয়ে] aiv <prompt>" }
  },

  execute: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    let photoMessage = null;
    if (msg.reply_to_message) {
      if (msg.reply_to_message.photo && msg.reply_to_message.photo.length > 0) {
        photoMessage = msg.reply_to_message.photo;
      } else if (msg.reply_to_message.document && msg.reply_to_message.document.mime_type?.startsWith("image/")) {
        photoMessage = [msg.reply_to_message.document];
      }
    }

    if (!photoMessage) {
      return bot.sendMessage(
        chatId,
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ একটা ছবিতে reply দিয়ে লিখুন:\n» aiv prompt\n» 🔰 aiv dancing in a neon city\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        { reply_to_message_id: messageId }
      );
    }

    const prompt = (args || []).join(" ").trim();
    if (!prompt) {
      return bot.sendMessage(
        chatId,
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ Prompt লিখুন।\n» 🔰 aiv dancing in a neon city\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        { reply_to_message_id: messageId }
      );
    }

    let waitMsgId = null;
    let tempFilePath = null;

    try {
      const waitMsg = await bot.sendMessage(
        chatId,
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 𝐛𝐚𝐫𝐚...\n» 🎥 𝐕𝐢𝐝𝐞𝐨 𝐢𝐬 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠!\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        { reply_to_message_id: messageId }
      );
      waitMsgId = waitMsg.message_id;

      const fileObj = Array.isArray(photoMessage) ? photoMessage[photoMessage.length - 1] : photoMessage;
      const fileId = fileObj.file_id;
      const fileLink = await bot.getFileLink(fileId);

      const imageResponse = await axios.get(fileLink, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 670000
      });

      const imageBuffer = Buffer.from(imageResponse.data);
      const form = new FormData();

      form.append("image", imageBuffer, {
        filename: "input.jpg",
        contentType: "image/jpeg"
      });

      form.append("prompt", prompt);
      form.append("mode", "image");

      const genResponse = await axios.post(
        GENERATE_ENDPOINT,
        form,
        {
          headers: form.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 2780000,
          responseType: "arraybuffer",
          validateStatus: () => true
        }
      );

      const contentType = genResponse.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        let errJson = null;
        try {
          errJson = JSON.parse(Buffer.from(genResponse.data).toString("utf-8"));
        } catch (_) {}

        throw new Error((errJson && (errJson.Result || errJson.message || errJson.error)) || "Generation failed");
      }

      if (genResponse.status < 200 || genResponse.status >= 300 || !contentType.startsWith("video/")) {
        throw new Error("Unexpected response from generate API");
      }

      const ext = (contentType.split("/")[1] || "mp4").split(";")[0].trim();
      const videoBuffer = Buffer.from(genResponse.data);

      tempFilePath = path.join(
        os.tmpdir(),
        `gen_${Date.now()}_${Math.floor(Math.random() * 1e6)}.${ext}`
      );

      fs.writeFileSync(tempFilePath, videoBuffer);

      await bot.sendVideo(
        chatId,
        fs.createReadStream(tempFilePath),
        {
          caption: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝐀𝐈 𝐕𝐈𝐃𝐄𝐎 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃!\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          reply_to_message_id: messageId
        }
      );

      if (waitMsgId) {
        try {
          bot.deleteMessage(chatId, waitMsgId);
        } catch (_) {}
      }

    } catch (error) {
      if (waitMsgId) {
        try {
          bot.deleteMessage(chatId, waitMsgId);
        } catch (_) {}
      }

      bot.sendMessage(
        chatId,
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝐅𝐀𝐈𝐋𝐄𝐃 𝐓𝐎\n» 🤩 𝐆𝐄𝐍𝐄𝐑𝗔𝐓𝐄 𝐕𝐈𝐃𝐄𝐎!\n» ⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧...\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        { reply_to_message_id: messageId }
      );
    } finally {
      if (tempFilePath) {
        fs.unlink(tempFilePath, () => {});
      }
    }
  }
};
