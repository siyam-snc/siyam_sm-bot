require('dotenv').config();

module.exports = {
    botToken: process.env.BOT_TOKEN || '8832797161:AAHe2WLvy52_coveOR0EODaD6KWPvo6D2J0',
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
