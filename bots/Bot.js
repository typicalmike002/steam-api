/**
 * Bot.js
 *
 * - Contains the main Bot class and both public and private functions.
 */

// Dependencies:
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
 * - each bot name should match a .creds.json file
 */ 
function Bot(name){
    this.name = name;
    this.client = new SteamUser();
    this.manager = undefined;
    this.callBack = function(){};

    let onLoggedIn = emitOnLoggedOn.bind(this);
    let onWebSession = emitOnWebSession.bind(this);
    let onError = emitOnError.bind(this);

    this.client.on('loggedOn', onLoggedIn);
    this.client.on('webSession', onWebSession);
    this.client.on('error', onError); 
}


/** 
 * Method logIn(callBack)
 *
 * - Uses the name property to get the bot's steam user credentials from .creds.json file.
 */
Bot.prototype.logIn = function(callBack){

    this.callBack = callBack;
    let onSubmit = onSecretSubmit.bind(this);
    
    // Query for secret then process it to unencrypt password:
    rl.question('Please enter the secret key for ' + this.name + '\n', onSubmit);
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


// Exports all bot functionality.
module.exports = Bot;


// Private Functions listed below:

/**
 * Function onSecretSubmit(secret)
 *
 * - Callback executed when user finishes inputting a
 *   secret key for unencrypting the steam account password.
 */
function onSecretSubmit(secret){
    // Decrypt the bot's password using the secret:
    let creds = require('./creds/' + this.name + '.creds.json');
    creds.password = deCryptPassword(creds.password, secret);
    this.client.logOn(creds);
    creds.password = undefined; // Not entirely sure this is needed.
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


/**
 * Function emitOnLoggedOn(details)
 *
 * - Callback that executes when a bot logs in.
 */
function emitOnLoggedOn(details){
    console.log( this.name + ' has logged in with SteamID: ' + this.client.steamID);

    // client has to be successfully logged on first for TradeOfferManager to work:
    this.manager = new TradeOfferManager({
        steam: this.client,
        domain: "gmail.com",
        language: "en", // english item description.
        pollInterval: 10000, // poll steam every 10 seconds.
        cancelTime: 30000 // Expire any outgoing trade offers that have been up for 5+ minutes.
    });

    // Executes callback passed to login:
    this.callBack();
}


/**
 * Function emitOnWebSession(session, cookies)
 *
 * - Callback that executes once a bot has 
 *   successfully created a websession with Steam.
 */
function emitOnWebSession(session, cookies) {
    console.log(this.name + ' has started a web session with ID: ' + session);
    this.manager.setCookies(cookies);
}


/**
 * Function emitOnError(err)
 *
 * - Callback for bot error handler.
 */
function emitOnError(err) {
    console.error(this.name + ' has return an error. ' + err);
    process.exit(1);
}

