import wa from 'whatsapp-web.js';
const { Client, LocalAuth } = wa;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
    },
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();