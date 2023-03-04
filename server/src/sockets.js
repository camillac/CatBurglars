module.exports = (io) => {
    let players = {}

    io.on("connection", (socket) => {
      console.log(`A socket connection to the server has been made: ${socket.id}`);
      if(players.l < 4) {
          players[socket.id] = {
          playerId: socket.id,
          room:null,
          }
      } else {
          socket.on("disconnected", () => {
          delete players[socket.id];
          io.emit('playerDisconnected', socket.id);
      });
      }




      console.log(players)

    });
}
