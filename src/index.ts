import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import Client from './client';
import guildMemberAddHandler from './event-handlers/guild-member-add';
import messageHandler from './event-handlers/message';
import readyHandler from './event-handlers/ready';

dotenv.config();

if (!process.env.DISCORD_TOKEN) {
  throw new Error('Token not provided');
}
console.log('Starting bot...');
let client: Client;

fs.promises.readFile(path.join(__dirname, '../config.json'), 'utf8')
  .then(async (data: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    client = new Client(JSON.parse(data));

    client.on('guildMemberAdd', guildMemberAddHandler.bind(null, client));
    client.on('messageCreate', messageHandler.bind(null, client));
    client.on('ready', readyHandler.bind(null, client));

    try {
      await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })
  .catch((error: Error) => {
    console.error('Podczas wczytywania plików konfiguracyjnych wystąpił błąd');
    console.error(error);
    process.exit(1);
  });
