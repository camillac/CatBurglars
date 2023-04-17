export default class CreateLobbyScene extends Phaser.Scene {
    constructor() {
        super("CreateLobbyScene");
        this.state = {};
        this.hasBeenSet = false;
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
            this.load.html("nameform", "client/assets/text/nameform.html")
        );

        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
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

                // Create a room
                scene.inputElement = scene.add.dom(400, 440).createFromCache("nameform");
                scene.inputElement.addListener("click");
                scene.inputElement.on("click", function (event) {
                    if (event.target.name === "createRoom") {
                        const name = scene.inputElement.getChildByName("name-form");
                        console.log(name.value);
                        scene.socket.emit("getRoomCode", name.value);
                        scene.socket.on("roomCreated", function (roomKey, name) {
                            scene.scene.start("LobbyScene", {
                                ...scene.state,
                                socket: scene.socket,
                                roomKey: roomKey,
                                playerName: name
                            });
                        });
                    }
                });
            },
        });
    }

    upload() { }
}