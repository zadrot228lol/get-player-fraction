const telegramBotAPI = require("node-telegram-bot-api");
const getPlayerFraction = require("./getPlayerFraction");
const token = "2073116222:AAEekSo_mMx0-bqfqs-TnTcaIcxkTcoqA8w";

const bot = new telegramBotAPI(token, {
  polling: true,
});

bot.onText(/\/org (.+)/, async (msg) => {
  const chatId = msg.chat.id;
  const { text } = msg;
  const splitedText = text.split(" ");
  if (!splitedText[1]) {
    return bot.sendMessage(
      chatId,
      "Вы забыли указать никнейм. /org [nickname]"
    );
  }
  if(/[а-яёА-ЯЁ]+/.test(splitedText[1])){
    return bot.sendMessage(chatId, "Запрещено указывать русские символы в никах!")
  }
  console.time();
  const fraction = await getPlayerFraction(splitedText[1]);
  console.timeEnd();
  bot.sendMessage(
    chatId,
    `${fraction ? fraction : "Игрок не состоит в организации"}`
  );
});
