const { default: axios } = require("axios");
const discordJS = require("discord.js");
const cache = require("node-cache");
const nodeCache = new cache();
const gosOrgsID = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 26, 27, 29,
];

const updateFraction = async (gosOrgID) => {
  try {
    if (nodeCache.has(`fraction-${gosOrgID}`)) {
      nodeCache.del(`fraction-${gosOrgID}`);
    }
    const url = `https://backend.arizona-rp.com/fraction/get-players?serverId=10&fractionId=${gosOrgID}`;
    const res = await axios({
      timeout: 1000 * 60,
      url,
      method: "get",
      headers: {
        Origin: "https://arizona-rp.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Referer: "https://arizona-rp.com",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        TE: "trailers",
      },
    });
    const { data } = res;
    if (data.status !== 1) {
      throw new Error("not data");
    }
    nodeCache.set(`fraction-${gosOrgID}`, data);
  } catch (e) {
    setInterval(async () => {
      await updateFraction(gosOrgID);
    }, 5000);
  }
};

let fractionInfo = {
  inited: false,
  timeOldUpdate: null,
};

const updateAllFraction = async () => {
  for (let gosOrgID of gosOrgsID) {
    await updateFraction(gosOrgID);
  }
  fractionInfo["timeOldUpdate"] = new Date();
  fractionInfo["inited"] = true;
};
updateAllFraction(); // начальная инициализация
setInterval(async () => {
  await updateAllFraction();
}, 500000); // 5 min

const getPlayerFraction = async (nickname) => {
  if (!fractionInfo.inited) {
    return "Ожидайте. Происходит инициализация фракции";
  }
  for (let gosOrgID of gosOrgsID) {
    const fracInfo = nodeCache.get(`fraction-${gosOrgID}`);
    const { items: fractionMembers } = fracInfo;
    for (let fractionMember of fractionMembers) {
      if (fractionMember.name === nickname) {
        return fracInfo.organizationLabel;
      }
    }
  }
  return null;
};

module.exports = getPlayerFraction;
