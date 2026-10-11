module.exports = {
    name: "uid",
    aliases: ["id", "myid", "userid"],
    version: "6.0",
    author: "SIYAM-HASAN",
    role: 0,
    category: "user",
    shortDescription: "Get user ID details",

    execute: async (bot, msg) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;

        let targetUser = msg.from;
        if (msg.reply_to_message && msg.reply_to_message.from) {
            targetUser = msg.reply_to_message.from;
        }

        const targetID = String(targetUser.id);
        const firstName = targetUser.first_name || "N/A";
        const lastName = targetUser.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const username = targetUser.username ? `@${targetUser.username}` : "No Username";

        const uidText = 
`╭━❮ **USER INFORMATION** ❯━╮
┃
┣ 👤 **NAME:** \`${fullName}\`
┣ 🔗 **USERNAME:** \`${username}\`
┣ 🆔 **USER ID:** \`${targetID}\`  *(Tap to copy)*
┃
┣ 👑 **SYSTEM OWNER:** \`SIYAM HASAN\`
┣ 🤖 **BOT:** \`NIJHUM CHATBOT\`
╰━═━═━═━═━═━═━═━═━═━╯`;

        await bot.sendMessage(chatId, uidText, {
            parse_mode: "Markdown",
            reply_to_message_id: messageId
        });
    }
};
