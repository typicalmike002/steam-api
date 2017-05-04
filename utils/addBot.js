const crypto = require('crypto');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt to name the bot:
rl.question(''
    + 'You are about to add a bot to steam-api.\n'
    + 'Please enter a name for your bot.', (addBotName) => {

    // Prompt to add the steam account user name:
    rl.question('Please enter a steam account username.', (addUserName) => {
        
        // Prompt to add the steam account password:
        rl.question('Please enter the steam account\'s password.', (addUserPassword) => {

            // Prompt to add a secret word used to encrypt the credentials:
            rl.question('Please enter a secret key used to encrypt your credentials.', (addSecret) => {
                console.log('Make sure you remember this secret!');

                // Encrypts the password using the user's secret:
                addUserPassword = encryptPassword(addUserPassword, addSecret);
                writeCredsToFile(addBotName, addUserName, addUserPassword);
                rl.close();
            });
        });
    });
});

function encryptPassword(password, secret){
    let cipher = crypto.createCipher('aes192', secret);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function writeCredsToFile(botName, userName, password){
    fs.writeFile('bots/' + botName + '.creds.json', '' 
        + '{\n'
            + '\t"accountName":' + '"' + userName + '",\n'
            + '\t"password":' + '"' + password + '"\n'
        + '}'
    );
}

