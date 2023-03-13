export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ LobbyScene });
        this.state = {};
        this.hasBeenSet = false;
    }

    init(data) {
        console.log(data);
        this.socket = data.socket;
        this.roomKey = data.roomKey;
    }

    preload() {
        // this.load.setBaseURL('http://labs.phaser.io');
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        );

        //load images from the assets folder
        this.load.image("icon", "client/assets/sprites/cat.png"); //Files might not be in the root
        // this.load.spritesheet("icon", "client/assets/sprites/cat.png", {
        //     frameWidth: 300,
        //     frameHeight: 300,
        // });
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
        this.load.image("player1", "client/assets/sprites/player1.png"); //Files might not be in the root
        this.load.image("player2", "client/assets/sprites/player2.png");
        this.load.image("player3", "client/assets/sprites/player3.png");
        this.load.image("player4", "client/assets/sprites/player4.png");
    }

    create() {
        const scene = this;
        scene.socket.emit("joinRoom", this.roomKey);
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        console.log("Room Key " + this.roomKey);

        // this.currentPlayer = this.physics.add.group();
        this.otherPlayers = this.physics.add.group();

        // JOINED ROOM - SET STATE
        this.socket.on("setState", function (state) {
            // console.log("udheihduehiude");
            const { roomKey, players, numPlayers } = state;
            // console.log(state);
            // console.log(roomKey);
            // console.log(players);
            // console.log(numPlayers);
            scene.physics.resume();

            // STATE
            scene.state.roomKey = roomKey;
            scene.state.players = players;
            scene.state.numPlayers = numPlayers;
        });

        // PLAYERS
        this.socket.on("currentPlayers", function (arg) {
            const { players, numPlayers } = arg;
            scene.state.numPlayers = numPlayers;
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === scene.socket.id) {
                    scene.addPlayer(scene, players[id]);
                } else {
                    scene.addOtherPlayers(scene, players[id]);
                }
            });
        });

        // NEW PLAYER
        this.socket.on("newPlayer", function (arg) {
            const { playerInfo, numPlayers } = arg;
            scene.addOtherPlayers(scene, playerInfo);
            scene.state.numPlayers = numPlayers;
            // console.log(numPlayers);
            // console.log(scene.state.numPlayers);
        });

        // DISCONNECT
        this.socket.on("disconnected", function (arg) {
            const { playerId, numPlayers } = arg;
            scene.state.numPlayers = numPlayers;
            // scene.currentPlayer.setScale(0.3)
            // .setPosition(125 + 175 * (playerInfo.playerNum - 1), 200);
            scene.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
                // if ()
            });
        });

        scene.boxes = scene.add.graphics();
        scene.circle = scene.add.graphics();
        // Add circle

        // Creates box for the lobby and start page
        scene.boxes.fillStyle(0xbeb2a8, 1);
        scene.boxes.fillRect(275, 400, 250, 90);
        scene.makeButton = scene.add
            .text(400, 450, this.roomKey, {
                fontFamily: "Chela One",
                fontcolor: "#FFFBF4'",
                fontSize: "40px",
            })
            .setOrigin(0.5);

        // Creates 4 circles for the players.

        //Player 1
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(125, 200, 50);

        // Player 2
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(300, 200, 50);

        // Player 3
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(475, 200, 50);

        // Player 4
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(650, 200, 50);

        // Title
        var cat = scene.add.text(125, 5, "Cat", {
            fontFamily: "Chela One",
            fontSize: 100,
            color: "#F8F0C6",
            fontStyle: "normal",
            stroke: "#000000",
            strokeThickness: 12,
        });
        var burg = scene.add.text(250, 5, "Burglars", {
            fontFamily: "Chela One",
            fontSize: 100,
            color: "#C1A87D",
            fontStyle: "normal",
            stroke: "#000000",
            strokeThickness: 12,
        });
        var end = scene.add.text(565, 5, ".io", {
            fontFamily: "Chela One",
            fontSize: 100,
            color: "#EEBA6B",
            fontStyle: "normal",
            stroke: "#000000",
            strokeThickness: 12,
        });
        scene.boxes.fillStyle(0xc1a87d, 1);
        scene.boxes.fillRect(275, 500, 250, 75);

        // Start Game button
        var startGame = scene.add
            .text(400, 535, "Start Game", {
                fontFamily: "Chela One",
                fontSize: 40,
                color: "#FFFBF4",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 12,
            })
            .setOrigin(0.5)
            .setPadding(0.0, 0.0, 0);

        startGame.setInteractive();

        // Start Game button events
        startGame.on("pointerup", () => {
            if (scene.state.numPlayers == 4) {
                scene.scene.start("FirstTask", {
                    ...scene.state,
                    socket: scene.socket,
                });
            } else {
                console.log("Not Enough Players!");
            }
        });
        startGame.on("pointerover", () => {
            startGame.setStyle({
                color: "#FFEBB9",
            });
        });
        startGame.on("pointerout", () => {
            startGame.setStyle({
                color: "#FFFBF4",
            });
        });
    }

    update() {
        const scene = this;
        // console.log(scene.state.numPlayers);
        var position = 125;
        // for (let x = 1; x <= scene.state.numPlayers; x++) {
        //     // console.log("eiudhie");
        //     var mycats = scene.add.sprite(300, 300, `player` + x);
        //     mycats.setScale(0.3).setPosition(position, 200);
        //     position += 175;
        // }
        this.socket.on("disconnected", function (arg) {
            const { playerId, numPlayers } = arg;
            scene.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
            // .setScale(0.3)
            // .setPosition(125 + 175 * (playerInfo.playerNum - 1), 200);
            scene.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });
        // this.socket.on("setState", function (state) {
        //     console.log("udheihduehiude")
        //     const { roomKey, players, numPlayers } = state;
        //     console.log(state);
        //     console.log(roomKey);
        //     console.log(players);
        //     console.log(numPlayers);
        //     scene.physics.resume();

        //     // STATE
        //     scene.state.roomKey = roomKey;
        //     scene.state.players = players;
        //     scene.state.numPlayers = numPlayers;
        // });

        // // PLAYERS
        // this.socket.on("currentPlayers", function (arg) {
        //     console.log("HELLO")
        //     const { players, numPlayers } = arg;
        //     scene.state.numPlayers = numPlayers;
        //     Object.keys(players).forEach(function (id) {
        //         if (players[id].playerId === scene.socket.id) {
        //             scene.addPlayer(scene, players[id]);
        //         } else {
        //             scene.addOtherPlayers(scene, players[id]);
        //         }
        //     });
        // });
    }

    // var position = 125;
    //     for (let x = 1; x <= scene.state.numPlayers; x++) {
    //         // console.log("eiudhie");
    //         var mycats = scene.add.sprite(300, 300, `player` + x);
    //         mycats.setScale(0.3).setPosition(position, 200);
    //         position += 175;
    //     }

    addPlayer(scene, playerInfo) {
        scene.joined = true;
        // scene.circle.fillStyle(0xe8ded1, 1);
        // scene.circle.fillCircle(300, 200, 50);
        var circle = scene.circle.fillStyle(0xffffff, 1);
        circle.fillCircle(125 + 175 * (playerInfo.playerNum - 1), 200, 50);
        var mycats = scene.add.sprite(
            300,
            300,
            `player` + playerInfo.playerNum
        );
        mycats
            .setScale(0.3)
            .setPosition(125 + 175 * (playerInfo.playerNum - 1), 200);
        // scene.currentPlayer = mycats;
    }
    addOtherPlayers(scene, playerInfo) {
        const otherPlayer = scene.add.sprite(
            300,
            300,
            `player` + playerInfo.playerNum
        );
        otherPlayer
            .setScale(0.3)
            .setPosition(125 + 175 * (playerInfo.playerNum - 1), 200);
        otherPlayer.playerId = playerInfo.playerId;
        scene.otherPlayers.add(otherPlayer);
    }
}
