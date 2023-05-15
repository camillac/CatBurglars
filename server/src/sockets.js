// CreateLobbyScene, JoinLobbyScene and LobbyScene both use this Among Us Tutorial as a reference:
// ** github.com/hannahrobot/amongus-tutorial

// Local Variables
https: var gameRooms = {};
var allFinished = false;

// SOCKETS START HERE
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(
            `A socket connection to the server has been made: ${socket.id}`
        );

        // ************************************* PLAY SCENE SOCKETS **********************************************

        // CREATE A ROOM
        // ** Base code taken from Among Us Replica
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

            socket.emit("roomCreated", key, name);
        });

        // GET ALL ROOMS DETAILS
        socket.on("getRooms", async function () {
            socket.emit("getRooms", gameRooms);
        });

        // JOIN A ROOM
        // ** Base code taken from Among Us Replica
        socket.on("joinRoom", (roomKey, playerName) => {
            socket.join(roomKey);
            const roomInfo = gameRooms[roomKey];

            if (!roomInfo.players[socket.id]) {
                roomInfo.players[socket.id] = {
                    playerId: socket.id,
                    playerNum: 0,
                    playerName: playerName,
                    finished: false,
                    ready: false,
                    defaultName: false,
                };

                roomInfo.players[socket.id].playerNum = Object.keys(
                    roomInfo.players
                ).length;

                // If player name not given, assign one
                // OR
                // If the players name is currently a default name from a prev game (ex. Player 1),
                // change it to match updated playerNum
                if (
                    playerName == "" ||
                    roomInfo.players[socket.id].defaultName
                ) {
                    roomInfo.players[socket.id].defaultName = true;
                    roomInfo.players[socket.id].playerName =
                        "Player " + roomInfo.players[socket.id].playerNum;
                }
            }

            // Update number of players
            roomInfo.numPlayers = Object.keys(roomInfo.players).length;
            // console.log("JOIN ROOM ");

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

            // console.log(roomInfo);
        });

        // ************************************* END OF PLAY SCENE SOCKETS **********************************************

        // ************************************* LOBBY SCENE SOCKETS **********************************************

        // CLIENT DISCONNECT
        // ** Base code taken from Among Us Replica
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
                // console.log("User Disconnected: ", socket.id);
                // console.log("Room Info BEFORE Removing Player");
                // console.log(roomInfo);

                var deletedNum = roomInfo.players[socket.id].playerNum;

                // SHIFT PLAYERNUMS DOWN IF PLAYERNUM > DELETED_PLAYERNUM
                for (playerId in roomInfo.players) {
                    // console.log("player: " + playerId);
                    // console.log(
                    //     "playerNum: " + roomInfo.players[playerId].playerNum
                    // );

                    if (roomInfo.players[playerId].playerNum > deletedNum) {
                        roomInfo.players[playerId].playerNum =
                            roomInfo.players[playerId].playerNum - 1;
                        if (
                            roomInfo.players[playerId].playerName ==
                            "Player " +
                                (roomInfo.players[playerId].playerNum + 1)
                        ) {
                            roomInfo.players[playerId].playerName =
                                "Player " +
                                roomInfo.players[playerId].playerNum;
                        }
                    }
                }

                // Remove this player from our players object
                delete roomInfo.players[socket.id];

                // Update numPlayers
                roomInfo.numPlayers = Object.keys(roomInfo.players).length;

                // Handle in-game disconnects
                if (roomInfo.inGame) {
                    // reset defaultNames to "" so they are set to have the proper playerNum on reconnect to new lobby
                    for (playerId in roomInfo.players) {
                        if (roomInfo.players[playerId].defaultName) {
                            roomInfo.players[playerId].playerName = "";
                        }
                    }

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

                    // Final Task Disconnect
                    if (roomInfo.inFinalTask) {
                        io.to(roomKey).emit("endGameFinal", newKey);
                    }
                    // Task One Disconnect
                    else {
                        io.to(roomKey).emit("endGame", newKey);
                    }
                } else {
                    // Handle lobby disconnects
                    io.to(roomKey).emit("disconnected", {
                        playerId: socket.id,
                        numPlayers: roomInfo.numPlayers,
                        roomInfo: roomInfo,
                    });
                }

                // console.log("Room Info AFTER Removing Player");
                // console.log(roomInfo);
            }
        });

        // Check if the key is valid
        // ** Base code taken from Among Us Replica
        socket.on("isKeyValid", function (code, name) {
            Object.keys(gameRooms).includes(code)
                ? socket.emit("keyIsValid", code, name)
                : socket.emit("keyNotValid");
        });

        // Check if the room is full, notify player if it is
        socket.on("isRoomFull", function (roomKey) {
            if (gameRooms[roomKey].numPlayers >= 4) {
                socket.emit("roomIsFull");
            } else {
                socket.emit("roomNotFull");
            }
        });

        // RECEIVES STARTGAME EMIT FROM ONE PLAYER, EMIT STARTGAME TO ALL PLAYERS IN THE ROOM
        socket.on("startGame", function (roomKey, start) {
            console.log("Start Game");
            gameRooms[roomKey].inGame = true;
            socket
                .to(roomKey)
                .emit("startRoom", { roomKey: roomKey, start: start });
        });

        // ************************************* END OF LOBBY SCENE SOCKETS **********************************************

        // ************************************* TASK ONE SCENE SOCKETS **********************************************

        // Starts task one
        socket.on("startTaskOne", function (roomKey, mainPlayer, playerIdx) {
            const roomInfo = gameRooms[roomKey];
            if (!roomInfo.task1IsStarted) {
                roomInfo.task1IsStarted = true;
                let arr = [1, 2, 3, 4, 5, 6];
                shuffleArray(arr);
                const key1 = arr[0];
                const key2 = arr[1];
                const key3 = arr[2]; // Randomly shuffle an array, in order to pick 3 random keys
                // console.log(roomKey);
                // console.log(key1, key2, key3);
                // console.log(roomInfo);
                for (playerId in roomInfo.players) {
                    // Sends MAIN PLAYER all 3 keys
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
                    }
                    // Sends SIDE PLAYERS their respective key
                    else {
                        io.to(roomInfo.players[playerId].playerId).emit(
                            "displaySideTaskOne",
                            {
                                playerId: playerId,
                                playerNum: roomInfo.players[playerId].playerNum,
                                key: arr[
                                    roomInfo.players[playerId].playerNum - 2
                                ],
                            }
                        );
                    }
                }
            }
        });

        // Start back-end timer
        socket.on("startTimer", function (roomKey, counter) {
            console.log("START TASK ONE TIMER");
            socket.on("decreaseCounter", function () {
                // Decrease timer on mistakes
                counter = counter - 5;
            });

            // Timer sends itself to the clients once every second
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

            // Stop the counter so it doesnt keep going after game ends
            socket.on("showWinScene", function () {
                console.log("Counter Destroyed");
                io.to(roomKey).emit("win", roomKey);
                clearInterval(Countdown);
            });

            // Stop the timer and move on to the next task
            socket.on("endedTask", function () {
                console.log("Counter Destroyed, Moving on to Next Task");
                io.to(roomKey).emit("nextTask", roomKey);
                clearInterval(Countdown);
            });

            // Stopping the timer when there's a disconnect
            socket.on("stopTimer", function (newKey) {
                clearInterval(Countdown);
                io.to(roomKey).emit("backToLobby", {
                    roomKey: newKey,
                });
                // delete gameRooms[roomKey];

                // console.log(gameRooms);
            });
        });

        // ************************************* TASK ONE SCENE SOCKETS **********************************************

        // ************************************ FINAL TASK SCENE SOCKETS *********************************************

        // Start the final task
        socket.on("startFinalTask", function (roomKey, mainPlayer) {
            const roomInfo = gameRooms[roomKey];
            roomInfo.inFinalTask = true;
            if (!roomInfo.finalTaskIsStarted) {
                roomInfo.finalTaskIsStarted = true;
                // console.log("Start Final Task");
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

        // Start server-side timer for the final task
        socket.on("startTimerFinal", function (roomKey, counterFinal) {
            console.log("START FINAL TIMER");
            const roomInfo = gameRooms[roomKey];
            var CountdownFinal = setInterval(function () {
                console.log(counterFinal);
                io.to(roomKey).emit("counterFinal", counterFinal);
                counterFinal--;
                if (counterFinal <= 0) {
                    let allFinishedPlaceholder = true;
                    for (playerId in roomInfo.players) {
                        if (!roomInfo.players[playerId].finished) {
                            // console.log("MAKE IT FALSE");
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

            // Stop the counter so it doesnt keep going after game ends
            socket.on("showWinSceneFinal", function () {
                console.log("counter destroyed");
                io.to(roomKey).emit("winFinal", roomKey);
                clearInterval(CountdownFinal);
            });

            // Stopping the timer on disconnects
            socket.on("stopTimerFinal", function (newKey) {
                clearInterval(CountdownFinal);
                io.to(roomKey).emit("backToLobbyFinal", {
                    roomKey: newKey,
                });

                // delete gameRooms[roomKey];

                // console.log(gameRooms);
            });
        });

        // Update finished variable for specific player on Win Condition
        socket.on("gotAllFish", function (roomKey, playerI) {
            console.log("GOT ALL FISH");
            const roomInfo = gameRooms[roomKey];
            roomInfo.players[playerI].finished = true;
        });

        // ************************************ SYNCING SOCKETS *********************************************

        // Server checks if everyone is done with any animations
        // and if it can send out the tasks
        socket.on("ready", function (roomKey) {
            const roomInfo = gameRooms[roomKey];
            var check = 0;
            roomInfo.players[socket.id].ready = true;
            for (var player in roomInfo.players) {
                if (roomInfo.players[player].ready == true) {
                    check++;
                }
            }
            if (check < 4) {
                socket.emit("waiting");
            } else if ((check = 4)) {
                io.to(roomKey).emit("canStart");
                io.to(roomKey).emit("destroyWaitingScene");
                for (var player in roomInfo.players) {
                    if (roomInfo.players[player].ready == true) {
                        roomInfo.players[player].ready = false;
                    }
                }
            }
        });
    });
};

// ************************************ HELPER FUNCTIONS *********************************************

// CODE GENERATOR FOR LOBBY
// ** Base code taken from Among Us Replica
function codeGenerator() {
    let code = "";
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// SHUFFLE ARRAYS FOR TASK ONE
// The shuffle array function was taken from this stack overflow link:
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
