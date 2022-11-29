import Discord from 'discord.js';
import * as uonetStatus from '../utils/uonet-status';
import Client from '../client';

export default async function status(
  client: Client,
  message: Discord.Message,
  args: string[],
): Promise<void> {
  await message.channel.sendTyping();

  let host: string;
  let symbol: string;
  let mobileUrl: string;
  let expectedTitle: string;
  if (message.member === null) return;
  if (message.member.roles.cache.some((role: Discord.Role) => role.name === 'eszkola.opolskie.pl')) {
    host = 'eszkola.opolskie.pl';
    symbol = args[0] || 'opole';
    mobileUrl = 'https://uonetplus-komunikacja.eszkola.opolskie.pl';
    expectedTitle = 'Logowanie do systemu Opolskiej e-Szkoła';
  } else if (message.member.roles.cache.some((role: Discord.Role) => role.name === 'edu.gdansk.pl')) {
    host = 'edu.gdansk.pl';
    symbol = args[0] || 'gdansk';
    mobileUrl = 'https://uonetplus-komunikacja.edu.gdansk.pl';
    expectedTitle = 'Logowanie do systemu e-Szkoła';
  } else if (message.member.roles.cache.some((role: Discord.Role) => role.name === 'umt.tarnow.pl')) {
    host = 'umt.tarnow.pl';
    symbol = args[0] || 'tarnow';
    mobileUrl = 'https://uonetplus-komunikacja.umt.tarnow.pl';
    expectedTitle = 'Logowanie do systemu e-Szkoła';
  } else if (message.member.roles.cache.some((role: Discord.Role) => role.name === 'resman.pl')) {
    host = 'resman.pl';
    symbol = args[0] || 'rzeszow';
    mobileUrl = 'https://uonetplus-komunikacja.resman.pl';
    expectedTitle = 'Logowanie do systemu';
  } else if (message.member.roles.cache.some((role: Discord.Role) => role.name === 'edu.lublin.eu')) {
    host = 'edu.lublin.eu';
    symbol = args[0] || 'lublin';
    mobileUrl = 'https://uonetplus-komunikacja.edu.lublin.eu';
    expectedTitle = 'Logowanie do systemu';
  } else if (message.member.roles.cache.some((role: Discord.Role) => role.name === 'eduportal.koszalin.pl')) {
    host = 'eduportal.koszalin.pl';
    symbol = args[0] || 'koszalin';
    mobileUrl = 'https://uonetplus-komunikacja.eduportal.koszalin.pl';
    expectedTitle = 'Logowanie do systemu e-Szkoła';
  } else {
    host = 'vulcan.net.pl';
    symbol = args[0] || 'warszawa';
    mobileUrl = 'https://lekcjaplus.vulcan.net.pl';
    expectedTitle = 'Uczeń';
  }
/**
  try {
    await uonetStatus.sendStatusMessage(
      [ChannelType.GuildNews], symbol, undefined, host, mobileUrl, expectedTitle,
    );
  } catch (error) {
    console.error(error);
    await message.channel.send(`Błąd: \`${error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:'}\``);
  }*/
}
