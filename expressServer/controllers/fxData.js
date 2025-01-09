const { redisClient } = require("../redisClient");

class FxDataController {
  static async setData(req, res) {
    try {
      const usersInfo = req.body;

      for (const userInfo in usersInfo) {
        let prevData = await redisClient.get(userInfo);
        let formatedData = JSON.parse(prevData);
        const {balance, profit, equity, profitMonthly, balanceMonthly, margin, marginFree} = usersInfo[userInfo];       
        if (prevData) {
          formatedData = {
            ...formatedData,
            balanceMonthly: balanceMonthly,
            profitMonthly: profitMonthly,
            balance: balance,
            profit: profit,
            equity: equity,
            margin: margin,
            MarginFree: marginFree,
          }    
          await redisClient.set(userInfo, JSON.stringify(formatedData));
        } else {
          formatedData = { balance, profit, equity };
          await redisClient.set(userInfo, JSON.stringify(formatedData));
        }
      }

      res.status(200).json({ message: 'Data saved successfully' });
    } catch (err) {
      res.status(500).json({error: err.message });
    }
  }
  static async getOneUserData(req, res) {
    try {
      const userId = req.params.userId;
      const userData = await redisClient.get(userId);
      res.json(userData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  static async updateData(req, res) {
    try {
        const usersInfo = req.body;

        for (const userInfo in usersInfo) {
            // Retrieve previous data from Redis
            let prevData = await redisClient.get(userInfo);
            let formatedData = prevData ? JSON.parse(prevData) : {};

            // Extract optional fields from the request
            const {
                balance,
                profit,
                equity,
                profitMonthly,
                balanceMonthly,
                margin,
                marginFree,
                returnMonthly,
            } = usersInfo[userInfo];
            console.log(returnMonthly)
            // Update only the provided fields
            if (balance !== undefined) formatedData.balance = balance;
            if (profit !== undefined) formatedData.profit = profit;
            if (equity !== undefined) formatedData.equity = equity;
            if (profitMonthly !== undefined) formatedData.profitMonthly = profitMonthly;
            if (balanceMonthly !== undefined) formatedData.balanceMonthly = balanceMonthly;
            if (margin !== undefined) formatedData.margin = margin;
            if (marginFree !== undefined) formatedData.marginFree = marginFree;
            if (returnMonthly !== undefined) formatedData.returnMonthly = returnMonthly;


            // Save updated data back to Redis
            await redisClient.set(userInfo, JSON.stringify(formatedData));
        }

        res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
}

module.exports = { FxDataController };