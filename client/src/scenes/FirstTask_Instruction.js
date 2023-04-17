export default class FirstTask_Instruction extends Phaser.Scene {
    constructor() {
        super("FirstTask_Instruction");
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerNum = data.playerNum;
        console.log(this.socket.id);
        this.players = data.players;
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
        const background = this.add.image(400, 300, "Background");
        background.setScale(2);
        //background.setScale(1);
        // const scroll = this.add.image(400,300,"Scroll");
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

        // i commented this out just b/c we need to factor in the second instruction scene before the fade
        // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) =>
        // {  this.cameras.main.fadeOut(10000,0,0,0);
        // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        //     this.scene.start('FirstTask');
        // });
        // });

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

        function playerInstruction() {
            if (this.playerInfo[scene.socket.id].playerNum === 1) {
                this.cameras.main.fadeOut(5000, 0, 0, 0);
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    (cam, effect) => {
                        console.log(scene.socket.id);
                        scene.scene.start("FirstTask", {
                            ...scene.state,
                            socket: scene.socket,
                            roomKey: this.roomKey,
                            start: scene.socket.id
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
                this.cameras.main.fadeOut(7000, 0, 0, 0);
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    (cam, effect) => {
                        scene.scene.start("FirstTask", {
                            ...scene.state,
                            socket: scene.socket,
                            roomKey: this.roomKey,
                            start: ""
                        });
                    }
                );

                otherPlayerInstruction(this.playerInfo[scene.socket.id].playerNum);
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
