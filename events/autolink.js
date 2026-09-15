const fs = require("fs");
const path = require("path");
const axios = require("axios");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const COMMAND_NAME = "autolink";

module.exports = (bot) => {
    bot.on("message", async (msg) => {
        try {
            if (!msg || !msg.chat || !msg.text) return;

            const chatId = msg.chat.id;
            const messageId = msg.message_id;
            const message = msg.text;

            const urlRegex = new RegExp("https?:\\/\\/[^\\s]+", "g");
            const linkMatches = message.match(urlRegex);
            if (!linkMatches || linkMatches.length === 0) return;

            const uniqueLinks = [...new Set(linkMatches)];

            try {
                if (typeof bot.setMessageReaction === "function") {
                    await bot.setMessageReaction(chatId, messageId, {
                        reaction: JSON.stringify([{ type: "emoji", emoji: "⏳" }])
                    });
                }
            } catch (e) {}

            let successCount = 0;
            let failCount = 0;

            const cacheDir = path.join(__dirname, "..", "cache");
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

            for (const url of uniqueLinks) {
                let loadingMsg = null;
                let tempPath = null;

                try {
                    try {
                        loadingMsg = await bot.sendMessage(chatId, "⏳ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐈𝐍𝐆 𝐕𝐈𝐃𝐄𝐎... 𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝐀𝐈𝐓", {
                            reply_to_message_id: messageId
                        });
                    } catch (e) {}

                    let videoUrl = null;
                    let title = "Video File";

                    // প্রধান ও নতুন অল-ইন-ওয়ান API তালিকা
                    const downloadApis = [
                        `https://api.siputzx.my.id/api/d/alldown?url=${encodeURIComponent(url)}`,
                        `https://widipe.com/download/alldown?url=${encodeURIComponent(url)}`,
                        `https://api.cynthia.my.id/api/alldownload?url=${encodeURIComponent(url)}`
                    ];

                    for (const api of downloadApis) {
                        try {
                            const res = await axios.get(api, { timeout: 20000 });
                            const d = res.data;
                            if (d && d.data && (d.data.video || d.data.url || d.data.mp4)) {
                                videoUrl = d.data.video || d.data.url || d.data.mp4;
                                if (d.data.title) title = d.data.title;
                                break;
                            } else if (d && d.result && (d.result.url || d.result.video)) {
                                videoUrl = d.result.url || d.result.video;
                                if (d.result.title) title = d.result.title;
                                break;
                            }
                        } catch (e) {}
                    }

                    // টিকটক এর বিশেষ ব্যাকআপ
                    if (!videoUrl && url.includes("tiktok.com")) {
                        try {
                            const ttRes = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, { timeout: 10000 });
                            if (ttRes.data && ttRes.data.data && ttRes.data.data.play) {
                                videoUrl = ttRes.data.data.play;
                                title = ttRes.data.data.title || title;
                            }
                        } catch (e) {}
                    }

                    // ফেসবুক এর বিশেষ ব্যাকআপ
                    if (!videoUrl && (url.includes("facebook.com") || url.includes("fb.watch"))) {
                        try {
                            const fbRes = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                            if (fbRes.data && fbRes.data.data && fbRes.data.data.urls) {
                                videoUrl = fbRes.data.data.urls[0].hd || fbRes.data.data.urls[0].sd;
                            }
                        } catch (e) {}
                    }

                    if (!videoUrl) {
                        failCount++;
                        continue;
                    }

                    const vidRes = await axios.get(videoUrl, {
                        responseType: "arraybuffer",
                        headers: { "User-Agent": "Mozilla/5.0" },
                        timeout: 60000
                    });

                    const videoBuffer = Buffer.from(vidRes.data);
                    const fileSizeInMB = videoBuffer.length / (1024 * 1024);

                    if (fileSizeInMB > 50) {
                        failCount++;
                        continue;
                    }

                    tempPath = path.join(cacheDir, `autolink_${Date.now()}.mp4`);
                    fs.writeFileSync(tempPath, videoBuffer);

                    const captionText = `📥 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃\n━━━━━━━━━━━━━━━\n🎬 𝐓𝐈𝐓𝐋𝐄 : ${title || "Video File"}\n📦 𝐒𝐈𝐙𝐄 : ${fileSizeInMB.toFixed(2)} 𝐌𝐁\n━━━━━━━━━━━━━━━\n🦋 ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

                    await bot.sendVideo(chatId, fs.createReadStream(tempPath), {
                        reply_to_message_id: messageId,
                        caption: captionText
                    });

                    successCount++;

                } catch (err) {
                    failCount++;
                } finally {
                    if (loadingMsg) {
                        try {
                            await bot.deleteMessage(chatId, loadingMsg.message_id);
                        } catch (e) {}
                    }
                    if (tempPath && fs.existsSync(tempPath)) {
                        try {
                            fs.unlinkSync(tempPath);
                        } catch (e) {}
                    }
                }
            }

            const finalReaction = successCount > 0 && failCount === 0 ? "✅" : successCount > 0 ? "⚠️" : "❌";
            try {
                if (typeof bot.setMessageReaction === "function") {
                    await bot.setMessageReaction(chatId, messageId, {
                        reaction: JSON.stringify([{ type: "emoji", emoji: finalReaction }])
                    });
                }
            } catch (e) {}

        } catch (globalErr) {}
    });
};
