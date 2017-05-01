const express = require('express');
const request = require('request');
const router = express.Router();
const bot = require('../bots/example');

// application IDs for steam games:
var appID = {
    TF2: 440,
    DOTA2: 570,
    CSGO: 730,
    Steam: 753
};

// (undocumented) context IDs for steam inventory lists:
var contextID = {
    TF2: 2,
    DOTA2: 2,
    CSGO: 2,
    Steam: 6
};

/**
 * root
 *
 * displays a welcome message to the user.
 */
router.get('/', (req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    res.json({
        message: 'Welcome to the steam api'
    });
});

/**
 * /api/profile/:steamID?key=YOURKEYGOESHERE
 *
 * gets the user's profile information.
 */
router.get('/api/profile/:steamID', (req, res, next) => {

    request.get(''
        + 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
        + '?key=' + req.query.key
        + '&steamids=' + req.params.steamID
        , (steamErr, steamRes, steamBody) => {
            if (steamErr){ 
                throw new Error(steamErr.message);
            }

            res.setHeader('Content-type', 'application/json');
            res.json(JSON.parse(steamBody));
        }
    );
});

/** 
 * /api/bot/inventory
 * 
 * gets the example bot's inventory list.
 */
router.get('/api/bot/inventory', (req, res, next) => {
    res.json({
        message: bot.getBotInventory(appID.CSGO, contextID.CSGO)
    });
});



module.exports = router;