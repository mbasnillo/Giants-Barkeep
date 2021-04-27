const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports = {
  name: 'play',
  aliases: ['p', 'skip', 'stop'],
  description: 'Music bot functionality',
  async execute(client, cmd, message, args, Discord) {
    const voice_channel = message.member.voice.channel;
    if (!voice_channel) {
      return message.reply('You need to be in a voice channel to use this command!');
    }

    const permissions = voice_channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.reply(`You don't have the correct permissions!`);

    const server_queue = queue.get(message.guild.id);

    if (cmd === 'play' || cmd === 'p') {
      if (!args.length) return message.reply('You need to provide something to play!');
      let song = {};

      if (ytdl.validateURL(args[0])) {
        // If second argument is a URL, get info using ytdl
        const song_info = await ytdl.getInfo(args[0]);
        song = {
          title: song_info.videoDetails.title,
          url: song_info.videoDetails.video_url
        };
      } else {
        // If second argument is a query, use search to find
        const video_finder = async (query) => {
          const video_result = await ytSearch(query);

          return (video_result.videos.length > 1) ? video_result.videos[0] : null;
        }

        const video = await video_finder(args.join(' '));
        if (video) {
          song = {
            title: video.title,
            url: video.url
          }
        } else {
          message.channel.send('Error finding video');
        }
      }

      if (!server_queue) {
        const queue_constructor = {
          voice_channel: voice_channel,
          text_channel: message.channel,
          connection: null,
          songs: []
        };

        queue.set(message.guild.id, queue_constructor);
        queue_constructor.songs.push(song);

        try {
          const connection = await voice_channel.join();
          queue_constructor.connection = connection;
          video_player(message.guild, queue_constructor.songs[0]);
        } catch (err) {
          queue.delete(message.guild.id);
          message.channel.send('Error connecting to server');
          throw err;
        }
      } else {
        server_queue.songs.push(song);
        return message.channel.send(`${song.title} - Added to Queue!`);
      }
    } else if (cmd == 'skip') {
      skip_song(message, server_queue);
    } else if (cmd === 'stop') {
      stop_song(message, server_queue);
    }
  }
}

const video_player = async (guild, song) => {
  const song_queue = queue.get(guild.id);

  if (!song) {
    song_queue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }

  const stream = ytdl(song.url, { filter: 'audioonly' });
  song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
      song_queue.songs.shift();
      video_player(guild, song_queue.songs[0]);
    });

  await song_queue.text_channel.send(`NOW PLAYING - ${song.title}`);
}

const skip_song = (message, server_queue) => {
  if (!message.member.voice.channel) return message.reply('You need to be in a voice channel to run this command!');
  if (!server_queue) return message.channel.send('There are no songs in the queue');
  server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
  if (!message.member.voice.channel) return message.reply('You need to be in a voice channel to run this command!');
  if (server_queue && server_queue.songs && server_queue.songs.length > 0) {
    server_queue.songs = [];
  } else {
    return message.channel.send("Can't stop what's not there");
  }
  server_queue.connection.dispatcher.end();
}