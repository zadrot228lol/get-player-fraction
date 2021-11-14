const telegramBotAPI = require("node-telegram-bot-api");
const getPlayerFraction = require("./getPlayerFraction");
const token = "2073116222:AAEekSo_mMx0-bqfqs-TnTcaIcxkTcoqA8w";

const bot = new telegramBotAPI(token, {
  polling: true,
});

const check = async (nickname, chatId) => {
  if (/[а-яёА-ЯЁ]+/.test(nickname)) {
    return bot.sendMessage(
      chatId,
      "Запрещено указывать русские символы в никах!"
    );
  }
  const fraction = await getPlayerFraction(nickname);
  if (!fraction.inited) {
    return bot.sendMessage(
      chatId,
      `Происходит инициализация данных. Ожидайте. Это может длиться до двух минут. Если будет больше, то обратитесь к разработчикам.`
    );
  }

  if (!fraction.isPlayerInFraction) {
    return bot.sendMessage(chatId, "Игрок не состоит в организации");
  }

  return bot.sendMessage(
    chatId,
    `Название организации: ${fraction.orgName}\nДолжность(ранг): ${fraction.playerRank}\nДолжность(название): ${fraction.playerRankName}`
  );
};

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
  if (splitedText[1] && splitedText[2]) {
    if (
      splitedText[1].split("_").length === 1 &&
      splitedText[2].split("_").length === 1
    ) {
      return check(`${splitedText[1]}_${splitedText[2]}`, chatId);
    }
  }
  return check(splitedText[1], chatId);
});
