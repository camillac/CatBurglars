module.exports = (io) => {
    let players = {}

    io.on("connection", (socket) => {
      console.log(`A socket connection to the server has been made: ${socket.id}`);

      if(Object.keys(players).length < 4) {
          players[socket.id] = {
          playerId: socket.id,
          room:null,
      }

      // Send the players object to the new player.
      socket.emit('currentPlayers', players);
      } else {
          socket.on("disconnect", () => {
          delete players[socket.id];
          // io.emit('playerDisconnected', socket.id);
          console.log(`Player ${socket.id} disconnected`);
          });
      }

      console.log(players);
      io.on("inLobby", (arg) => {
        console.log(arg);
      })
    });

  }; 
