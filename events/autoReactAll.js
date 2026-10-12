const emojiList = [
    "👍", "❤️", "🔥", "🥰", "👏", 
    "🎉", "🤩", "⚡", "😎", "💯", 
    "😍", "🗿", "🌸", "👑", "✨"
];

module.exports = (bot) => {
    bot.on("message", async (msg) => {
        try {
            if (!msg || !msg.chat || !msg.message_id || !msg.from) return;
            if (msg.from.id === bot.token.split(":")[0]) return;

            const chatId = msg.chat.id;
            const messageId = msg.message_id;
            const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

            await bot.setMessageReaction(chatId, messageId, {
                reaction: [{ type: "emoji", emoji: randomEmoji }],
                is_big: false
            });
        } catch (err) {}
    });
};
