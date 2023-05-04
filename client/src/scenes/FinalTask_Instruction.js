export default class FinalTask_Instruction extends Phaser.Scene {
    constructor() {
        super("FinalTask_Instruction");
        this.state = {};
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerName = data.playerName;
        this.playerInfo = data.playerInfo;
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
        
        //Fade in Effect for the Instruction
        this.cameras.main.fadeIn(5000, 0, 0, 0, instructions);
        var instructions = scene.add
            .text(
                400,
                300,
                "Congratulations!\nYou have made it to the\nfinal task.",
                {
                    fontFamily: "Chela One",
                    fontSize: 60,
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5);

        
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
                        scene.scene.start("FinalTask", {
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
                        `You are Player 1.\nCommunicate with your team\nto figure out the correct\nthree keys in the\ncorrect order!`,
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
                        scene.scene.start("FinalTask", {
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
                playerNum,
                playerOneUsername = "Player 1"
            ) {
                //Fade out after the Instruction
                // playerOneUsername is not used for now, will implement when we merge with the username branch
                var playerInfo = scene.add
                    .text(
                        400,
                        300,
                        `You are Player ${playerNum}.\nDescribe your key to\n${playerOneUsername}\nand pay attention to which\nnumber your key is!`,
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