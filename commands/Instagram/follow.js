exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    if (help) {
        var embed = utility.createEmbed("Follow");
        embed.setDescription("More details for the **follow** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}follow <username>`);
        embed.addField("Description", "Easily follow someone on Instagram.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("follow", message);

    request.get(`/web/search/topsearch/?context=blended&query=${suffix}&rank_token=0.8730298813193997&include_reel=false`, config.instagram.sessionId).then(body => {
        body = JSON.parse(body);

        if (body.users.length < 1)
            return utility.error("No user found.", message);

        var result = body.users.filter(account => account.user.username === suffix);

        if (!result || result.length < 1)
            return utility.error(`No user with the username ${suffix} exists`, message);
        else
            request.post(`/web/friendships/${result[0].user.pk}/follow/`, {}, config.instagram.sessionId).then(body => {
                utility.success(`Successfully followed [@${suffix}](https://www.instagram.com/${suffix})`, message);
            }).catch(error => {
                utility.error(`An error occurred while trying to follow ${suffix}`, message);
            });
    }).catch(error => {
        utility.error(`An error occurred while searching for ${suffix}`, message);
    });
};