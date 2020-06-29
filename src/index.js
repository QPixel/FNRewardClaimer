const Discord = require("discord.js");
const fs = require("fs");
const { prefix, token } = require("./config.json");
const path = require("path");
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

try {
  auth.login(null, '');
} catch (err) {
  auth.login('newAuth', '');
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(token);
