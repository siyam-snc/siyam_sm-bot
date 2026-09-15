const axios = require("axios");

const baseApiUrl = "https://noobs-api.top/dipto/baby";

module.exports = {
  name: "bot",
  aliases: ["mbot", "milonbot", "বট"],
  version: "10.0.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "fun",
  shortDescription: "High-speed chat bot with extra dialogues and auto responses",

  execute: async (bot, msg, argsText) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderId = msg.from.id;
    const firstName = msg.from.first_name || "User";
    const args = argsText ? argsText.split(" ") : [];

    try {
      // ১. শুধু /bot দিলে ডিফল্ট রেসপন্স
      if (!args[0]) {
        const text = `「 ${firstName} 」\nবলুন আমি "বট" আপনাকে কিভাবে সাহায্য করতে পারি?`;
        return bot.sendMessage(chatId, text, {
          reply_to_message_id: messageId
        });
      }

      // ২. টিচ (Teach) কমান্ড হ্যান্ডলিং
      if (args[0] === "teach") {
        const [q, a] = args.slice(1).join(" ").split(/\s*-\s*/);
        if (!q || !a) {
          return bot.sendMessage(chatId, "⚠️ Format: teach ask - reply", {
            reply_to_message_id: messageId
          });
        }

        const { data } = await axios.get(
          `${baseApiUrl}?teach=${encodeURIComponent(q)}&reply=${encodeURIComponent(a)}&senderID=${senderId}`
        );

        return bot.sendMessage(chatId, `✅ Added: ${data.message}`, {
          reply_to_message_id: messageId
        });
      }

      // ৩. নরমাল এআই চ্যাট রেসপন্স
      const { data } = await axios.get(
        `${baseApiUrl}?text=${encodeURIComponent(args.join(" "))}&senderID=${senderId}&font=1`
      );

      return bot.sendMessage(chatId, data.reply, {
        reply_to_message_id: messageId
      });
    } catch (err) {
      return bot.sendMessage(chatId, "API Busy!", {
        reply_to_message_id: messageId
      });
    }
  },

  // ৪. অটো চ্যাট ফিল্টার (যেখানে মেসেজের শুরুতে bot/বট থাকলে বা অটোমেশন ট্রিগার হলে কাজ করবে)
  onChat: async (bot, msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderId = msg.from.id;
    const firstName = msg.from.first_name || "User";
    const body = msg.text || "";

    if (!body) return;
    const lowerBody = body.toLowerCase();

    if (lowerBody.startsWith("bot") || lowerBody.startsWith("বট")) {
      const text = body.replace(/^(bot|বট)\s*/i, "").trim();

      if (!text) {
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
          "ওই যে দেখো 𓆩সিয়াম𓆪 বস যাচ্ছে , এক বালতি প্রেম দিয়ে দাও 🤭"
        ];

        const rand = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        const replyText = `「 ${firstName} 」\n\n${rand}`;

        return bot.sendMessage(chatId, replyText, {
          reply_to_message_id: messageId
        });
      }

      // যদি bot/বট লেখার পর কথা থাকে তবে সরাসরি উত্তর দেবে
      try {
        const { data } = await axios.get(
          `${baseApiUrl}?text=${encodeURIComponent(text)}&senderID=${senderId}&font=1`
        );
        return bot.sendMessage(chatId, data.reply, {
          reply_to_message_id: messageId
        });
      } catch (e) {}
    }
  }
};
