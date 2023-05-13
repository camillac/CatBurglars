// CreateLobbyScene, JoinLobbyScene and LobbyScene both use this Among Us Tutorial as a reference:
// ** github.com/hannahrobot/amongus-tutorial

export default class CreateLobbyScene extends Phaser.Scene {
    constructor() {
        super("CreateLobbyScene");
        this.state = {};
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
            this.load.html("createform", "client/assets/text/createform.html")
        );

        this.load.image(
            "background_createlobby",
            "client/assets/sprites/Sky.png"
        );
        this.load.image("big_clouds", "client/assets/sprites/big_clouds.png");
        this.load.image(
            "Clouds_small",
            "client/assets/sprites/clouds-white-small.png"
        );
        this.load.image(
            "House_JoinLobby",
            "client/assets/sprites/House_No Backgroung.png"
        );
    }

    create() {
        var add = this.add;
        const scene = this;

        scene.roomKey = "";

        // START THE SOCKET CONNECTION
        this.socket = io();

        const background = this.add.image(400, 300, "background_createlobby");
        background.setScale(4.0);

        var Clouds_bg1 = this.add.tileSprite(
            400,
            470,
            800,
            1000,
            "Clouds_small"
        );
        var Clouds_bg2 = this.add.tileSprite(400, 470, 800, 1000, "big_clouds");

        //-------- CLOUD EFFECT
        scene.tweens.add({
            targets: Clouds_bg1,
            tilePositionX: { from: 0, to: 180 },
            ease: "linear",
            duration: 8000,
            repeat: -1, //Infinity Times
            yoyo: false, // @False Does not go Back and Forth
        });
        scene.tweens.add({
            targets: Clouds_bg2,
            tilePositionX: { from: 0, to: 180 },
            ease: "linear",
            duration: 8000,
            repeat: -1, //Infinity Times
            yoyo: false,
        });
        // --------------- END OF CLOUDS EFFECT------------------

        // --------------- HOUSE---------------------
        const house = scene.add.image("400", "300", "House_JoinLobby");
        house.setScale(4);
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
                    strokeThickness: 8,
                });

                // Back button
                const backButton = add
                    .text(60, 25, "Back", {
                        fontFamily: "Black Ops One",
                        fontSize: 25,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
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

                // Create a room
                scene.inputElement = scene.add
                    .dom(400, 440)
                    .createFromCache("createform");
                scene.inputElement.addListener("click");
                scene.inputElement.on("click", function (event) {
                    if (event.target.name === "createRoom") {
                        const name =
                            scene.inputElement.getChildByName("name-form");
                        scene.socket.emit("getRoomCode", name.value);
                        scene.socket.on(
                            "roomCreated",
                            function (roomKey, name) {
                                scene.scene.start("LobbyScene", {
                                    ...scene.state,
                                    socket: scene.socket,
                                    roomKey: roomKey,
                                    playerName: name,
                                });
                            }
                        );
                    }
                });
            },
        });
    }

    upload() {}
}
