//! dependencies

// #region
const dotenv = require('dotenv');
const Discord = require('discord.js');

const client = new Discord.Client();
const fs = require('fs');

dotenv.config();
// #endregion

const prefix = '!';

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', (message) => {
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === 'pronoun') {
    const [pn] = args;
    const { member } = message;
    if (!pn) {
      message.channel.send(`Please enter a pronoun ${message.author}`);
    } else {
      const guildRole = message.guild.roles.find('name', pn);
      if (!guildRole) {
        message.channel.send("This role doesn't exist, maybe use !pronounAdd?");
      } else {
        member.addRole(guildRole).catch((error) => console.warn(error));
        message.channel.send(`Adding role ${pn} for ${message.author.username}`);
      }
    }
  } else if (command === 'unpronoun') {
    const [pn] = args;
    const { member } = message;
    if (!pn) {
      message.channel.send('Please enter a pronoun.');
    } else {
      const guildRole = message.guild.roles.find('name', pn);
      member.removeRole(guildRole).catch(console.error);
      message.channel.send(`Removing ${pn} for ${message.author.username}.`);
    }
  } else if (command === 'beepboop') {
    message.channel.send(`Hello ${message.author.username}! ❤ `);
  } else if (command === 'pnhelp') {
    message.channel.send('Welcome to Pronoun Bot!');
    message.channel.send(
      'Using !pronoun [pronoun] will add a pronoun for the user. Note that you must use this format: they/them.'
    );
    message.channel.send('Using !unpronoun [pronoun] will remove a pronoun for the user.');
    message.channel.send('Using !pronounadd [pronoun] will add the pronoun (mods only).');
  } else if (command === 'pronounadd') {
    const [pn] = args;
    const perms = message.channel.permissionsFor(message.member).hasPermissions('MANAGE_ROLES_OR_PERMISSIONS');
    if (!pn) {
      message.channel.send('Please enter a pronoun.');
    } else if (!perms) {
      message.channel.send('Contact a moderator to add your pronouns');
    } else if (!pn.includes('/')) {
      message.channel.send('Enter pronouns in subject/2nd form format: they/them, it/its, she/her');
    } else {
      message.guild.createRole({
        name: pn,
        permissions: []
      });
      message.channel.send(`Adding pronouns: ${pn}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
