const { Client } = require('whatsapp-web.js');
const fs = require('fs-extra');

// ملف لتخزين بيانات الجلسة
const SESSION_FILE_PATH = './session.json';
let sessionData;

// قراءة بيانات الجلسة إذا كان موجودًا
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData
});

client.on('qr', (qr) => {
    console.log('QR Code received, scan it!');
    console.log(qr); // طباعة رمز QR كنص حتى يمكن مسحه ضوئيًا
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
    if (message === 'السلام عليكم') {
        return 'عليك السلام ورحمةالله وبركاته. شكراً لتواصلك معنا 🥰';
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
