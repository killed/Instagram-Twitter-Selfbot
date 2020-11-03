exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    if (help) {
        var embed = utility.createEmbed("Username");
        embed.setDescription("More details for the **username** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}username <new username>`);
        embed.addField("Description", "Easily update your username on Instagram.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("username", message);

    request.postData("/accounts/edit/", { "username": suffix }, config.instagram.sessionId).then(body => {
        utility.success(`Successfully updated username to @${suffix}`, message);
    }).catch(error => {
        utility.error("An error occurred while trying update biography", message);
    });
};