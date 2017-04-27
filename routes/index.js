const express = require('express');
const request = require('request');
const router = express.Router();

/**
 * root
 */
router.get('/', (req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    res.json({
        message: 'Welcome to the steam api'}
    );
});

/**
 * /api/profile/:steamID?key=YOURKEYGOESHERE
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

module.exports = router;