const Discord = require("discord.js");
const eayarlar = require('../ayarlar.json');
const db = require("quick.db");

exports.run = async (client , message, args) => {
    let arvisemb = new Discord.MessageEmbed().setFooter(`❤️・ArviS`, client.user.avatarURL()).setColor(0x49003e).setTimestamp()
    let arvis = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author

    if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has("ROL_ID")) return message.react("746308515940925441");
    if (!arvis) return message.channel.send(arvisemb.setDescription(`❌・Toplam Teyit Sayısına Bakmak İstediğiniz Kullanıcıyı \`.teyit <@arvis/ID>\` Şeklinde Belirtiniz`)).then(e => (e.delete({ timeout: 10000 })));

    let selam = await db.fetch(`Erkek_${arvis.id}`)
    let ben = await db.fetch(`Kız_${arvis.id}`)
    let arviss = await db.fetch(`ToplamKayit_${arvis.id}`)
    if (!selam) selam = "0"
    if (!ben) ben = "0"
    if (!arviss) arviss = "0"

    message.channel.send(arvisemb.setDescription(`🔢・${arvis} Adlı Kullanıcının Toplam **${arviss}** Kaydı Bulunmakta (**\`${selam}\` Erkek, \`${ben}\` Kız**)`)).then(e => (e.delete({ timeout: 10000 })));
}

exports.conf = {
    aliases: ["kayıt", "teyit", "bilgi"]
};

exports.help = {
    name: "teyit"
};
