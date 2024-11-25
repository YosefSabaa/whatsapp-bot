const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    const sock = makeWASocket({
        auth: state,
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];

        if (!message.message) return;

        const from = message.key.remoteJid;
        const text = message.message.conversation;

        console.log(`رسالة جديدة من ${from}: ${text}`);

        if (text === 'مرحبا') {
            await sock.sendMessage(from, { text: 'أهلاً وسهلاً بك!' });
        } else {
            await sock.sendMessage(from, { text: 'أنا بوت واتساب. كيف أساعدك؟' });
        }
    });
}

startBot();
