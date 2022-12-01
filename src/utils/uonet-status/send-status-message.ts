import Discord, {
  DMChannel,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import { checkService, interpretCodeMessage, StatusCode } from '.';

export default async function sendStatusMessage(
  channels: (PartialDMChannel | DMChannel | TextChannel | NewsChannel | ThreadChannel)[],
  symbol: string,
  lastStatusCode: number | undefined = undefined,
  host: string | undefined = 'vulcan.net.pl',
  mobileUrl: string | undefined = 'https://lekcjaplus.vulcan.net.pl',
  expectedTitle: string | undefined = 'Uczeń',
): Promise<number> {
  const [studentNewStatus, messagesStatus, mobileApiStatus] = await Promise.all([
    checkService(`https://uonetplus-uczen.${host}/${symbol}`, expectedTitle),
    checkService(`https://uonetplus-wiadomosciplus.${host}/${symbol}`, 'Wiadomości Plus'),
    checkService(`${mobileUrl}/${symbol}`, 'UONET+ dla urządzeń mobilnych'),
  ]);

  const statusCode = (studentNewStatus ? studentNewStatus.code : 0)
    + (mobileApiStatus ? mobileApiStatus.code * 8 : 0)
    + (studentNewStatus ? studentNewStatus.code * 64 : 0);

  if (lastStatusCode === undefined || statusCode !== lastStatusCode) {
    const statusColor = Math.max(
      studentNewStatus?.code || 0,
      messagesStatus?.code || 0,
      mobileApiStatus?.code || 0,
    ) === StatusCode.Working ? '#2ecc71' : '#f1c40f';

    const embed = new Discord.EmbedBuilder()
      .setTitle(`Status dzienniczka ${host} (dla symbolu *${symbol}*)`)
      .setColor(statusColor)
      .addFields({ name: 'Nowy moduł uczeń:', value: interpretCodeMessage(studentNewStatus) })
      .addFields({ name: 'Wiadomości plus:', value: interpretCodeMessage(messagesStatus) })
      .addFields({ name: 'API mobilne (HEBE):', value: interpretCodeMessage(mobileApiStatus) });

    if (Math.max(
      studentNewStatus.code,
      messagesStatus.code,
      mobileApiStatus.code,
    ) === StatusCode.Working) {
      embed.setImage('https://i.imgur.com/oBPbqmy.png');
    }

    await Promise.all(channels.map(
      (statusChannel) => statusChannel.send({ embeds: [embed] }),
    ));
  }

  return statusCode;
}
