import * as dotenv from 'dotenv';
dotenv.config();
const path = `${__dirname}/../../../.env/`;
dotenv.config({ path: path });

export const discordToken = process.env.DISCORD_TOKEN;
export const prefix = process.env.prefix;
export const email = process.env.email;
export const password = process.env.password;
export const botPrefix = process.env.botprefix;
