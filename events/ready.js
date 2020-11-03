module.exports = async (bot, message) => {
    console.log("[+] Logged in as: %s", bot.user.tag);
    console.log("[?] Bot trigger: %s", bot.config.discord.prefix);
    console.log("[?] Servers: %d\r\n", bot.guilds.size);
}