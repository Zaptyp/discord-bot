import moment from 'moment-timezone';
import Discord from 'discord.js';
import Client from '../client';
import * as appVersion from '../utils/app-version';
import { DevBuild, DevBuildRedirect } from '../utils/app-version';

moment.locale('pl');

function getBuildLinks(
  develop: DevBuild | DevBuildRedirect,
  prs: Array<DevBuild | DevBuildRedirect>,
  rich: boolean,
): string {
  if (rich) {
    let developString: string;
    if (develop.redirect) {
      developString = `- ***[develop](${develop.redirectUrl})***: *Nie odnaleziono*`;
    } else {
      developString = `- ***[develop](${develop.url})***: **${develop.version}** opublikowana **${
        moment(develop.publishedAt)
          .tz('Europe/Warsaw')
          .calendar()
          .toLowerCase()
      }**`;
    }
    return `${developString}\n${
      prs
        .map((build: appVersion.DevBuild | appVersion.DevBuildRedirect) => (build.redirect
          ? `- *[${build.branch}](${build.redirectUrl})*: *Nie odnaleziono*`
          : `- *[${build.branch}](${build.url})*: **${build.version}** opublikowana **${
            moment(build.publishedAt)
              .tz('Europe/Warsaw')
              .calendar()
              .toLowerCase()
          }**`))
        .join('\n')
    }`;
  }
  let developString: string;
  if (develop.redirect) {
    developString = `- **develop**: ${develop.redirectUrl} - *Nie odnaleziono*`;
  } else {
    developString = `- **develop**: ${develop.url} - ${develop.version}`;
  }
  return `${developString}\n${prs.map((build: appVersion.DevBuild | appVersion.DevBuildRedirect) => (build.redirect
    ? `- ${build.branch}: ${build.redirectUrl} - *Nie odnaleziono*`
    : `- ${build.branch}: ${build.url} - ${build.version}`)).join('\n')
  }`;
}

export default async function pobierz(client: Client, message: Discord.Message): Promise<void> {
  await message.channel.sendTyping();

  try {
    const betaBuild = await appVersion.getBetaBuild();
    const devDevelopBuild = await appVersion.getDevelopBuild();
    const devPrBuilds = await appVersion.getPrBuilds();

    const buildMessageRich = getBuildLinks(devDevelopBuild, devPrBuilds, true);
    const buildMessagePlain = getBuildLinks(devDevelopBuild, devPrBuilds, false);

    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: 'Pobierz Wulkanowego!', iconURL: 'https://cdn.discordapp.com/attachments/523847362632744975/546459616188563477/nr_logo_wulkanowy2.png' })
      .addFields({ name: 'Strona internetowa', value: 'https://wulkanowy.github.io/' })
      .setColor('#9a0007')
      .addFields({ name: 'Wersja beta',
        value: `${`Aktualna wersja: **v${betaBuild.version}** opublikowana **${
          moment(betaBuild.publishedAt)
            .tz('Europe/Warsaw')
            .calendar()
            .toLowerCase()
        }**\n`
        + '[Sklep Play](https://play.google.com/store/apps/details?id=io.github.wulkanowy) | '
        + `[GitHub](${betaBuild.url}) | `}${betaBuild.directUrl === null
          ? '' : `[Direct](${betaBuild.directUrl})`}` });

    if (buildMessageRich.length < 1000) {
      embed.addFields({ name: 'Wersja DEV', value: buildMessageRich });
      await message.channel.send({ embeds: [embed] });
    } else if (buildMessagePlain.length < 1000) {
      embed.addFields({ name: 'Wersja DEV', value: buildMessagePlain });
      await message.channel.send({ embeds: [embed] });
    } else if (buildMessagePlain.length < 2000) {
      await message.channel.send({ content: buildMessagePlain, embeds: [embed] });
    } else {
      embed.addFields({ name: 'Wersja DEV', value: 'Zbyt dużo buildów. Odwiedź [naszą stronę domową](https://wulkanowy.github.io/#download) by pobrać któregoś z nich' });
      await message.channel.send({ embeds: [embed] });
    }
  } catch (error) {
    await message.channel.send(`Błąd: \`${error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:'}\``);
  }
}
