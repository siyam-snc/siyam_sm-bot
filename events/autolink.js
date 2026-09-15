const fs = require("fs");
const path = require("path");
const axios = require("axios");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const COMMAND_NAME = "autolink";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

module.exports = (bot) => {
    bot.on("message", async (msg) => {
        if (!msg || !msg.chat || !msg.text) return;

        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const message = msg.text;

        const urlRegex = /https?:\/\/[^\s<>"']+/gi;
        const matches = message.match(urlRegex);

        if (!matches || !matches.length) return;

        const uniqueLinks = [...new Set(matches.map(url => url.replace(/[),.!?]+$/, "")))];

        const cacheDir = path.join(__dirname, "..", "cache");

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        let loadingMessage = null;
        let successCount = 0;
        let failCount = 0;

        try {
            loadingMessage = await bot.sendMessage(
                chatId,
                `⏳ 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐈𝐍𝐆...\n━━━━━━━━━━━━━━━\n🔗 𝐋𝐈𝐍𝐊𝐒 : ${uniqueLinks.length}\n⚡ 𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝐀𝐈𝐓...`,
                {
                    reply_to_message_id: messageId
                }
            );
        } catch (e) {}

        try {
            if (typeof bot.setMessageReaction === "function") {
                await bot.setMessageReaction(chatId, messageId, {
                    reaction: JSON.stringify([
                        {
                            type: "emoji",
                            emoji: "⏳"
                        }
                    ])
                });
            }
        } catch (e) {}

        for (let i = 0; i < uniqueLinks.length; i++) {
            const url = uniqueLinks[i];

            try {
                if (loadingMessage && loadingMessage.message_id) {
                    try {
                        await bot.editMessageText(
                            `⏳ 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐈𝐍𝐆...\n━━━━━━━━━━━━━━━\n📥 𝐏𝐑𝐎𝐂𝐄𝐒𝐒 : ${i + 1}/${uniqueLinks.length}\n🔗 ${url}\n⚡ 𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝐀𝐈𝐓...`,
                            {
                                chat_id: chatId,
                                message_id: loadingMessage.message_id
                            }
                        );
                    } catch (e) {}
                }

                let videoUrl = null;
                let title = "Video File";

                const apis = [
                    `https://deliriussapi-official.vercel.app/download/alldown?url=${encodeURIComponent(url)}`,
                    `https://api.vreden.web.id/api/ytmp4?url=${encodeURIComponent(url)}`,
                    `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`
                ];

                for (const api of apis) {
                    try {
                        const response = await axios.get(api, {
                            timeout: 20000,
                            headers: {
                                "User-Agent": "Mozilla/5.0"
                            }
                        });

                        const data = response.data;

                        const candidates = [
                            data?.data?.url,
                            data?.data?.download_url,
                            data?.data?.video,
                            data?.data?.videoUrl,
                            data?.result?.url,
                            data?.result?.download_url,
                            data?.result?.video,
                            data?.result?.videoUrl,
                            data?.url,
                            data?.download_url
                        ];

                        const found = candidates.find(
                            value =>
                                typeof value === "string" &&
                                /^https?:\/\//i.test(value)
                        );

                        if (found) {
                            videoUrl = found;

                            title =
                                data?.data?.title ||
                                data?.result?.title ||
                                data?.title ||
                                title;

                            break;
                        }
                    } catch (e) {}
                }

                if (!videoUrl && /tiktok\.com/i.test(url)) {
                    try {
                        const response = await axios.get(
                            `https://tikwm.com/api/?url=${encodeURIComponent(url)}`,
                            {
                                timeout: 20000,
                                headers: {
                                    "User-Agent": "Mozilla/5.0"
                                }
                            }
                        );

                        const data = response.data?.data;

                        if (data?.play) {
                            videoUrl = data.play;
                            title = data.title || title;
                        }
                    } catch (e) {}
                }

                if (!videoUrl) {
                    failCount++;
                    continue;
                }

                const videoResponse = await axios.get(videoUrl, {
                    responseType: "arraybuffer",
                    timeout: 60000,
                    maxContentLength: MAX_FILE_SIZE,
                    maxBodyLength: MAX_FILE_SIZE,
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "video/*,*/*;q=0.8"
                    }
                });

                const videoBuffer = Buffer.from(videoResponse.data);

                if (!videoBuffer.length) {
                    failCount++;
                    continue;
                }

                if (videoBuffer.length > MAX_FILE_SIZE) {
                    failCount++;
                    continue;
                }

                const fileSizeInMB =
                    videoBuffer.length / (1024 * 1024);

                const safeTitle =
                    String(title || "Video File")
                        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
                        .slice(0, 100);

                const tempPath = path.join(
                    cacheDir,
                    `autolink_${Date.now()}_${i}.mp4`
                );

                fs.writeFileSync(tempPath, videoBuffer);

                const captionText =
                    `📥 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `🎬 𝐓𝐈𝐓𝐋𝐄 : ${safeTitle}\n` +
                    `📦 𝐒𝐈𝐙𝐄 : ${fileSizeInMB.toFixed(2)} 𝐌𝐁\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `🦋 ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

                try {
                    await bot.sendVideo(
                        chatId,
                        fs.createReadStream(tempPath),
                        {
                            reply_to_message_id: messageId,
                            caption: captionText,
                            supports_streaming: true
                        }
                    );

                    successCount++;
                } finally {
                    try {
                        if (fs.existsSync(tempPath)) {
                            fs.unlinkSync(tempPath);
                        }
                    } catch (e) {}
                }
            } catch (err) {
                failCount++;
            }
        }

        if (loadingMessage && loadingMessage.message_id) {
            try {
                let finalText;

                if (successCount > 0 && failCount === 0) {
                    finalText =
                        `✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄\n` +
                        `━━━━━━━━━━━━━━━\n` +
                        `📥 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 : ${successCount}\n` +
                        `🔗 𝐋𝐈𝐍𝐊𝐒 : ${uniqueLinks.length}`;
                } else if (successCount > 0) {
                    finalText =
                        `⚠️ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄\n` +
                        `━━━━━━━━━━━━━━━\n` +
                        `📥 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 : ${successCount}\n` +
                        `❌ 𝐅𝐀𝐈𝐋𝐄𝐃 : ${failCount}\n` +
                        `🔗 𝐋𝐈𝐍𝐊𝐒 : ${uniqueLinks.length}`;
                } else {
                    finalText =
                        `❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃\n` +
                        `━━━━━━━━━━━━━━━\n` +
                        `❌ 𝐅𝐀𝐈𝐋𝐄𝐃 : ${failCount}\n` +
                        `🔗 𝐋𝐈𝐍𝐊𝐒 : ${uniqueLinks.length}`;
                }

                await bot.editMessageText(finalText, {
                    chat_id: chatId,
                    message_id: loadingMessage.message_id
                });
            } catch (e) {}
        }

        try {
            if (typeof bot.setMessageReaction === "function") {
                const finalReaction =
                    successCount > 0 && failCount === 0
                        ? "✅"
                        : successCount > 0
                        ? "⚠️"
                        : "❌";

                await bot.setMessageReaction(chatId, messageId, {
                    reaction: JSON.stringify([
                        {
                            type: "emoji",
                            emoji: finalReaction
                        }
                    ])
                });
            }
        } catch (e) {}
    });
};
