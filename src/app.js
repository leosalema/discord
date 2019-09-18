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
  author: String,
  content: String,
  createdAt: {type: Date, default: Date.now}
});

const Discord = mongoose.model('Discord', discordSchema);

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  let discord = new Discord({
    author: message.author.username,
    content: message.content
  })

  discord.save(function(error) {
    if (error) {
      console.log(error);
    }
  })
});

client.login(process.env.TOKEN);