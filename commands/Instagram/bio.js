exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    if (help) {
        var embed = utility.createEmbed("Bio");
        embed.setDescription("More details for the **bio** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}bio <biography>`);
        embed.addField("Description", "Easily update your bio on Instagram.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("bio", message);

    request.postData("/accounts/edit/", { "biography": suffix }, config.instagram.sessionId).then(body => {
        utility.success("Successfully updated biography", message);
    }).catch(error => {
        utility.error("An error occurred while trying update biography", message);
    });
};