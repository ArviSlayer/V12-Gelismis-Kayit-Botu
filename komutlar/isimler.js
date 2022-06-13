const Discord = require("discord.js");
const client = new Discord.Client();
const database = require("quick.db");

exports.run = (client, message, args) => {
    const arvisemb = new Discord.MessageEmbed().setColor(0x2c0032).setFooter(`❤️・Arvis`, client.user.avatarURL()).setTimestamp()
    let arvis = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    if(!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.get("YETKILI_ROL_ID")) return message.react("746308515940925441");
    if(!arvis) return message.channel.send(arvisemb.setDescription(`❌・Lütfen Geçmiş Kullanıcı Adlarını Görmek İstediğin Kullanıcıyı Etiketle`)).then (e => (e.delete({ timeout: 6000 })));

    let isimgecmisi = database.get(`isimler_${arvis.id}`)
    let liste=""
    if (isimgecmisi) {
        var sayı = 0
        sayı = isimgecmisi.length
        for(let i = 0;i<sayı;i++){
            liste+=`\n\`${i+1}.\` ${isimgecmisi[i]}`
        }
    } else {
        message.channel.send(arvisemb.setDescription(`🌀・${arvis} Adlı Kullanıcının Geçmiş Kullanıcı Adları \n\n ❌・Bu Kullanıcının Geçmiş Adı Bulunmuyor`)).then(e => (e.delete({ timeout: 10000 })))
        return
    }

    message.channel.send(arvisemb.setDescription(`🌀・${arvis} Adlı Kullanıcının Geçmiş Kullanıcı Adları **[${isimgecmisi.length}]** \n${liste}`)).then(e => (e.delete({ timeout: 10000 })))
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "isimler",
  description: "",
  usage: "isimler"
};
