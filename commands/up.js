const os = require("os");

module.exports = {
  name: "up",
  aliases: ["uptime", "status", "আপ", "system"],
  version: "2.5.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  role: 0, 
  category: "system",
  shortDescription: "Shows bot uptime and system specs",
  longDescription: "Displays bot running time, ping, system RAM, CPU usage, and server details.",
  guide: "{pn}",

  execute: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const startPing = Date.now();

    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const formattedUptime = `${days}d${hours}h ${minutes}m${seconds}s`;

    const memoryUsage = process.memoryUsage();
    const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);

    // Number হিসেবে হিসাব করে শেষে toFixed করা হয়েছে
    const totalMemNum = os.totalmem() / (1024 * 1024 * 1024);
    const freeMemNum = os.freemem() / (1024 * 1024 * 1024);
    const usedMemNum = totalMemNum - freeMemNum;

    const totalMem = totalMemNum.toFixed(2);
    const usedMem = usedMemNum.toFixed(2);

    const endPing = Date.now() - startPing;
    const loadAvg = os.loadavg()[0];
    const cpuLoad = loadAvg ? loadAvg.toFixed(2) : "0.00";
    const cpuCores = os.cpus().length;
    const platform = os.platform().toUpperCase();
    const nodeVersion = process.version;

    // Visual Progress Bar for System RAM Usage
    const ramPercentage = Math.round((usedMemNum / totalMemNum) * 100);
    const filledBlocks = Math.round(ramPercentage / 10);
    const ramBar = "█".repeat(filledBlocks) + "░".repeat(10 - filledBlocks);

    const statusText = 
`___⚡ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃 ⚡___

  ⚙️ 𝐁𝐎𝐓 𝐏𝐄𝐑𝐅𝐎𝐑𝐌𝐀𝐍𝐂𝐄
  ▸ ⏳ 𝐔𝐩𝐭𝐢𝐦𝐞  : \`${formattedUptime}\`
  ▸ 🚀 𝐋𝐚𝐭𝐞𝐧𝐜𝐲 : \`${endPing} ms\`
  __________________________
  🖥️ 𝐒𝐄𝐑𝐕𝐄 𝐒𝐏𝐄𝐂𝐒
  ▸ ⚡ 𝐂𝐏𝐔 𝐋𝐨𝐚𝐝  : \`${cpuLoad}%\` (\`${cpuCores} Cores\`)
  ▸ 💾 𝐏𝐫𝐨𝐜𝐞𝐬𝐬   : 
  ▸ 💾 \`${heapUsed} MB / ${heapTotal} MB\`
  ▸ 🧠 𝐒𝐲𝐬𝐭𝐞𝐦 𝐑𝐀𝐌 : 
  ▸ 🧠 \`${usedMem} GB / ${totalMem} GB\`
  ▸ 📊 𝐔𝐬𝐚𝐠𝐞  : [${ramBar}] \`${ramPercentage}%\`
  __________________________
  📋 𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎
  ▸ 🐧 𝐎𝐒        : \`${platform}\`
  ▸ 🟢 𝐍𝐨𝐝𝐞.𝐣𝐬   : \`${nodeVersion}\`
  ▸ 🆔 𝐏𝐈𝐃        : \`${process.pid}\`
  ___________________________
  👑 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 : 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

    try {
      await bot.sendMessage(chatId, statusText, {
        parse_mode: "Markdown",
        reply_to_message_id: messageId
      });
    } catch (err) {
      console.error("Uptime Command Error:", err.message);
    }
  }
};
