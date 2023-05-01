export default class FirstTask_Instruction extends Phaser.Scene {
    constructor() {
        super("FirstTask_Instruction");
        this.state = {};
    }
    init(data) {
        this.data = data;
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerName = data.playerName;
        this.playerInfo = data.playerInfo;
        this.hostPlayer = data.hostPlayer;
    }

    preload() {
        this.load.image("Scroll", "client/assets/sprites/scroll.png");
        this.load.image(
            "Background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        const scene = this;
        // background
        const background = this.add.image(400, 300, "Background");
        background.setScale(2);
        var sky = this.add.image(400, 350, "Sky");
        sky.setScale(4.0);

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

        //Fade in Effect for the Instruction
        this.cameras.main.fadeIn(5000, 0, 0, 0, instructions);
        var instructions = scene.add
            .text(
                400,
                300,
                "Communicate with your team and\ninsert the keys in the correct order\nto break into the house!",
                {
                    fontFamily: "Chela One",
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
            // if you are player 1
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
                            start: scene.socket.id,
                        });
                    }
                );
                var playerInfo = scene.add
                    .text(
                        400,
                        300,
                        `You are Player 1.\nCommunicate with your team\nto figure out the correct\nthree keys!`,
                        {
                            fontFamily: "Chela One",
                            fontSize: 60,
                            color: "#000000",
                            align: "center",
                        }
                    )
                    .setOrigin(0.5);
            } else {
                this.cameras.main.fadeOut(5000, 0, 0, 0);
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    (cam, effect) => {
                        scene.scene.start("FirstTask", {
                            ...scene.state,
                            socket: scene.socket,
                            roomKey: this.roomKey,
                            playerName: this.playerName,
                            start: "",
                        });
                    }
                );

                otherPlayerInstruction(
                    this.playerInfo[scene.socket.id].playerNum
                );
            }

            function otherPlayerInstruction(
                playerNum
            ) {
                //Fade out after the Instruction
                // playerOneUsername is not used for now, will implement when we merge with the username branch
                var playerInfo = scene.add
                    .text(
                        400,
                        300,
                        `You are Player ${playerNum}.\nDescribe your key to\n${scene.hostPlayer}\nand pay attention to which\nnumber your key is!`,
                        {
                            fontFamily: "Chela One",
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
