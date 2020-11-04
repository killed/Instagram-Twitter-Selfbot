exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var instagramUtility = require("../../modules/instagram/utility");

    if (help) {
        var embed = utility.createEmbed("Username");
        embed.setDescription("More details for the **username** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}username <social media> <new username>`);
        embed.addField("Description", "Easily update your username on the social media platform.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("username", message);

    var type = suffix.split(" ")[0];
    var username = suffix.split(" ")[1];

    if (type.toLowerCase() == "instagram") {
        instagramUtility.getAccountInformation().then(account => {
            var postData = `username=${username}&email=${account.email}`;

            request.postData("www.instagram.com", "/accounts/edit/", postData, config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
                if (body.indexOf("\"status\": \"ok\"") > -1)
                    utility.success(`Successfully updated username to [@${username}](https://instagram.com/${username})`, message);
                else
                    utility.error("An error occurred while trying update username", message);
            }).catch(error => { utility.error("An error occurred while trying update username", message); });
        }).catch(error => { utility.error("An error occurred while trying to get the account information", message); });
    }
};