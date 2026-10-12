const yts = require("yt-search");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

function toBold(str) {
    if (!str) return "";
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
  config: {
    name: "song",
    version: "9.3.0",
    author: LOCKED_AUTHOR,
    role: 0,
    description: "Stable YouTube music downloader",
    category: "media",
    guide: "song <name/link>",
    cooldowns: 5
  },

  execute: async (bot, msg, args) => {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      module.exports.config.author = LOCKED_AUTHOR;
    }

    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (!args || !args.length) {
      return bot.sendMessage(
        chatId,
        toBold("⚠️ গানের নাম বা YouTube link দিন"),
        { reply_to_message_id: messageId }
      );
    }

    let query = args.join(" ");
    let ytLink = query;

    try {
      if (!ytLink.includes("youtu")) {
        const search = await yts(query);

        if (!search?.videos?.length) {
          return bot.sendMessage(
            chatId,
            toBold("❌ গান পাওয়া যায়নি"),
            { reply_to_message_id: messageId }
          );
        }

        ytLink = search.videos[0].url;
      }

      const loading = await bot.sendMessage(
        chatId,
        toBold("🎧 Downloading..."),
        { reply_to_message_id: messageId }
      );

      const apiRes = await axios.get(`https://noobs-api.top/dipto/ytmp3?url=${ytLink}`);
      const downloadLink = apiRes.data?.download?.audio || apiRes.data?.audio || apiRes.data?.downloadUrl;
      const title = apiRes.data?.title || "Unknown Song";

      if (!downloadLink) {
        try { await bot.deleteMessage(chatId, loading.message_id); } catch (e) {}
        return bot.sendMessage(
          chatId,
          toBold("❌ গান ডাউনলোড লিংক পাওয়া যায়নি"),
          { reply_to_message_id: messageId }
        );
      }

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `song_${Date.now()}.mp3`);

      const response = await axios({
        url: downloadLink,
        method: "GET",
        responseType: "stream",
        timeout: 60000
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      try { await bot.deleteMessage(chatId, loading.message_id); } catch (e) {}

      const captionText = 
`🎵 SONG DOWNLOADED

📌 Title: ${title}
🔗 Link: ${ytLink}
👑 BOT OWNER: SIYAM-HASAN`;

      await bot.sendAudio(
        chatId,
        fs.createReadStream(filePath),
        {
          caption: toBold(captionText),
          reply_to_message_id: messageId
        }
      );

      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {}

    } catch (err) {
      try {
        bot.sendMessage(
          chatId,
          toBold("❌ সমস্যা হয়েছে 🚨বস সিয়াম এর ইনবক্সে নক দাও"),
          { reply_to_message_id: messageId }
        );
      } catch (e) {}
    }
  },

  onStart: async function (context, msg, args) {
    if (context.bot && msg) {
      return module.exports.execute(context.bot, msg, args);
    }
    return module.exports.execute(context.api, context.event, context.args);
  },

  run: async function (context, msg, args) {
    return module.exports.onStart(context, msg, args);
  }
};
