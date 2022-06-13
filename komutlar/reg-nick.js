const Discord = require("discord.js");
const database = require("quick.db");
const eayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
    if(message.author.bot || message.channel.type === "dm") return;
    let arvis = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let isim = args[1];
    let yas = parseInt(args[2]);
    let arvis_tamisim = eayarlar.tag + isim + eayarlar.tırnak + yas
    let arvisemb = new Discord.MessageEmbed().setFooter(`❤️・ArviS`, client.user.avatarURL()).setColor(0x49003e).setTimestamp()
    
    if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.get("ROL_ID")) return message.react("746308515940925441");
    if (!arvis) return message.reply("❌・Kullanıcı Adını Değiştirmek İstediğin Kullanıcıyı Etiketlemelisin").then(e => e.delete({ timeout: 6000 }));
    if (!isim) return message.reply("❌・Kullanıcı Adını Değiştirmem İçin Bir İsim Yazmalısın").then(e => e.delete({ timeout: 6000 }));
    if (!yas) return message.reply("❌・Kullanıcının Adını Değiştirmem İçin Yaşını Belirtmelisin").then(e => e.delete({ timeout: 6000 }));

    await arvis.setNickname(arvis_tamisim, "Register | İsim Değiştirme")
    database.push(`isimler_${arvis.id}`, `${arvis_tamisim} [**İsim Değiştirme**]`)
    
    let isimgecmisi = database.get(`isimler_${arvis.id}`)
    let liste = ""
    var sayı = 0
    if(isimgecmisi){
        sayı = isimgecmisi.lenght
        for(let i = 0;i<isimgecmisi.length;i++){
            liste+=`\n\`${i+1}.\` ${isimgecmisi[i]}`
        }
    } else {
        liste=`\n ❌・Bu Kullanıcının Geçmiş Adı Bulunmuyor.`
    }

    message.channel.send(arvisemb.setDescription(`✅・${arvis.user} Adlı Kullanıcının Adını **${arvis_tamisim}** Olarak Değiştirdim \n ⚠️・Bu Kullanıcı Daha Önceden **${isimgecmisi.length}** Bu Farklı İsimi Kullanmış \n ${liste}`).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))).then(e => e.delete({ timeout: 15000 }))
};

exports.conf = {
    aliases: ["isim", "nick"]
};

exports.help = {
    name: "isim"
};
