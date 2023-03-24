// local variables
var gameRooms = {};
var users = {};

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(
            `A socket connection to the server has been made: ${socket.id}`
        );

        // CREATE A ROOM
        socket.on("getRoomCode", async function (name) {
            let key = codeGenerator();
            while (Object.keys(gameRooms).includes(key)) {
                key = codeGenerator();
            }
            gameRooms[key] = {
                roomKey: key,
                players: {},
                numPlayers: 0,
            };
            console.log("ROOM CREATED - ROOM KEY: " + key);
            socket.emit("roomCreated", key, name);
        });

        // JOIN A ROOM
        socket.on("joinRoom", (roomKey, playerName) => {
            console.log(socket.id);
            socket.join(roomKey);
            // console.log("test" + roomKey);
            const roomInfo = gameRooms[roomKey];
            // console.log("roomInfo", roomInfo);
            roomInfo.players[socket.id] = {
                playerId: socket.id,
                playerNum: 0,
                playerName: playerName
            };

            roomInfo.players[socket.id].playerNum = Object.keys(
                roomInfo.players
            ).length;

            // Update number of players
            roomInfo.numPlayers = Object.keys(roomInfo.players).length;
            console.log("JOIN ROOM ");
            // Set initial state
            socket.emit("setState", roomInfo);

            // Send the players object to the new player
            socket.emit("currentPlayers", {
                players: roomInfo.players,
                numPlayers: roomInfo.numPlayers,
            });

            // Update all other players of the new player
            socket.to(roomKey).emit("newPlayer", {
                playerInfo: roomInfo.players[socket.id],
                numPlayers: roomInfo.numPlayers,
            });

            console.log(roomInfo);
        });

        // socket.on("join", function (roomID, callback) {
        //     console.log("join");

        //     // Join existing room
        //     if (connectClientToRoom(roomID, client.id, false)) {
        //         callback(roomID);
        //     }
        // });

        socket.on("disconnect", () => {
            console.log(`A socket has disconnected`);

            // Find which room they belong to
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
                console.log(roomInfo);

                var deletedNum = roomInfo.players[socket.id].playerNum;
                console.log(deletedNum);
                console.log(roomInfo.players);
                for (playerId in roomInfo.players) {
                    console.log("player: " + playerId);
                    console.log(
                        "playerNum: " + roomInfo.players[playerId].playerNum
                    );

                    if (roomInfo.players[playerId].playerNum > deletedNum) {
                        roomInfo.players[playerId].playerNum =
                            roomInfo.players[playerId].playerNum - 1;
                    }
                }

                // Remove this player from our players object
                delete roomInfo.players[socket.id];

                // Update numPlayers
                roomInfo.numPlayers = Object.keys(roomInfo.players).length;

                // Emit a message to all players to remove this player
                io.to(roomKey).emit("disconnected", {
                    playerId: socket.id,
                    numPlayers: roomInfo.numPlayers,
                    roomInfo: roomInfo,
                });

                console.log(roomInfo);
            }
        });

        socket.on("isKeyValid", function (code, name) {
            Object.keys(gameRooms).includes(code)
                ? socket.emit("keyIsValid", code, name)
                : socket.emit("keyNotValid");
        });

        socket.on("startGame", function (roomKey) {
            socket.to(roomKey).emit("startRoom");
        });
    });
};

// CODE GENERATOR FOR LOBBY
function codeGenerator() {
    let code = "";
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
