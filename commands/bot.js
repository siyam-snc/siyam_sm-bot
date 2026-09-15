const axios = require("axios");

const baseApiUrl = "https://noobs-api.top/dipto/baby";

// বটের পাঠানো মেসেজের ID ট্র্যাক করার জন্য ইন-মেমোরি স্টেট
const botMessagesState = new Map();

// র্যান্ডম মেসেজ লিস্ট
const randomReplies = [
  "𝗵𝗲 𝗯𝗼𝘁 𝗯𝗼𝘁 𝗰𝗵𝗶𝗹𝗹 𝗯𝗿𝗼!",
  "I love you 💝",
  "আমি 𓆩সিয়াম𓆪 বস এর সাথে বিজি আছি-😕😏",
  "আমার বস 𓆩সিয়াম𓆪 কে একটা জি GF দাও-😽🫶",
  "জান তোমার নানি রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
  "𓆩সিয়াম𓆪 বস'এর হবু বউ রে কেও দেকছো?😪",
  "জান হাঙ্গা করবা-🙊😝",
  "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤",
  "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
  "বেশি Bot Bot করলে leave নিবো কিন্তু😒",
  "তোর বাড়ি কি কিশোরগঞ্জ, পোড়াবাড়িয়া গ্রাম😵‍💫",
  "মেয়ে হলে বস 𓆩সিয়াম𓆪 কে 𝐊𝐈𝐒𝐒 দে 😒",
  "চুমু খাওয়ার বয়স টা চকলেট🍫খেয়ে উড়িয়ে দিলো 𓆩সিয়াম𓆪 বস 🥺🤗",
  "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
  "জান বাল ফালাইবা-🙂🥱🙆‍♂",
  "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",
  "দিনশেষে পরের BOW সুন্দর-☹️🤧",
  "সুন্দর মাইয়া মানেই-🥱আমার বস 𓆩সিয়াম𓆪 এর বউ-😽🫶",
  "হা জানু , এইদিক এ আসো কিস দেই🤭 😘",
  "আরে আমি মজা করার mood এ নাই😒",
  "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘",
  "আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস 𓆩সিয়াম𓆪 কে দান করেন-🥱🐰🍒",
  "ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧",
  "অনুমতি দিলে কল দিতাম..!😒",
  "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
  "বস 𓆩সিয়াম𓆪 এর সাথে কথা বলবো এখন , ডিস্টার্ব করিস না 😒",
  "বেশি বেশি বকবক করলে তোকে ব্লক মেরে দেবো কিন্তু-🐸",
  "জানু তোমার জন্য আমার মনটা আই ঢাই করে 💖",
  "ওই যে देखो 𓆩সিয়াম𓆪 বস যাচ্ছে , এক বালতি প্রেম দিয়ে দাও 🤭"
];

module.exports = {
  name: "bot",
  aliases: ["mbot", "milonbot", "বট"],
  version: "10.0.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "fun",
  shortDescription: "Interactive chat bot with flawless reply tracking",

  // ১. /bot বা /bot teach কমান্ড
  execute: async (bot, msg, argsText) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderId = msg.from.id;
    const firstName = msg.from.first_name || "User";
    const args = argsText ? argsText.trim().split(/\s+/) : [];

    try {
      // শিখানোর কমান্ড
      if (args[0] === "teach") {
        const payload = args.slice(1).join(" ");
        const [q, a] = payload.split(/\s*-\s*/);
        if (!q || !a) {
          return bot.sendMessage(chatId, "⚠️ Format: /bot teach ask - reply", {
            reply_to_message_id: messageId
          });
        }

        const { data } = await axios.get(
          `${baseApiUrl}?teach=${encodeURIComponent(q)}&reply=${encodeURIComponent(a)}&senderID=${senderId}`
        );

        return bot.sendMessage(chatId, `✅ Added: ${data.message || "Success"}`, {
          reply_to_message_id: messageId
        });
      }

      // নরমাল /bot লিখলে র্যান্ডম মেসেজ দিবে এবং মেসেজের আইডি সেভ রাখবে
      const randText = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      const sentMsg = await bot.sendMessage(chatId, `「 ${firstName} 」\n\n${randText}`, {
        reply_to_message_id: messageId
      });

      if (sentMsg && sentMsg.message_id) {
        botMessagesState.set(sentMsg.message_id, senderId);
      }
    } catch (err) {
      console.error("Bot Execute Error:", err.message);
      return bot.sendMessage(chatId, "⚠️ API Busy!", { reply_to_message_id: messageId });
    }
  },

  // ২. অটো চ্যাট এবং রিপ্লাই লিসেনার
  onChat: async (bot, msg) => {
    if (!msg || !msg.text) return;

    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderId = msg.from.id;
    const firstName = msg.from.first_name || "User";
    const body = msg.text.trim();

    try {
      // ক) ইউজার যদি বটের পাঠানো কোনো মেসেজে রিপ্লাই করে
      if (msg.reply_to_message) {
        const repliedMsgId = msg.reply_to_message.message_id;

        // চেক করবে মেসেজটি কি আমাদের এই বটেরই ছিল কিনা
        if (msg.reply_to_message.from && msg.reply_to_message.from.is_bot) {
          const { data } = await axios.get(
            `${baseApiUrl}?text=${encodeURIComponent(body)}&senderID=${senderId}&font=1`
          );

          if (data && data.reply) {
            const newSentMsg = await bot.sendMessage(chatId, data.reply, {
              reply_to_message_id: messageId
            });
            
            // পরবর্তী রিপ্লাইয়ের জন্য নতুন মেসেজ আইডিটি মেমোরিতে আপডেট রাখা
            if (newSentMsg && newSentMsg.message_id) {
              botMessagesState.set(newSentMsg.message_id, senderId);
            }
          }
          return;
        }
      }

      // খ) ট্রিগার চেক: bot, mbot, milonbot, বা বট দিয়ে মেসেজ শুরু হলে
      const lowerBody = body.toLowerCase();
      const triggers = ["bot", "mbot", "milonbot", "বট"];
      const isTriggered = triggers.some((trg) => lowerBody === trg || lowerBody.startsWith(trg + " "));

      if (isTriggered) {
        const randText = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        const sentMsg = await bot.sendMessage(chatId, `「 ${firstName} 」\n\n${randText}`, {
          reply_to_message_id: messageId
        });

        if (sentMsg && sentMsg.message_id) {
          botMessagesState.set(sentMsg.message_id, senderId);
        }
      }
    } catch (err) {
      console.error("Bot OnChat Error:", err.message);
    }
  }
};
