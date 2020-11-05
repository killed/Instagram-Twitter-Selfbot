exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/twitter/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var twitterUtility = require("../../modules/twitter/utility");
    var csrfToken = twitterUtility.randomCsrf();

    var type = suffix.split(" ")[0];
    var username = suffix.split(" ")[1];

    if (type.toLowerCase() == "twitter") {
        request.get("help.twitter.com", "/api/v1/username_lookups?username=" + username).then(body => {
            if (body.indexOf("s\":f") != -1) {
                request.post("api.twitter.com", "/1.1/account/settings.json", "screen_name=" + username, config.twitter.authToken, csrfToken).then(body => {
                    if (body.indexOf(`screen_name":"${username}"`) > -1)
                        utility.success(`Successfully updated username to [@${username}](https://instagram.com/${username})`, message);
                    else
                        utility.error("An error occurred while trying update username", message);
                });
            } else
                return utility.error("Username unavailable, please try a different username", message);
        }).catch(error => { utility.error("An error occurred while checking username availability", message); });
    }
};