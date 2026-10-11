const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

module.exports = {
    name: "uid",
    aliases: ["id", "myid", "userid"],
    version: "6.0",
    author: "SIYAM-HASAN",
    role: 0,
    category: "user",
    shortDescription: "Get user ID card",

    execute: async (bot, msg) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;

        let targetUser = msg.from;
        if (msg.reply_to_message && msg.reply_to_message.from) {
            targetUser = msg.reply_to_message.from;
        }

        const targetID = String(targetUser.id);
        const rawName = (targetUser.first_name + " " + (targetUser.last_name || "")).trim();
        // কোনো স্কয়ার বক্স যেন না আসে তাই শুধুমাত্র ইংরেজি অক্ষর বা সেফ ক্যারেক্টার ফিল্টার করা হলো
        const userName = rawName.replace(/[^\x00-0x7F]/g, "").trim() || "Telegram User";

        try {
            const width = 820;
            const height = 480;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext("2d");

            // Gradient Background
            const bg = ctx.createLinearGradient(0, 0, width, height);
            bg.addColorStop(0, "#1c0a16");
            bg.addColorStop(0.5, "#3b1540");
            bg.addColorStop(1, "#1a0b1c");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Card Frame
            roundRect(ctx, 20, 20, 780, 440, 26);
            ctx.fillStyle = "rgba(25, 12, 32, 0.9)";
            ctx.fill();

            ctx.strokeStyle = "rgba(251, 113, 133, 0.6)";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Header Banner
            const headerGrad = ctx.createLinearGradient(45, 40, 775, 40);
            headerGrad.addColorStop(0, "#fb7185");
            headerGrad.addColorStop(1, "#c084fc");
            ctx.fillStyle = headerGrad;
            roundRect(ctx, 45, 40, 730, 52, 14);
            ctx.fill();

            ctx.font = "bold 28px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.fillText("TELEGRAM USER ID CARD", 410, 76);

            // Profile Picture Handling
            const avatarSize = 175;
            const avatarX = 70;
            const avatarY = 120;

            let userAvatarImg = null;
            try {
                const photos = await bot.getUserProfilePhotos(targetUser.id, { limit: 1 });
                if (photos && photos.total_count > 0) {
                    const fileId = photos.photos[0][0].file_id;
                    const fileLink = await bot.getFileLink(fileId);
                    userAvatarImg = await loadImage(fileLink);
                }
            } catch (e) {}

            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.clip();

            if (userAvatarImg) {
                ctx.drawImage(userAvatarImg, avatarX, avatarY, avatarSize, avatarSize);
            } else {
                ctx.fillStyle = "#4a1d3a";
                ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
                ctx.font = "bold 42px Arial";
                ctx.fillStyle = "#f9a8d4";
                ctx.textAlign = "center";
                ctx.fillText(userName.charAt(0) || "U", avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 16);
            }
            ctx.restore();

            // Avatar Ring
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2);
            ctx.strokeStyle = "#fb7185";
            ctx.lineWidth = 4;
            ctx.stroke();

            // User Info Boxes
            ctx.fillStyle = "rgba(45, 20, 50, 0.85)";
            roundRect(ctx, 290, 115, 480, 100, 16);
            ctx.fill();

            ctx.font = "bold 15px Arial";
            ctx.fillStyle = "#f9a8d4";
            ctx.textAlign = "left";
            ctx.fillText("USER NAME", 320, 150);

            ctx.font = "bold 26px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(userName.length > 22 ? userName.slice(0, 22) + "..." : userName, 320, 190);

            ctx.fillStyle = "rgba(45, 20, 50, 0.85)";
            roundRect(ctx, 290, 235, 480, 100, 16);
            ctx.fill();

            ctx.font = "bold 15px Arial";
            ctx.fillStyle = "#e9d5ff";
            ctx.fillText("USER ID", 320, 270);

            ctx.font = "bold 26px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(targetID, 320, 310);

            // Footer
            ctx.fillStyle = "rgba(50, 20, 55, 0.9)";
            roundRect(ctx, 50, 360, 720, 70, 16);
            ctx.fill();

            ctx.font = "bold 24px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.fillText("Owner: SIYAM HASAN", 410, 405);

            const cachePath = path.join(__dirname, "..", "cache");
            await fs.ensureDir(cachePath);
            const filePath = path.join(cachePath, `uid_${Date.now()}.png`);
            await fs.writeFile(filePath, canvas.toBuffer("image/png"));

            await bot.sendPhoto(chatId, fs.createReadStream(filePath), {
                caption: `🆔 **User ID:** \`${targetID}\``,
                parse_mode: "Markdown",
                reply_to_message_id: messageId
            });

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        } catch (err) {
            console.error(err);
            bot.sendMessage(chatId, `🆔 **Your ID:** \`${targetID}\``, { parse_mode: "Markdown", reply_to_message_id: messageId });
        }
    }
};
