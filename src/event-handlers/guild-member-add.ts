import Discord from 'discord.js';
import Client from '../client';

export default async function guildMemberAddHandler(
  client: Client,
  partialMember: Discord.PartialGuildMember | Discord.GuildMember,
): Promise<void> {
  const member = await partialMember.fetch();
  console.log(`${member.user.username} wbił!`);
  const avatar = member.user.avatarURL();
  const { id } = member.user;
  if (!member.user.bot) {
    const embedDM = new Discord.EmbedBuilder()
      .setTitle('Witaj na serwerze Wulkanowego!')
      .setDescription('Używamy tutaj specjalnych ról, by móc oznaczyć osoby korzystające z danej wersji e-dziennika (np. `vulcan.net.pl`, `eszkola.opolskie.pl`).\nUłatwia to rozwiązywanie problemów i testowanie nowych funkcji.\n\nBy wyświetlić listę wszystkich ról, przejdź na kanał #choose-role\n - By przydzielić sobie odpowienią rolę, kliknij w odpowiednią reakcję.\n\n**Dziękujemy za wybranie naszej aplikacji!**')
      .setColor('#9a0007');
    await member.send({ embeds: [embedDM] });
  }

  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === client.config.channels.greetings,
  );
  if (!channel || !(channel instanceof Discord.TextChannel)) return;
  if (!member.guild.members.me?.permissionsIn(channel).has(['SendMessages'])) return;
  const embedPublic = new Discord.EmbedBuilder()
    .setAuthor({ name: 'Na serwerze pojawił się', iconURL: avatar || undefined })
    .setDescription(`<@!${id}>`)
    .setColor('#9a0007');
  await channel.send({ embeds: [embedPublic] });
}
