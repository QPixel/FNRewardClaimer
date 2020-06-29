const Auth = require('../libs/auth');
const axios = require('axios').default;
const {MessageEmbed} = require('discord.js');
const {PUBLIC_BASE_URL} = require('../utils/endpoints');

const auth = new Auth();

module.exports = {
    name: 'claim',
    description: 'Claims daily reward',
    async execute(message, args) {
        let token = await auth.login(null, '');
        let {accountId} = require('../libs/deviceAuthDetails.json');
        const embed = new MessageEmbed().setTitle('FNRewardClaimer').setFooter('FNRewardClaimer, a bot made by QPixel').setTimestamp();

        let response = await axios.post(`${PUBLIC_BASE_URL}/game/v2/profile/${accountId}/client/ClaimLoginReward?profileId=campaign&rvn=-1`, {}, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}).catch((res) => {
            console.log('Something went wrong with the claiming command!');
            console.error(res);
            return message.reply('Something went wrong!')
        });
        let notification = response.data.notifications[0];
        let items = notification.items;
        if (items.length === 0) {
            embed.setDescription(`You have already claimed your items! Days logged in: ${notification.daysLoggedIn}`);
            embed.addField('No items to claim....');
            return message.channel.send(embed);
        }
        embed.setDescription(`You have claimed ${items.length} items! Days logged in: ${notification.daysLoggedIn}`);
        embed.addField('Claimed:', '```json ', JSON.stringify(items, null, 4), '```');

        message.channel.send(embed);
    }
}
