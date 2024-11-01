const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');

const SESSION_FILE_PATH = './session.json';
let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', message => {
    console.log(`Received message: ${message.body}`);
    const replyMessage = handleMessage(message.body);
    message.reply(replyMessage);
});

function handleMessage(message) {
    if (message === 'ping') {
        return 'pong';
    } else if (message === 'مساعدة') {
        return 'كيف يمكنني مساعدتك اليوم؟';
    } else if (message.startsWith('!echo ')) {
        return message.slice(6);
    } else {
        return 'عذرًا، لم أفهم. يمكنك طلب المساعدة بكتابة "مساعدة".';
    }
}

client.on('authenticated', (session) => {
    console.log('Authenticated successfully!');
    if (session) {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session))
            .then(() => {
                console.log('Session data saved!');
            })
            .catch(err => console.error('Error saving session data:', err));
    } else {
        console.error('Session data is empty, not saving.');
    }
});

client.initialize();
