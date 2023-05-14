class Sidebar extends Phaser.GameObjects.Container {
    preload() {
        this.load.image("player1", "client/assets/sprites/player1.png");
        this.load.image("player2", "client/assets/sprites/player2.png");
        this.load.image("player3", "client/assets/sprites/player3.png");
        this.load.image("player4", "client/assets/sprites/player4.png");
    }

    constructor(scene, width, height, roomkey, socket, color = 0xfaf3ec) {
        super(scene, width, height);
        this.scene = scene; // Scene that is requesting sidebar
        this.width = width; // Width of screen
        this.height = height; // Height of screen
        this.roomkey = roomkey; // Player data
        this.socket = socket; // Socket data
        this.color = color; // color for sidebar
        this.roomList = [];

        let increment = 0;
        let circle_color = ((color == 0xfaf3ec) ? 0xe8ded1 : 0xc4e2f0);

        // Rectangle background for sidebar
        const menu = this.scene.add.graphics();
        menu.fillStyle(color, 1);
        menu.fillRoundedRect(10, 10, this.width / 5, this.height - 20, 32);

        //Add Players Sprite Circles
        scene.circle = this.scene.add.graphics();
        scene.circle.fillStyle(circle_color, 1);
        scene.circle.fillCircle(90, 70, 50);

        // Player 2
        scene.circle.fillStyle(circle_color, 1);
        scene.circle.fillCircle(90, 210, 50);

        // Player 3
        scene.circle.fillStyle(circle_color, 1);
        scene.circle.fillCircle(90, 350, 50);

        // Player 4
        scene.circle.fillStyle(circle_color, 1);
        scene.circle.fillCircle(90, 490, 50);

        // Get room data from server
        socket.emit("getRooms", {});

        // Create player names and sprites
        socket.on("getRooms", (data) => {
            var rooms = Object.values(data);

            // get list of players
            for (var i = 0; i < rooms.length; i++) {
                if (rooms[i].roomKey == this.roomkey) {
                    this.roomList.push(rooms[i]);
                }
            }
            let players = this.roomList[0].players;

            // Destroy prevoius players before adding new ones
            if (scene.currentPlayer) {
                scene.currentPlayer.destroy();
                scene.playerNames.destroy();
            }

            if (scene.otherPlayers) {
                scene.otherPlayers.destroy();
                scene.playerNames.destroy();
                increment = 0;
            }

            // Create sprites and names
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === scene.socket.id) {
                    // Add current player
                    var circle = scene.circle.fillStyle(0xffffff, 1);
                    circle.fillCircle(90, 70, 50);
                    scene.currentPlayer = scene.add
                        .sprite(90, 70, "player" + players[id].playerNum)
                        .setScale(0.7);
                    scene.playerNames = scene.add.text(
                        90,
                        137,
                        players[id].playerName,
                        {
                            fontSize: "18px",
                            color: "#000000",
                            fontFamily: "Black Ops One",
                        }
                    );
                    scene.playerNames.setOrigin(0.5);
                    scene.playerNames.setWordWrapWidth(150, true);
                    scene.playerNames.setAlign("center");
                    scene.playerNames.setDepth(1);
                    scene.currentPlayer.setDepth(1);
                } else {
                    // Add other players
                    scene.otherPlayers = scene.add
                        .sprite(
                            90,
                            210 + increment,
                            "player" + players[id].playerNum
                        )
                        .setScale(0.6);
                    scene.playerNames = scene.add.text(
                        90,
                        210 + increment + 67,
                        players[id].playerName,
                        {
                            fontSize: "18px",
                            color: "#000000",
                            fontFamily: "Black Ops One",
                        }
                    );
                    scene.playerNames.setOrigin(0.5);
                    scene.playerNames.setWordWrapWidth(150, true);
                    scene.playerNames.setAlign("center");
                    scene.playerNames.setDepth(1);
                    scene.otherPlayers.setDepth(1);
                    increment += 140;
                }
            });
        });
    }
}

export default Sidebar;
