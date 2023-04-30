export default class JoinLobbyScene extends Phaser.Scene {
    constructor() {
        super("JoinLobbyScene");
        this.state = {};
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
            this.load.html("codeform", "client/assets/text/codeform.html"),
            this.load.html("joinRoomForm", "client/assets/text/joinRoomForm.html")
        );

        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );

        this.load.image("icon", "client/assets/sprites/cat.png");
        this.load.image("player1", "client/assets/sprites/player1.png");
        this.load.image("player2", "client/assets/sprites/player2.png");
        this.load.image("player3", "client/assets/sprites/player3.png");
        this.load.image("player4", "client/assets/sprites/player4.png");
        this.load.image("crate1", "client/assets/sprites/crate1.png");
        this.load.image("crate2", "client/assets/sprites/crate2.png");
        this.load.image("crate3", "client/assets/sprites/crate3.png");
        this.load.image("crate4", "client/assets/sprites/crate4.png");
        this.load.image("crate5", "client/assets/sprites/crate5.png");

    }

    create() {
        var add = this.add;
        const scene = this;
        scene.roomKey = "";
        this.socket = io();

        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        WebFont.load({
            google: {
                families: ["Chela One"],
            },
            active: function () {
                // Title
                add.text(125, 110, "Cat", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#F8F0C6",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(250, 110, "Burglars", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#C1A87D",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(565, 110, ".io", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#EEBA6B",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });

                // Back button
                const backButton = add
                    .text(50, 30, "Back", {
                        fontFamily: "Chela One",
                        fontSize: 20,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 12,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);
                scene.notValidText = scene.add
                    .text(400, 300, "", {
                        fill: "#ff0000",
                        fontSize: "35px",
                        fontFamily: "Chela One",
                        fontStyle: "normal",
                        strokeThickness: 12,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);
                backButton.setInteractive();

                // Back button events
                backButton.on("pointerover", () => {
                    backButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                backButton.on("pointerout", () => {
                    backButton.setStyle({
                        color: "#FFFBF4",
                    });
                });
                backButton.on("pointerup", () => {
                    backButton.destroy();

                    scene.scene.start("PlayScene", {
                        ...scene.state,
                        socket: scene.socket,
                    });
                });

                scene.circle = scene.add.graphics();


                // JOIN A ROOM
                scene.inputElement = scene.add.dom(400, 370).createFromCache("joinRoomForm");
                scene.inputElement.addListener("click");
                scene.inputElement.on("click", function (event) {
                    if (event.target.name === "showRoom" && scene.inputElement.getChildByName("name-form").value.length !== 0) {
                        const name = scene.inputElement.getChildByName("name-form");
                        scene.inputElement.removeListener("click");
                        scene.inputElement.setVisible(false);
                        scene.notValidText.setText("");
                        console.log(name.value);
                        scene.socket.emit("getRooms", {});

                        scene.socket.on("getRooms", (data) => {
                            console.log(data);
                            var rooms = Object.values(data);
                            var roomList = [];
                            var playerList = [];
                            var roomKeyList = [];

                            for (var i = 0; i < rooms.length; i++) {
                                roomList.push(rooms[i]);
                            }
                            console.log(roomList);

                            for (var i = 0; i < roomList.length; i++) {
                                var room = roomList[i];
                                // console.log(room.roomKey,Object.values(room.players)[0].playerId,room.numPlayers);
                                playerList.push(Object.values(room.players));
                                console.log(room.roomKey, Object.values(room.players), room.numPlayers);
                            }
                            console.log(playerList);


                            var x = 125;
                            var y = 370;
                            var counter = 0;
                            var increment = 0;
                            var yIncrement = 300;
                            var nextPage = false;
                            var roomSprites = [];
                            var roomSpritesCircles = [];
                            var roomSpritesText = [];

                            for (var i = 0; i < roomList.length; i++) {
                                if (counter == 4) {
                                    counter = 0;
                                }
                                let room = roomList[i];
                                var roomKey = room.roomKey;
                                roomKeyList.push(roomKey);
                                var numPlayers = room.numPlayers;

                                console.log(roomKey, room.players, numPlayers);

                                var circle = scene.circle.fillStyle(0xffffff, 1);
                                circle.fillCircle(125 * (increment + 1) + 175 * (1 - 1), yIncrement, 50);
                                roomSpritesCircles.push(circle);
                                // console.log(i);
                                var mycats = scene.add.sprite(
                                    300 * (i + 1),
                                    300,
                                    `crate` + (counter + 1)
                                );
                                counter++;
                                mycats
                                    .setScale(0.6)
                                    .setPosition(125 * (increment + 1) + 175 * (1 - 1), yIncrement);
                                console.log(mycats.texture.key);
                                mycats.setInteractive();
                                roomSprites.push(mycats);
                                increment++;
                                var roomText = scene.add
                                    .text(x, y, roomKey, {
                                        fontFamily: "Chela One",
                                        fontSize: 20,
                                        color: "#FFFBF4",
                                        fontStyle: "normal",
                                        stroke: "#000000",
                                        strokeThickness: 12,
                                    })
                                    .setOrigin(0.5)
                                    .setPadding(10, 10, 10, 10);
                                roomSpritesText.push(roomText);
                                // roomText.setInteractive();
                                mycats.on("pointerover", () => {
                                    roomText.setStyle({
                                        color: "#FFEBB9",
                                    });
                                });
                                mycats.on("pointerout", () => {
                                    roomText.setStyle({
                                        color: "#FFFBF4",
                                    });
                                });
                                mycats.on("pointerdown", ((index) => {
                                    // Return a new arrow function that uses the captured index value
                                    return () => {
                                        console.log(`Sprite clicked at index ${index}`);
                                        scene.scene.start("LobbyScene", {
                                            ...scene.state,
                                            socket: scene.socket,
                                            roomKey: roomKeyList[index],
                                            playerName: name.value,
                                        });
                                    };
                                })(i));

                                if (x > 600) {
                                    console.log("here");
                                    x = 125;
                                    increment = 0;
                                    yIncrement += 170;
                                    y += 170;
                                }
                                else if (x < 600) {
                                    x += 125;
                                }
                                if (y > 560) {
                                    console.log("here");
                                    nextPage = true;
                                    break;
                                }
                            }
                            if (nextPage) {
                                const nextPageButton = scene.add
                                    .text(400, 580, "Next Page", {
                                        fontFamily: "Chela One",
                                        fontSize: 20,
                                        color: "#FFFBF4",
                                        fontStyle: "normal",
                                        stroke: "#000000",
                                        strokeThickness: 12,
                                    })
                                    .setOrigin(0.5)
                                    .setPadding(10, 10, 10, 10);
                                nextPageButton.setInteractive();
                                nextPageButton.on("pointerover", () => {
                                    nextPageButton.setStyle({
                                        color: "#FFEBB9",
                                    });
                                });
                                nextPageButton.on("pointerout", () => {
                                    nextPageButton.setStyle({
                                        color: "#FFFBF4",
                                    });
                                });
                                nextPageButton.on("pointerup", () => {
                                    // show remaining rooms
                                    nextPageButton.destroy();
                                    for (var i = 0; i < roomSprites.length; i++) {
                                        roomSprites[i].destroy();
                                        // roomSpritesCircles[i].destroy();
                                        roomSpritesText[i].destroy();
                                    }
                                    var x = 125;
                                    var y = 370;
                                    var counter = 0;
                                    var increment = 0;
                                    var yIncrement = 300;
                                    var backPage = false;

                                    for (var i = 4; i < roomList.length; i++) {
                                        if (counter == 4) {
                                            counter = 0;
                                        }
                                        let room = roomList[i];
                                        var roomKey = room.roomKey;
                                        roomKeyList.push(roomKey);
                                        var numPlayers = room.numPlayers;

                                        console.log(roomKey, room.players, numPlayers);

                                        var circle = scene.circle.fillStyle(0xffffff, 1);
                                        circle.fillCircle(125 * (increment + 1) + 175 * (1 - 1), yIncrement, 50);
                                        // console.log(i);
                                        var mycats = scene.add.sprite(
                                            300 * (i + 1),
                                            300,
                                            `player` + (counter + 1)
                                        );
                                        counter++;
                                        mycats
                                            .setScale(0.6)
                                            .setPosition(125 * (increment + 1) + 175 * (1 - 1), yIncrement);
                                        console.log(mycats.texture.key);
                                        mycats.setInteractive();
                                        increment++;
                                        var roomText = scene.add
                                            .text(x, y, roomKey, {
                                                fontFamily: "Chela One",
                                                fontSize: 20,
                                                color: "#FFFBF4",
                                                fontStyle: "normal",
                                                stroke: "#000000",
                                                strokeThickness: 12,
                                            })
                                            .setOrigin(0.5)
                                            .setPadding(10, 10, 10, 10);
                                        // roomText.setInteractive();
                                        mycats.on("pointerover", () => {
                                            roomText.setStyle({
                                                color: "#FFEBB9",
                                            });
                                        });
                                        mycats.on("pointerout", () => {
                                            roomText.setStyle({
                                                color: "#FFFBF4",
                                            });
                                        });
                                        mycats.on("pointerdown", ((index) => {
                                            // Return a new arrow function that uses the captured index value
                                            return () => {
                                                console.log(`Sprite clicked at index ${index}`);
                                                scene.scene.start("LobbyScene", {
                                                    ...scene.state,
                                                    socket: scene.socket,
                                                    roomKey: roomKeyList[index],
                                                    playerName: name.value,
                                                });
                                            };
                                        })(i));

                                        if (x > 600) {
                                            console.log("here");
                                            x = 125;
                                            increment = 0;
                                            yIncrement += 170;
                                            y += 170;
                                        }
                                        else if (x < 600) {
                                            x += 125;
                                        }
                                        if (y > 560) {
                                            console.log("here");
                                            backPage = true;
                                            break;
                                        }
                                    }
                                    if (backPage) {
                                        const backPageButton = scene.add
                                            .text(400, 580, "Back Page", {
                                                fontFamily: "Chela One",
                                                fontSize: 20,
                                                color: "#FFFBF4",
                                                fontStyle: "normal",
                                                stroke: "#000000",
                                                strokeThickness: 12,
                                            })
                                            .setOrigin(0.5)
                                            .setPadding(10, 10, 10, 10);
                                        backPageButton.setInteractive();
                                        backPageButton.on("pointerover", () => {
                                            backPageButton.setStyle({
                                                color: "#FFEBB9",
                                            });
                                        });
                                        backPageButton.on("pointerout", () => {
                                            backPageButton.setStyle({
                                                color: "#FFFBF4",
                                            });
                                        });
                                        backPageButton.on("pointerup", () => {
                                            // show remaining rooms
                                            backPageButton.destroy();
                                            for (var i = 0; i < roomSprites.length; i++) {
                                                roomSprites[i].destroy();
                                                // roomSpritesCircles[i].destroy();
                                                roomSpritesText[i].destroy();
                                            }
                                            var x = 125;
                                            var y = 370;
                                            var counter = 0;
                                            var increment = 0;
                                            var yIncrement = 300;
                                            var backPage = false;

                                            for (var i = 0; i < roomList.length; i++) {
                                                if (counter == 4) {
                                                    counter = 0;
                                                }
                                                let room = roomList[i];
                                                var roomKey = room.roomKey;
                                                roomKeyList.push(roomKey);
                                                var numPlayers = room.numPlayers;

                                                console.log(roomKey, room.players, numPlayers);

                                                var circle = scene.circle.fillStyle(0xffffff, 1);
                                                circle.fillCircle(125 * (increment + 1) + 175 * (1 - 1), yIncrement, 50);
                                                // console.log(i);
                                                var mycats = scene.add.sprite(
                                                    300 * (i + 1),
                                                    300,
                                                    `player` + (counter + 1)
                                                );
                                                counter++;
                                                mycats
                                                    .setScale(0.6)
                                                    .setPosition(125 * (increment + 1) + 175 * (1 - 1), yIncrement);
                                                console.log(mycats.texture.key);
                                                mycats.setInteractive();
                                                increment++;
                                                room = scene.add
                                                    .text(x, y, roomKey, {
                                                        fontFamily: "Chela One",
                                                        fontSize: 20,
                                                        color: "#FFFBF4",
                                                        fontStyle: "normal",
                                                        stroke: "#000000",
                                                        strokeThickness: 12,
                                                    })
                                                    .setOrigin(0.5)
                                                    .setPadding(10, 10, 10, 10);
                                                // roomText.setInteractive();
                                                mycats.on("pointerover", () => {
                                                    room.setStyle({
                                                        color: "#FFEBB9",
                                                    });
                                                }
                                                );
                                                mycats.on("pointerout", () => {
                                                    room.setStyle({
                                                        color: "#FFFBF4",
                                                    });
                                                }
                                                );
                                                mycats.on("pointerdown", ((index) => {
                                                    // Return a new arrow function that uses the captured index value
                                                    return () => {
                                                        console.log(`Sprite clicked at index ${index}`);
                                                        scene.scene.start("LobbyScene", {
                                                            ...scene.state,
                                                            socket: scene.socket,
                                                            roomKey: roomKeyList[index],
                                                            playerName: name.value,
                                                        });
                                                    };
                                                }
                                                )(i));

                                                if (x > 600) {
                                                    console.log("here");
                                                    x = 125;
                                                    increment = 0;
                                                    yIncrement += 170;
                                                    y += 170;
                                                }
                                                else if (x < 600) {
                                                    x += 125;
                                                }
                                                if (y > 560) {
                                                    console.log("here");
                                                    backPage = true;
                                                    break;
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        scene.notValidText.setText("Please enter a username").setPosition(400, 470);
                    }
                });
            },
        });
    }

    upload() { }
}
