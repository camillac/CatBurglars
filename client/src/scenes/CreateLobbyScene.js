export default class CreateLobbyScene extends Phaser.Scene {
    constructor() {
        super("CreateLobbyScene");
        this.state = {};
        this.hasBeenSet = false;
    }
    
    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
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
                
                // Create lobby button
                const createButton = add
                    .text(400, 325, "Create A Room", {
                        fontFamily: "Chela One",
                        fontSize: 50,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 12,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);

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
                scene.notValidText = scene.add.text(400, 500, "", {
                    fill: "#ff0000",
                    fontSize: "35px",
                    fontFamily: "Chela One",
                    fontStyle: "normal",
                    strokeThickness: 12,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);;
                createButton.setInteractive();
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

                // Create lobby button events
                createButton.on("pointerover", () => {
                    createButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                createButton.on("pointerout", () => {
                    createButton.setStyle({
                        color: "#FFFBF4",
                    });
                });
                createButton.on("pointerup", () => {
                    scene.socket.emit("getRoomCode");

                    scene.socket.on("roomCreated", function (roomKey) {
                        scene.socket.emit("isKeyValid", roomKey);

                        scene.socket.on("keyNotValid", function () {
                            scene.notValidText.setText("Invalid Room Key");
                        });

                        scene.socket.on("keyIsValid", function (input) {
                            
                            scene.scene.start("LobbyScene", {
                                ...scene.state,
                                socket: scene.socket,
                                roomKey: roomKey,
                            });
                        });
                    });
                });
            },
        });
    }

    upload() {}
}