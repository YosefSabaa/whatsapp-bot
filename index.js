const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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

// حدث عند استلام رمز QR
client.on('qr', (qr) => {
    // طباعة QR Code في الطرفية
    qrcode.generate(qr, { small: true });
});

// حدث عند جاهزية البوت
client.on('ready', () => {
    console.log('Bot is ready!');
});

// حدث عند استلام رسالة
client.on('message', message => {
    console.log(`Received message: ${message.body}`);
    // معالجة الرسالة
    const replyMessage = handleMessage(message.body);
    message.reply(replyMessage); // إرسال الرد المناسب
});

// وظيفة لمعالجة الرسائل
function handleMessage(message) {
    if (message === 'ping') {
        return 'pong';
    } else if (message === 'مساعدة') {
        return 'كيف يمكنني مساعدتك اليوم؟';
    } else if (message.startsWith('!echo ')) {
        return message.slice(6); // إرجاع النص بعد !echo
    } else {
        return 'عذرًا، لم أفهم. يمكنك طلب المساعدة بكتابة "مساعدة".'; // الرد عند عدم الفهم
    }
}

// حفظ بيانات الجلسة
client.on('authenticated', (session) => {
    console.log('Authenticated successfully!');

    if (session) {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session)) // حفظ بيانات الجلسة في ملف
            .then(() => {
                console.log('Session data saved!');
            })
            .catch(err => console.error('Error saving session data:', err));
    } else {
        console.error('Session data is empty, not saving.');
    }
});

// بدء تشغيل البوت
client.initialize();
