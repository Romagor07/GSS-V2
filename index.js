
const fs = require('fs');
const { Client, GatewayIntentBits, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Gamedig = require('gamedig');
const fetchSCPStatus = require('./scp');
const config = require('./config.json');
const channels = require('./channels.json');

const CHANNELS_FILE = './channels.json';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) {
    console.error('Гильдия не найдена.');
    return;
  }

  await updateStatuses(guild);
  setInterval(() => updateStatuses(guild), 30000);
});

async function updateStatuses(guild) {
  const ch1 = guild.channels.cache.get(channels.channel1);
  const ch2 = guild.channels.cache.get(channels.channel2);
  const ch3 = guild.channels.cache.get(channels.channel3);
  const ch4 = guild.channels.cache.get(channels.channel4);
  const servers = config.servers;

  const statuses = await Promise.all(
    servers.map(async (srv, i) => {
      try {
        const state = await Gamedig.query({
          type: 'garrysmod',
          host: srv.ip,
          port: srv.port,
          socketTimeout: 3000,
          attemptTimeout: 3000
        });

        const playerList =
          state.players.map(p => ` 🔹 ${p.name || '*Подключается ...*'}`).join('\n') ||
          ' 🔸 На сервере никого нету 😥';

        const embed = new EmbedBuilder()
          .setTitle(`🟢 ${srv.name}`)
          .setColor(['#FF0000', '#FFFF00', '#FF4500'][i])
          .setDescription('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\u200B')
          .setThumbnail(`https://dev.novanautilus.net/images/${state.map}.jpg`)
          .addFields(
            { name: '🌍 ┃ Карта', value: ` 🔹 ${state.map} \n\u200B` },
            {
              name: `👥 ┃ Игроки ${state.raw.numplayers}/${state.maxplayers}`,
              value: playerList,
            },
            { name: '\u200B', value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' }
          )
          .setFooter({ text: 'Обновлено' })
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Подключиться')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://wargm.ru/server/${srv.connect}/connect`)
        );

        return {
          embed,
          row,
          status: {
            online: true,
            players: state.raw.numplayers,
            maxPlayers: state.maxplayers,
          },
        };
      } catch (err) {
        console.error(`Ошибка получения статуса ${srv.name}:`, err);

        const embed = new EmbedBuilder()
          .setTitle(`🔴 ${srv.name} - Выключен`)
          .setColor('#d65a5a')
          .setFooter({ text: 'Обновлено' })
          .setTimestamp();

        return {
          embed,
          row: null,
          status: {
            online: false,
            players: 0,
            maxPlayers: 0,
          },
        };
      }
    })
  );

  const scp = await fetchSCPStatus();
  if (ch1) ch1.setName(`${statuses[0].status.online ? '🟢' : '🔴'} ${servers[0].name} - ${statuses[0].status.players}|${statuses[0].status.maxPlayers}`);
  if (ch2) ch2.setName(`${statuses[1].status.online ? '🟢' : '🔴'} ${servers[1].name} - ${statuses[1].status.players}|${statuses[1].status.maxPlayers}`);
  if (ch3) ch3.setName(scp.name);

  if (ch4 && ch4.type === ChannelType.GuildText) {
    for (let i = 0; i < statuses.length; i++) {
      const s = statuses[i];
      const existingMessageId = channels.messageIds[i];

      try {
        if (existingMessageId) {
          const msg = await ch4.messages.fetch(existingMessageId);
          await msg.edit({ embeds: [s.embed], components: s.row ? [s.row] : [] });
        } else {
          throw new Error("No message ID");
        }
      } catch (e) {
        const newMsg = await ch4.send({ embeds: [s.embed], components: s.row ? [s.row] : [] });
        channels.messageIds[i] = newMsg.id;
        fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2));
      }
    }
  }
}

client.login(config.token);
