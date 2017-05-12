/**
 * Bots.js
 *
 * - Use this wrapper class to create and use multiple bots.
 */
const Bot = require('./Bot');


/**
 * Class Bots()
 *
 * - Container for all bots.
 */
function Bots(){};


/**
 * Method addBot(name)
 *
 * - Adds a new bot to the list of bots.
 */ 
Bots.prototype.addBot = function(name){
    this[name] = new Bot(name);
}

// Expose the Bots class to other modules:
module.exports = Bots;