import Discord from 'discord.js';
import Client from '../client';
import * as uonetStatus from '../utils/uonet-status';
/*8
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

  void ActivityType.Watching('od mniej niż minuty', {
    type: 'WATCHING',
  });

  let activeTimeMinutes = 1;

  setInterval(() => {
    if (activeTimeMinutes >= 60 * 48) {
      const activeTimeDays = Math.floor(activeTimeMinutes / 60 / 24);
      void ActivityType.Watching(`od ${activeTimeDays} dni`, {
        type: 'WATCHING',
      });
    } if (activeTimeMinutes >= 60) {
      const activeTimeHours = Math.floor(activeTimeMinutes / 60);
      void ActivityType.Watching(activeTimeHours === 1 ? 'od godziny' : `od ${activeTimeHours} godzin`, {
        type: 'WATCHING',
      });
    } else {
      void client.user.setPresence([activeTimeMinutes === 1 ? 'od minuty' : `od ${activeTimeMinutes} minut`, {
        type: 'WATCHING',
      }]);
    }
    activeTimeMinutes += 1;
  }, 60000);

  console.log('Uruchomiono bota :)');
}*/
