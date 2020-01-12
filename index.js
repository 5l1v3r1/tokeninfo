const { default: { get, patch } } = require("axios");

const { Client, RichEmbed } = require("discord.js");

const bot = new Client({});

require("dotenv").config({ path: ".env" })

bot.on("ready", () => console.log("Online"));

bot.on("message", async (msg) => {

    if (msg.author.id !== "Your id") return;

    let args = msg.content.trim().split(/\s/g);
    let cmd = args.shift().toLowerCase();


    if (cmd === "tokeninfo") {

        info(args.join(" "))
            .then(async res => {
                let embed = new RichEmbed();

                if (typeof res[0] == "undefined") return console.log(res) && console.log("Invalid token");





                embed.setThumbnail(`https://cdn.discordapp.com/avatars/${res[0].id}/${res[0].avatar}.png` || bot.user.displayAvatarURL)
                embed.setColor("AQUA")
                embed.setDescription(`
            **id**:  __**${res[0].id}**__
            **username**:  __**${res[0].username}**__
            **discriminator**:  __**${res[0].discriminator}**__
           **email**:  __**${res[0].email}**__
            **verified**:  __**${res[0].verified}**__
            **locale**:  __**${res[0].locale}**__
            **mfa_enabled**:  __**${res[0].mfa_enabled}**__
            **phone**:  __**${res[0].phone}**__
            **flags**: __**${res[0].flags}**__
            `)
                embed.setFooter(`React with:0️⃣ ,1️⃣ ,2️⃣ , or 3️⃣ for more info!`)

                let message = await msg.channel.send(embed);

                const collector = message.createReactionCollector((reaction, user) => user.id === '642951787892178968' && ["0️⃣", "1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name));

                collector.on("collect", (reaction) => {


                    let emoji = reaction.emoji.name;

                    console.log(emoji === "0️⃣")

                    switch (emoji) {
                        case "0️⃣":
                            embed.fields = []
                            embed.title = ``
                            embed.setTitle("Main Info");

                            if (typeof res[0] == "undefined") {
                                embed.setDescription("No info on this token")
                            } else {

                                embed.setDescription(`
            **id**:  __**${res[0].id}**__
            **username**:  __**${res[0].username}**__
            **discriminator**:  __**${res[0].discriminator}**__
           **email**:  __**${res[0].email}**__
            **verified**:  __**${res[0].verified}**__
            **locale**:  __**${res[0].locale}**__
            **mfa_enabled**:  __**${res[0].mfa_enabled}**__
            **phone**:  __**${res[0].phone}**__
            **flags**: __**${res[0].flags}**__
            `);

                            }
                            message.edit({ embed: embed });
                            reaction.remove(bot.user)
                            break;
                        case `1️⃣`:
                            embed.fields = []
                            embed.title = ``
                            embed.setTitle("Friends")

                            let friends = res[3].splice(6, res[3].length - 5);

                            if (typeof friends[0] == "undefined") {
                                embed.setDescription("No friends")
                            } else {
                                embed.setDescription("")
                                friends.forEach(friend => {
                                    embed.addField(`Name: ${friend.user.username.toUpperCase()}`, `**ID: ${friend.id} : DISCRIM: ${friend.user.discriminator}** `)
                                })
                            }

                            message.edit({ embed: embed });
                            reaction.remove(bot.user)


                            break;

                        case "2️⃣":

                            embed.fields = []
                            embed.title = ``

                            embed.setTitle("Servers");

                            let guilds = res[2];

                            if (typeof guilds[0] == "undefined") {
                                embed.setDescription("No connections")
                            } else {
                                embed.setDescription("")
                                guilds.forEach(guild => {
                                    embed.addField(`Name: ${guild.name.toUpperCase()}`, `**${guild.id} : Owner: ${guild.owner === true ? " Yes " : " No"}** `)
                                })
                            }

                            message.edit({ embed: embed })
                            reaction.remove(bot.user)

                            break; // ?

                        case "3️⃣": // for connections
                            embed.fields = []
                            embed.title = ``
                            embed.setTitle(`Connections`)


                            if (typeof res[1][0] == "undefined") {
                                embed.setDescription("No connections")
                            } else {
                                embed.setDescription("")
                                res[1].forEach(connection => {
                                    embed.addField(`${connection.type}`, `**${connection.name} : Visible: ${connection.visibility === 1 ? " Yes " : " No"}** `)
                                })
                            }

                            message.edit({ embed: embed })
                            reaction.remove(bot.user)


                    }

                })


            })

    }
});

// console.log(process.env)


bot.login(process.env.TOKEN);

async function info(token) {
    // "https://gateway.discord.gg/cdn-cgi/trace", 

    let test = [];

    try {



        let main = await get("https://discordapp.com/api/v7/users/@me", { headers: { "Authorization": token } });

        let connection = await get("https://discordapp.com/api/v7/users/@me/connections", { headers: { "Authorization": token } });

        let guilds = await get("https://discordapp.com/api/v7/users/@me/guilds", { headers: { "Authorization": token } });

        let friends = await get("https://discordapp.com/api/v6/users/@me/relationships", { headers: { "Authorization": token } });

        test.push(main.data, connection.data, guilds.data, friends.data);

    } catch (ex) {
        return "Invalid Token"
    }

    finally {
        return test;
    }



}
