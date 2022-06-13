const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const key = require("./security/login.json");
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require('quick.db');
require('./util/eventLoader')(client);
const ms = require('parse-ms');
Discord.Constants.DefaultOptions.ws.properties.$browser = "Discord Android"

const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`🔋・${files.length} Komut Yükleniyor`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        //log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(aliases => {
            client.aliases.set(aliases, props.help.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 1;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

////////////////////////////////SUNUCU GİRİŞ SİSTEMİ//////////////////////////////////////

client.on("guildMemberAdd", async member => {
    let gkisi = client.users.cache.get(member.id);
    const ktarih = new Date().getTime() - gkisi.createdAt.getTime();
    let regKanal = member.guild.channels.cache.find(e => e.id === ayarlar.userjoin.unregchat);
    let yhlog = member.guild.channels.cache.find(e => e.id === ayarlar.userjoin.newaccchat);

    const arvisemb = new Discord.MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL()).setImage(`IMAGE LİNKİ GİRİN`).setFooter(ayarlar.durum, client.user.avatarURL()).setTimestamp()

    if (ktarih < 604800000) {
        member.roles.set([ayarlar.userjoin.prison])
        member.setNickname(ayarlar.userjoin.newacc)

        member.send(`⚠️・Hesabın **1 Haftadan Kısa** Bir Sürede Açıldığı İçin Güvenlik Amaçlı Karantinaya Alındın. Yetkililere Ulaşarak Destek Alabilirsin`)
        if (yhlog) yhlog.send(`⚠️・${member.user} Adlı Kullanıcının Hesabı \`1 Hafta\`dan Kısa Sürede Açıldığı İçin Kullanıcı Karantinaya Atıldı`)
        if (regKanal) regKanal.send(arvisemb.setDescription(`\`👋・\` **Merhaba**, Sunucumuza Hoş Geldin ${member.user} \n\n\ \`😀・\` Seninle Birlikte **${member.guild.memberCount}** Kişiyiz \n\ \`🤔・\` Hesabın **${moment.utc(member.user.createdAt).format('DD.MM.YYYY')}** Tarihinde Oluşturulmuş \n\`⚠️・\` Hesabın Yeni Açıldığı İçin Güvenlik Amaçlı Şuan Kayıt Olamazsın \n\n\`❌・\` **Şüpheli Hesap** `,true).setColor(0xbb0004))
    } else {
        member.roles.add(ayarlar.userjoin.unreg)
        member.setNickname(ayarlar.userjoin.oldacc)

        if (regKanal) regKanal.send(`<@&REGISTER_YETKILI_ROL_ID>`, arvisemb.setDescription(`\`👋・\` **Merhaba**, Sunucumuza Hoş Geldin ${member.user} \n\n\`😀・\` Seninle Birlikte **${member.guild.memberCount}** Kişiyiz \n\`🤔・\` Hesabın **${moment.utc(member.user.createdAt).format('DD.MM.YYYY')}** Tarihinde Oluşturulmuş \n\`🔊・\` Kayıt Olmak İçin **Voice Confirmed** Ses Odalarından Birine Girmelisin \n\n\`✅・\` **Güvenli Hesap**  `,true).setColor(0x20cc00));
    }
});

////////////////////////////////SUNUCU GİRİŞ SİSTEMİ//////////////////////////////////////

client.on('ready', ()=>{
    let sesKanal = client.channels.cache.get(ayarlar.voiceC);
    if (!sesKanal) return console.log(`❌・Ses Kanalı Bulunamadı`);
    sesKanal.join().then(console.log(`[✅・${moment().format('YYYY-MM-DD HH:mm:ss')}] Ses Kanalına Bağlanıldı`)).catch(err => console.error(`[❌・${moment().format('YYYY-MM-DD HH:mm:ss')}] Ses Kanalına Bağlanılamadı`));

    setInterval(() => {
        sesKanal.join();
        console.log(`[🔋・${moment().format('YYYY-MM-DD HH:mm:ss')}] Ses Kanalı Bağlantısı Güncellendi.`);
    }, 600000)
});

client.login(key.token);
