// const getPlayerFraction = require("÷./getPlayerFraction");
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const fs = require('fs');
const path = require("path");
const cmds = [];
const init = () => {
  const cmdsFiles = fs.readdirSync(path.resolve('./src/cmds'));
  for(let cmdFile of cmdsFiles){
    if(cmdFile.endsWith('.js')){
      const cmd = require(path.resolve('./src/cmds/', cmdFile));
      cmds.push(cmd);
    }
  }
  console.log(`Было инициализировано ${cmds.length} команд!`);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  init();
});

client.on("messageCreate", msg => {
  if(msg.content.startsWith("/")){
    const cmd = cmds.find(cmd => cmd.name === msg.content.slice(1).split(" ")[0]);
    if(!cmd){
      return msg.channel.send(`<@${msg.author.id}> [404] Неизвестная команда!`);
    }
    return cmd.func(client, msg);
  }
})

client.login("OTEwOTgwNTQzODYzMjEwMDA3.YZauvg.OgNv72kE-p0xEFk_287NWCxmooA");

// const token = "2073116222:AAEekSo_mMx0-bqfqs-TnTcaIcxkTcoqA8w";
// const bot = new telegramBotAPI(token, {
//   polling: true,
// });

// const test = (arr = []) => {
//   const validUsers = [];
//   arr.map(user => {
//     if(/^\[\w+\]\[\d\] .+$/.test(user.nick)){
//       validUsers.push(user.nick);
//     }
//   });
//   return {
//     validUsers
//   };
// }

// const wait = async (time) => new Promise(resolve => {
//   setTimeout(() => {
//     resolve(null);
//   }, time);
// });

// const check = async (nickname, chatId, options = {}) => {
//   if(options.dev && options.time){
//     await wait(options.time * Math.random() * 1000);
//   }
//   if (/[а-яёА-ЯЁ]+/.test(nickname)) {
//     return bot.sendMessage(
//       chatId,
//       "Запрещено указывать русские символы в никах!"
//     );
//   }
//   const fraction = await getPlayerFraction(nickname);
//   if (!fraction.inited) {
//     return bot.sendMessage(
//       chatId,
//       `Происходит инициализация данных. Ожидайте. Это может длиться до двух минут. Если будет больше, то обратитесь к разработчикам.`
//     );
//   }

//   if (!fraction.isPlayerInFraction) {
//     return bot.sendMessage(chatId, `Игрок${options.showNick && ` ${nickname}`} не состоит в организации`);
//   }

//   return bot.sendMessage(
//     chatId,
//     `${options.showNick ? `Никнейм: ${nickname}\n` : "Данные:\n"} Название организации: ${fraction.orgName}\nДолжность(ранг): ${fraction.playerRank}\nДолжность(название): ${fraction.playerRankName}`
//   );
// };

// bot.onText(/\/pizdec/, msg => {
//   setInterval(() => {
//     bot.sendMessage(msg.chat.id, "pizdec")
//   }, 2000);
// })

// bot.onText(/\/check/, (msg) => {
//   const data = require('./data.json');
//   console.log(data);
//   const { validUsers } = test(data);
//   const chatId = msg.chat.id;
//   validUsers.map(nick => {
//     check(nick.split("]")[2].trim(), chatId, {
//       dev: true,
//       time: 2000,
//       showNick: true,
//     });
//   });
// })

// bot.onText(/\/org (.+)/, async (msg) => {
//   const chatId = msg.chat.id;
//   const { text } = msg;
//   const splitedText = text.split(" ");
//   if (!splitedText[1]) {
//     return bot.sendMessage(
//       chatId,
//       "Вы забыли указать никнейм. /org [nickname]"
//     );
//   }
//   if(/^\[\w+\]\[\d\] .+$/.test(splitedText[1])){

//   }
//   if (splitedText[1] && splitedText[2]) {
//     if (
//       splitedText[1].split("_").length === 1 &&
//       splitedText[2].split("_").length === 1
//     ) {
//       return check(`${splitedText[1]}_${splitedText[2]}`, chatId);
//     }
//   }
//   return check(splitedText[1], chatId);
// });
