exports.run = (bot, message, suffix, help) => {
	const utility = require("../../modules/utility.js");

	if (help) {
		var embed = utility.createEmbed("Restart");
		embed.setDescription("More details for the **restart** command.");
		embed.addField("Command usage", "This command takes no parameters.");
		embed.addField("Description", "Restarts the bot.");
		return message.edit({ embed: embed });
	}

	utility.success("Restarting the bot, boss.", message);

	setTimeout(function() {
		process.exit(0);
	}, 1000);

};
