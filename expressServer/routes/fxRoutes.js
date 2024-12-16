const Router = require('express').Router;
const { FxDataController } = require('../controllers/fxData');

const fxRoutes = Router();

fxRoutes.get("/:userId",FxDataController.getOneUserData);
fxRoutes.post("/", FxDataController.setData);

module.exports = fxRoutes;