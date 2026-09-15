if (!global.babaAutoTargets) {
  global.babaAutoTargets = {};
}

const titles = [
  "প্রেমের কাঙ্গাল 💔", "প্যারালাল জগতের লুচু 🦉", "জাতীয় ছ্যাঁকা খোর 🍳",
  "অনলাইন সিরিয়াল কিলার 🕶️", "ফাঁকে পড়ে সিঙ্গেল 🐸", "ডিজিটাল মজনু 📱",
  "লুকানো ক্রাশের ভিকটিম 💘", "প্যাড়া মাস্টার ৩০০০ ⚡", "ফেসবুকের বিখ্যাত ফাপরবাজ 📢",
  "চিপাগলির লেজেন্ড 😼", "অনলাইন ভণ্ড সাধু 🧙‍♂️", "ক্রাশের বড় ভাই/বোন 🤣",
  "ফেসবুকের কিপটা সম্রাট 🪙", "সিঙ্গেল সমাজের সভাপতি 👑", "ফেসবুক সেলিব্রিটি (মনে মনে) 🌟",
  "প্রেম প্রস্তাব প্রত্যাখ্যাত ভভুক্তভোগী 🥀", "ইনবক্সের বিরতিহীন ডিস্টারবার 📩",
  "চিল মানসিকতার পাগল 🤪", "ফেসবুকের রহস্যময় প্রাণী 🦖", "সবজান্তা শমসের 🧠",
  "টিকটক লেভেল সেলিব্রিটি 💃", "রাতের আঁধারের পেঁচা 🦉", "চা-খোর সম্রাট ☕"
];

const predictions = [
  "খুব শীঘ্রই তোমার জীবনে একটা বিড়াল ঢুকে প্যান্ট নষ্ট করবে! 🐱",
  "আগামী ২৪ ঘণ্টার মধ্যে তুমি একটা বিশাল লেভেলের বাঁশ খাইতে যাচ্ছো! 🎍",
  "তোমার ক্রাশ আগামী কাল ভুল করে তোমায় 'আই লাভ ইউ' পাঠিয়ে ফেলবে! 💌",
  "আজ রাতে স্বপ্ন দেখবে তুমি আকাশে উড়ছো, কিন্তু সকালে উঠে দেখবে খাট থেকে পড়ে গেছো! 🛌",
  "খুব দ্রুত তোমার পকেটে ৫০ টাকা পাওয়া যাবে যা তুমি ভুলেই গিয়েছিলে! 💸",
  "আজকের পর থেকে তোমার চেহারা দেখলে ফোনের ফেসলকও কাজ করবে না! 🗿",
  "ভবিষ্যতে তুমি অনেক বড় ধনী হবে—\n তবে শুধু Free Fire এর ডায়মন্ডের দিক দিয়ে! 💎😆",
  "তোমার ফেসবুক আইডিতে খুব দ্রুত এক হাজার রিঅ্যাক্ট আসার সম্ভাবনা আছে (স্বপ্নে)! 💤",
  "আগামী সপ্তাহে তুমি রাস্তায় চলতে গিয়ে বিখ্যাত কারও জুতোয় পা দিয়ে ফেলবে! 👟",
  "খুব শিগগির তোমার ফোনে একটা আজব অচেনা নম্বর থেকে মিসকল আসবে! 📞",
  "তোমার বন্ধু আগামীকালে তোমায় একটা ফ্রিতে বিরিয়ানি খাওয়াতে পারে! 🍲",
  "তোমার কপালে চরম লেভেলের প্যারা লেখা আছে, সাবধানে থেকো! ⚠️",
  "আজ রাতে ঘুমানোর সময় তোমার মশা মারার ব্যাট নষ্ট হয়ে যাবে! 🦟",
  "তোমার ক্রাশ অন্য কারও সাথে চ্যাট করতে গিয়ে তোমাকে দুর্ঘটনাবশত স্ক্রিনশট পাঠাবে! 📸",
  "চা খেতে গিয়ে তোমার শার্টে গরম চা পড়ে একটা বিশ্বমানচিত্র তৈরি হবে! ☕",
  "তোমার কপাল এতোই ভালো যে আগামী ১ বছর তোমার কোনো সিঙ্গেল থাকার ভয় নেই! ❤️",
  "আজ রাত ৩টায় তোমার মনে হবে বিরিয়ানি খাওয়া দরকার কিন্তু ফ্রিজে কিছুই পাবে না! 🍗",
  "তুমি জলদি একটা ট্রল পেজের মেইন ভিকটিম হতে যাচ্ছো! 🎭"
];

