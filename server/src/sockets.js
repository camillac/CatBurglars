// local variables
var gameRooms = {};

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(
            `A socket connection to the server has been made: ${socket.id}`
        );

        // ************************************* PLAY SCENE SOCKETS **********************************************

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
            console.log("ROOM CREATED - ROOM KEY: " + key);
            socket.emit("roomCreated", key);
        });

        // JOIN A ROOM
        socket.on("joinRoom", (roomKey) => {
            console.log(socket.id);
            socket.join(roomKey);
            // console.log("test" + roomKey);
            const roomInfo = gameRooms[roomKey];
            // console.log("roomInfo", roomInfo);
            roomInfo.players[socket.id] = {
                playerId: socket.id,
                playerNum: 0,
                playerName: "",
            };

            roomInfo.players[socket.id].playerNum = Object.keys(
                roomInfo.players
            ).length;
            roomInfo.players[socket.id].playerName =
                "Player " + roomInfo.players[socket.id].playerNum;

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

        // ************************************* END OF PLAY SCENE SOCKETS **********************************************

        // ************************************* LOBBY SCENE SOCKETS **********************************************

        // CLIENT DISCONNECT
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
                console.log("User Disconnected: ", socket.id);
                console.log("Room Info BEFORE Removing Player");
                console.log(roomInfo);

                var deletedNum = roomInfo.players[socket.id].playerNum;

                // SHIFT PLAYERNUMS DOWN IF PLAYERNUM > DELETED_PLAYERNUM
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

                console.log("Room Info AFTER Removing Player");
                console.log(roomInfo);
            }
        });

        // CHECKS IF INPUTTED ROOM KEY IS VALID
        socket.on("isKeyValid", function (input) {
            Object.keys(gameRooms).includes(input)
                ? socket.emit("keyIsValid", input)
                : socket.emit("keyNotValid");
        });

        // RECEIVES STARTGAME EMIT FROM ONE PLAYER, EMIT STARTGAME TO ALL PLAYERS IN THE ROOM
        socket.on("startGame", function (roomKey) {
            console.log("start game");

            socket.to(roomKey).emit("startRoom", {roomKey: roomKey});
        });

        // ************************************* END OF LOBBY SCENE SOCKETS **********************************************

        // ************************************* TASK ONE SCENE SOCKETS **********************************************

        socket.on("startTaskOne", function (roomKey, mainPlayer) {
            console.log("taskOne");
            let arr = [1,2,3,4,5,6]; 
            shuffleArray(arr); 
            console.log(arr); 
            const key1 = arr[0]; 
            const key2 = arr[1]; 
            const key3 = arr[2]; 
            console.log(key1, key2, key3);
            const roomInfo = gameRooms[roomKey];
            console.log(roomInfo.players); 
            console.log("num: ", mainPlayer); 
            // console.log(roomInfo);
            // console.log(roomKey);
            for (playerId in roomInfo.players) {
                console.log(playerId);
                if (roomInfo.players[playerId].playerNum == mainPlayer) {
                    io.to(playerId).emit("displayMainTaskOne", {playerId: playerId, playerNum: roomInfo.players[playerId].playerNum, key1: key1, key2:key2, key3:key3});
                }
                else{
                    io.to(playerId).emit("displaySideTaskOne", {playerId: playerId, playerNum: roomInfo.players[playerId].playerNum, key1: key1, key2:key2, key3:key3}); 
                }
            }
        });

        // ************************************* TASK ONE SCENE SOCKETS **********************************************
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
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}