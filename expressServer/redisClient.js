const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  await redisClient.connect();
  console.log("Redis connected successfully");
}

module.exports = { redisClient, connectRedis };