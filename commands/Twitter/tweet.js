exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/twitter/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var twitterUtility = require("../../modules/twitter/utility");
    var csrfToken = twitterUtility.randomCsrf();

    var type = suffix.split(" ")[0];
    var status = suffix.substring(type.length + 1);

    if (type.toLowerCase() == "twitter") {
        request.post("twitter.com", "/i/api/1.1/statuses/update.json", "status=" + status, config.twitter.authToken, csrfToken).then(body => {
            if (body.indexOf(`full_text":"${status}"`) > -1 || body.indexOf(`text":"${status}"`) > -1)
                utility.success(`Successfully tweeted **${status}**`, message);
            else
                utility.error("Failed to post tweet, sorry", message);
        }).catch(error => { utility.error("An error occurred while tweeting tweet", message); });
    }
};