require('dotenv').config();

module.exports = {
    botToken: process.env.BOT_TOKEN || '8769306456:AAGEJMrPMcNPCc3-VNZPP4HxQq6vYrhcr2I',
    prefix: '/',
    ownerID: '8442705758',
    
    adminIDs: [
        '7683797493',
        '8442705758'
    ],

    modIDs: [],

    whitelistMode: {
        enable: false,
        whiteListIds: [
            '8442705758',
            '7683797493'
        ]
    }
};
