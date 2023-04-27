export default class FirstTask_Instruction extends Phaser.Scene {
    constructor() {
        super("FirstTask_Instruction");
        this.state = {};
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
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
        this.cameras.main.fadeIn(1000, 0, 0, 0, instructions);
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

        // destroy instructions when finished 

        // Showing player instructions 

        this.socket.on("displayT1P1Instructions", function() {
            instructions.destroy();
            scene.cameras.main.fadeOut(5000, 0, 0, 0);
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
            scene.socket.on("renderTaskOne", function(roomKey) {
                scene.scene.start("FirstTask", {
                    ...scene.state,
                    socket: scene.socket,
                    roomKey: roomKey,
                    start: scene.socket.id
                });
            });
        });

        this.socket.on("displayT1POInstructions", function(playerNum) {
            instructions.destroy();
            const playerOneUsername = "Player 1";
            scene.cameras.main.fadeOut(7000, 0, 0, 0);
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
            scene.socket.on("renderTaskOne", function(roomKey) {
                scene.scene.start("FirstTask", {
                    ...scene.state,
                    socket: scene.socket,
                    roomKey: roomKey,
                    start: ""
                });
            });
        });

        }
    
    update() { }
}
