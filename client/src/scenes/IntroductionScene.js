export default class IntroductionScene extends Phaser.Scene {
    constructor() {
        super("IntroductionScene");
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
        this.load.image("Leaf_1", "client/assets/sprites/Leaf.png");
        this.load.image("Leaf_2", "client/assets/sprites/leaf2.png");
        this.load.image("Grass", "client/assets/sprites/grass.png");
        
        // Load background
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
        const background = this.add.image(400, 300, "House");
        background.setScale(4.0);

        // House 
        var House = this.add
            .image(400, 300, "House_no_background")
            .setScale(4);
        this.tweens.add({
            targets: House,
            y: 10,
            scale:9,
            ease: "Cubic.easeIn",
            duration: 3500,
            onComplete: () => {
                House.destroy();
                scene.scene.start("FirstTask_Instruction", {
                    ...scene.state,
                    socket: scene.socket,
                    roomKey: this.roomKey,
                    playerName: this.playerName,
                    playerInfo: this.playerInfo,
                    playerNum: this.playerNum,
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
