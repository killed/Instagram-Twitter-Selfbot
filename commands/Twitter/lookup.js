exports.run = (bot, message, suffix, help) => {
    var request = require("../../modules/twitter/http");
    var utility = require("../../modules/utility.js");
    var config = require("../../data/config");

    var twitterUtility = require("../../modules/twitter/utility");
    var csrfToken = twitterUtility.randomCsrf();

    var type = suffix.split(" ")[0];
    var method = suffix.split(" ")[1];

    if (type.toLowerCase() == "twitter") {
        if (method.toLowerCase() == "user") {
            var username = suffix.split(" ")[2];

            request.get("twitter.com", "/i/api/1.1/search/typeahead.json?" + `q=@${username}&src=search&result_type=users`, config.twitter.authToken, csrfToken).then(body => {
                if (body.indexOf(`"token":"${username}"` > -1)) {
                    body = JSON.parse(body);

                    var result = body.users.filter(account => account.screen_name === username);

                    if (!result || result.length < 1)
                        return utility.error(`No user with the username ${username} exists`, message);
                    else {
                        var query = `include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&include_tweet_replies=false&count=20&userId=${result[0].id}&ext=mediaStats%2ChighlightedLabel`;

                        request.get("twitter.com", `/i/api/2/timeline/profile/${result[0].id}.json?` + query, config.twitter.authToken, csrfToken).then(body => {
                            if (body.indexOf(`screen_name":"${username}"`) > -1) {
                                body = JSON.parse(body);

                                var tweetCount = body.globalObjects.tweets.length;

                                body = body.globalObjects.users[result[0].id];

                                var embed = utility.createEmbed("Command completed", false);

                                if (body.profile_image_url_https)
                                    embed.setThumbnail(body.profile_image_url_https);

                                if (body.name && body.name.length >= 1)
                                    embed.setDescription(`:white_check_mark: | Twitter lookup result for **@${username}** - ${body.name} - ${result[0].id}`);
                                else
                                    embed.setDescription(`:white_check_mark: | Twitter lookup result for **@${username}** - ${result[0].id}`);

                                embed.addField("Followers", utility.format(body.followers_count), true);
                                embed.addField("Following", utility.format(body.friends_count), true);

                                if (body.location && body.location.length >= 1)
                                    embed.addField("Location", body.location.trim(), true);

                                if (body.description && body.description.length >= 1 && body.description.length <= 2000)
                                    embed.addField("Biography", body.description, false);

                                message.edit({ embed: embed });
                            } else
                                return utility.error("Failed to get users stats", message);
                        }).catch(error => { utility.error("An error occurred while trying to fetch user stats", message); });
                    }
                } else
                    return utility.error(`No user with the username ${username} exists`, message);
            }).catch(error => { utility.error("An error occurred while trying to fetch user id", message); });
        } else if (method.toLowerCase() == "tweet") {
            var hashtag = suffix.substring(type.length + (method.length + 2));

            var query = `include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweet=true&q=${encodeURIComponent(hashtag)}&count=40&query_source=typed_query&pc=1&spelling_corrections=1&ext=mediaStats%2ChighlightedLabel`;

            request.get("twitter.com", "/i/api/2/search/adaptive.json?" + query, config.twitter.authToken, csrfToken).then(body => {
                body = JSON.parse(body).globalObjects;

                var tweets = [];

                for (var prop in body.tweets) {
                    if (body.tweets.hasOwnProperty(prop)) {
                        tweets.push(prop);
                    }
                }

                var tweet = body.tweets[tweets[tweets.length * Math.random() << 0]];

                if (tweet.full_text && tweet.full_text.length >= 1) {
                    var embed = utility.createEmbed("Command completed", true);
                    embed.setDescription(`:white_check_mark: | Twitter lookup result for **@${hashtag}** - [Tweet](https://twitter.com/XO/statuses/${tweet.id})`);
                    embed.addField("Likes", utility.format(tweet.favorite_count), true);
                    embed.addField("Replies", utility.format(tweet.reply_count), true);
                    embed.addField("Retweets", utility.format(tweet.retweet_count), true);
                    embed.addField("Tweet Text", tweet.full_text.trim(), false);

                    message.edit({ embed: embed });
                } else
                    return message.edit(`Tweet ID: ${tweet.id}`);
            }).catch(error => { utility.error("An error occurred while trying to fetch hashtag", message); });
        }
    }
};