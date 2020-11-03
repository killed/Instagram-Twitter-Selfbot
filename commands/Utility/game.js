exports.run = (bot, message, suffix, help) => {
	const utility = require("../../modules/utility.js");
	var config = require("../../data/config");

	if (help) {
		var embed = utility.createEmbed("Game");
		embed.setDescription("More details for the **game** command.");
		embed.addField("Command usage", `${bot.config.discord.prefix}game <game name || remove>`);
		embed.addField("Description", "Updates or removes the current \"Playing\" game.");
		return message.edit({ embed: embed });
	}

	if (!suffix)
		return utility.parameters("game", message);

	var type = 0;

	if (suffix.toLowerCase().split(" ")[0] == "streaming") {
		type = 1;
		suffix = suffix.substring(10);
	} else if (suffix.toLowerCase().split(" ")[0] == "listening") {
		type = 2;
		suffix = suffix.substring(10);
	} else if (suffix.toLowerCase().split(" ")[0] == "watching") {
		type = 3;
		suffix = suffix.substring(9);
	}

	if (type == 1) {
		bot.user.setPresence({
			game: {
				name: suffix,
				url: `https://twitch.tv/${config.twitch.username}`
			}
		});
	} else {
		bot.user.setPresence({
			game: {
				name: (suffix.toLowerCase() == "remove" ? null : suffix),
				type: type
			}
		});
	}

	if (suffix.toLowerCase() == "remove") {
		utility.success("Game has been removed.", message);
	} else {
		if (type == 0)
			utility.success(`Game has been updated to **${suffix}**.`, message);
		else if (type == 1)
			utility.success(`Game has been updated to streaming **${suffix}**.`, message);
		else if (type == 2)
			utility.success(`Game has been updated to listening to **${suffix}**.`, message);
		else if (type == 3)
			utility.success(`Game has been updated to watching **${suffix}**.`, message);
	}
};
