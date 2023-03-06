// local variables
var gameRooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)


    // CREATE A ROOM
    socket.on("getRoomCode", async function () {
      let key = codeGenerator();
      while (Object.keys(gameRooms).includes(key)) {
        key = codeGenerator();
      }
      gameRooms[key] = {
        roomKey: key,
        players: {},
        numPlayers: 0,
      };
      console.log('ROOM CREATED - ROOM KEY: ' + key);
      socket.emit("roomCreated", key);
    });

    socket.on("joinRoom", (roomKey) => {
      socket.join(roomKey);
      console.log('test' + roomKey);
      const roomInfo = gameRooms[roomKey];
      console.log("roomInfo", roomInfo);
      roomInfo.players[socket.id] = {
        playerId: socket.id,
      };

      console.log(roomInfo);

      // update number of players
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;

      // set initial state
      socket.emit("setState", roomInfo);

      // send the players object to the new player
      socket.emit("currentPlayers", {
        players: roomInfo.players,
        numPlayers: roomInfo.numPlayers,
      });

      // update all other players of the new player
      socket.to(roomKey).emit("newPlayer", {
        playerInfo: roomInfo.players[socket.id],
        numPlayers: roomInfo.numPlayers,
      });
    });


    socket.on('join', function(roomID, callback) {
        // join existing room
        console.log("join");
        if (connectClientToRoom(roomID, client.id, false)) {
            callback(roomID);
        }
    });

    socket.on("disconnect", () => {
      console.log(`A socket has disconnected`);
      //find which room they belong to
      let roomKey = 0;
      for (let keys1 in gameRooms) {
        for (let keys2 in gameRooms[keys1]) {
          Object.keys(gameRooms[keys1][keys2]).map((el) => {
            if (el === socket.id) {
              roomKey = keys1;
            }
          });
        }
      }

      const roomInfo = gameRooms[roomKey];

      if (roomInfo) {
        console.log("user disconnected: ", socket.id);
        // remove this player from our players object
        delete roomInfo.players[socket.id];
        // update numPlayers
        roomInfo.numPlayers = Object.keys(roomInfo.players).length;
        // emit a message to all players to remove this player
        io.to(roomKey).emit("disconnected", {
          playerId: socket.id,
          numPlayers: roomInfo.numPlayers,
        });
      }
    });


    socket.on("isKeyValid", function (input) {
      Object.keys(gameRooms).includes(input)
        ? socket.emit("keyIsValid", input)
        : socket.emit("keyNotValid");
    });


  });
};

function codeGenerator() {
  let code = "";
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
