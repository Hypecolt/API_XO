const express = require('express')
const bodyParser = require('body-parser')
const usersController = require('../controllers/userController.js')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id(\\d+)", usersController.getUser);

router.post("/", urlencodedParser, usersController.addUser);
router.patch("/:id(\\d+)", urlencodedParser, usersController.updateUser);

module.exports = router;