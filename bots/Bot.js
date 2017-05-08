const SteamUser = require('steam-user');
const TradeOfferManager = require('steam-tradeoffer-manager');
const crypto = require('crypto');
const readline = require('readline');

// Interface for inputting the example client's secret.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// application IDs for steam games:
const appIDs = {
    TF2: 440,
    DOTA2: 570,
    CSGO: 730,
    Steam: 753
}

// (undocumented) context IDs for steam inventory lists:
const contextIDs = {
    TF2: 2,
    DOTA2: 2,
    CSGO: 2,
    Steam: 6
};


/**
 * Class Bot
 *
 * - Initalizes a bot by name. 
 */ 
function Bot(name){
    this.name = name;
}


/** 
 * Method logIn()
 *
 * - Uses the name property to get the bot's steam user credentials from .creds.json file.
 *
 * - Initalizes all of the bot's functionality.
 */
Bot.prototype.logIn = function(){
    
    // Query for secret then process it to unencrypt password:
    rl.question('Please enter the secret key for ' + this.name + '\n', (secret) => { 
        
        // Decrypt the bot's password:
        let creds = require('./' + this.name + '.creds.json');
        creds.password = deCryptPassword(creds.password, secret);

        // Log the bot into steam:
        this.client = new SteamUser();
        this.client.logOn(creds);

        // Initializes the manager once the bot is connected.
        this.client.on('loggedOn', (details) => {
            console.log( this.name + ' has logged in with SteamID: ' + this.client.steamID);

            // client has to be successfully logged on first for TradeOfferManager to work:
            this.manager = new TradeOfferManager({
                steam: this.client,
                domain: "gmail.com",
                language: "en", // english item description.
                pollInterval: 10000, // poll steam every 10 seconds.
                cancelTime: 30000 // Expire any outgoing trade offers that have been up for 5+ minutes.
            });
        });

        // Sets the manager's cookies once a web session has been established:
        this.client.on('webSession', (session, cookies) => {
            console.log(this.name + ' has started a web session with ID: ' + session);
            this.manager.setCookies(cookies);
        });

        // Prints a stacktrace of the err to the console and exit.
        this.client.on('error', (err) => {
            console.error(this.name + ' has return an error. ' + err);
            process.exit(1);
        });     
    });
}

/**
 * Method getInventoryByGameName(gameName, callBack)
 *
 * - Returns the inventory items the bot is carrying through the gameName argument.
 *
 * - return arguments: callBack(err, inventory, currency, numberOfItems);
 *
 */
Bot.prototype.getInventoryByGameName = function(gameName, callBack) {
    let appID = appIDs[gameName];
    let contextID = contextIDs[gameName];

    // Make sure each ID is a valid game number:
    if (typeof appID !== 'number' || typeof contextID !== 'number') {
        throw new Error(''
            + 'GameNameError: ' 
            + gameName
            + 'is not currently supported by this api.'
        );
    }

    // Make sure a function was passed to the callBack argument: 
    if (typeof callBack !== 'function'){
        throw new Error('TypeError: callBack is not a function.');
    }

    // Registers the callback to the call:
    this.manager.getInventoryContents(appID, contextID, false, callBack);
}


/** 
 * Function deCryptPassword(password, secret)
 *
 * - Returns the password argument decrypted.
 *
 * - Uses the secret argument for the decryption process.
 */
function deCryptPassword(password, secret) {
    let decipher = crypto.createDecipher('aes192', secret);
    let decrypted = decipher.update(password, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


// Export all bot functionality: 
module.exports = Bot;
