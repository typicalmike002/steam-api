const SteamUser = require('steam-user');
const client = new SteamUser();
const clientCreds = require('./example.creds.json');
const crypto = require('crypto');

client.logOn(clientCreds);

const TradeOfferManager = require('steam-tradeoffer-manager');
var manager;

client.on('loggedOn', (details) => {
    console.log('example.js has logged in with SteamID: ' + client.steamID);

    // client has to be successfully logged on first for TradeOfferManager to work:
    manager = new TradeOfferManager({
        steam: client,
        domain: "gmail.com",
        language: "en", // english item description.
        pollInterval: 10000, // poll steam every 10 seconds.
        cancelTime: 30000 // Expire any outgoing trade offers that have been up for 5+ minutes.
    });
});

client.on('webSession', (session, cookies) => {
    console.log('example.js has started a web session with ID: ' + session);
    manager.setCookies(cookies);
});

client.on('error', (err) => {
    console.error('example.js has return an error. ' + err);
    process.exit(1);
});

module.exports = {
    'getBotInventory': (appID, contextID) => {
        return manager.getInventoryContents(appID, contextID, false, (err, inventory, currencies) => {
            if (err) {
                throw new Error(err); 
            }
            console.log('sussess');
            console.log(inventory);
            return {
                inventory: inventory,
                currencies: currencies
            }
        });
    }
};