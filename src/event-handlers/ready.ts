import Discord from 'discord.js';
import Client from '../client';
import * as uonetStatus from '../utils/uonet-status';

const statusChannels: Discord.TextChannel[] = [];
let lastStatusCode = 0;

async function performCheck(): Promise<void> {
  try {
    await Promise.all(statusChannels.map(
      (statusChannel: Discord.TextChannel) => statusChannel.sendTyping(),
    ));
    lastStatusCode = await uonetStatus.sendStatusMessage(statusChannels, 'warszawa', lastStatusCode);
  } catch (error) {
    console.error(error);
    await Promise.all(statusChannels.map((statusChannel: Discord.TextChannel) => statusChannel.send(
      `Błąd: \`${error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:'}\``,
    )));
  }
}

export default function readyHandler(client: Client): void {
  statusChannels.push(client.channels.cache
    .find((ch: Discord.Channel) => ch.id === '522119365265588224') as Discord.TextChannel);

  const statusCheckInterval = client.config.statusInterval * 1000;

  setInterval((): void => {
    void performCheck();
  }, statusCheckInterval);
  
  console.log('Uruchomiono bota :)');
}
