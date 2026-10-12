const toBold = (text) => {
    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const bold = [
        ..."𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭",
        ..."𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"
    ];

    return [...String(text)].map(char => {
        const index = normal.indexOf(char);
        return index === -1 ? char : bold[index];
    }).join("");
};

module.exports = {
    name: "uid",
    aliases: ["id"],
    version: "6.0",
    author: "SIYAM-HASAN",
    role: 0,
    category: "user",
    shortDescription: "Get user ID details",

    execute: async (bot, msg) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;

        let targetUser = msg.from;

        if (msg.reply_to_message?.from) {
            targetUser = msg.reply_to_message.from;
        }

        const targetID = String(targetUser.id);
        const firstName = targetUser.first_name || "N/A";
        const lastName = targetUser.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim();

        const username = targetUser.username
            ? `@${targetUser.username}`
            : "No Username";

        const uidText =
`╭━❮ ${toBold("INFORMATION")} ❯━╮
┃
┣ 👤 ${toBold("NAME")}: ${toBold(fullName)}
┣ 🔗 ${toBold("USERNAME")}: ${toBold(username)}
┣ 🆔 ${toBold("USER ID")}: ${targetID}
┃
┣ 👑 ${toBold("OWNER")}: ${toBold("SIYAM HASAN")}
┣ 🤖 ${toBold("NIJHUM CHATBOT")}
╰━═━═━═━═━═━═━═━═━╯`;

        await bot.sendMessage(chatId, uidText, {
            reply_to_message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "📋 𝗖𝗢𝗣𝗬 𝗜𝗗",
                            copy_text: {
                                text: targetID
                            }
                        }
                    ]
                ]
            }
        });
    }
};
