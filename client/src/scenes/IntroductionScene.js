export default class IntroductionScene extends Phaser.Scene {
    constructor() {
        super("IntroductionScene");
        this.state = {};
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerInfo = data.playerInfo;
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
        this.load.image("Leaf_1", "client/assets/sprites/Leaf.png");
        this.load.image("Leaf_2", "client/assets/sprites/leaf2.png");
        this.load.image("Grass", "client/assets/sprites/grass.png");
        //load background
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        //-------------------------- Add Background-----------------------------

        const scene = this;
        this.cameras.main.fadeIn(1000, 0, 0, 0);

       
        var sky = this.add.image(400, 300, "Sky");
        sky.setScale(4.0);
    
        //---------------------------- Moving Clouds--------------------------------
        var Clouds_bg1 = this.add.tileSprite(
            400,
            100,
            800,
            600,
            "Clouds_small"
        );

        //MOVING CLOUDS
        var Clouds_bg2 = this.add.tileSprite(400, 100, 800, 600, "big_clouds");
        scene.tweens.add({
            targets: Clouds_bg1,
            tilePositionX: { from: 0, to: 180 },
            ease: "linear",
            duration: 8000,
            repeat: -1,
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
       
        //----------------------- House with Zoom In effect-----------------------
        // House 

        const background = this.add.image(400, 300, "House");
        background.setScale(4.0);

        var House = this.add
            .image(450, 300, "House")
            .setOrigin(0.5)
            .setScale(0.5);
        this.tweens.add({
            targets: House,
            scaleX: 4,
            scaleY: 4,
            ease: "Cubic.easeIn",
            duration: 4000,
            onComplete: () => {
                House.destroy();
                scene.scene.start("FirstTask_Instruction", {
                    ...scene.state,
                    socket: scene.socket,
                    roomKey: this.roomKey,
                    playerInfo: this.playerInfo
                });
            },
        });
    }

    upload() {
        //Cloud Effect
        Clouds_bg1.tilePositionX += 0.9;
        Clouds_bg2.tilePositionX += 0.25;
    }
}
