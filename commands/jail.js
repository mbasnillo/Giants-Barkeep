const ms = require('ms');

module.exports = {
  name: 'jail',
  aliases: ['unjail'],
  description: 'Gives a user the specific jail role',
  async execute(client, cmd, message, args) {
    const member = message.mentions.users.first();

    let role = message.guild.roles.cache.find(role => role.name === "everyday jail day");

    if (cmd === 'jail') {
      if (message.member.permissions.has('MANAGE_ROLES')) {
        if (!args[1]) {
          const memberTarget = message.guild.members.cache.get(member.id);
          memberTarget.roles.add(role).catch(console.error);
          message.channel.send('User has now been jailed');
          return;
        }
        
        const memberTarget = message.guild.members.cache.get(member.id);
        memberTarget.roles.add(role).catch(console.error);
        message.channel.send(`User has now been jailed for ${ms(ms(args[1]))}`);
  
        setTimeout(function() {
          const memberTarget = message.guild.members.cache.get(member.id);
          memberTarget.roles.remove(role).catch(console.error);
          message.channel.send('User has now been removed from jail');
        }, ms(args[1]));
      } else {
        return message.reply('Insufficient permissions to jail a user');
      }
    }

    if (cmd === 'unjail') {
      if (message.member.permissions.has('MANAGE_ROLES')) {
        const memberTarget = message.guild.members.cache.get(member.id);
        memberTarget.roles.remove(role).catch(console.error);
        message.channel.send('User has now been removed from jailed');
      } else {
        return message.reply('Insufficient permissions to unjail a user');
      }
    }
  }
}