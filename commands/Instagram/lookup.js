exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    if (help) {
        var embed = utility.createEmbed("Lookup");
        embed.setDescription("More details for the **lookup** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}lookup <username>`);
        embed.addField("Description", "Easily lookup a user on Instagram.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("lookup", message);

    request.get("i.instagram.com", "/api/v1/users/" + suffix + "/usernameinfo/", config.instagram.sessionId, config.instagram.userAgents.mobile).then(body => {
        if (body.indexOf("\"status\": \"ok\"") > -1) {
            body = JSON.parse(body).user;

            var embed = utility.createEmbed("Command completed", false);

            if (body.hd_profile_pic_url_info)
                embed.setThumbnail(body.hd_profile_pic_url_info.url);

            if (body.full_name && body.full_name.length >= 1)
                embed.setDescription(`:white_check_mark: | Lookup result for **@${suffix}** - ${body.full_name} - ${body.pk}`);
            else
                embed.setDescription(`:white_check_mark: | Lookup result for **@${suffix}**`);

            embed.addField("Followers", utility.format(body.follower_count), true);
            embed.addField("Following", utility.format(body.following_count), true);
            embed.addField("Mutual Followers", utility.format(body.mutual_followers_count), true);

            if (body.biography && body.biography.length >= 1 && body.biography.length <= 2000)
                embed.addField("Biography", body.biography, false);

            message.edit({ embed: embed });
        } else
            return utility.error("User not found", message);
    }).catch(error => { utility.error("An error occurred while trying to lookup user", message); });
};