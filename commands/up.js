const os = require("os");

const LOCKED_AUTHOR = "SIYAM-HASAN";

// স্বাভাবিক ট্যাক্সটকে অটোমেটিক মোটা করার ফাংশন
function toBold(str) {
    const boldMap = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
        'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
        'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
        'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
        'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟩', '8': '𝟴', '9': '𝟵'
    };
    return str.split('').map(c => boldMap[c] || c).join('');
}

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
        const start = Date.now();

        try {
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            const memory = process.memoryUsage();
            const usedRAM = (memory.heapUsed / 1024 / 1024).toFixed(1);
            const totalHeap = (memory.heapTotal / 1024 / 1024).toFixed(1);
            const ping = Date.now() - start;

            const cpuLoad = os.loadavg()[0].toFixed(2);
            const cpuCores = os.cpus().length;
            const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
            const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
            const usedMemGB = (totalMemGB - freeMemGB).toFixed(1);

            const platform = os.platform().toUpperCase();
            const arch = os.arch().toUpperCase();
            const nodeVersion = process.version;

            const statusText = 
`${toBold("SIYAM-HASAN • BOT STATUS")}

⏱️ ${toBold("UPTIME:")} \`${days}d${hours}h ${minutes}m${seconds}s\`
⚡ ${toBold("PING:")} \`${ping} ms\`
🧠 ${toBold("PROCESS RAM:")} \`${usedRAM} /${totalHeap} MB\`
💻 ${toBold("CPU LOAD:")} \`${cpuLoad} (${cpuCores} Cores)\`
📊 ${toBold("SYSTEM RAM:")} \`${usedMemGB} /${totalMemGB} GB\`

⚙️ ${toBold("NODE.JS:")} \`${nodeVersion}\`
🖥️ ${toBold("PLATFORM:")} \`${platform} (${arch})\`

👑 ${toBold("OWNER:")} ${toBold("SIYAM HASAN")}
🤖 ${toBold("BOT:")} ${toBold("NIJHUM CHATBOT")}`;

            await bot.sendMessage(chatId, statusText, {
                parse_mode: "Markdown",
                reply_to_message_id: messageId
            });

        } catch (err) {
            console.error(err);
            bot.sendMessage(chatId, "⚠️ Failed to fetch system status.", { reply_to_message_id: messageId });
        }
    }
};
