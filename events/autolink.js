const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { execFile } = require("child_process");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const COMMAND_NAME = "autolink";

const CACHE_DIR = path.join(__dirname, "..", "cache");
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const DOWNLOAD_TIMEOUT = 120000;

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function runYtDlp(url, outputPath) {
    return new Promise((resolve, reject) => {
        execFile(
            "yt-dlp",
            [
                "--no-playlist",
                "--no-warnings",
                "--no-progress",
                "--restrict-filenames",
                "--max-filesize",
                "50M",
                "-f",
                "best[ext=mp4]/best",
                "-o",
                outputPath,
                "--print",
                "after_move:filepath",
                url
            ],
            {
                timeout: DOWNLOAD_TIMEOUT,
                maxBuffer: 10 * 1024 * 1024
            },
            (error, stdout, stderr) => {
                if (error) {
                    reject(
                        new Error(
                            stderr?.trim() ||
                            stdout?.trim() ||
                            error.message
                        )
                    );
                    return;
                }

                const lines = stdout
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(Boolean);

                const finalPath =
                    lines.find(line => fs.existsSync(line)) ||
                    outputPath;

                if (!fs.existsSync(finalPath)) {
                    reject(new Error("Downloaded file was not found"));
                    return;
                }

                resolve(finalPath);
            }
        );
    });
}

async function getDirectVideo(url) {
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

            const videoUrl = candidates.find(
                value =>
                    typeof value === "string" &&
                    /^https?:\/\//i.test(value)
            );

            if (videoUrl) {
                return {
                    url: videoUrl,
                    title:
                        data?.data?.title ||
                        data?.result?.title ||
                        data?.title ||
                        "Video File"
                };
            }
        } catch (e) {}
    }

    if (/tiktok\.com/i.test(url)) {
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
                return {
                    url: data.play,
                    title: data.title || "TikTok Video"
                };
            }
        } catch (e) {}
    }

    return null;
}

async function downloadDirectVideo(videoUrl, filePath) {
    const response = await axios.get(videoUrl, {
        responseType: "stream",
        timeout: 90000,
        maxContentLength: MAX_FILE_SIZE,
        maxBodyLength: MAX_FILE_SIZE,
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "video/*,*/*;q=0.8"
        }
    });

    const contentLength = Number(response.headers["content-length"] || 0);

    if (contentLength > MAX_FILE_SIZE) {
        throw new Error("Video is larger than 50 MB");
    }

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        let total = 0;

        response.data.on("data", chunk => {
            total += chunk.length;

            if (total > MAX_FILE_SIZE) {
                response.data.destroy();
                writer.destroy();
                reject(new Error("Video is larger than 50 MB"));
            }
        });

        response.data.on("error", reject);
        writer.on("error", reject);

        writer.on("finish", () => {
            if (!fs.existsSync(filePath)) {
                reject(new Error("Video file was not created"));
                return;
            }

            resolve(filePath);
        });

        response.data.pipe(writer);
    });
}

function getErrorText(error) {
    const text = String(error?.message || error || "");

    if (/50\s?M|larger than 50|maximum file size/i.test(text)) {
        return "ভিডিও 50 MB-এর বেশি";
    }

    if (/unsupported|no video|unable to download/i.test(text)) {
        return "এই লিংকের ভিডিও পাওয়া যায়নি";
    }

    if (/timed out|timeout/i.test(text)) {
        return "ডাউনলোডের সময় শেষ হয়ে গেছে";
    }

    if (/yt-dlp.*not found|not recognized/i.test(text)) {
        return "Server-এ yt-dlp install করা নেই";
    }

    return "ভিডিও ডাউনলোড করা যায়নি";
}

