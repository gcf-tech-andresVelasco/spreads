const express = require("express");
var cors = require('cors')
const { createClient } = require("redis");
require("dotenv").config();

let redisClient;

async function redisConnect() {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  }).on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();

  await redisClient.set("key", "me funciono");
  const value = await redisClient.get("key");
  console.log(value);
}

const app = express();
const port = 3000;

app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/spread", async (req, res) => {
  try {
    //EURUSDc
    const bid1 = await redisClient.get("bid1");
    const ask1 = await redisClient.get("ask1");
    const spread1 = await redisClient.get("spread1");
    //GBPUSDc
    const bid2 = await redisClient.get("bid2");
    const ask2 = await redisClient.get("ask2");
    const spread2 = await redisClient.get("spread2");
    //USDJPYc
    const bid3 = await redisClient.get("bid3");
    const ask3 = await redisClient.get("ask3");
    const spread3 = await redisClient.get("spread3");
    //XAUUSDc
    const bid4 = await redisClient.get("bid4");
    const ask4 = await redisClient.get("ask4");
    const spread4 = await redisClient.get("spread4");

    res.json({
      EURUSDc: {
        bid: bid1,
        ask: ask1,
        spread: spread1,
      },
      GBPUSDc:{
        bid: bid2,
        ask: ask2,
        spread: spread2,
      },
      USDJPYc:{
        bid: bid3,
        ask: ask3,
        spread: spread3,
      },
      XAUUSDc:{
        bid: bid4,
        ask: ask4,
        spread: spread4,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

(async () => {
  await redisConnect();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
