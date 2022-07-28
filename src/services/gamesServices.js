const fs = require('fs')
const path = require('path')
const gamestore = require('../gamestore.json')
const datastore = require('../datastore.json')

const firstPlayer = (p1, p2) =>{
    return Math.floor(Math.random()*10) < 5 ? p1 : p2;
};

const getAll = async () => {
    return JSON.parse(fs.readFileSync('./src/gamestore.json'));
    //return datastore;
};

const indexOfGame = (id) => {
    return gamestore.indexOf(filterById(id)[0]);
};

const filterById = (id) => {
    return gamestore.filter((game) => game.id === id);
};

const getGame = async (id) => {
    return filterById(id)[0];
};

const filterByStatus = (status) =>{
    return gamestore.filter((game) => game.status === status);
};

const getGamesByStatus = async (status) => {
    return filterByStatus(status);
};

const addGame = async (playerId, gameInfo) => {

    if(!datastore[playerId]){
        return "User does not exist";
    }

    const newId = gamestore[gamestore.length - 1].id + 1;

    gamestore.push({
        id: newId,
        ...gameInfo,
    });

    fs.writeFileSync('./src/gamestore.json', JSON.stringify(gamestore))
    return gamestore;
};

const joinGame = async (id, playerId) => {
    const index = indexOfGame(id);

    if(!datastore[playerId]){
        return "User does not exist";
    }

    if (index !== -1) {
        if(!gamestore[index].idPlayer2){
            const lucky = firstPlayer(gamestore[index].idPlayer1, gamestore[index].idPlayer2);
            gamestore[index].idPlayer2 = playerId;
            gamestore[index].status = "active";
            gamestore[index].firstMove = lucky;
            gamestore[index].currentMove = lucky;
            gamestore[index].table = [ ...Array(9).keys() ].map( i => 0);
        } else {
            return "Game is full";
        }
        fs.writeFileSync('./src/gamestore.json', JSON.stringify(gamestore))
        return gamestore;
    } else {
        return "Game not found";
    }
};

const addMove = async(id, playerId, moveIdx) => {
    
    if(!datastore[playerId]){
        return "User does not exist";
    }
    
    const index = indexOfGame(id);

    if(!gamestore[index].idPlayer2){
        return "Game has not started yet";
    }

    if(gamestore[index].idPlayer1 !== playerId && gamestore[index].idPlayer2 !== playerId){
        return "Player not part of this game";
    }

    if (index !== -1) {
        if(gamestore[index].currentMove === playerId){
            if(gamestore[index].table[moveIdx] === 0){
                gamestore[index].table[moveIdx] = playerId;

                //check table status
                for(let i = 0 ; i < 3 ; i++){
                    if((gamestore[index].table[i] === gamestore[index].table[i + 3] && 
                        gamestore[index].table[i + 3] === gamestore[index].table[i + 6] && 
                        gamestore[index].table[i] !== 0) ||
                        (gamestore[index].table[i*3] === gamestore[index].table[i*3 + 1] && 
                         gamestore[index].table[i*3 + 1] === gamestore[index].table[i*3 + 2] &&
                         gamestore[index].table[i*3] !== 0)
                        ){
                        gamestore[index].status = "finished";
                        fs.writeFileSync('./src/gamestore.json', JSON.stringify(gamestore))
                        return `Player ${playerId} has won`;
                    }
                }

                if((gamestore[index].table[0] === gamestore[index].table[4] && gamestore[index].table[4] === gamestore[index].table[8] && gamestore[index].table[0] !== 0) ||
                    (gamestore[index].table[2] === gamestore[index].table[4] && gamestore[index].table[4] === gamestore[index].table[6] && gamestore[index].table[2] !== 0)){
                        gamestore[index].status = "finished";
                        fs.writeFileSync('./src/gamestore.json', JSON.stringify(gamestore))
                        return `Player ${playerId} has won`;
                    }

                if(gamestore[index].currentMove === gamestore[index].idPlayer1){
                    gamestore[index].currentMove = gamestore[index].idPlayer2;
                } else {
                    gamestore[index].currentMove = gamestore[index].idPlayer1;
                }
            } else {
                return "Space occupied";
            }
        } else {
            return "Not your turn";
        }
        fs.writeFileSync('./src/gamestore.json', JSON.stringify(gamestore))
        return gamestore;
    } else {
        return "Game not found";
    }
}

const deleteGame = async (id, playerId) => {
    const index = indexOfGame(id);
    if (index !== -1) {
        if(gamestore[index].status === "finished" && gamestore[index].idPlayer1 === playerId){
            gamestore.splice(index, 1);
            fs.writeFileSync('./src/gamestore.json', JSON.stringify(gamestore))
            return "Game deleted";
        } else {
            return "Game not finished, or not your game";
        }
    } else {
      return "Game not found";
    }
  };

module.exports = {getAll, getGame, addGame, getGamesByStatus, joinGame, addMove, deleteGame};