module.exports = (bot) => {
    bot.on("message", async msg => {
        if (!msg || !msg.chat || !msg.text) return;

        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const message = msg.text;

        const urlRegex = /https?:\/\/[^\s<>"']+/gi;
        const matches = message.match(urlRegex);

        if (!matches || !matches.length) return;

        const uniqueLinks = [
            ...new Set(
                matches.map(url =>
                    url.replace(/[),.!?]+$/, "")
                )
            )
        ];

        let loadingMessage = null;
        let successCount = 0;
        let failCount = 0;
        const failures = [];

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

            let tempPath = null;

            try {
                if (loadingMessage?.message_id) {
                    try {
                        await bot.editMessageText(
                            `⏳ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐈𝐍𝐆...\n━━━━━━━━━━━━━━━\n📥 𝐏𝐑𝐎𝐂𝐄𝐒𝐒 : ${i + 1}/${uniqueLinks.length}\n🔗 ${url}\n⚡ 𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝐀𝐈𝐓...`,
                            {
                                chat_id: chatId,
                                message_id: loadingMessage.message_id
                            }
                        );
                    } catch (e) {}
                }

                const fileBase =
                    `autolink_${Date.now()}_${i}`;

                const ytDlpPath = path.join(
                    CACHE_DIR,
                    `${fileBase}.mp4`
                );

                let title = "Video File";
                let downloadedPath = null;

                try {
                    downloadedPath = await runYtDlp(
                        url,
                        ytDlpPath
                    );
                } catch (ytError) {
                    const direct = await getDirectVideo(url);

                    if (!direct?.url) {
                        throw ytError;
                    }

                    title = direct.title || title;

                    tempPath = path.join(
                        CACHE_DIR,
                        `${fileBase}_direct.mp4`
                    );

                    downloadedPath =
                        await downloadDirectVideo(
                            direct.url,
                            tempPath
                        );
                }

                if (!downloadedPath || !fs.existsSync(downloadedPath)) {
                    throw new Error("Video file not found");
                }

                tempPath = downloadedPath;

                const stat = fs.statSync(tempPath);

                if (stat.size > MAX_FILE_SIZE) {
                    throw new Error(
                        "Video is larger than 50 MB"
                    );
                }

                if (stat.size === 0) {
                    throw new Error(
                        "Downloaded file is empty"
                    );
                }

                const fileSizeInMB =
                    stat.size / (1024 * 1024);

                const safeTitle =
                    String(title || "Video File")
                        .replace(
                            /[<>:"/\\|?*\x00-\x1F]/g,
                            ""
                        )
                        .slice(0, 100);

                const captionText =
                    `📥 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `🎬 𝐓𝐈𝐓𝐋𝐄 : ${safeTitle}\n` +
                    `📦 𝐒𝐈𝐙𝐄 : ${fileSizeInMB.toFixed(2)} 𝐌𝐁\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `🦋 ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

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
            } catch (error) {
                failCount++;

                failures.push({
                    index: i + 1,
                    reason: getErrorText(error)
                });
            } finally {
                if (tempPath) {
                    try {
                        if (fs.existsSync(tempPath)) {
                            fs.unlinkSync(tempPath);
                        }
                    } catch (e) {}
                }
            }
        }

        if (loadingMessage?.message_id) {
            try {
                let finalText =
                    `━━━━━━━━━━━━━━━\n` +
                    `📥 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 : ${successCount}\n` +
                    `❌ 𝐅𝐀𝐈𝐋𝐄𝐃 : ${failCount}\n` +
                    `🔗 𝐋𝐈𝐍𝐊𝐒 : ${uniqueLinks.length}`;

                if (successCount === uniqueLinks.length) {
                    finalText =
                        `✅ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄\n` +
                        finalText;
                } else if (successCount > 0) {
                    finalText =
                        `⚠️ 𝐏𝐀𝐑𝐓𝐈𝐀𝐋𝐋𝐘 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄\n` +
                        finalText;
                } else {
                    finalText =
                        `❌ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐅𝐀𝐈𝐋𝐄𝐃\n` +
                        finalText;
                }

                if (failures.length) {
                    finalText += `\n━━━━━━━━━━━━━━━`;

                    for (const failure of failures) {
                        finalText +=
                            `\n❌ ${failure.index}. ${failure.reason}`;
                    }
                }

                await bot.editMessageText(
                    finalText,
                    {
                        chat_id: chatId,
                        message_id: loadingMessage.message_id
                    }
                );
            } catch (e) {}
        }

        try {
            if (typeof bot.setMessageReaction === "function") {
                const finalReaction =
                    successCount === uniqueLinks.length
                        ? "✅"
                        : successCount > 0
                        ? "⚠️"
                        : "❌";

                await bot.setMessageReaction(
                    chatId,
                    messageId,
                    {
                        reaction: JSON.stringify([
                            {
                                type: "emoji",
                                emoji: finalReaction
                            }
                        ])
                    }
                );
            }
        } catch (e) {}
    });
};
