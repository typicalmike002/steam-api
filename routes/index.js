const express = require('express');
const request = require('request');
const router = express.Router();
const bots = require('../utils/startBots');


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
 * - gets the user's profile information.
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
 * /bot/getInventory/:botname/:game
 * 
 * - Gets inventory items a bot is currently holding by game name.
 *
 * - params: botname  {name of the bot we want}
 *           game     {the steam game of which to load the inventory of}
 */
router.get('/bot/getInventory/:botname/:game', (req, res, next) => {

    bots[req.params.botname].getInventoryByGameName(req.params.game, (err, inventory, currency, length) => {
        if (err){ throw new Error(err); }

        res.json({
            inventory: inventory,
            currency: currency,
            length: length
        });
    });
});

module.exports = router;