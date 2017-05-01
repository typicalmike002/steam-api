const SteamUser = require('steam-user');
const client = new SteamUser();

client.logOn({
    accountName: 'typicalmike002',
    password: 'M237283274l!'
});

const TradeOfferManager = require('steam-tradeoffer-manager');
var manager;

client.on('loggedOn', (details) => {
    console.log('example.js has logged into Steam as ' + client.steamID);

    // client has to be successfully logged on first for TradeOfferManager to work:
    manager = new TradeOfferManager({
        steam: client,
        domain: "gmail.com",
        language: "en", // english item description.
        pollInterval: 10000, // poll steam every 10 seconds.
        cancelTime: 30000 // Expire any outgoing trade offers that have been up for 5+ minutes.
    });
});

client.on('error', (err) => {
    console.log('example.js has return an error. ' + err);
    process.exit(1);
});

module.exports = {
    'getBotInventory': (appID, contextID) => {
        return manager.getInventoryContents(appID, contextID, false, (err, inventory, currencies) => {
            if (err) {
                throw new Error(err); 
            }
            return {
                inventory: inventory,
                currencies: currencies
            }
        });
    }
};