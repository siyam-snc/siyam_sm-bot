const axios = require("axios");
const config = require("../config");

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

// একটি গ্লোবাল বাটন মার্কআপ তৈরি
const getReplyMarkup = () => {
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

// মূল এপিআই হ্যান্ডলার ফাংশন
const handleAiResponse = async (bot, msg, text, chatId, messageId) => {
  const replyMarkup = getReplyMarkup();
  const loadingMsg = await bot.sendMessage(chatId, "💭 এ্ঁক্ঁটু্ঁ ভা্ঁব্ঁছি্ঁ..", {
    reply_to_message_id: messageId
  });

  try {
    const res = await axios.post(
      META_AI_ENDPOINT,
      { api_key: META_AI_KEY, message: text },
      { headers: { "Content-Type": "application/json" }, timeout: 30000 }
    );

    const replyText = res.data?.response || res.data?.message || res.data?.text || "কোনো উত্তর পাওয়া যায়নি। 😅";

    await bot.editMessageText(`🤖 **AI উত্তর:**\n\n${replyText}`, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      reply_markup: replyMarkup,
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("AI Reply Error:", err.message);
    await bot.editMessageText("❌ সমস্যা! এখন উত্তর দিতে পারছি না, একটু পর চেষ্টা করুন। 🥺", {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      reply_markup: replyMarkup
    });
  }
};

module.exports = {
  name: "autoAiChat",
  aliases: ["a", "botchat"],
  version: "1.0.6",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "ai",
  shortDescription: "Interactive auto AI chat system with triggers",

  // ১. কমান্ড ব্যবহার করলে (যেমন: /ai কেমন আছো)
  execute: async (bot, msg, argsText) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const text = argsText ? argsText.trim() : "";

    if (!text) {
      return bot.sendMessage(chatId, "⚠️ কিছু তো লিখুন! যেমন: `/ai কেমন আছো?`", {
        reply_to_message_id: messageId
      });
    }
    await handleAiResponse(bot, msg, text, chatId, messageId);
  },

  // ২. অটো চ্যাট লিসেনার (গ্রুপ বা প্রাইভেট চ্যাটের সাধারণ মেসেজ ট্র্যাক করতে)
  onChat: async (bot, msg) => {
    if (!msg || !msg.text) return;

    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const text = msg.text.trim();
    const isPrivate = msg.chat.type === "private";
    const replyToMsg = msg.reply_to_message;

    // ট্রিগার ও রিপ্লাই চেক
    const isTriggerWord = /^(hi|hello|hey|বট|bot|baby|বেবি|প্রীতি|কেমন আছো|হেই|হাই)$/i.test(text);
    const isBotReply = replyToMsg && replyToMsg.from && replyToMsg.from.is_bot;

    // যদি ট্রিগার ওয়ার্ড না হয়, বটের রিপ্লাই না হয় এবং গ্রুপ চ্যাট হয়, তবে ইগনোর করবে
    if (!isTriggerWord && !isBotReply && !isPrivate) return;

    // যদি গ্রুপে শুধু ট্রিগার ওয়ার্ড দেয় (এবং বটের মেসেজে রিপ্লাই না করে)
    if (isTriggerWord && !isBotReply && !isPrivate) {
      const randomText = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
      return bot.sendMessage(chatId, randomText, {
        reply_to_message_id: messageId,
        reply_markup: getReplyMarkup()
      });
    }

    // বটের মেসেজে রিপ্লাই দিলে বা প্রাইভেট চ্যাটে মেসেজ দিলে AI এপিআই কল হবে
    await handleAiResponse(bot, msg, text, chatId, messageId);
  }
};
