const moment = require("moment");
const Discord = require("discord.js");

module.exports = client => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Bütün Komutlar Yüklendi`);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] "${client.user.username}" İsmiyle Giriş Yapıldı`);
    client.user.setActivity(`❤️ ArviS`, {type: 'LISTENING'});
    setInterval(() => {
        client.user.setStatus("online");
        client.user.setActivity(`❤️ ArviS`, {type: 'LISTENING'});
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Durum Mesajı Güncellendi`);
    }, 600000)
}
