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
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        );

        //load images from the assets folder
        this.load.image("icon", "client/assets/sprites/cat.png"); //Files might not be in the root
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        const scene = this;
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        console.log("Room Key " + this.roomKey);

        this.otherPlayers = this.physics.add.group();

        // scene.socket.emit("joinRoom", scene.roomKey);

        // JOINED ROOM - SET STATE
        this.socket.on("setState", function (state) {
            const { roomKey, players, numPlayers } = state;
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
        });

        // DISCONNECT
        this.socket.on("disconnected", function (arg) {
            const { playerId, numPlayers } = arg;
            scene.state.numPlayers = numPlayers;
            scene.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });

        scene.boxes = scene.add.graphics();
        scene.circle = scene.add.graphics();
        // Add circle

        // Creates box for the lobby and start page
        scene.boxes.fillStyle(0xbeb2a8, 1);
        scene.boxes.fillRect(275, 380, 250, 110);
        scene.lobbyText = scene.add.text(400,410, "Lobby Code:", {
          fontFamily: "Chela One",
          fontcolor: "#FFFBF4",
          fontSize: "40px",
        })
        .setOrigin(0.5);
        scene.makeButton = scene.add
            .text(400, 460, this.roomKey, {
                fontFamily: "Martian Mono",
                fontcolor: "#FFFBF4'",
                fontSize: "40px",
                fontWeight: "bold"
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
            scene.scene.start("FirstTask", {
                ...scene.state,
                socket: scene.socket,
            });
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

        var mycats = this.add.sprite(300, 300, "icon");
        mycats.setScale(0.3).setPosition(125, 200);
    }

    update() {}
}