// local variables
var gameRooms = {};

module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log(
            `A socket connection to the server has been made: ${socket.id}`
        );

        // ************************************* PLAY SCENE SOCKETS **********************************************

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

        // GET ALL ROOMS DETAILS
        socket.on("getRooms", async function () {
            socket.emit("getRooms", gameRooms);
        });
        // DELETE A ROOM
        socket.on("deleteRoom", async function (roomKey) {
            delete gameRooms[roomKey];
            console.log("ROOM DELETED - ROOM KEY: " + roomKey);
            socket.emit("roomDeleted", roomKey);
        });
        // JOIN A ROOM
        socket.on("joinRoom", (roomKey, playerName) => {
            console.log("JOINED ROOM " + roomKey, playerName);
            socket.join(roomKey);
            const roomInfo = gameRooms[roomKey];
            // console.log(roomInfo);
            roomInfo.players[socket.id] = {
                playerId: socket.id,
                playerNum: 0,
                playerName: playerName,
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

            let roomInfo = gameRooms[roomKey];

            if (roomInfo) {
                console.log("User Disconnected: ", socket.id);
                console.log("Room Info BEFORE Removing Player");
                console.log(roomInfo);

                var deletedNum = roomInfo.players[socket.id].playerNum;
                console.log("deletedNum: " + deletedNum);

                // SHIFT PLAYERNUMS DOWN IF PLAYERNUM > DELETED_PLAYERNUM
                for (playerId in roomInfo.players) {
                    console.log("player: " + playerId);
                    console.log(
                        "playerNum: " + roomInfo.players[playerId].playerNum
                    );

                    if (roomInfo.players[playerId].playerNum > deletedNum) {
                        if (deletedNum == 4) {
                            // delete room if this condition is met and break out of loop
                            delete gameRooms[roomKey];
                            console.log("Room deleted");
                            break;
                        }
                        else {
                            roomInfo.players[playerId].playerNum =
                                roomInfo.players[playerId].playerNum - 1;
                        }
                        // console.log("playerNum: " + roomInfo.players[playerId].playerNum);
                    }
                    // else {
                    //     roomInfo.players[playerId].playerNum =
                    //         roomInfo.players[playerId].playerNum - 1;
                    // }
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
                console.log(roomInfo.roomKey);
                io.to(roomInfo.roomKey).emit("playerLeave", roomInfo.roomKey);
                console.log("Room Info AFTER Removing Player");
                console.log(roomInfo);
                // emit player leave message to all players in room
            }
            else {
                console.log("Room does not exist");
            }
        });
        socket.on("isKeyValid", function (code, name) {
            Object.keys(gameRooms).includes(code)
                ? socket.emit("keyIsValid", code, name)
                : socket.emit("keyNotValid");
        });

        // RECEIVES STARTGAME EMIT FROM ONE PLAYER, EMIT STARTGAME TO ALL PLAYERS IN THE ROOM
        socket.on("startGame", function (roomKey, start) {
            socket
                .to(roomKey)
                .emit("startRoom", { roomKey: roomKey, start: start });
        });

        socket.on("startTimer", function (roomKey, counter) {
            socket.on("decreaseCounter", function () {
                counter = counter - 5;
            });

            var Countdown = setInterval(function () {
                io.to(roomKey).emit("counter", counter);
                counter--;
                if (counter <= 0) {
                    console.log("Lost!");
                    io.to(roomKey).emit("lost", roomKey);
                    delete gameRooms[roomKey];
                    clearInterval(Countdown);
                }
            }, 1000);

            // stop the counter so it doesnt keep going after game ends
            socket.on("showWinScene", function () {
                console.log("counter destroyed");
                io.to(roomKey).emit("win", roomKey);
                // remove room from gameRooms
                delete gameRooms[roomKey];
                clearInterval(Countdown);
            });
        });

        // ************************************* END OF LOBBY SCENE SOCKETS **********************************************

        // ************************************* TASK ONE SCENE SOCKETS **********************************************

        socket.on("startTaskOne", function (roomKey, mainPlayer, playerIdx) {
            let arr = [1, 2, 3, 4, 5, 6];
            shuffleArray(arr);
            const key1 = arr[0];
            const key2 = arr[1];
            const key3 = arr[2];
            console.log(key1, key2, key3);
            const roomInfo = gameRooms[roomKey];;
            for (playerIdx in roomInfo.players) {
                if (roomInfo.players[playerIdx].playerNum == mainPlayer) {
                    const counter = 30;
                    io.to(roomInfo.players[playerIdx].playerId).emit(
                        "startTimerEX",
                        { roomKey, counter }
                    );
                    io.to(roomInfo.players[playerIdx].playerId).emit(
                        "displayMainTaskOne",
                        {
                            playerId: playerIdx,
                            playerNum: roomInfo.players[playerIdx].playerNum,
                            key1: key1,
                            key2: key2,
                            key3: key3,
                        }
                    );
                } else if (roomInfo.players[playerIdx].playerNum == 2) {
                    io.to(roomInfo.players[playerIdx].playerId).emit(
                        "displaySideTaskOne",
                        {
                            playerId: playerIdx,
                            playerNum: roomInfo.players[playerIdx].playerNum,
                            key: key1,
                        }
                    );
                } else if (roomInfo.players[playerIdx].playerNum == 3) {
                    io.to(roomInfo.players[playerIdx].playerId).emit(
                        "displaySideTaskOne",
                        {
                            playerId: playerIdx,
                            playerNum: roomInfo.players[playerIdx].playerNum,
                            key: key2,
                        }
                    );
                } else {
                    io.to(roomInfo.players[playerIdx].playerId).emit(
                        "displaySideTaskOne",
                        {
                            playerId: playerIdx,
                            playerNum: roomInfo.players[playerIdx].playerNum,
                            key: key3,
                        }
                    );
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
