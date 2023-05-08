// local variables
var gameRooms = {};
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
            while (Object.keys(gameRooms).includes(key)) {
                key = codeGenerator();
            }
            gameRooms[key] = {
                roomKey: key,
                players: {},
                numPlayers: 0,
                inGame: false,
                inFinalTask: false,
            };
            console.log("ROOM CREATED - ROOM KEY: " + key);
            socket.emit("roomCreated", key, name);
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
                };

                roomInfo.players[socket.id].playerNum = Object.keys(
                    roomInfo.players
                ).length;
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
                    }
                }

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
                    };

                    console.log("ROOM CREATED - ROOM KEY: " + newKey);
                    if(roomInfo.inFinalTask){
                        io.to(roomKey).emit("endGameFinal", newKey);
                    }
                    else{
                        io.to(roomKey).emit("endGame", newKey);}
                    
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

        socket.on("startTimer", function (roomKey, counter) {
            console.log("IN START TIMER");
            console.log(roomKey);
            console.log(counter); 
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
            })

            socket.on("stopTimer", function (newKey) {
                clearInterval(Countdown);
                io.to(roomKey).emit("backToLobby", {
                    roomKey: newKey,
                });
            });
        });
        socket.on("startTimerFinal", function (roomKey, counterFinal) {
            console.log("IN START TIMER");
            console.log(roomKey);
            console.log(counterFinal); 
            const roomInfo = gameRooms[roomKey];
            var CountdownFinal = setInterval(function () {
                console.log(counterFinal);
                io.to(roomKey).emit("counterFinal", counterFinal);
                counterFinal--;
                if (counterFinal <= 0) {
                    console.log(gameRooms[roomKey]); 
                    let allFinishedPlaceholder = true;  
                    for(playerId in roomInfo.players){
                        console.log(roomInfo.players[playerId], roomInfo.players[playerId].finished);
                        if(!(roomInfo.players[playerId].finished)){
                            console.log("MAKE IT FALSE"); 
                            allFinishedPlaceholder = false; 
                        }
                    }
                    console.log("ALL FINISHED:" , allFinished); 
                    if (allFinished) {
                        console.log("WON");
                        console.log("counter destroyed");
                        io.to(roomKey).emit("winFinal", roomKey);
                        clearInterval(CountdownFinal);
                    }
                    else {
                        console.log("Lost!");
                        io.to(roomKey).emit("lostFinal", roomKey);
                        clearInterval(CountdownFinal);
                    }
                }
                // if(counter <= 0 && finished){
                // console.log("counter destroyed");
                // io.to(roomKey).emit("winFinal", roomKey);
                // clearInterval(Countdown);
                // }
            }, 1000);

            // stop the counter so it doesnt keep going after game ends
            socket.on("showWinSceneFinal", function () {
                console.log("counter destroyed");
                io.to(roomKey).emit("winFinal", roomKey);
                clearInterval(CountdownFinal);
            });

            // socket.on("endedTaskFinal", function () {
            //     console.log("counter destroyed, moving on to next task");
            //     io.to(roomKey).emit("nextTask", roomKey);
            //     clearInterval(CountdownFinal);
            // })

            socket.on("stopTimerFinal", function (newKey) {
                clearInterval(CountdownFinal);
                io.to(roomKey).emit("backToLobbyFinal", {
                    roomKey: newKey,
                });
            });
        });
        socket.on("gotAllFish", function (roomKey, playerI){
            console.log("GOT ALL FISH"); 
            // finished = true; 
            const roomInfo = gameRooms[roomKey];
            // console.log(roomKey); 
            // console.log(roomInfo);
            // console.log((roomInfo.players)[playerI]); 
            (roomInfo.players)[playerI].finished = true; 
            console.log(roomInfo); 
            let allFinishedPlaceholder = true;  
                for(playerId in roomInfo.players){
                    console.log(roomInfo.players[playerId], roomInfo.players[playerId].finished);
                    if(!(roomInfo.players[playerId].finished)){
                        console.log("MAKE IT FALSE"); 
                        allFinishedPlaceholder = false; 
                    }
                }
            console.log(allFinished); 
            if(allFinishedPlaceholder){
                allFinished = true; 
                console.log("NOW ALL FINISHED, ", allFinished); 
            }
            
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
            const roomInfo = gameRooms[roomKey];
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
        });

        // ************************************* TASK ONE SCENE SOCKETS **********************************************

        // ************************************ FINAL TASK SCENE SOCKETS *********************************************
        socket.on("startFinalTask", function (roomKey, mainPlayer) {
        gameRooms[roomKey].inFinalTask = true;
           console.log("entered startFinalTask");
            const roomInfo = gameRooms[roomKey];
            const counter = 20; 
            console.log("main player: ", mainPlayer); 
            console.log(roomInfo.players[mainPlayer].playerId);
            io.to(roomInfo.players[mainPlayer].playerId).emit(
                        "startTimerEXFinal",
                        { roomKey, counter }
                    );
            for (playerId in roomInfo.players) {
                console.log("playerID: ", playerId); 
                console.log("playerIDscok: ", roomInfo.players[playerId].playerId); 
                io.to(roomInfo.players[playerId].playerId).emit(
                            "displayFinal",
                            {
                                playerId: playerId,
                                playerNum: roomInfo.players[playerId].playerNum,
                            }
                        );
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
