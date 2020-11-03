exports.run = (bot, message, suffix, help) => {
	const utility = require("../../modules/utility.js");
	const description = "Ping/pong challenge/response to see if the bot is alive, " +
		"and how long it takes to respond returned in milliseconds.";

	if (help) {
		var embed = utility.createEmbed("Alive");
		embed.setDescription("More details for the **alive** command.");
		embed.addField("Command usage", "This command takes no parameters.");
		embed.addField("Description", description);
		return message.edit({ embed: embed });
	}

	var embed = utility.createEmbed("Alive");
	embed.setDescription(description);
	embed.addField("Latency", "Pinging...", true);
	embed.addField("API Latency", "Pinging...", true);

	message.delete();
	message.channel.send({ embed: embed }).then(sent => {
		var embed = utility.createEmbed("Alive");
		embed.setDescription(description);
		embed.addField("Latency", sent.createdTimestamp - message.createdTimestamp + "ms", true);
		embed.addField("API Latency", Math.round(bot.ping) + "ms", true);
		sent.edit({ embed: embed });
	});
};
