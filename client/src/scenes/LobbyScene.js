// CreateLobbyScene, JoinLobbyScene and LobbyScene both use this Among Us Tutorial as a reference:
// ** github.com/hannahrobot/amongus-tutorial

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ LobbyScene });
        this.state = {};
    }

    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerName = data.playerName;
    }

    preload() {
        // Load images from the assets folder
        this.load.image("icon", "client/assets/sprites/cat.png");
        this.load.image(
            "House_no_background",
            "client/assets/sprites/House_No Backgroung.png"
        );
        this.load.image("player1", "client/assets/sprites/player1.png");
        this.load.image("player2", "client/assets/sprites/player2.png");
        this.load.image("player3", "client/assets/sprites/player3.png");
        this.load.image("player4", "client/assets/sprites/player4.png");
        this.load.image("Sky_Lobby", "client/assets/sprites/Sky.png");
    }

    create() {
        const scene = this;

        scene.socket.emit("joinRoom", this.roomKey, this.playerName);

        // Set background
        const background = this.add.image(400, 300, "Sky_Lobby");
        background.setScale(4);

        // Set House as a Background
        const House = this.add.image(400, 300, "House_no_background");
        House.setScale(3.5);

        // Set Variables
        // console.log("Room Key " + this.roomKey);
        this.currentPlayer = this.physics.add.group();
        this.otherPlayers = this.physics.add.group();
        this.playerNames = this.physics.add.group();

        // JOINED ROOM - SET STATE
        // ** Base code taken from Among Us Replica
        this.socket.on("setState", function (state) {
            const { roomKey, players, numPlayers } = state;
            scene.physics.resume();

            // STATE
            scene.state.roomKey = roomKey;
            scene.state.players = players;
            scene.state.numPlayers = numPlayers;
        });

        // CURRENT PLAYERS
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
        });

        // Other Player Started Game
        this.socket.on("startRoom", function (arg) {
            // console.log("gameStarted");
            const { roomKey, start } = arg;
            scene.scene.start("IntroductionScene", {
                ...scene.state,
                socket: scene.socket,
                roomKey: roomKey,
                playerName: scene.playerName,
                playerName: scene.playerName,
                playerInfo: scene.state.players,
                playerNum: scene.state.players[scene.socket.id].playerNum,
            });
        });

        //Players Circle
        scene.boxes = scene.add.graphics();
        scene.circle = scene.add.graphics();

        // Creates box for the lobby and start page
        scene.boxes.fillStyle(0xbeb2a8, 1);
        scene.boxes.fillRect(265, 380, 270, 110);
        scene.lobbyText = scene.add
            .text(400, 410, "Lobby Code:", {
                fontFamily: "Black Ops One",
                color: "#FFFBF4",
                fontSize: "40px",
                stroke: "#000000",
                strokeThickness: 5,
            })
            .setOrigin(0.5);

        // Room key and copy key functions
        var key = scene.add
            .text(400, 460, this.roomKey, {
                fontFamily: "Black Ops One",
                color: "#FFFBF4",
                fontSize: "40px",
                fontWeight: "bold",
                stroke: "#000000",
                strokeThickness: 5,
            })
            .setOrigin(0.5);
        key.setInteractive();

        key.on("pointerup", () => {
            navigator.clipboard.writeText(this.roomKey);
            scene.copiedRoomKey = scene.add
                .text(390, 325, "Room Key Copied To Clipboard!", {
                    fontFamily: "Black Ops One",
                    fontSize: 35,
                    color: "#FFFFFF",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                })
                .setOrigin(0.5)
                .setPadding(0.0, 0.0, 0);

            function copiedKey() {
                scene.copiedRoomKey.destroy();
            }

            this.time.addEvent({
                delay: 2000,
                callback: copiedKey,
                callbackScope: this,
            });
        });

        key.on("pointerover", () => {
            key.setStyle({
                color: "#FFEBB9",
            });
        });
        key.on("pointerout", () => {
            key.setStyle({
                color: "#FFFBF4",
            });
        });

        // Creates 4 circles for the players.

        //Player 1
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(125, 210, 50);

        // Player 2
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(300, 210, 50);

        // Player 3
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(475, 210, 50);

        // Player 4
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(650, 210, 50);

        // Title
        var cat = scene.add.text(15, 15, "Cat", {
            fontFamily: "Black Ops One",
            fontSize: 95,
            color: "#f1c582",
            fontStyle: "normal",
            stroke: "#000000",
            strokeThickness: 8,
        });
        var burg = scene.add.text(185, 15, "Burglars", {
            fontFamily: "Black Ops One",
            fontSize: 95,
            color: "#f1c582",
            fontStyle: "normal",
            stroke: "#000000",
            strokeThickness: 8,
        });
        var end = scene.add.text(655, 15, ".io", {
            fontFamily: "Black Ops One",
            fontSize: 95,
            color: "#f1c582",
            fontStyle: "normal",
            stroke: "#000000",
            strokeThickness: 8,
        });
        scene.boxes.fillStyle(0xc1a87d, 1);
        scene.boxes.fillRect(265, 500, 270, 75);

        // Start Game button
        var startGame = scene.add
            .text(400, 535, "Start Game", {
                fontFamily: "Black Ops One",
                fontSize: 40,
                color: "#FFFBF4",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 5,
            })
            .setOrigin(0.5)
            .setPadding(0.0, 0.0, 0);

        startGame.setInteractive();

        // Start Game button events
        startGame.on("pointerup", () => {
            if (scene.state.numPlayers == 4) {
                scene.socket.emit("startGame", this.roomKey, this.socket.id);
                // console.log("startGame", this.roomKey);
                scene.scene.start("FirstTask_Instruction", {
                    ...scene.state,
                    socket: scene.socket,
                    roomKey: this.roomKey,
                    playerName: this.playerName,
                    playerInfo: scene.state.players,
                    playerNum: scene.state.players[this.socket.id].playerNum,
                });
            } else {
                scene.notEnoughPlayers = scene.add
                    .text(400, 325, "Not Enough Players!", {
                        fontFamily: "Black Ops One",
                        fontSize: 35,
                        color: "#ff0000",
                        fontStyle: "normal",
                        strokeThickness: 5,
                    })
                    .setOrigin(0.5)
                    .setPadding(0.0, 0.0, 0);
                function notEnough() {
                    scene.notEnoughPlayers.destroy();
                }
                this.time.addEvent({
                    delay: 1000,
                    callback: notEnough,
                    callbackScope: this,
                });
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

        // DISCONNECT
        this.socket.on("disconnected", (arg) => {
            this.scene.restart(); // restart current scene
        });
    }

    //-------------------------- Add Players Functions -----------------------------

    // Add playing that requested to join
    addPlayer(scene, playerInfo) {
        scene.joined = true;
        var circle = scene.circle.fillStyle(0xffffff, 1);
        circle.fillCircle(125 + 175 * (playerInfo.playerNum - 1), 210, 50);
        var mycats = scene.add.sprite(
            300,
            310,
            `player` + playerInfo.playerNum
        );
        mycats
            .setScale(0.6)
            .setPosition(125 + 175 * (playerInfo.playerNum - 1), 210);
        var playerNameDisplay = scene.add
            .text(
                125 + 175 * (playerInfo.playerNum - 1),
                280,
                playerInfo.playerName,
                {
                    fontFamily: "Black Ops One",
                    fontSize: 25,
                    color: "#FFFFFF",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                }
            )
            .setOrigin(0.5)
            .setPadding(0.0, 0.0, 0);
        scene.playerNames.add(playerNameDisplay);
        scene.currentPlayer.add(mycats);
    }

    // Adding other players in the lobby
    addOtherPlayers(scene, playerInfo) {
        const otherPlayer = scene.add.sprite(
            300,
            300,
            `player` + playerInfo.playerNum
        );
        otherPlayer
            .setScale(0.5)
            .setPosition(125 + 175 * (playerInfo.playerNum - 1), 210);
        otherPlayer.playerId = playerInfo.playerId;
        var playerNameDisplay = scene.add
            .text(
                125 + 175 * (playerInfo.playerNum - 1),
                285,
                playerInfo.playerName,
                {
                    fontFamily: "Black Ops One",
                    fontSize: 20,
                    color: "#FFFFFF",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 3,
                }
            )
            .setOrigin(0.5)
            .setPadding(0.0, 0.0, 0);
        scene.playerNames.add(playerNameDisplay);
        scene.otherPlayers.add(otherPlayer);
    }
}
