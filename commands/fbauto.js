const axios = require("axios");

async function handleFbDownload(bot, msg) {
  if (!msg || !msg.text) return;

  const text = msg.text.trim();
  // Regex to detect Facebook video links in chat
  const fbRegex = /(https?:\/\/(?:www\.|web\.|m\.|fb\.)?(?:facebook\.com|fb\.watch)\/[^\s]+)/i;
  const match = text.match(fbRegex);

  if (!match) return;

  const url = match[0];
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  let loadingMsg = null;
  try {
    // 1. Send Bold English Loading Message
    loadingMsg = await bot.sendMessage(
      chatId,
      "**⏳ DOWNLOADING YOUR FACEBOOK VIDEO... PLEASE WAIT!**",
      { reply_to_message_id: messageId, parse_mode: "Markdown" }
    );

    // 2. Fetch Video
    let videoUrl = null;

    try {
      const response = await axios.get(`https://api.vkrdown.com/fb/download.php?url=${encodeURIComponent(url)}`);
      if (response.data && response.data.data) {
        videoUrl = response.data.data.hd || response.data.data.sd;
      }
    } catch (e) {
      try {
        const fallback = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
        if (fallback.data && fallback.data.video) {
          videoUrl = fallback.data.video.noWatermark || fallback.data.video.watermark;
        }
      } catch (err) {}
    }

    // Delete Loading Message
    if (loadingMsg && loadingMsg.message_id) {
      await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
    }

    // 3. Handle Failure Error Message
    if (!videoUrl) {
      return bot.sendMessage(
        chatId,
        "**❌ ERROR: UNABLE TO DOWNLOAD THIS FACEBOOK VIDEO! PLEASE MAKE SURE THE VIDEO IS PUBLIC AND TRY AGAIN.**",
        { reply_to_message_id: messageId, parse_mode: "Markdown" }
      );
    }

    // 4. Send Video with Bold English Caption
    const caption = 
"**📥 FACEBOOK VIDEO DOWNLOADED SUCCESSFULLY!**\n" +
"**━━━━━━━━━━━━━━━━━━**\n" +
"**👑 AUTHOR: 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍**\n" +
"**⚡ ENGINE: NIJHUM-CHAT-BOT**\n" +
"**━━━━━━━━━━━━━━━━━━**";

    await bot.sendVideo(chatId, videoUrl, {
      reply_to_message_id: messageId,
      caption: caption,
      parse_mode: "Markdown"
    });

  } catch (err) {
    console.error("Auto FB Error:", err.message);
    if (loadingMsg && loadingMsg.message_id) {
      bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
    }
    bot.sendMessage(
      chatId,
      "**❌ ERROR: SOMETHING WENT WRONG WHILE PROCESSING YOUR REQUEST!**",
      { reply_to_message_id: messageId, parse_mode: "Markdown" }
    );
  }
}

module.exports = {
  name: "fbauto",
  aliases: ["fb", "fbdl"],
  version: "2.0.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "downloader",
  shortDescription: "Auto Facebook Video Downloader without command 📥",

  // ম্যানুয়ালি কমান্ড দিলে কাজ করার জন্য
  execute: async (bot, msg) => {
    await handleFbDownload(bot, msg);
  },

  // কমান্ড ছাড়া শুধু লিঙ্ক পাঠালেই অটো রান করার জন্য
  onChat: async (bot, msg) => {
    await handleFbDownload(bot, msg);
  }
};
