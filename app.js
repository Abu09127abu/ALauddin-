const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const botToken = '7856472592:AAH4oelCjIzv1pPvOy7I0JJliFnLgOwR6Xs';
const botApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

// ডাটাবেজ (সাধারণ ভাবে MongoDB বা Firebase ব্যবহৃত হতে পারে)
// এটি পরীক্ষার জন্য একটি সহজ অবজেক্ট ব্যবহার করা হলো
let users = {};

app.post('/webhook', async (req, res) => {
    const message = req.body.message;

    if (message) {
        const userId = message.from.id;
        const text = message.text;

        if (text === '/start') {
            // রেফারেল লিংক থেকে যদি নতুন ইউজার আসে
            const refUserId = parseInt(message.text.split('=')[1]);

            // রেফার করা ইউজারের কয়েন বৃদ্ধি করা
            if (refUserId && users[refUserId]) {
                users[refUserId].coins += 1000;
                await axios.post(botApiUrl, {
                    chat_id: refUserId,
                    text: "আপনার রেফারেল থেকে ১০০০ কয়েন অর্জন করেছেন!",
                });
            }

            // নতুন ইউজারকে ২০০ কয়েন দেয়া
            if (!users[userId]) {
                users[userId] = { coins: 200, referrals: [] };
                await axios.post(botApiUrl, {
                    chat_id: userId,
                    text: "আপনি ২০০ কয়েন পেয়েছেন!",
                });
            }
        }
    }

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});