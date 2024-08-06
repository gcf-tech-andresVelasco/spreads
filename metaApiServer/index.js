const MetaApi = require("metaapi.cloud-sdk").default;
const { createClient } = require("redis");
require("dotenv").config();


async function redisConnect() {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  }).on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();

  await redisClient.set("key", "me funciono");
  const value = await redisClient.get("key");
  console.log(value);
}
//User session
const token = process.env.TOKEN;
const accountId = process.env.ACCOUNT_ID;

const symbol1 = "EURUSDc";
const symbol2 = "GBPUSDc";
const symbol3 = "USDJPYc";
const symbol4 = "XAUUSDc";

const api = new MetaApi(token);
//const api = new MetaApi(token, { region });

async function getSpread() {
  try {
    const account = await api.metatraderAccountApi.getAccount(accountId);

    if (account.state !== "DEPLOYED") {
      console.log("Deploying account");
      await api.metatraderAccountApi.deployAccount(accountId);
      await account.waitConnected();
    }

    const connection = account.getRPCConnection();
    await connection.connect();

    // Wait for the terminal to connect and synchronize
    await connection.waitSynchronized();

    const consult_spread = async () => {
      if (!connection) {
        console.log("RPC connection is not connected");
        await connection.connect();

      // Wait for the terminal to connect and synchronize
      await connection.waitSynchronized();
      }
      const quote1 = await connection.getSymbolPrice(symbol1);
      const quote2 = await connection.getSymbolPrice(symbol2);
      const quote3 = await connection.getSymbolPrice(symbol3);
      const quote4 = await connection.getSymbolPrice(symbol4);
      console.log(quote1);
      if (quote1) {
        const bid1 = quote1.bid;
        const ask1 = quote1.ask;
        const spread = ask1 - bid1;

        console.log(`Symbol: ${symbol1}, Bid: ${bid1}, Ask: ${ask1}, Spread: ${spread}`);

        await redisClient.set("bid1", bid1.toString());
        await redisClient.set("ask1", ask1.toString());
        await redisClient.set("spread1", spread.toString());
      } else {
        console.log(`No quotes received for symbol ${symbol1}`);
      }
      if (quote2) {
        const bid2 = quote2.bid;
        const ask2 = quote2.ask;
        const spread = ask2 - bid2;

        await redisClient.set("bid2", bid2.toString());
        await redisClient.set("ask2", ask2.toString());
        await redisClient.set("spread2", spread.toString());
      } else {
        console.log(`No quotes received for symbol ${symbol2}`);
      }
      if (quote3) {
        const bid3 = quote3.bid;
        const ask3 = quote3.ask;
        const spread = ask3 - bid3;

        await redisClient.set("bid3", bid3.toString());
        await redisClient.set("ask3", ask3.toString());
        await redisClient.set("spread3", spread.toString());
      } else {
        console.log(`No quotes received for symbol ${symbol3}`);
      }
      if (quote4) {
        const bid4 = quote4.bid;
        const ask4 = quote4.ask;
        const spread = ask4 - bid4;

        await redisClient.set("bid4", bid4.toString());
        await redisClient.set("ask4", ask4.toString());
        await redisClient.set("spread4", spread.toString());
      } else {
        console.log(`No quotes received for symbol ${symbol4}`);
      }
    };

    setInterval(consult_spread, 3000);

    onabort = async () => {
      await connection.close();
      api.close();
    };
  } catch (err) {
    console.error(err);
  }
}

(async () => {
  await redisConnect();
  getSpread(accountId);
})();