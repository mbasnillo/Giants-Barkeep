module.exports = {
  name: 'coinflip',
  description: 'Flips a coin and returns either heads or tails',
  execute(client, cmd, message, args) {
    let result = Math.floor(Math.random() * 2 + 1);

    if (result % 2 == 0) {
      message.channel.send('Heads');
    } else {
      message.channel.send('Tails');
    }
  }
}