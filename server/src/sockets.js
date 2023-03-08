module.exports = (io) => {
    let gameRooms = {
        // [roomNum]: {
        // players: {
        // playerId: socket.id
        // }
        // numPlayer:
    //  }
    }

    function addPlayerToRoom(roomNum, socket) {
      // Make sure the game room exists
      if (!gameRooms[roomNum]) {
        gameRooms[roomNum] = { players: {}, numPlayers: 0 };
      }

      // Make sure there are less than 4 players in the game room
      if (gameRooms[roomNum].keys(players).length <= 4) {
        // Add the player to the game room's list of players
        gameRooms[roomNum].players[socket.id] = socket.id;
        gameRooms[roomNum].players[roomNum] = roomNum;
        gameRooms[roomNum].numPlayers++;
        socket.join(roomNum);
        return true;
      } else {
        // Return false if the game room is full
        return false;
      }
    }

    io.on("connection", (socket) => {
        // When a player connects, try to add them to a game room
          let addedToRoom = false;
          let roomNum;
          while (!addedToRoom) {
            roomNum = Math.floor(Math.random() * 9000) + 1000; // generates a random number between 1000 and 9999
            addedToRoom = addPlayerToRoom(roomNum, socket);
          }

          // When there are 4 players in the game room, create the room and notify all players
          if (gameRooms[roomNum].numPlayers === 4) {
            io.to(roomNum).emit('roomCreated', roomNum);
          }

        socket.on("disconnect", () => {
            if (roomNum) {
              // Remove the player from the current room
              delete gameRooms[roomNum].players[socket.id];
              gameRooms[roomNum].numPlayers--;
            }
          });

      // if(Object.keys(players).length < 4) {
      //     players[socket.id] = {
      //     playerId: socket.id,
      //     room:null,
      // }
      //
      // // Send the players object to the new player.
      // socket.emit('currentPlayers', players);
      // } else {
      //     socket.on("disconnect", () => {
      //     delete players[socket.id];
      //     // io.emit('playerDisconnected', socket.id);
      //     console.log(`Player ${socket.id} disconnected`);
      //     });
      // }

      console.log(gameRooms);
    });
}
