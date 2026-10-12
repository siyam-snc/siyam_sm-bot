const os = require("os");

const LOCKED_AUTHOR = "SIYAM-HASAN";

// Convert English text to Bold Unicode correctly
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
    name: "uptime",
    aliases: ["up", "status"],
    version: "6.0",
    author: LOCKED_AUTHOR,
    role: 0,
    category: "system",
    shortDescription: "Advanced real-time bot status",

    execute: async (bot, msg) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;

        try {
            const uptime = process.uptime();

            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            const memory = process.memoryUsage();

            const usedRAM = (
                memory.heapUsed / 1024 / 1024
            ).toFixed(1);

            const totalHeap = (
                memory.heapTotal / 1024 / 1024
            ).toFixed(1);

            const pingStart = Date.now();

            const cpuLoad = os.loadavg()[0].toFixed(2);
            const cpuCores = os.cpus().length;

            const totalMemGB = (
                os.totalmem() / 1024 / 1024 / 1024
            ).toFixed(1);

            const freeMemGB = (
                os.freemem() / 1024 / 1024 / 1024
            ).toFixed(1);

            const usedMemGB = (
                Number(totalMemGB) - Number(freeMemGB)
            ).toFixed(1);

            const platform = os.platform().toUpperCase();
            const arch = os.arch().toUpperCase();
            const nodeVersion = process.version;

            const ping = Date.now() - pingStart;

            const statusText =
`╭━❮ ${toBold("SIYAM-HASAN • BOT STATUS")} ❯━╮
┃
┣ ⏱️ ${toBold("UPTIME")}: ${toBold(`${days}D ${hours}H ${minutes}M ${seconds}S`)}
┣ ⚡ ${toBold("PING")}: ${toBold(`${ping} MS`)}
┣ 🧠 ${toBold("PROCESS 
┣ 🎀 RAM")}: ${toBold(`${usedRAM} / ${totalHeap} MB`)}
┣ 💻 ${toBold("CPU LOAD")}: 
┣ 🌚 ${toBold(`${cpuLoad} (${cpuCores} CORES)`)}
┣ 📊 ${toBold("SYSTEM 
┣ 🔐 RAM")}: ${toBold(`${usedMemGB} / ${totalMemGB} GB`)}
┃
┣ ⚙️ ${toBold("NODE.JS")}: ${toBold(nodeVersion)}
┣ 🖥️ ${toBold("PLATFORM")}: ${toBold(`${platform} (${arch})`)}
┃
┣ 👑 ${toBold("OWNER")}: ${toBold("SIYAM HASAN")}
┣ 🤖 ${toBold("BOT")}: ${toBold("NIJHUM CHATBOT")}
╰━═━═━═━═━═━═━═━═━═━╯`;

            await bot.sendMessage(chatId, statusText, {
                reply_to_message_id: messageId
            });

        } catch (err) {
            console.error("Uptime command error:", err);

            await bot.sendMessage(
                chatId,
                `⚠️ ${toBold("FAILED TO FETCH SYSTEM STATUS")}`,
                {
                    reply_to_message_id: messageId
                }
            );
        }
    }
};
