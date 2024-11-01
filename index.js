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
    console.log('Session data loaded:', sessionData ? 'Yes' : 'No');
});

client.on('message', message => {
    console.log(`Received message: ${message.body}`);
    const replyMessage = handleMessage(message.body);
    message.reply(replyMessage);
});

function handleMessage(message) {
    if (message === 'السلام عليكم') {
        return 'عليك السلام ورحمة الله وبركاته. شكراً لتواصلك معنا 🥰';
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
    // حفظ بيانات الجلسة في الملف
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session))
        .then(() => {
            console.log('Session data saved!');
        })
        .catch(err => console.error('Error saving session data:', err));
});

// إعادة تحميل بيانات الجلسة عند كل بدء
client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
    fs.remove(SESSION_FILE_PATH); // احذف الجلسة عند تسجيل الخروج
});

client.initialize();
