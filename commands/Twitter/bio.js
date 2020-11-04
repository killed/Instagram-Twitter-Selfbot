exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/twitter/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var twitterUtility = require("../../modules/twitter/utility");
    var csrfToken = twitterUtility.randomCsrf();

    var type = suffix.split(" ")[0];
    var bio = suffix.split(" ")[1];

    if (type.toLowerCase() == "twitter") {
        request.post("/1.1/account/update_profile.json", "description=" + bio, config.twitter.authToken, csrfToken).then(body => {
            if (body.indexOf(`description":"${bio}"`) > -1)
                utility.success(`Successfully updated bio to **${bio}**`, message);
            else
                utility.error("An error occurred while trying update bio", message);
        }).catch(error => { utility.error("An error occurred while trying update bio", message); });
    }
};