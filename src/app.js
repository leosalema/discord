require('dotenv').config();

const DiscordJS = require('discord.js');
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, 
{ useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

const client = new DiscordJS.Client();

db.on('error', console.error.bind(console, "connection error"));
db.once('open', function(callback) {
  console.log('Connection succeeded');
})

const discordSchema = new mongoose.Schema({
  channelType: String,
  channelId: String,
  channelName: String,
  channelPosition: Number,
  channelParentID: String,
  channelLastMessageID: String,
  guildName: String,
  guildSysyemChangelID: String,
  guildId: String,
  guildOwnerId: String,
  id: String,
  type: String,
  content: String,
  authorId: String,
  authorUsername: String,
  authorBot: Boolean,
  readyAt: Date,
  createdAt: {type: Date, default: Date.now}
});

const Discord = mongoose.model('Discord', discordSchema);

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  let discord = new Discord({
    channelType: message.channel.type,
    channelId: message.channel.id,
    channelName: message.channel.name,
    channelPosition: message.channel.position,
    channelParentID: message.channel.parentID,
    channelLastMessageID: message.channel.lastMessageID,
    guildName: message.channel.guild.name,
    guildSysyemChangelID: message.channel.guild.systemChannelID,
    guildId: message.channel.guild.id,
    guildOwnerId: message.channel.guild.ownerID,
    id: message.id,
    type: message.type,
    content: message.content,
    authorId: message.author.id,
    authorUsername: message.author.username,
    authorBot: message.author.bot,
    readyAt: message.mentions._client.readyAt,
  })

  discord.save(function(error) {
    if (error) console.log(error);
  })
});

client.login(process.env.TOKEN);