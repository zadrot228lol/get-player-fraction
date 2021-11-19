const getPlayerFraction = require("../getPlayerFraction");
const { MessageEmbed } = require("discord.js");

const getEmbed = (fraction, nickname) => {
  if (!fraction.inited) {
    const embed = new MessageEmbed()
      .setColor("#a4290e")
      .setTitle("Упс...")
      .setDescription(
        "На данный момент происходит инициализация данных. Ожидайте."
      )
      .setImage("https://i.ytimg.com/vi/OUy28rFDapg/maxresdefault.jpg")
      .setTimestamp()
      .setFooter("Добро пожаловать в Gym", "https://i.imgur.com/AfFp7pu.png");
    return embed;
  }
  return fraction.isPlayerInFraction
    ? new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Успешно!`)
        .addFields(
          { name: "``Никнейм``", value: nickname },
          { name: "``Организация``", value: fraction.orgName },
          {
            name: "``Должность(ранг)``",
            value: `${fraction.playerRankName}(${fraction.playerRank})`,
          }
        )
        .setImage("https://i.ytimg.com/vi/OUy28rFDapg/maxresdefault.jpg")
        .setTimestamp()
        .setFooter("Добро пожаловать в Gym")
    : new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Успешно!`)
        .setDescription("Игрок не состоит в организации")
        .setImage("https://i.ytimg.com/vi/OUy28rFDapg/maxresdefault.jpg")
        .setTimestamp()
        .setFooter("Добро пожаловать в Gym")
};

const getDiscordUserNick = (client, message) => {
  const member = message.guild.members.cache.find(
    (m) => m.id == message.mentions.members.first().id
  );
  if (!member) {
    return null;
  }
  return member.nickname;
};

const check = async (nickname, message) => {
  const fraction = await getPlayerFraction(nickname);
  const embed = getEmbed(fraction, nickname);
  return message.channel.send({ embeds: [embed] });
};

const org = async (client, message) => {
  const args = message.content.split(" ").slice(1);
  if (!args[0]) {
    return message.channel.send(
      `<@${message.author.id}> Используйте: /org [nickname]`
    );
  }
  if (message.mentions.members.first()) {
    const preNickname = getDiscordUserNick(client, message); // получаем дискорд ник
    let nickname = ""; // результативный никнейм.
    const splitedPreNickname = preNickname.split("]"); // разделяем по ] чтобы можно было отсеять среди дискорд формы - ник
    Array.from(splitedPreNickname[splitedPreNickname.length - 1]).map(
      (letter) => {
        // проходимся по всем символам никнейма. Начиная после тега ранга.
        if (/^[a-zA-Z-_" "]+$/.test(letter)) {
          // проверяем, является ли символ английском.
          nickname += letter; // если да, то добавляем его в слово
        } else {
          nickname += " "; // если нет, то просто ставим пробел. Сделано для того чтобы если знак был между ником, то его было можно легко заменить
        }
      }
    );
    return check(nickname.trim().replace(" ", "_"), message);
  }
  if (args[0] && args[1]) {
    const nickname = `${args[0]}_${args[1]}`;
    return check(nickname, message);
  }
  const nickname = args[1];
  return check(nickname, message);
};

module.exports = {
  name: "org",
  func: org,
};
