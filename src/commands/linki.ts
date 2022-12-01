import Discord from 'discord.js';
import Client from '../client';

export default async function linki(client: Client, message: Discord.Message): Promise<void> {
  const embed = new Discord.EmbedBuilder()
    .setAuthor({ name: 'Linki', iconURL: 'https://cdn.discordapp.com/attachments/523847362632744975/546459616188563477/nr_logo_wulkanowy2.png' })
    .addFields({ name:'Strona', value: 'https://wulkanowy.github.io/' })
    .addFields({ name: 'GitHub', value: 'https://github.com/wulkanowy/' })
    .addFields({ name: 'Sklep Play', value: 'https://play.google.com/store/apps/details?id=io.github.wulkanowy' })
    .addFields({ name: 'Huawei AppGallery', value: 'https://appgallery.huawei.com/#/app/C101440411' })
    .addFields({ name: 'Trello', value: 'https://trello.com/b/A97NUM1s/wulkanowy/' })
    .addFields({ name: 'PayPal', value: 'https://www.paypal.me/wulkanowy' })
    .addFields({ name: 'Pomoc w tłumaczeniu', value: 'https://crowdin.com/project/wulkanowy2' })
    .setColor('#9a0007');
  await message.channel.send({ embeds: [embed] });
}
