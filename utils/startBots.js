/**
 * utility startBots.js
 *
 * - References the ./bots/creds folder to create and log in all bots.
 *
 * - Since each bot queries the developer for a key, they have to be
 *   logged in consecutively, one at a time.
 *
 * - This consecutive login works by chaining all of the bot's login
 *   methods in a way so when the first bot is finished logging on this chain will 
 *   execute the second bot's login method until there are no more bots.
 */

const fs = require('fs');
const path = require('path');
const Bots = require('../bots/bots');

var bots = new Bots();

// Needed for chaining all of the bot's login methods.
var callChain = function(){}; 

// Adds each .creds.json file inside ../bots/creds to the list of bots.
fs.readdirSync(path.join(__dirname, '../bots/creds')).forEach((file) => {
    let botName = file.substring(0, file.indexOf('.creds.json'));
    bots.addBot(botName);
    addLogInToCallChain(callChain, botName);
    ((callBack, name) => {
        callChain = () => {
            bots[name].logIn(callBack);
        };
    })(callChain, botName);
});

// Executes the chain of bot login methods.
callChain();

// Allow other modules to use these bots:
module.exports = bots;


// Private Functions (TODO: use these instead of what's above)

/**
 * Function addBotToBots(file)
 *
 * @file {string} A file with the .creds.json extension.
 *
 * - Add a bot using a file name to the list of bots.
 *
 * - Begins the process of adding the bot's login method
 *   to the callchain of functions.
 */
function addBotToBots(file) {
    console.log(file);
    let botName = file.substring(0, file.indexOf('.creds.json'));
    bots.addBot(botName);
    addLogInToCallChain(callChain, botName);
}


/**
 * Function addLogInToCallChain(callBack, name)
 *
 * @callback {function} passes the function to execute once bot is logged in.
 * @name {string} passes the name of the bot to the actual log in function.
 *
 * - Adds a function to the callchain that is used for logging in a bot.
 */
function addLogInToCallChain(callBack, name) {
    callChain = logInBot(callBack, name);
}


/**
 * Function logInBot(callBack, name)
 *
 * @callBack {function} executes once the bot is logged in.
 * @name {string} name of the bot to log in.
 */
function logInBot(callBack, name) {
    bots[name].logIn(callBack);
}
