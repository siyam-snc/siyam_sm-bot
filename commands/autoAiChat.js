const axios = require("axios");

// কনফিগারেশন সেফটি চেক
let config = {};
try {
  config = require("../config");
} catch (e) {
  config = {};
}

const META_AI_GEM_ID = "ba0fbe0d-976e-493a-afdb-6d8469e53df0";
const META_AI_ENDPOINT = `https://nxtai.zipohostbd.workers.dev/api/use?gem=${META_AI_GEM_ID}`;
const META_AI_KEY = "nxt_3a454c41e6a84aeead28d1fb4aec87a4";

const RANDOM_REPLIES = [
  "সিয়াম ভাই চিপায় আটকে গেছে! 😜",
  "ডাকলেন কেন ভাই? কিছু খাইতে দেবেন নাকি? 🍔🌸",
  "হুম বলো, শুনতেছি! 🎧✨",
  "আমাকে ডাকলে কিন্তু সিয়াম ভাই রাগ করবে! 😂🙈",
  "কী খবর বল? সব শান্তশিষ্ট তো? 🤖💫",
  "ডাকছো ভালো কথা, কিন্তু বেশি প্যানপ্যান করবা না! 🥱💤",
  "আরে প্রীতি শোনো! কি খবর তোমার? 🌺✨",
  "হেই! আমাকে মনে পড়লো তাহলে? 🙈💖"
];

// বাটন মার্কআপ জেনারেটর
const getButtons = () => {
  const botUsername = config.botUsername || "YourBotUsername";
  const ownerUsername = config.ownerUsername || "YourOwnerUsername";
  return {
    inline_keyboard: [
      [
        { text: "➕ 𝐀𝐃𝐃 𝐆𝐑𝐎𝐔𝐏", url: `https://t.me/${botUsername}?startgroup=true` },
        { text: "👑 𝐎𝐖𝐍𝐄𝐑", url: `https://t.me/${ownerUsername}` }
      ]
    ]
  };
};

// AI এপিআই কল ফাংশন
async function fetchAiReply(bot, chatId, messageId, text) {
  const loadingMsg = await bot.sendMessage(chatId, "💭 এ্ঁক্ঁটু্ঁ ভা্ঁব্ঁছি্ঁ..", {
    reply_to_message_id: messageId
  });

  try {
    const res = await axios.post(
      META_AI_ENDPOINT,
      { api_key: META_AI_KEY, message: text },
      { headers: { "Content-Type": "application/json" }, timeout: 20000 }
    );

    const replyText = res.data?.response || res.data?.message || res.data?.text || "কোনো উত্তর পাওয়া যায়নি! 😅";

    await bot.editMessageText(`🤖 **AI উত্তর:**\n\n${replyText}`, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      reply_markup: getButtons(),
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("❌ AI API Error:", err.message);
    await bot.editMessageText("❌ এপিআই সাড়া দিচ্ছে না! একটু পর আবার চেষ্টা করুন। 🥺", {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      reply_markup: getButtons()
    });
  }
}

module.exports = {
  name: "autoAiChat",
  aliases: ["a", "bot", "বট"],
  version: "1.0.7",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "ai",
  shortDescription: "Auto AI chat and direct command system",

  // ১. সরাসরি কমান্ড ব্যবহার করলে (যেমন: /ai কেমন আছো বা /bot)
  execute: async (bot, msg, argsText) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const text = argsText ? argsText.trim() : "";

    if (!text) {
      const randText = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
      return bot.sendMessage(chatId, randText, {
        reply_to_message_id: messageId,
        reply_markup: getButtons()
      });
    }

    await fetchAiReply(bot, chatId, messageId, text);
  },

  // ২. প্যাসিভ চ্যাট লিসেনার (গ্রুপ ও প্রাইভেট চ্যাটের সাধারণ টেক্সট ট্র্যাক করতে)
  onChat: async (bot, msg) => {
    if (!msg || !msg.text) return;

    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const text = msg.text.trim();
    const isPrivate = msg.chat.type === "private";
    const replyToMsg = msg.reply_to_message;

    const isTrigger = /^(hi|hello|hey|বট|bot|baby|বেবি|প্রীতি|কেমন আছো|হেই|হাই)$/i.test(text);
    const isBotReply = replyToMsg && replyToMsg.from && replyToMsg.from.is_bot;

    // ট্রিগার বা বটের রিপ্লাই না হলে এবং গ্রুপ চ্যাট হলে কিছু করবে না
    if (!isTrigger && !isBotReply && !isPrivate) return;

    // ক) গ্রুপে শুধু ট্রিগার ওয়ার্ড লিখলে র্যান্ডম রিপ্লাই দেবে
    if (isTrigger && !isBotReply && !isPrivate) {
      const randText = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
      return bot.sendMessage(chatId, randText, {
        reply_to_message_id: messageId,
        reply_markup: getButtons()
      });
    }

    // খ) বটের মেসেজে রিপ্লাই দিলে বা প্রাইভেটে মেসেজ পাঠালে AI কাজ করবে
    await fetchAiReply(bot, chatId, messageId, text);
  }
};
