const Discord = require("discord.js");
const database = require("quick.db");
const eayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
    if (message.author.bot || message.channel.type === "dm") return;
    let kayitLog = message.guild.channels.cache.get(eayarlar.reg["log-k"]);
    let sohbet = message.guild.channels.cache.get(eayarlar.reg.sohbet);
    let arvis = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let isim = args[1];
    let yas = parseInt(args[2]);
    let arvis_tamisim = eayarlar.tag + isim + eayarlar.tırnak + yas
    let arvisemb = new Discord.MessageEmbed().setFooter(`❤️・ArviS`, client.user.avatarURL()).setColor(0x49003e).setTimestamp()

    if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.get("ROL_ID")) return message.react("746308515940925441");
    if (!arvis) return message.reply(`❌・Kayıt Edilecek Kullanıcıyı Belirtmelisin`).then(e => e.delete({ timeout : 6000 }));
    if (!isim) return message.reply(`❌・Kullanıcıyı Kayıt Etmem İçin Bir İsim Yazmalısın`).then(e => e.delete({ timeout: 6000 }));
    if (!yas) return message.reply(`❌・Kullanıcının Kaydını Tamamlamam İçin Yaşını Belirtmelisin`).then(e => e.delete({ timeout: 6000 }));

    if (arvis.roles.cache.get("ERKEK_ROL_ID")) return message.channel.send(arvisemb.setDescription(`❌・Bu Kullanıcı Zaten Kayıtlı Olduğu İçin Tekrar Kayıt Edemem \n ⚠️・İsim Değiştirmek İçin \`.isim <@arvis/ID> İsim Yaş\` Komutunu Kullanmalısın`)).then(e => e.delete({ timeout: 6000 })).catch(err => console.error(error));
    if (arvis.roles.cache.get("KIZ_ROL_ID")) return message.channel.send(arvisemb.setDescription(`❌・Bu Kullanıcı Zaten Kayıtlı Olduğu İçin Tekrar Kayıt Edemem \n ⚠️・İsim Değiştirmek İçin \`.isim <@arvis/ID> İsim Yaş\` Komutunu Kullanmalısın`)).then(e => e.delete({ timeout: 6000 })).catch(err => console.error(error));

    await arvis.setNickname(arvis_tamisim, "Register | İsim Değiştirme")
    await arvis.roles.add(["KIZ ROL ID 1", "KIZ ROL ID 2"])
    await arvis.roles.remove("KAYITSIZ ROL ID")

    database.add(`Kız_${message.author.id}`, 1)
    database.add(`ToplamKayit_${message.author.id}`, 1)
    database.push(`isimler_${arvis.id}`, `${arvis_tamisim} [**<@&KIZ ROL ID>**]`);

    let isimgecmisi = database.get(`isimler_${arvis.id}`)
    let liste = ""
    var sayı = 0
    if(isimgecmisi){
        sayı = isimgecmisi.lenght
        for(let i = 0;i<isimgecmisi.length;i++){
            liste+=`\n\`${i+1}.\` ${isimgecmisi[i]}`
        }
    }else{
        liste=`\n ❌・Bu Kullanıcının Geçmiş Adı Bulunmuyor`
    }

    kayitLog.send(arvisemb.setDescription(`\`🌀・\` **Kayıt Edilen Kullanıcı**: ${arvis.user} \n \`👑・\` **Kayıt Eden Yetkili:** ${message.author} \n \`💭・\` **Kullanıcıya Verilen Roller:** <@&KIZ ROL ID 1>, <@&KIZ ROL ID 2>`))
    sohbet.send(arvisemb.setDescription(`\`🙌・\` ${arvis.user} Aramıza **<@&KIZ_ROL_ID>** Olarak Katıldı \n \`🔢・\` Sunucuda Toplam **${message.guild.memberCount}** Kişi Olduk \n \`⛔・\` Sohbete Katılmadan Önce <#KURALLAR KANAL ID> Kanalına Göz Atmayı Unutma`)).then(e => e.delete({ timeout: 6000 }))
    message.channel.send(arvisemb.setDescription(`\`👩・\` ${arvis.user} Adlı Kullanıcıyı **Kız** Olarak Kaydettim \n \`👩・\` Kullanıcı Adını **${arvis_tamisim}** Olarak Güncelleyip Veri Tabanına Kaydettim \n\n \`⚠️・\` Bu Kullanıcı Daha Önceden **${isimgecmisi.length}** Bu Farklı İsimle Kayıt Olmuş \n ${liste}`))
};

exports.conf = {
    aliases: ["kız", "kadın", "k"]
};

exports.help = {
    name: 'kadın'
};
