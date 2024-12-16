const express = require("express");
var cors = require('cors');
const { redisClient, connectRedis } = require("./redisClient");
const fxRoutes = require('./routes/fxRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Middleware para manejar JSON en el cuerpo de las solicitudes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/spread", async (req, res) => {
  try {
    const symbols = ['EURUSDc', 'GBPUSDc', 'USDJPYc', 'USDCHFc', 'USDCADc', 'AUDUSDc', 'NZDUSDc'];
    let response = {};

    for (let symbol of symbols) {
      const bid = await redisClient.get(`bid_${symbol}`);
      const ask = await redisClient.get(`ask_${symbol}`);
      const spread = await redisClient.get(`spread_${symbol}`);
      response[symbol] = { bid, ask, spread };
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nuevo endpoint POST para recibir y guardar datos en Redis
app.post("/spread", async (req, res) => {
  try {
    const spreads = req.body;

    for (const symbol in spreads) {
      if (spreads.hasOwnProperty(symbol)) {
        const { bid, ask, spread } = spreads[symbol];
        await redisClient.set(`bid_${symbol}`, bid);
        await redisClient.set(`ask_${symbol}`, ask);
        await redisClient.set(`spread_${symbol}`, spread);
      }
    }

    res.status(200).json({ message: "Datos guardados en Redis" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/fx', fxRoutes);

(async () => {
  await connectRedis();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
