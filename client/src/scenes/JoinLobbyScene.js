export default class JoinLobbyScene extends Phaser.Scene {
    constructor() {
        super("JoinLobbyScene");
        this.state = {};
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
            this.load.html("codeform", "client/assets/text/codeform.html")
        );

        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );

        this.load.image("Button", "client/assets/sprites/Button.png");
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
                families: ["Black Ops One"],
            },
            active: function () {
                // Title
                add.text(15, 110, "Cat", {
                    fontFamily: "Black Ops One",
                    fontSize: 95,
                    color: "#f1c582",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
                add.text(185, 110, "Burglars", {
                    fontFamily: "Black Ops One",
                    fontSize: 95,
                    color: "#f1c582",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
                add.text(655, 110, ".io", {
                    fontFamily: "Black Ops One",
                    fontSize: 95,
                    color: "#f1c582",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 9,
                });
        
                // Back button
                  
                const backButton = add.text(60, 25, "Back", {
                        fontFamily: "Black Ops One",
                        fontSize: 25,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 8,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);
        
                scene.notValidText = scene.add
                    .text(400, 300, "", {
                        fill: "#ff0000",
                        fontSize: "35px",
                        fontFamily: "Black Ops One",
                        fontStyle: "normal",
                        strokeThickness: 8,
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

                // Join a room
                scene.inputElement = scene.add
                    .dom(400, 450)
                    .createFromCache("codeform");
                scene.inputElement.addListener("click");
                scene.inputElement.on("click", function (event) {
                    if (event.target.name === "enterRoom") {
                        const name =
                            scene.inputElement.getChildByName("name-form");
                        const code =
                            scene.inputElement.getChildByName("code-form");
                        scene.socket.emit("isKeyValid", code.value, name.value);
                    }
                    scene.socket.on("keyNotValid", function () {
                        scene.notValidText.setText("Invalid Room Key");
                    });
                    scene.socket.on("keyIsValid", function (code, name) {
                        scene.scene.start("LobbyScene", {
                            ...scene.state,
                            socket: scene.socket,
                            roomKey: code,
                            playerName: name,
                        });
                    });
                });
            },
        });
    }

    upload() { }
}
