import Discord from 'discord.js';
import Client from '../client';

export default async function ping(client: Client, message: Discord.Message): Promise<void> {
  const testmessage = await message.channel.send('Sprawdzam...');
  const embed = new Discord.EmbedBuilder()
    .setTitle('PONG! :ping_pong:')
    .setDescription(
      `${`Udało mi się odpowiedzieć w **${Math.round(testmessage.createdTimestamp - message.createdTimestamp)}ms`}\n**`
      + `${`Opóźnienie API Discord wynosi **${Math.round(client.ws.ping)}ms**`}`,
    )
    .setColor('#F44336');
  await testmessage.edit({ content: null, embeds: [embed] });
}
