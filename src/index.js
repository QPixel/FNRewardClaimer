const Discord = require("discord.js");
const fs = require("fs");
const { prefix, token, autoClaim, channelID, guildID } = require("./config.json");
const path = require("path");
const cron = require("node-cron");
const client = new Discord.Client();
const Auth = require("./libs/auth");
const auth = new Auth();

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync(`${__dirname}/commands/`)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}


const autoRequest = () => {
	const command = client.commands.get("autoclaim");
	const channel = client.channels.cache.get(channelID);
	try {
		command.execute(channel);
	} catch (e) {
		return channel.send("Auto claim failed");
	}
}
client.on("message", (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);
	if (command.name === "AutoClaim") return;
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});


function startUp() {
  try {
    auth.login(null, '');
  } catch (err) {
    auth.login('newAuth', '');
  }
  client.on("ready", (channel) => {
    console.log(`\n Logged in as ${client.user.tag}!`);
    console.log(`If this is the first time using the bot, please run ${prefix}setupauth {authorization_code} to setup the auth`);
		if (autoClaim === true) {
			cron.schedule("* * * 1 * *", () => {
				autoRequest();
			})
		}
  });
  client.login(token);
}

startUp();  


