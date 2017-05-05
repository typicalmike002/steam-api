/**
 * utility addBot()
 *
 * - Adds a new json file containing steam account credentials 
 *   which are used by a bot to log in and perform actions.
 *
 * - This was built to keep steam account passwords encrypted.
 */
const crypto = require('crypto');
const readline = require('readline');
const fs = require('fs');

// Interface for inputting the bot credentials:
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


/**
 * Class Bot()
 *
 * - The bot's constructor, values are set via command line.
 */
function Bot(){
    this.name;
    this.userName;
    this.password;
    this.secret;
}


/**
 * Bot Method buildBot()
 *
 * - Encrypts the bot's password using a secret 
 *   which should never be saved in the source code.
 *
 * - Saves the resulting bot credentials to a .json file.
 */
Bot.prototype.buildBot = function() {
    this.password = encryptPassword(this.password, this.secret);
    writeBot(this.name, this.userName, this.password);
}


/** 
 * Bot Method inputBotCredentials()
 * 
 * - Begins a chain of Prompts which query the user 
 *   for all of the bot's credentials.
 *
 * - Prompts the user to name the new bot.
 */
Bot.prototype.inputBotCredentials = function() {
    rl.question(''
        + 'You are about to add a bot to steam-api.\n'
        + 'Please enter a name for your bot.\n'
        , setName
    );
}


/**
 * Function setName(newName)
 *
 * - Sets the bot filename. 
 *
 * - Prompts the user for the bot's steam account user name.
 */

function setName(newName) {
    bot.name = newName;
    rl.question(''
        + 'Please enter a steam account username.\n'
        , setUserName
    );
}


/**
 * Function setUserName(newUserName)
 *
 * - Sets the user account name to associate with this bot.
 *
 * - Prompts the user for the steam account password.
 */
function setUserName(newUserName) {
    bot.userName = newUserName;
    rl.question(''
        + 'Please enter the steam account\'s password.\n'
        , setUserPassword
    );
}


/** 
 * Function setUserPassword(newUserPassword)
 *
 * - Set the steam account's password used by the bot.
 *
 * - Prompts the user for a secret key used to encrypt the password.
 */
function setUserPassword(newUserPassword) {
    bot.password = newUserPassword;
    rl.question(''
        + 'Please enter a secret key used to encrypt your credentials.\n'
        + 'Make sure you remember this secret!\n'
        , setSecret
    );
}


/** 
 * Function setSecret(newSecret)
 *
 * - Sets the secret key used by a developer.  This key will
 *   be required each time the bot needs to be turned on.
 *
 * - Executes the method for building the bot.
 */
function setSecret(newSecret) {
    bot.secret = newSecret;
    rl.close();
    bot.buildBot();
}


/**
 * Function encryptPassword(password, secret)
 *
 * - Encrypt the password using a secret keyword.
 */ 
function encryptPassword(password, secret) {
    let cipher = crypto.createCipher('aes192', secret);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}


/**
 * Function writeBot(botName, userName, password)
 *
 * - Saves the steam account username and password to a json file.
 *   inside the bots folder.
 *
 * - These credentials are used by the bot to access steam.
 */
function writeBot(botName, userName, password) {
    fs.writeFile('bots/' + botName + '.creds.json', '' 
        + '{\n'
            + '\t"accountName":' + '"' + userName + '",\n'
            + '\t"password":' + '"' + password + '"\n'
        + '}'
    );
}


// Creates the bot and executes the method for adding credentials:
var bot = new Bot();
bot.inputBotCredentials();
