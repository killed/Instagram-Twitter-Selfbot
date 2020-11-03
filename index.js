"use strict";

/*
 *
 *	npm i uws --save
 *	npm i sodium --save
 *	npm i request --save
 *	npm i bufferutil --save
 *	npm i discord.js --save
 *	npm i arunoda/node-usage --save
 *	npm i libsodium-wrappers --save
 *	npm i hammerandchisel/erlpack --save
 *
 */

// Libraries
const discord = require("discord.js");
const fs = require("fs");

// Variables
const config = require("./data/config.json");
var bot = new discord.Client({
    sync: true,
    fetchAllMembers: true
});

fs.readdir("./events/", (err, files) => {
    if (err)
        return console.log(err);

    console.log("[+] Loading a total of %d events", files.length);

    files.forEach(file => {
        const eventName = file.split(".")[0];
        const event = require(`./events/${file}`);

        bot.on(eventName, event.bind(null, bot));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

fs.readdir("./commands/", (err, files) => {
    if (err)
        return console.log(err);

    var totalCommands = 0;

    files.forEach(file => {
        totalCommands += fs.readdirSync(`./commands/${file}`).length;
    });

    console.log("[+] Loading a total of %d commands (%d categories)\r\n", totalCommands, files.length);
});

bot.config = config;
bot.login(config.discord.token);

module.exports.bot = bot;