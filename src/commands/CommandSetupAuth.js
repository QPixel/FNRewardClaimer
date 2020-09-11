const Auth = require('../libs/auth');
const Discord = require('discord.js');
const Endpoints = require('../utils/endpoints');
const {prefix} = require('../config.json');
const auth = new Auth();
module.exports = {
    name: 'setupauth',
    description: 'Sets up auth',
    async execute(message, args) {
        const embed = new Discord.MessageEmbed().setTitle('FNRewardClaimer').setFooter('FNRewardClaimer, a bot made by QPixel').setTimestamp();
        console.log(args)
        if (!args[0] || args[0] === ""){
            embed.addField('Please get the code from this url..', Endpoints.API_AUTHORIZATION_CODE);
            embed.addField('Then redo the command with the code at the end', `${prefix}setupauth aaa0b38c2633f4867sdaf4838a29765d644`)
            return message.channel.send(embed);
        } else {
            try {
                await auth.login('fixauth', args[0]);
                embed.setDescription("Auth should be fixed.")
            } catch (e) {
                console.error(e);
                embed.setDescription("Something went wrong with setting up the auth!");
            }
            return message.channel.send(embed);
        }
    }
}