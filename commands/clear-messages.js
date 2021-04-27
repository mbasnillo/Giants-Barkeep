module.exports = {
  name: 'clear-messages',
  aliases: ['cm', 'clear'],
  description: 'Clears messages up to a certain amount',
  async execute(client, cmd, message, args) {
    if (!args[0]) return message.reply('Please specify a number of messages to clear');
    if (isNaN(args[0])) return message.reply('Please enter a real number');
    if (args[0] > 100) return message.reply('Cannot delete more than 100 messages');
    if (args[0] < 1) return message.reply('Must delete at least one message');

    let limit = parseInt(args[0]) + 1;

    if (message.member.permissions.has('MANAGE_MESSAGES')) {
      await message.channel.messages.fetch({ limit: limit })
        .then(messages => {
          message.channel.bulkDelete(messages);
        })
        .then(_ => {
          message.channel.send(`${limit - 1} messages successfully deleted`);
        });
    } else {
      return message.reply('Insufficient permissions to delete messages');
    }
  }
}