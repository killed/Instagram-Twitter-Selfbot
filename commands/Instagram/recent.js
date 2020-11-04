exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/instagram/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    if (help) {
        var embed = utility.createEmbed("Recent");
        embed.setDescription("More details for the **recent** command.");
        embed.addField("Command usage", `${bot.config.discord.prefix}recent <type> <username>`);
        embed.addField("Description", "Easily get or like a users post on the social media platform.");
        return message.edit({ embed: embed });
    }

    if (!suffix)
        return utility.parameters("lookup", message);

    var type = suffix.split(" ")[0];
    var username = suffix.split(" ")[1];

    if (type == "get") {
        request.get("i.instagram.com", "/api/v1/users/" + username + "/usernameinfo/", config.instagram.sessionId, config.instagram.userAgents.mobile).then(body => {
            if (body.indexOf("\"status\": \"ok\"") > -1) {
                body = JSON.parse(body).user;

                request.get("i.instagram.com", `/api/v1/feed/user/${body.pk}/`, config.instagram.sessionId, config.instagram.userAgents.mobile).then(body => {
                    if (body.indexOf("\"status\": \"ok\"") > -1) {
                        body = JSON.parse(body).items;

                        var lastPostUrl;

                        if (body[0].media_type == 1)
                            lastPostUrl = body[0].image_versions2.candidates[0].url;
                        else if (body[0].media_type == 2)
                            lastPostUrl = body[0].video_versions[0].url;

                        message.edit(lastPostUrl);
                    } else
                        return utility.error("Failed to get users feed", message);
                }).catch(error => { utility.error("An errror occurred while trying to fetch users feed", message); });
            } else
                return utility.error("User not found", message);
        }).catch(error => { utility.error("An error occurred while trying to lookup user", message); });
    } else if (type == "like") {
        request.get("i.instagram.com", "/api/v1/users/" + username + "/usernameinfo/", config.instagram.sessionId, config.instagram.userAgents.mobile).then(body => {
            if (body.indexOf("\"status\": \"ok\"") > -1) {
                body = JSON.parse(body).user;

                request.get("i.instagram.com", `/api/v1/feed/user/${body.pk}/`, config.instagram.sessionId, config.instagram.userAgents.mobile).then(feed => {
                    if (feed.indexOf("\"status\": \"ok\"") > -1) {
                        feed = JSON.parse(feed).items;

                        request.postData("www.instagram.com", `/web/likes/${feed[0].id}/like/`, "", config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
                            if (body.indexOf("\"status\": \"ok\"") > -1)
                                utility.success(`Successfully liked [post](https://www.instagram.com/p/${feed[0].code})`, message);
                            else
                                utility.error("Failed to like post", message);
                        }).catch(error => { utility.error("An error occurred while trying to like post", message); });
                    } else
                        return utility.error("Failed to get users feed", message);
                }).catch(error => { utility.error("An errror occurred while trying to fetch users feed", message); });
            } else
                return utility.error("User not found", message);
        }).catch(error => { utility.error("An error occurred while trying to lookup user", message); });
    } else
        return utility.error("Invalid type", message);
};