const { Client } = require('whatsapp-web.js');
const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');

// مسار ملف الجلسة
const SESSION_FILE_PATH = './session.json';
let sessionData;

// قراءة بيانات الجلسة إذا كانت موجودة
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true }); // عرض رمز QR في الطرفية
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
        return 'عليك السلام ورحمة الله وبركاته.\nشكراً لتواصلك معنا.\nيمكنك إرسال "مساعدة" لمعرفة المزيد من التفاصيل.';
    } else if (message === 'مساعدة') {
        return 'كيف يمكنني مساعدتك؟ الرجاء إرسال رقم ما تريد الاستفسار عنه:\n١- مواعيد العمل\n٢- طباعة ملفات\n٣- التواصل معنا';
    } else if (message === '1') {
        return 'مواعيد العمل هي \n كل يوم من الساعة 10 A.M الي الساعة 11 P.M';
    } else if (message.startsWith('!echo ')) {
        return message.slice(6);
    } else {
        return 'عذرًا، لم أفهم. يمكنك طلب المساعدة بكتابة "مساعدة".';
    }
}

client.on('authenticated', (session) => {
    console.log('Authenticated successfully!');
    // حفظ بيانات الجلسة في الملف
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
    console.log('Session data saved!');
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
    fs.removeSync(SESSION_FILE_PATH); // احذف الجلسة عند تسجيل الخروج
});

client.initialize();
