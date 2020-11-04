exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var instagramUtility = require("../../modules/instagram/utility");

    if (help) {
        var embed = utility.createEmbed("Bio");
        embed.setDescription("More details for the **bio** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}bio <biography>`);
        embed.addField("Description", "Easily update your bio on Instagram.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("bio", message);

    instagramUtility.getAccountInformation().then(account => {
        var postData = `username=${account.username}&email=${account.email}&biography=${suffix}`;

        request.postData("www.instagram.com", "/accounts/edit/", postData, config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
            if (body.indexOf("\"status\": \"ok\"") > -1)
                utility.success(`Successfully updated bio to **${suffix}**`, message);
            else
                utility.error("An error occurred while trying update bio", message);
        }).catch(error => { utility.error("An error occurred while trying update bio", message); });
    }).catch(error => { utility.error("An error occurred while trying to get the account information", message); });
};