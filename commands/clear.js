module.exports = {
  name: "clear",
  aliases: ["clean", "cls", "unsend", "del"],
  version: "2.0.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0,
  category: "owner",
  shortDescription: "Delete recent messages from chat 🧹",

  execute: async (bot, msg, argsText) => {
    const chatId = msg.chat.id;
    const currentMsgId = msg.message_id;

    try {
      // কতগুলো মেসেজ ডিলিট করা হবে তা পার্স করা (ডিফল্ট ১০০)
      let amount = 100;
      let args = [];

      if (Array.isArray(argsText)) {
        args = argsText;
      } else if (typeof argsText === "string" && argsText.trim()) {
        args = argsText.trim().split(/\s+/);
      } else if (msg.text) {
        args = msg.text.trim().split(/\s+/).slice(1);
      }

      if (args[0] && !isNaN(args[0])) {
        amount = Math.min(parseInt(args[0]), 100); // সর্বোচ্চ ১০০টি মেসেজ লিমিট
      }

      // বর্তমান মেসেজ আইডি থেকে পিছনের মেসেজগুলো ডিলিট করার রিকোয়েস্ট
      const deletePromises = [];
      for (let i = 0; i <= amount; i++) {
        const targetMsgId = currentMsgId - i;
        if (targetMsgId > 0) {
          deletePromises.push(
            bot.deleteMessage(chatId, targetMsgId).catch(() => {})
          );
        }
      }

      await Promise.all(deletePromises);

      // মেসেজ ক্লিয়ার হওয়ার পর একটি কনফার্মেশন পাঠানো
      const statusMsg = await bot.sendMessage(
        chatId,
        `**🧹 CLEANED UP TO ${amount} RECENT MESSAGES SUCCESSFULLY!**`,
        { parse_mode: "Markdown" }
      );

      // ৩ সেকেন্ড পর কনফার্মেশন মেসেজটিও স্বয়ংক্রিয়ভাবে মুছে ফেলা
      setTimeout(() => {
        bot.deleteMessage(chatId, statusMsg.message_id).catch(() => {});
      }, 3000);

    } catch (err) {
      console.error("Clear Command Error:", err.message);
    }
  }
};
