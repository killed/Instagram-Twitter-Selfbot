exports.run = (bot, message, suffix, help) => {
	const utility = require("../../modules/utility.js");

	if (help) {
		var embed = utility.createEmbed("Clean");
		embed.setDescription("More details for the **clean** command.");
		embed.addField("Optional commmand usage", `${bot.config.discord.prefix}clean <amount>`);
		embed.addField("Description", `Deletes sent messages by **${bot.user.username}**.`);
		return message.edit({ embed: embed });
	}

	message.delete();
	var amount = suffix ? parseInt(suffix.split(" ")[0], 10) : 100

	message.channel.fetchMessages({ before: message.id, limit: amount }).then(messages => {
		var msgs = messages.filter(msg => msg.author.id == bot.user.id && msg != messages[0] && !msg.pinned);
		msgs.map(msg => msg.delete());
	});
};
