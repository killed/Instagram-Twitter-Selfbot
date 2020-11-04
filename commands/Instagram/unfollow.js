exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    if (help) {
        var embed = utility.createEmbed("Unfollow");
        embed.setDescription("More details for the **unfollow** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}unfollow <username>`);
        embed.addField("Description", "Easily unfollow someone on Instagram.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("unfollow", message);

    request.get("www.instagram.com", `/web/search/topsearch/?context=blended&query=${suffix}&include_reel=false`, config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
        body = JSON.parse(body);

        if (body.users.length < 1)
            return utility.error("No user found.", message);

        var result = body.users.filter(account => account.user.username === suffix);

        if (!result || result.length < 1)
            return utility.error(`No user with the username ${suffix} exists`, message);
        else
            request.postData("www.instagram.com", `/web/friendships/${result[0].user.pk}/unfollow/`, "", config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
                utility.success(`Successfully unfollowed [@${suffix}](https://www.instagram.com/${suffix})`, message);
            }).catch(error => {
                utility.error(`An error occurred while trying to unfollow ${suffix}`, message);
            });
    }).catch(error => {
        utility.error(`An error occurred while searching for ${suffix}`, message);
    });
};