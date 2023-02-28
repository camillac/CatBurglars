module.exports = (io) => {
    io.on("connection", (socket) => {
      console.log(`A socket connection to the server has been made: ${socket.id}`)
    });
}
