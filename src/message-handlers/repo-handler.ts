import Discord from 'discord.js';
import _ from 'lodash';
import * as GitHub from '../utils/github';
import Client from '../client';

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export default async function repoHandler(
  client: Client,
  message: Discord.Message,
): Promise<void> {
  const repoRegex = /(?:\s|^)([\w-.]+)\/([\w-.]+)(?=\s|$)/g;
  const repoMatches = Array.from(message.content.matchAll(repoRegex));

  if (repoMatches.length > 0) {
    await message.channel.sendTyping();

    const repoNames = _.uniqWith(
      repoMatches.map((repoMatch: RegExpMatchArray) => ({
        owner: repoMatch[1],
        repo: repoMatch[2],
      })),
      _.isEqual,
    );

    const repos: GitHub.RepoInfo[] = (await Promise.all(
      repoNames.map(async ({ owner, repo }: { owner: string; repo: string }) => {
        try {
          return await GitHub.getRepoInfo(owner, repo);
        } catch (error) {
          console.warn(error);
          return null;
        }
      }),
    ))
      .filter(notEmpty);

    // eslint-disable-next-line @typescript-eslint/require-await
    await Promise.all(repos.map(async (repo: GitHub.RepoInfo) => {
      const embed = new Discord.EmbedBuilder()
        .setTitle(`${repo.name}`)
        .setURL(repo.url)
        .setThumbnail(repo.avatar)
        .setFooter({ text: 'GitHub', iconURL: 'https://i.imgur.com/LGyvq8p.png' })
        .setColor('#ffeb3b');

      if (repo.description) {
        embed.setDescription(repo.description);
      } else {
        embed.setDescription('Brak opisu');
      }
      if (repo.homepage) {
        embed.addFields({ name: 'Strona domowa', value: repo.homepage });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // embed.addFields({ name: 'Gwiazdki', value: repo.stars.number });

      await message.channel.send({ embeds: [embed] });
      
    }));
  }
}
