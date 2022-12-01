import Discord from 'discord.js';
import { prune } from 'voca';
import _ from 'lodash';
import * as GitHub from '../utils/github';
import Client from '../client';

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export default async function issueHandler(
  client: Client,
  message: Discord.Message,
): Promise<void> {
  const issueRegex = /(?:\s|^)(?:(?:([\w-.]+)\/)?([\w-.]+))?#(\d+)(?=\s|$)/g;
  const issueMatches = Array.from(message.content.matchAll(issueRegex));

  if (issueMatches.length > 0) {
    await message.channel.sendTyping();

    let repository = 'wulkanowy';
    switch (message.channel.id) {
      case '666358671428550677': { repository = 'uonet-api'; break; }
      case '558341774704115713': { repository = 'sdk'; break; }
      case '542450812937306112': { repository = 'sdk-node'; break; }
      case '666790865976688641': { repository = 'school-extension-server'; break; }
      case '558344919962353664': { repository = 'fake-log'; break; }
      case '558345420028248076': { repository = 'uonet-request-signer'; break; }
      case '714234783156142171': { repository = 'AppKillerManager'; break; }
      case '558345023100420118': { repository = 'wulkanowy.github.io'; break; }
      case '592063735363796993': { repository = 'material-chips-input'; break; }
      case '558345487573319680': { repository = 'qr'; break; }
      case '558345455558197249': { repository = 'cli'; break; }
      case '565275490630238208': { repository = 'fake-vulcan-ext'; break; }
      case '523847362632744975': { repository = 'discord-bot'; break; }
      case '558345138557157389': { repository = 'bitrise-redirector'; break; }
      case '558345380081696809': { repository = 'average-volcano'; break; }
      case '558345520045621268': { repository = 'timetable-parser-js'; break; }
      case '698499304465104906': { repository = 'symbols-generator'; break; }
      case '786967003247673395': { repository = 'wulkanowy-web'; break; }
      case '798530776655855617': { repository = 'bridge'; break; }
      case '772196118150905916': { repository = 'wulkanowy-ios'; break; }
      case '927216572160954398': { repository = 'awesome-school-projects-poland'; break; }
      default: { repository = 'wulkanowy'; break; }
    }

    const issueNames = _.uniqWith(
      issueMatches.map((issueMatch: RegExpMatchArray) => ({
        owner: issueMatch[1] || 'wulkanowy',
        repo: issueMatch[2] || repository,
        issue: parseInt(issueMatch[3], 10),
      })),
      _.isEqual,
    ).filter(notEmpty);

    const issues = (await Promise.all(
      issueNames.map(async (
        { owner, repo, issue }: { owner: string; repo: string; issue: number },
      ) => {
        try {
          const info = await GitHub.getIssueInfo(owner, repo, issue);
          if (!info) return null;
          return info;
        } catch (error) {
          console.warn(error);
          return null;
        }
      }),
    ))
      .filter(notEmpty);

    await Promise.all(issues.map(async (issue: GitHub.IssueInfo | GitHub.PullInfo) => {
      const embed = new Discord.EmbedBuilder()
        .setTitle(`[#${issue.number}] ${issue.title}`)
        .setURL(issue.url)
        .setAuthor({ name: issue.user.login, iconURL: issue.user.avatar, url: issue.user.url })
        .setFooter({ text: 'GitHub', iconURL: 'https://i.imgur.com/LGyvq8p.png' });

      if (issue.type === 'issue') embed.addFields({ name: 'Repozytorium', value: `${issue.owner}/${issue.repo}` });

      if (issue.type === 'issue') embed.addFields({ name: 'Typ', value: 'Issue' });
      else if (issue.type === 'pull') embed.addFields({ name: 'Typ', value: 'Pull request' });

      if (issue.open) embed.addFields({ name: 'Stan', value: 'Otwarty' });
      else embed.addFields({ name: 'Stan', value: issue.type === 'pull' && issue.merged ? 'Merged' : 'Zamknięty' });

      if (issue.type === 'pull' && issue.open) embed.addFields({ name: 'Draft', value: issue.draft ? 'Tak' : 'Nie' });

      if (issue.description) {
        embed.setDescription(prune(issue.description, 512, '\n(...)'));
      } else {
        embed.setDescription('Brak opisu');
      }

      if (issue.type === 'pull' && issue.merged) embed.setColor('#6f42c1');
      else if (issue.type === 'pull' && issue.draft) embed.setColor('#6a737d');
      else if (issue.open) embed.setColor('#2cbe4e');
      else embed.setColor('#cb2431');

      await message.channel.send({ embeds: [embed] });
    }));
  }
}
