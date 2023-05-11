export default class JoinLobbyScene extends Phaser.Scene {
    constructor() {
        super("JoinLobbyScene");
        this.state = {};
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
            this.load.html("joinform", "client/assets/text/joinform.html")
        );

        this.load.image(
            "Sky_1",
            "client/assets/sprites/Sky.png"
        );

        this.load.image("Button", "client/assets/sprites/Button.png");
        this.load.image("big_clouds", "client/assets/sprites/big_clouds.png");
        this.load.image(
            "Clouds_small",
            "client/assets/sprites/clouds-white-small.png"
        );
        this.load.image("House_JoinLobby", "client/assets/sprites/House_No Backgroung.png");
    }

    create() {
        var add = this.add;
        const scene = this;

        scene.roomKey = "";

        // START THE SOCKET CONNECTION
        this.socket = io();
        
        //----- SKY BACKGROUND 
        const background = this.add.image(400, 300, "Sky_1");
        background.setScale(4.0);
        var Clouds_bg1 = this.add.tileSprite(
            400,
            470,
            800,
            1000,
            "Clouds_small"
        );
        
        //-------- CLOUD EFFECT
        var Clouds_bg2 = this.add.tileSprite(400, 470, 800, 1000, "big_clouds");
        scene.tweens.add({
            targets: Clouds_bg1,
            tilePositionX: { from: 0, to: 180 },
            ease: "linear",
            duration: 8000,
            repeat: -1, //Infinity Times
            yoyo:false, // @False Does not go Back and Forth
        });
        scene.tweens.add({
            targets: Clouds_bg2,
            tilePositionX: { from: 0, to: 180 },
            ease: "linear",
            duration: 8000,
            repeat: -1, //Infinity Times
            yoyo: false,
        });
        
        const house = scene.add.image("400","300","House_JoinLobby");
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
                    
                //KEY NOT VALID
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
                    .createFromCache("joinform");
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
                        scene.socket.emit("isRoomFull", code);
                        scene.socket.on("roomIsFull", function () {
                            scene.notValidText.setText("This Room is Full!");
                        });
                        scene.socket.on("roomNotFull", function () {
                            scene.scene.start("LobbyScene", {
                                ...scene.state,
                                socket: scene.socket,
                                roomKey: code,
                                playerName: name,
                            });
                        });
                    });
                });
            },
        });
    }

    upload() { }
}
