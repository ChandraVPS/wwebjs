import chalk from 'chalk';
import wa from 'whatsapp-web.js';
import fs from 'fs';
import cron from 'node-cron';
import dotenv from 'dotenv';
import qr from 'qrcode-terminal';
dotenv.config();
const { Client, LocalAuth, Chat } = wa;
const log = console.log;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process", // <- this one doesn't works in Windows
            "--disable-gpu",
        ],
    },
});

const chat = new Chat();
const hpmaster = process.env.HPMASTER;
const perkeloncoan = process.env.PERKELONCOAN;
const testing = process.env.TESTING;
const ayang = process.env.AYANG;
const apikey = process.env.APIKEY;

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
    qrcode.generate(qr, { small: true });
    log(chalk.blue("[SERVER] Scan QR code diatas untuk login"));
});

client.on('ready', () => {
    log(chalk.green('[SERVER] WA WEB Service ready'));
    client.sendMessage(hpmaster, "[BOT] Im Ready Bos!");

    cron.schedule('0 5 * * *', async () => {
        const hari = 86400;
        const jam = 3600;
        const menit = 60;
        const lebaran = new Date('2022-05-02 00:00:00');
        const diff = Math.floor((lebaran.getTime() - new Date().getTime()) / 1000);
        const bedaHari = Math.floor(diff / hari);
        const bedaJam = Math.floor((diff % hari) / jam);
        const bedaMenit = Math.floor((diff % jam) / menit);
        const berjalan = 30 - bedaHari;
        let quotes;

        let response = await axios.get('https://zenzapi.xyz/api/randomquote/muslim?apikey=' + apikey, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res => {
            if (res.data.status == 'OK') {
                quotes = res.data.result.text_id;
            } else {
                quotes = 'Call API Quotes Gagal Bre sorry!';
            }
        });

        const response2 = await axios.get('https://zenzapi.xyz/islami/jadwalshalat?kota=cirebon&apikey=' + apikey, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

        let datanya = response2.data.result[0];
        let txt1 = "*Selamat Pagi Sahabat*\n" +
            "Kita memasuki puasa *Hari ke-" + berjalan - 1 + "* sahabat.\n" +
            "Tersisa *" + bedaHari + " Hari* lagi menuju kemenangan Idhul Fitri 1443 H tetap semangat dan tingkatkan Ibadah kita.\n" +
            "Berikut Quotes Pagi ini :\n" +
            "_" + quotes + "_";
        let txt2 = "Jadwal Sholat Cirebon " + datanya.tanggal + "\n" +
            "Subuh : " + datanya.subuh + "\n" +
            "Dzuhur : " + datanya.dzuhur + "\n" +
            "Ashar : " + datanya.ashar + "\n" +
            "Maghrib : " + datanya.maghrib + "\n" +
            "Isya : " + datanya.isya + "\n" +
            "*Terima Kasih*";
        await client.sendMessage(perkeloncoan, txt1);
        await client.sendMessage(perkeloncoan, txt2);
        log(chalk.green('[SERVER] Daily message Send!'));
    });

    cron.schedule('1,31 * * * *', async () => {
        client.sendMessage(hpmaster, "[BOT] Jangan Lupa Chat " + ayang + " yaa!");
    });
});

client.initialize();