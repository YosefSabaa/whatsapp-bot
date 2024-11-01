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
    // حفظ QR كصورة
    qrcode.toFile('QR.png', qr, (err) => {
        if (err) {
            console.error("فشل في حفظ رمز QR:", err);
        } else {
            console.log("تم حفظ رمز QR كصورة. افتح الملف 'QR.png' لمسحه ضوئيًا.");
        }
    });
});

client.on('ready', () => {
    console.log('البوت جاهز!');
});

client.on('message', message => {
    console.log(`تم استقبال الرسالة: ${message.body}`);
    // معالجة الرسالة والرد
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
        return message.slice(6); // إرجاع النص بعد !echo
    } else {
        return 'عذرًا، لم أفهم. يمكنك طلب المساعدة بكتابة "مساعدة".';
    }
}

// حفظ بيانات الجلسة
client.on('authenticated', (session) => {
    console.log('تم التحقق بنجاح!');

    // التأكد من أن بيانات الجلسة غير فارغة
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

// بدء تشغيل البوت
client.initialize();
