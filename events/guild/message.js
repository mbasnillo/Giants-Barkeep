const { PREFIX } = process.env;

module.exports = (Discord, client, message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

  if (command) {
    command.execute(client, cmd, message, args, Discord);
  }
};