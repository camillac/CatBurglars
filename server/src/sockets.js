module.exports = (io) => {
  var connectCounter = 0;
  io.on("connection", (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    connectCounter++;
    console.log(connectCounter);
    socket.on("disconnect", () => {
      console.log(`A socket has disconnected`);
      connectCounter--;
      console.log(connectCounter);
    });
  });
}
