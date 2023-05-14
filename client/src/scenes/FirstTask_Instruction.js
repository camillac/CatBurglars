export default class FirstTask_Instruction extends Phaser.Scene {
    constructor() {
        super("FirstTask_Instruction");
        this.state = {};
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerName = data.playerName;
        this.playerInfo = data.playerInfo;
        this.playerNum = data.playerNum;
    }

    preload() {
        this.load.image("House", "client/assets/sprites/House.png"); //Need to Update this
        this.load.image("Sky", "client/assets/sprites/Sky.png");
        this.load.image("settings", "client/assets/sprites/settings_icon.png");
        this.load.image("Door", "client/assets/sprites/oor.png");
        this.load.image("big_clouds", "client/assets/sprites/big_clouds.png");
        this.load.image(
            "Clouds_small",
            "client/assets/sprites/clouds-white-small.png"
        );
    }

    create() {
        const scene = this;

        // Set up background
        const background = this.add.image(400, 300, "Background");
        background.setScale(2);

        var sky = this.add.image(400, 350, "Sky");
        sky.setScale(4.0);

        // Clouds
        var Clouds_bg1 = this.add.tileSprite(
            400,
            470,
            800,
            1000,
            "Clouds_small"
        );
        var Clouds_bg2 = this.add.tileSprite(400, 470, 800, 1000, "big_clouds");

        scene.tweens.add({
            targets: Clouds_bg1,
            tilePositionX: { from: 0, to: 180 },
            ease: "linear",
            duration: 8000,
            repeat: -1, //Infinity Times
            yoyo: (true, 2000),
        });
        scene.tweens.add({
            targets: Clouds_bg2,
            tilePositionX: { from: 0, to: 180 },
            ease: "linear",
            duration: 8000,
            repeat: -1, //Infinity Times
            yoyo: false,
        });

        // Fade in Effect for the Instruction
        this.cameras.main.fadeIn(5000, 0, 0, 0, instructions);
        var instructions = scene.add
            .text(
                400,
                300,
                "Communicate with your \n team and insert the \ncorrect keys in order \nto break into the house!",
                {
                    fontFamily: "Black Ops One",
                    fontSize: 60,
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5);

        // destroy instructions when finished
        function destroyInstructions() {
            instructions.destroy();
        }

        this.time.addEvent({
            delay: 6000,
            callback: destroyInstructions,
            callbackScope: this,
        });
        this.time.addEvent({
            delay: 6000,
            callback: playerInstruction,
            callbackScope: this,
        });

        // Showing player instructions
        function playerInstruction() {
            // If you are player 1
            if (this.playerInfo[scene.socket.id].playerNum === 1) {
                this.cameras.main.fadeOut(5000, 0, 0, 0);
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    (cam, effect) => {
                        scene.scene.start("FirstTask", {
                            ...scene.state,
                            socket: scene.socket,
                            roomKey: this.roomKey,
                            playerName: this.playerName,
                            playerNum: this.playerNum,
                            start: scene.socket.id,
                        });
                    }
                );
                var playerInfo = scene.add
                    .text(
                        400,
                        300,
                        `You are Player 1.\nCommunicate with your \n team to figure out the \n correct three keys.`,
                        {
                            fontFamily: "Black Ops One",
                            fontSize: 60,
                            color: "#000000",
                            align: "center",
                        }
                    )
                    .setOrigin(0.5);
            } else {
                // All other players
                this.cameras.main.fadeOut(5000, 0, 0, 0);
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    (cam, effect) => {
                        scene.scene.start("FirstTask", {
                            ...scene.state,
                            socket: scene.socket,
                            roomKey: this.roomKey,
                            playerName: this.playerName,
                            playerNum: this.playerNum,
                            start: "",
                        });
                    }
                );

                otherPlayerInstruction(
                    this.playerInfo[scene.socket.id].playerNum
                );
            }

            // If you are not player 1, show different instruction
            function otherPlayerInstruction(
                playerNum,
                playerOneUsername = "Player 1"
            ) {
                //Fade out after the Instruction
                var playerInfo = scene.add
                    .text(
                        400,
                        300,
                        `You are Player ${playerNum}.\nDescribe your key to\n${playerOneUsername}.`,
                        {
                            fontFamily: "Black Ops One",
                            fontSize: 60,
                            color: "#000000",
                            align: "center",
                        }
                    )
                    .setOrigin(0.5);
            }
        }
    }

    update() {}
}