const luckyItems = [
  "ভাঙা চামচ 🥄", "পুরোনো মোজা 🧦", "পঁচা ডিম 🥚", "প্লাস্টিকের বোতল 🍾",
  "ছেঁড়া জুতো 👟", "মশারি 🕸️", "জং ধরা পেরেক 📌", "কাঁচা মরিচ 🌶️",
  "ফুটো হওয়া বালতি 🪣", "বন্ধ হওয়া ঘড়ি ⏰", "পুরোনো দেওয়াশলাই 🧨",
  "খালি ডালের কোটা 🫙", "ছেঁড়া হেডফোন 🎧", "কাচের মার্বেল 🔮",
  "এক টাকার ফুটো কয়েন 🪙", "প্লাস্টিকের চিরুনি 🪮", "মরিচা ধরা চাবি 🔑",
  "ময়লার ঝুড়ি 🗑️", "ভাঙা পাওয়ার ব্যাংক 🔋", "শুকনো লেবু 🍋"
];

async function runBabaPrediction(bot, chatId, messageId, senderName, targetName) {
  try {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    const randomItem = luckyItems[Math.floor(Math.random() * luckyItems.length)];
    const loveScore = Math.floor(Math.random() * 101);

    const magicResponse = 
`🔮 » 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━━━━

👤 𝗖 𝗢 𝗥: ${senderName}
🎯 𝗧𝗔𝗥𝗚𝗘𝗧: ${targetName}

🛡️ গোপন টাইটেল: ${randomTitle}
❤️ লাভ মিটার: ${loveScore}%
🍀 লাকি আইটেম: ${randomItem}

📜 ভবিষ্যতের বাণী:
» ${randomPrediction}

━━━━━━━━━━━━━━━━━━
🏆 » 𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝗕𝗢𝗧 ⚡`;

    await bot.sendMessage(chatId, magicResponse, {
      reply_to_message_id: messageId
    });
  } catch (err) {
    console.error("Baba Send Error:", err.message);
  }
}

module.exports = {
  name: "baba",
  aliases: ["bhobisshot", "babaon", "babaoff"],
  version: "4.0.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "fun",
  shortDescription: "Magical Fortune Predictor & Auto Target 🔮",

  execute: async (bot, msg, argsText = "") => {
    try {
      const chatId = msg.chat.id;
      const messageId = msg.message_id;
      const senderName = msg.from?.first_name || "COMMANDER USER";
      
      const text = (typeof argsText === "string" ? argsText : msg.text || "").trim();
      const args = text.split(/\s+/);
      const subCommand = args[0]?.toLowerCase();

      // ১. অটো টার্গেট অন (/baba on)
      if (subCommand === "on") {
        if (!msg.reply_to_message || !msg.reply_to_message.from) {
          return bot.sendMessage(
            chatId,
            "⚠️ যাকে অটো টার্গেট করতে চান তার মেসেজে রিপ্লাই দিয়ে '/baba on' লিখুন!",
            { reply_to_message_id: messageId }
          );
        }

        const targetUser = msg.reply_to_message.from;
        const targetId = targetUser.id;
        const targetName = targetUser.first_name || "TARGET USER";

        global.babaAutoTargets[targetId] = { targetName };

        return bot.sendMessage(
          chatId,
          `✅ [ ${targetName} ] এর জন্য বাবা সিয়ামের অটো ভবিষ্যৎবাণী মোড চালু করা হলো!`,
          { reply_to_message_id: messageId }
        );
      }

      // ২. অটো টার্গেট অফ (/baba off)
      if (subCommand === "off") {
        if (msg.reply_to_message && msg.reply_to_message.from) {
          const targetId = msg.reply_to_message.from.id;
          if (global.babaAutoTargets[targetId]) {
            delete global.babaAutoTargets[targetId];
            return bot.sendMessage(chatId, "❌ অটো ভবিষ্যৎবাণী মোড বন্ধ করা হলো।", {
              reply_to_message_id: messageId
            });
          }
        }

        global.babaAutoTargets = {};
        return bot.sendMessage(chatId, "❌ সব রানিং অটো ভবিষ্যৎবাণী মোড বন্ধ করা হলো।", {
          reply_to_message_id: messageId
        });
      }

      // ৩. সাধারণ ভবিষ্যৎবাণী
      let targetName = senderName;
      if (msg.reply_to_message && msg.reply_to_message.from) {
        targetName = msg.reply_to_message.from.first_name || "TARGET USER";
      }

      await runBabaPrediction(bot, chatId, messageId, senderName, targetName);
    } catch (e) {
      console.error("Baba Execute Error:", e.message);
    }
  },

  // ৪. অটো চ্যাট লিসেনার
  onChat: async (bot, msg) => {
    try {
      if (!msg || !msg.from) return;

      const senderId = msg.from.id;
      if (global.babaAutoTargets && global.babaAutoTargets[senderId]) {
        const senderName = msg.from.first_name || "User";
        const targetData = global.babaAutoTargets[senderId];
        await runBabaPrediction(
          bot,
          msg.chat.id,
          msg.message_id,
          senderName,
          targetData.targetName || senderName
        );
      }
    } catch (e) {
      console.error("Baba OnChat Error:", e.message);
    }
  }
};
