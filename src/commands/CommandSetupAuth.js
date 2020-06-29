const Auth = require('../libs/auth');
const auth = new Auth();
module.exports = {
    name: 'setupauth',
    description: 'Sets up auth',
    async execute(message, args) {
        await auth.login('fixAuth', args);
    }
}