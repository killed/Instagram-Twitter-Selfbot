module.exports = async (bot, message) => {
    const utility = require("../modules/utility.js");
    const fs = require("fs");

    if (message.author.id !== bot.user.id)
        return;

    if (message.content.startsWith(bot.config.discord.prefix)) {
        var content = message.content.replace(/  /g, " ");

        while (content.includes("  "))
            content = content.replace(/  /g, " ");

        const categories = fs.readdirSync(`${__dirname}/../commands/`);
        const command = content.split(" ")[0].substring(bot.config.discord.prefix.length).toLowerCase();
        const suffix = content.substring(command.length + bot.config.discord.prefix.length + 1);

        if (command == "help") {
            if (suffix) {
                categories.forEach(category => {
                    try {
                        var path = `${__dirname}/../commands/${category}/${suffix}.js`;

                        if (fs.existsSync(path)) {
                            require(path).run(bot, message, suffix, true);
                            delete require.cache[require.resolve(path)];
                        }
                    } catch (err) {
                        console.log(err.stack);
                    }
                });
            } else {
                var commands = [];

                categories.forEach(category => {
                    commands.push(fs.readdirSync(`./commands/${category}/`).join(", ").replace(/.js/g, ""));
                });

                utility.sendHelp(categories, commands, message);
            }
        } else {
            categories.forEach(category => {
                try {
                    var path = `${__dirname}/../commands/${category}/${command}.js`;

                    if (fs.existsSync(path)) {
                        require(path).run(bot, message, suffix, false);
                        delete require.cache[require.resolve(path)];
                    }
                } catch (err) {
                    console.log(err.stack);
                }
            });
        }
    }
}