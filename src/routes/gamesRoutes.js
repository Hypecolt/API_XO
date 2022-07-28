const express = require('express')
const bodyParser = require('body-parser')
const gameController = require('../controllers/gamesController.js')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const router = express.Router();

router.get("/", gameController.getGames);
router.get("/:id(\\d+)", gameController.getGame);

router.post("/", gameController.addGame);
router.post("/:id(\\d+)", gameController.joinGame);
router.put("/:id(\\d+)/move", gameController.move);

router.delete("/:id(\\d+)", gameController.deleteGame);

module.exports = router;