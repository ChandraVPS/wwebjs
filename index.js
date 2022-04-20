import chalk from 'chalk';
import wa from 'whatsapp-web.js';
const { Client, LocalAuth, Chat } = wa;
const log = console.log;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
    },
});

const chat = new Chat();

client.on('message', async (msg) => {
    if (msg.body.includes("!sticker")) {
        if (msg.hasMedia) {
            const media = await msg.downloadMedia();
            client.sendMessage(msg.from, media, {
                sendMediaAsSticker: true,
                stickerName: `[BOT STICKER]`,
                stickerAuthor: "CBot!",
            });
        } else {
            client.sendMessage(msg.from, "Foto tidak ditemukan!");
        }
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    log(chalk.green('[SERVER] WA WEB Service ready'));
});

client.initialize();