exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/twitter/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var twitterUtility = require("../../modules/twitter/utility");
    var csrfToken = twitterUtility.randomCsrf();

    var type = suffix.split(" ")[0];
    var username = suffix.split(" ")[1];

    if (type.toLowerCase() == "twitter") {
        request.get("twitter.com", "/i/api/1.1/search/typeahead.json?" + `q=@${username}&src=search&result_type=users`, config.twitter.authToken, csrfToken).then(body => {
            if (body.indexOf(`"token":"${username}"` > -1)) {
                body = JSON.parse(body);

                var result = body.users.filter(account => account.screen_name === username);

                if (!result || result.length < 1)
                    return utility.error(`No user with the username ${username} exists`, message);
                else {
                    request.post("api.twitter.com", "/1.1/friendships/destroy.json", "id=" + result[0].id, config.twitter.authToken, csrfToken).then(body => {
                        if (body.indexOf(`screen_name":"${username}"`) > -1)
                            utility.success(`Successfully unfollowed [@${username}](https://twitter.com/${username})`, message);
                        else
                            utility.error(`Failed to unfollow ${username}`, message);
                    }).catch(error => { utility.error("An error occurred while trying to unfollow user", message); });
                }
            } else
                return utility.error(`No user with the username ${username} exists`, message);
        }).catch(error => { utility.error("An error occurred while trying to fetch user id", message); });
    }
};