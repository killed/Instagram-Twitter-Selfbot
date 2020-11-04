exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var instagramUtility = require("../../modules/instagram/utility");

    if (help) {
        var embed = utility.createEmbed("Bio");
        embed.setDescription("More details for the **bio** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}bio <social media> <biography>`);
        embed.addField("Description", "Easily update your bio on the social media platform.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("bio", message);

    var type = suffix.split(" ")[0];
    var bio = suffix.split(" ")[1];

    if (type.toLowerCase() == "instagram") {
        instagramUtility.getAccountInformation().then(account => {
            var postData = `username=${account.username}&email=${account.email}&biography=${bio}`;

            request.postData("www.instagram.com", "/accounts/edit/", postData, config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
                if (body.indexOf("\"status\": \"ok\"") > -1)
                    utility.success(`Successfully updated bio to **${bio}**`, message);
                else
                    utility.error("An error occurred while trying update bio", message);
            }).catch(error => { utility.error("An error occurred while trying update bio", message); });
        }).catch(error => { utility.error("An error occurred while trying to get the account information", message); });
    }
};