const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter the secret for the example.js bot.', (secret) => {
    process.env.secret = secret;
    rl.close();
});