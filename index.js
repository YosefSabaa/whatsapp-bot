const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs-extra');

// مسار ملف الجلسة
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
    // تحويل رمز QR إلى Base64
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error("فشل في توليد رمز QR:", err);
        } else {
            console.log("انسخ هذا الرابط وافتحه لمسح QR:");
            console.log(url);
        }
    });
});

client.on('ready', () => {
    console.log('البوت جاهز!');
});

client.on('message', message => {
    console.log(`تم استقبال الرسالة: ${message.body}`);
    const replyMessage = handleMessage(message.body);
    message.reply(replyMessage);
});

// وظيفة لمعالجة الرسائل
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
    console.log('تم التحقق بنجاح!');
    if (session) {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session))
            .then(() => {
                console.log('تم حفظ بيانات الجلسة!');
            })
            .catch(err => console.error('خطأ في حفظ بيانات الجلسة:', err));
    } else {
        console.error('بيانات الجلسة فارغة، لن يتم الحفظ.');
    }
});

client.initialize();
