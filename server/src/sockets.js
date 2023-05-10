// PlayScene and LobbyScene both use this Among Us Tutorial as a reference:
// github.com/hannahrobot/amongus-tutorial

// local variables
https: var gameRooms = {};
var users = {};
var allFinished = false;
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(
            `A socket connection to the server has been made: ${socket.id}`
        );

        // ************************************* PLAY SCENE SOCKETS **********************************************

        // CREATE A ROOM
        socket.on("getRoomCode", async function (name) {
            let key = codeGenerator();
            
            gameRooms[key] = {
                roomKey: key,
                players: {},
                numPlayers: 0,
                inGame: false,
                inFinalTask: false,
                task1IsStarted: false,
                finalTaskIsStarted: false,
            };
            
            console.log("ROOM CREATED - ROOM KEY: " + key);
            if (name == "") {
                name = "Player 1";
            }
            
            socket.emit("roomCreated", key, name);
        });

        // GET ALL ROOMS DETAILS
        socket.on("getRooms", async function () {
            socket.emit("getRooms", gameRooms);
        });

        // JOIN A ROOM
        socket.on("joinRoom", (roomKey, playerName) => {
            socket.join(roomKey);
            const roomInfo = gameRooms[roomKey];

            if (!roomInfo.players[socket.id]) {
                roomInfo.players[socket.id] = {
                    playerId: socket.id,
                    playerNum: 0,
                    playerName: playerName,
                    finished: false,
                    ready: false
                };

                roomInfo.players[socket.id].playerNum = Object.keys(
                    roomInfo.players
                ).length;

                if (playerName == "") {
                    roomInfo.players[socket.id].playerName =
                        "Player " + roomInfo.players[socket.id].playerNum;
                }
            }

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
                        if ((roomInfo.players[playerId].playerName) == ("Player " + (roomInfo.players[playerId].playerNum + 1))) {
                            (roomInfo.players[playerId].playerName) = ("Player " + (roomInfo.players[playerId].playerNum));
                        }
                    };
                };

                // Remove this player from our players object
                delete roomInfo.players[socket.id];

                // Update numPlayers
                roomInfo.numPlayers = Object.keys(roomInfo.players).length;

                if (roomInfo.inGame) {
                    // clearInterval(Countdown);

                    // Emit a message to all players to generate a new room
                    let newKey = codeGenerator();
                    while (Object.keys(gameRooms).includes(newKey)) {
                        newKey = codeGenerator();
                    }
                    gameRooms[newKey] = {
                        roomKey: newKey,
                        players: {},
                        numPlayers: 0,
                        inGame: false,
                        inFinalTask: false,
                        task1IsStarted: false,
                        finalTaskIsStarted: false,
                    };

                    console.log("ROOM CREATED - ROOM KEY: " + newKey);
                    if (roomInfo.inFinalTask) {
                        io.to(roomKey).emit("endGameFinal", newKey);
                    } else {
                        io.to(roomKey).emit("endGame", newKey);
                    }
                } else {
                    io.to(roomKey).emit("disconnected", {
                        playerId: socket.id,
                        numPlayers: roomInfo.numPlayers,
                        roomInfo: roomInfo,
                    });
                }

                console.log("Room Info AFTER Removing Player");
                console.log(roomInfo);
            }
        });

        socket.on("isKeyValid", function (code, name) {
            Object.keys(gameRooms).includes(code)
                    ? socket.emit("keyIsValid", code, name)
                    : socket.emit("keyNotValid");
        });

        socket.on("isRoomFull", function (roomKey) {
            if (gameRooms[roomKey].numPlayers >= 4) {
                socket.emit("roomIsFull");
            } else {
                socket.emit("roomNotFull");
            }
        });

        // RECEIVES STARTGAME EMIT FROM ONE PLAYER, EMIT STARTGAME TO ALL PLAYERS IN THE ROOM
        socket.on("startGame", function (roomKey, start) {
            console.log("start game");
            gameRooms[roomKey].inGame = true;
            // const {roomkey, startId} = arg;
            socket
                .to(roomKey)
                .emit("startRoom", { roomKey: roomKey, start: start });
        });

        // ************************************* END OF LOBBY SCENE SOCKETS **********************************************

        // ************************************* TASK ONE SCENE SOCKETS **********************************************
        
        socket.on("startTaskOne", function (roomKey, mainPlayer, playerIdx) {
            const roomInfo = gameRooms[roomKey];
            if (!roomInfo.task1IsStarted) {
                roomInfo.task1IsStarted = true;
                let arr = [1, 2, 3, 4, 5, 6];
                shuffleArray(arr);
                const key1 = arr[0];
                const key2 = arr[1];
                const key3 = arr[2];
                console.log(roomKey);
                console.log(key1, key2, key3);
                // const roomInfo = gameRooms[roomKey];
                console.log(roomInfo);
                for (playerId in roomInfo.players) {
                    if (roomInfo.players[playerId].playerNum == mainPlayer) {
                        const counter = 30;
                        io.to(roomInfo.players[playerId].playerId).emit(
                            "startTimerEX",
                            { roomKey, counter }
                        );
                        io.to(roomInfo.players[playerId].playerId).emit(
                            "displayMainTaskOne",
                            {
                                playerId: playerId,
                                playerNum: roomInfo.players[playerId].playerNum,
                                key1: key1,
                                key2: key2,
                                key3: key3,
                            }
                        );
                    } else if (roomInfo.players[playerId].playerNum == 2) {
                        io.to(roomInfo.players[playerId].playerId).emit(
                            "displaySideTaskOne",
                            {
                                playerId: playerId,
                                playerNum: roomInfo.players[playerId].playerNum,
                                key: key1,
                            }
                        );
                    } else if (roomInfo.players[playerId].playerNum == 3) {
                        io.to(roomInfo.players[playerId].playerId).emit(
                            "displaySideTaskOne",
                            {
                                playerId: playerId,
                                playerNum: roomInfo.players[playerId].playerNum,
                                key: key2,
                            }
                        );
                    } else {
                        io.to(roomInfo.players[playerId].playerId).emit(
                            "displaySideTaskOne",
                            {
                                playerId: playerId,
                                playerNum: roomInfo.players[playerId].playerNum,
                                key: key3,
                            }
                        );
                    }
                }
            }
        });

        socket.on("startTimer", function (roomKey, counter) {
            console.log("IN START TIMER");
            socket.on("decreaseCounter", function () {
                counter = counter - 5;
            });

            var Countdown = setInterval(function () {
                console.log(counter);
                io.to(roomKey).emit("counter", counter);
                counter--;
                if (counter <= 0) {
                    console.log("Lost!");
                    io.to(roomKey).emit("lost", roomKey);
                    clearInterval(Countdown);
                }
            }, 1000);

            // stop the counter so it doesnt keep going after game ends
            socket.on("showWinScene", function () {
                console.log("counter destroyed");
                io.to(roomKey).emit("win", roomKey);
                clearInterval(Countdown);
            });

            socket.on("endedTask", function () {
                console.log("counter destroyed, moving on to next task");
                io.to(roomKey).emit("nextTask", roomKey);
                clearInterval(Countdown);
            });

            socket.on("stopTimer", function (newKey) {
                clearInterval(Countdown);
                io.to(roomKey).emit("backToLobby", {
                    roomKey: newKey,
                });
                delete gameRooms[roomKey];

                console.log(gameRooms);
            });
        });

        // ************************************* TASK ONE SCENE SOCKETS **********************************************

        // ************************************ FINAL TASK SCENE SOCKETS *********************************************

        socket.on("startFinalTask", function (roomKey, mainPlayer) {
            const roomInfo = gameRooms[roomKey];
            roomInfo.inFinalTask = true;
            if (!roomInfo.finalTaskIsStarted) {
                roomInfo.finalTaskIsStarted = true;
                console.log("entered startFinalTask");
                const counter = 30;
                for (playerId in roomInfo.players) {
                    if (roomInfo.players[playerId].playerNum == mainPlayer) {
                        io.to(roomInfo.players[playerId].playerId).emit(
                            "startTimerEXFinal",
                            { roomKey, counter }
                        );
                    }
                    io.to(roomInfo.players[playerId].playerId).emit(
                        "displayFinal",
                        {
                            playerId: playerId,
                            playerNum: roomInfo.players[playerId].playerNum,
                        }
                    );
                }
            }
        });

        socket.on("startTimerFinal", function (roomKey, counterFinal) {
            console.log("IN START TIMER");
            const roomInfo = gameRooms[roomKey];
            var CountdownFinal = setInterval(function () {
                console.log(counterFinal);
                io.to(roomKey).emit("counterFinal", counterFinal);
                counterFinal--;
                if (counterFinal <= 0) {
                    let allFinishedPlaceholder = true;
                    for (playerId in roomInfo.players) {
                        if (!roomInfo.players[playerId].finished) {
                            console.log("MAKE IT FALSE");
                            allFinishedPlaceholder = false;
                        }
                    }
                    if (allFinishedPlaceholder) {
                        allFinished = true;
                        console.log("NOW ALL FINISHED, ", allFinished);
                    } else {
                        allFinished = false;
                    }
                    console.log("ALL FINISHED:", allFinished);
                    if (allFinished) {
                        console.log("WON");
                        console.log("counter destroyed");
                        io.to(roomKey).emit("winFinal", roomKey);
                        clearInterval(CountdownFinal);
                    } else {
                        console.log("Lost!");
                        io.to(roomKey).emit("lostFinal", roomKey);
                        clearInterval(CountdownFinal);
                    }
                }
            }, 1000);

            // stop the counter so it doesnt keep going after game ends
            socket.on("showWinSceneFinal", function () {
                console.log("counter destroyed");
                io.to(roomKey).emit("winFinal", roomKey);
                clearInterval(CountdownFinal);
            });

            socket.on("stopTimerFinal", function (newKey) {
                clearInterval(CountdownFinal);
                io.to(roomKey).emit("backToLobbyFinal", {
                    roomKey: newKey,
                });

                delete gameRooms[roomKey];

                console.log(gameRooms);
            });
        });

        socket.on("gotAllFish", function (roomKey, playerI) {
            console.log("GOT ALL FISH");
            const roomInfo = gameRooms[roomKey];
            roomInfo.players[playerI].finished = true;
        });

        
        
        // ************************************ SYNCING SOCKETS *********************************************

        socket.on("ready", function(roomKey) {
            const roomInfo = gameRooms[roomKey];
            var check = 0;
            roomInfo.players[socket.id].ready = true;
            for (var player in roomInfo.players) {
                if (roomInfo.players[player].ready == true)
                {
                    check++;
                }
            }
            if (check < 4) {
                socket.emit("waiting");
            } else if (check = 4) {
                io.to(roomKey).emit("canStart");
                io.to(roomKey).emit("destroyWaitingScene");
                for (var player in roomInfo.players) {
                    if (roomInfo.players[player].ready == true)
                    {
                        roomInfo.players[player].ready = false;
                    }
                }
            }
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
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
