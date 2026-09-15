const axios = require("axios");

module.exports = {
  name: "tempmail",
  aliases: ["mail", "tmpmail", "মেইল"],
  version: "1.0.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "utility",
  shortDescription: "Generate temporary disposable email & check inbox for OTP 📧",

  execute: async (bot, msg, argsText) => {
    try {
      const chatId = msg.chat.id;
      const messageId = msg.message_id;

      let args = [];
      if (Array.isArray(argsText)) {
        args = argsText;
      } else if (typeof argsText === "string" && argsText.trim()) {
        args = argsText.trim().split(/\s+/);
      } else if (msg.text) {
        args = msg.text.trim().split(/\s+/).slice(1);
      }

      const subCommand = args[0]?.toLowerCase();

      // ১. ইনবক্স ও OTP চেক করা: /tempmail check email@domain.com
      if (subCommand === "check" || subCommand === "inbox") {
        const email = args[1];
        if (!email || !email.includes("@")) {
          return bot.sendMessage(
            chatId,
            "⚠️ সঠিক ইমেইল ঠিকানা দিন!\n\nউদাহরণ: `/tempmail check example@1secmail.com`",
            { reply_to_message_id: messageId, parse_mode: "Markdown" }
          );
        }

        const [login, domain] = email.split("@");
        const loadingMsg = await bot.sendMessage(chatId, "📥 ইনবক্স চেক করা হচ্ছে...", {
          reply_to_message_id: messageId
        });

        const res = await axios.get(
          `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`
        );

        if (loadingMsg && loadingMsg.message_id) {
          bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
        }

        if (!res.data || res.data.length === 0) {
          return bot.sendMessage(
            chatId,
            `📭 **[ \`${email}\` ]** এ এখনো কোনো মেসেজ বা OTP আসেনি!`,
            { reply_to_message_id: messageId, parse_mode: "Markdown" }
          );
        }

        // সর্বশেষ আসা ইমেইলটি পড়া
        const latestMsg = res.data[0];
        const msgDetail = await axios.get(
          `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${latestMsg.id}`
        );

        const mailData = msgDetail.data;
        const cleanBody = mailData.textBody ? mailData.textBody.substring(0, 800) : "কোনো টেক্সট নেই";

        const replyText = 
`📬 **নতুন মেসেজ / OTP এসেছে!**
━━━━━━━━━━━━━━━━━━
👤 **প্রেরক:** ${mailData.from}
📌 **বিষয়:** ${mailData.subject}
📅 **তারিখ:** ${mailData.date}

📄 **মেসেজ বডি:**
${cleanBody}
━━━━━━━━━━━━━━━━━━
👑 **ENGINE:** 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 ⚡`;

        return bot.sendMessage(chatId, replyText, {
          reply_to_message_id: messageId,
          parse_mode: "Markdown"
        });
      }

      // ২. নতুন ইমেইল জেনারেট করা: /tempmail
      const loadingMsg = await bot.sendMessage(chatId, "📧 নতুন টেম্প মেইল তৈরি করা হচ্ছে...", {
        reply_to_message_id: messageId
      });

      const res = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
      const genEmail = res.data[0];

      if (loadingMsg && loadingMsg.message_id) {
        bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
      }

      const responseText = 
`📧 **আপনার টেম্পোরারি ইমেইল:**
\`${genEmail}\`

📥 **ইনবক্স ও OTP চেক করার নিয়ম:**
কোড পাঠানোর পর মেসেজ দেখতে লিখুন:
\`/tempmail check ${genEmail}\`

💡 *টিপস: ইমেইলের উপর ট্যাপ করলেই কপি হয়ে যাবে!*
━━━━━━━━━━━━━━━━━━
👑 **AUTHOR:** 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 ⚡`;

      return bot.sendMessage(chatId, responseText, {
        reply_to_message_id: messageId,
        parse_mode: "Markdown"
      });

    } catch (err) {
      console.error("Tempmail Error:", err.message);
      return bot.sendMessage(msg.chat.id, "❌ সার্ভারে সমস্যা হচ্ছে, কিছুক্ষণ পর আবার চেষ্টা করুন!", {
        reply_to_message_id: msg.message_id
      });
    }
  }
};
