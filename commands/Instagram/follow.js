exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    if (help) {
        var embed = utility.createEmbed("Follow");
        embed.setDescription("More details for the **follow** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}follow <username>`);
        embed.addField("Description", "Easily follow someone on the social media platform.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("follow", message);

    var type = suffix.split(" ")[0];
    var username = suffix.split(" ")[1];

    if (type.toLowerCase() == "instagram") {
        request.get("www.instagram.com", `/web/search/topsearch/?context=blended&query=${username}&include_reel=false`, config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
            body = JSON.parse(body);

            if (body.users.length < 1)
                return utility.error("No user found.", message);

            var result = body.users.filter(account => account.user.username === username);

            if (!result || result.length < 1)
                return utility.error(`No user with the username ${username} exists`, message);
            else
                request.postData("www.instagram.com", `/web/friendships/${result[0].user.pk}/follow/`, "", config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
                    utility.success(`Successfully followed [@${username}](https://www.instagram.com/${username}) on instagram`, message);
                }).catch(error => {
                    utility.error(`An error occurred while trying to follow ${username}`, message);
                });
        }).catch(error => {
            utility.error(`An error occurred while searching for ${username}`, message);
        });
    }
};