<div align="center">

  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyZjFucnFmdjRsc2p3ZDJyM2h6Znd6MWU2Nm1zYndxeHprZmdqOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svvjDDy267/giphy.gif" width="220px" alt="Cyber Bot Animation">

  <h1>🤖 SIYAM SM TELEGRAM BOT</h1>
  <p><i>An Advanced, Modular & Dynamic Telegram User/Group Management Bot written in Node.js</i></p>

  <p>
    <a href="https://github.com/siyam-snc/siyam_sm-bot/stargazers"><img src="https://img.shields.io/github/stars/siyam-snc/siyam_sm-bot?style=for-the-badge&color=gold" alt="Stars"></a>
    <a href="https://github.com/siyam-snc/siyam_sm-bot/network/members"><img src="https://img.shields.io/github/forks/siyam-snc/siyam_sm-bot?style=for-the-badge&color=blue" alt="Forks"></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v20-green?style=for-the-badge&logo=node.js" alt="Node.js"></a>
    <a href="https://telegram.org/"><img src="https://img.shields.io/badge/Telegram-BotAPI-blue?style=for-the-badge&logo=telegram" alt="Telegram"></a>
  </p>

  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-842c-439613e470e0.gif" width="100%" alt="Header Line">

</div>

---

## 🎭 About The Bot

**SIYAM SM BOT** হলো একটি আধুনিক ও শক্তিশালী টেলিগ্রাম বট। এতে রয়েছে ইনস্ট্যান্ট ফাইল লোডার, অটো-রিয়েকশন, স্প্যাম প্রোটোকল, হোয়াইটলিস্ট সিকিউরিটি চেইন এবং অ্যাডভান্সড অ্যাডমিন কন্ট্রোল সিস্টেম।

<div align="center">
  <img src="https://media.giphy.com/media/uVqJA3SUJ4M4VJ82yU/giphy.gif" width="450px" alt="Futuristic Hologram AI Bot">
</div>

---

## ✨ Features Overview

- ⚡ **Dynamic Command Manager:** বট রিস্টার্ট না দিয়েও টেলিগ্রাম থেকেই নতুন কোড বা গিটহাব ফাইল লিংক দিয়ে কমান্ড ইনস্টল, লোড ও আনলোড করার সুবিধা।
- 🛡️ **Role-Based Security:** Owner (Role 2), Admin (Role 1), এবং User (Role 0) ভিত্তিক সুনির্দিষ্ট পাওয়ার ডিস্ট্রিবিউশন।
- 🚫 **Anti-Spam & Anti-Flood Protection:** গ্রুপে স্প্যাম ও ফ্লাড প্রতিরোধক সিকিউরিটি মেকানিজম।
- 🤖 **Auto Reaction System:** ইনকামিং মেসেজে অটোমেটিক ইমোজি রিয়েকশন দেওয়ার ডাইনামিক ইভেন্ট।
- 🔄 **Crash Prevention & Auto Restart:** বটের যেকোনো ইন্টারনাল এররে বট বন্ধ না হয়ে স্বয়ংক্রিয়ভাবে রিস্টার্ট নেওয়ার সুবিধা।
- 🖼️ **Canvas & Imaging Support:** চিত্র বা ফ্রেম জেনারেট করার জন্য Canvas সি-লাইব্রেরি সাপোর্ট।

<div align="center">
  <br>
  <img src="https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" width="400px" alt="Futuristic Tech Interface Animation">
</div>

---

## 🚀 GitHub Actions Deployment Setup (Instant Run)

কেহ যদি এই রিপোজিটরি **Fork** করে গিটহাব অ্যাকশনের মাধ্যমে সম্পূর্ণ ফ্রিতে ২৪/৭ বট চালাতে চায়, তবে তাকে নিচের ধাপগুলো অনুসরণ করতে হবে:

1. আপনার গিটহাব রিপোজিটরির ভেতরে যান।
2. `.github/workflows` নামের ফাইলে আগেরটুকু কেটে ।
3. নিচের কোড ব্লকটি কপি করে ওই ফাইলে পেস্ট করে দিন:

```yaml
name: Telegram Bot Runner

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  run-bot:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm install

      - name: Start Bot
        run: node runner.js
