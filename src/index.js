const telegramBotAPI = require("node-telegram-bot-api");
const getPlayerFraction = require("./getPlayerFraction");
const token = "2073116222:AAEekSo_mMx0-bqfqs-TnTcaIcxkTcoqA8w";
const gosOrgsID = [1,2,3,4,5,6,7,8,9,10,20,21,22,23,24,26,27,29];

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
  bot.sendMessage(chatId, "Загрузка...")
  const fraction = await getPlayerFraction(splitedText[1], gosOrgsID);
  bot.sendMessage(
    chatId,
    `${fraction ? fraction : "Игрок не состоит в организации"}`
  );
});
