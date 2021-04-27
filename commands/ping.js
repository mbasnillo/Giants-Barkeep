module.exports = {
  name: 'ping',
  description: 'Returns pong',
  execute(client, cmd, message, args, Discord) {

    /*
      ROLE-RELATED
    */
    // if (message.member.roles.cache.has('836194256132636712')) {
    //   message.channel.send('pongerz');
    // } else {
    //   message.channel.send('Adding role');
    //   message.member.roles.add('836194256132636712').catch(console.error); // used to add a role for a certain user
    //   // message.member.roles.remove('836194256132636712'); // For removing
    // }

    // let role = message.guild.roles.cache.find(role => role.name === "Barkeep");

    // // Permission Flags  - https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS - https://discordjs.guide/popular-topics/permissions.html#roles-as-bot-permissions
    // if (message.member.permissions.has('KICK_MEMBERS')) {
    //   message.channel.send('CAN KICK');
    // } else {
    //   message.channel.send('CANNOT KICK');
    // }

    // if (message.member.roles.cache.some(role => role.name === "Barkeep")) {
    //   message.channel.send('pongerz');
    // } else {
    //   message.channel.send('NO ROLE');
    //   message.member.roles.add(role).catch(console.error);
    // }

    /*================================================================================================*/

    /*
      EMBED-RELATED
    */
    const newEmbed = new Discord.MessageEmbed()
      .setColor('#ffdc73')
      .setTitle('Rules')
      .setURL('https://google.com')
      .setDescription('This is an embed for the server rules')
      .addFields(
        { name: 'Rule 1', value: 'No gore' },
        { name: 'Rule 2', value: '\u200B' },
      )
      .addField('Inline field title', 'test second add field', true)
      .setImage('https://i.imgur.com/8qfW7bb.png')
      .setTimestamp()
      .setFooter('Footer text', 'https://i.imgur.com/8qfW7bb.png');

    message.channel.send(newEmbed);
  }
}