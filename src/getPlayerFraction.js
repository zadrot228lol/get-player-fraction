const { default: axios } = require("axios");
const discordJS = require("discord.js");

const getPlayerFraction = async (nickname, gosOrgsID) => {
  for (let gosOrgID of gosOrgsID) {
    try {
      const url = `https://backend.arizona-rp.com/fraction/get-players?serverId=10&fractionId=${gosOrgID}`;
      const res = await axios({
        url,
        method: "get",
      });
      const { data } = res;
      if (data.status !== 1) {
        break;
      }
      const { items } = data;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.name === nickname) {
          return data.organizationLabel;
        }
      }
    } catch (e) {
      break
    }
  }
  return null;
};

module.exports = getPlayerFraction;
