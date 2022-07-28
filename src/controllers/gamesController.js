const fromString = require('uuidv4')
const gamesServices = require('../services/gamesServices.js')

//Add game
const addGame = async(req, res, next) => {
    try {
        if(!req?.query?.playerId){
            throw{message: "Not logged in"};
        }

        const id = parseInt(req.query.playerId)

        const response = await gamesServices.addGame(id, {
            status:"pending",
            idPlayer1: id
        });

        res.json(response);
    } catch (err) {
        console.error(`Error while adding game`);
        next(err);
    }
};

const getGames = async (req, res, next) => {
    try {
        var raspuns;
        req.query.status ? raspuns = await gamesServices.getGamesByStatus(req.query.status) : raspuns = await gamesServices.getAll();
        raspuns.length === 0 ? raspuns = ["Invalid game status!"] : null;
        res.json(raspuns);
    } catch (err) {
        console.error(`Error while getting games`);
        next(err);
    }
};

const getGame = async (req, res, next) => {
    try {
        if (!req?.params?.id) {
            throw { message: "No parameter provided" };
        }

        const response = await gamesServices.getGame(parseInt(req.params.id));

        if (!response) {
            throw { message: "No game found" };
        }

        res.json(response);
    } catch (err) {
        console.error(`Error while getting game`);
        next(err);
    }
};

const joinGame = async (req, res, next) =>{
    try {
        if (!req?.params?.id) {
            throw { message: "No game with such id" };
        }

        if(!req?.query?.playerId){
           throw{message: "Not logged in"};
        } 

        const gameId = parseInt(req.params.id)

        const playerId = parseInt(req.query.playerId);

        const response = await gamesServices.joinGame(gameId, playerId);

        if(response === "Game is full"){
            res.status(400);
            res.json("Game is full!");
        } else {
            res.json(response);
        }

    } catch (err) {
        console.error(`Error while getting game`);
        next(err);
    }
};

const move = async (req, res, next) => {
    try{

        if(!req?.query?.playerId){
            throw{message: "Not logged in"};
         } 

        if(!parseInt(req?.query?.xpos) || !parseInt(req?.query?.ypos) || 
            parseInt(req?.query?.xpos.replace(/[^0-9-]+/g, "")) < 0 || parseInt(req?.query?.xpos.replace(/[^0-9-]+/g, "")) > 3 ||
            parseInt(req?.query?.ypos.replace(/[^0-9-]+/g, "")) < 0 || parseInt(req?.query?.ypos.replace(/[^0-9-]+/g, "")) > 3
            ){
                throw { message: "Invalid position" };
        }

        const x = parseInt(req.query.xpos) - 1;
        const y = parseInt(req.query.ypos) - 1;

        const gameId = parseInt(req.params.id)

        const idx = x + 3*y;

        const response = await gamesServices.addMove(gameId, parseInt(req.query.playerId), idx);

        res.json(response);

    } catch (err) {
        console.error(`Error registering move`);
        next(err);
    }
}

const deleteGame = async (req, res, next) => {
    try {
      if (!req?.params?.id) {
        throw { message: "No parameter provided" };
      }
      if (!req?.query?.playerId) {
        throw { message: "No parameter provided" };
      }
      const response = await gamesServices.deleteGame(parseInt(req.params.id), parseInt(req.query.playerId));
      res.json({ message: response });
    } catch (err) {
      console.error(`Error while deleting game`);
      next(err);
    }
  };

module.exports = {addGame, getGames, getGame, joinGame, move, deleteGame};