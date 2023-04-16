export default class IntroductionScene extends Phaser.Scene {
    constructor() {
        super("IntroductionScene");
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerNum = data.playerNum;
        console.log(this.socket.id);
        this.players = data.players;
        this.start = data.start
    }
    preload() {
        //load cats/players
        // this.load.image('Player_1','client/assets/sprites/player1.png');
        // this.load.image('Player_2','client/assets/sprites/player2.png');
        // this.load.image('Player_3','client/assets/sprites/player3.png');
        // this.load.image('Player_4','client/assets/sprites/player4.png');
        this.load.image("House", "client/assets/sprites/House_1.png"); //Need to Update this
        this.load.image("Sky", "client/assets/sprites/Sky.png");
        this.load.image("settings", "client/assets/sprites/settings_icon.png");
        this.load.image("Door", "client/assets/sprites/oor.png");
        this.load.image("big_clouds", "client/assets/sprites/big_clouds.png");
        this.load.image(
            "Clouds_small",
            "client/assets/sprites/clouds-white-small.png"
        );
        this.load.image("Leaf_1","client/assets/sprites/Leaf.png" );
        this.load.image("Leaf_2","client/assets/sprites/leaf2.png");
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

        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);
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
        //-------------------------Add Grass-----------------------
        var Grass = this.add.sprite(300, 450, "Grass");
        Grass.setScale(1.5);

        
        ///---------------LEAF ANIMATION-----------------------------
        var image3 = this.add.image(800, 200, 'Leaf_1')
                    .setScale(0.5);
        this.tweens.add({
            targets: image3,
            scaleX: 0.5,
            scaleY:0.5,
            props: {
                x: { value: 70, flipX: true },
                y: { value: 250 },
            },
           
            duration: 3000,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
    
        //----------------------- House with Zoom In effect-----------------------
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
                    start: this.socket.id
                });
            },
        });
        

        
        // // Add the setting wheel button
        // const settingsBtn = this.add
        //     .image(57, 550, "settings")
        //     .setInteractive();
        // settingsBtn.setScale(0.75);
        // settingsBtn.on("pointerup", () => {
        //     // Open the settings popup
        //     this.showSettingsPopup();
        // });
    }

    upload() {
        //Cloud Effect
        Clouds_bg1.tilePositionX += 0.9;
        Clouds_bg2.tilePositionX += 0.25;
    }
    // showSettingsPopup() {
    //     // Create and display the settings popup
    //     const popup = this.add.container(
    //         this.game.config.width / 2,
    //         this.game.config.height / 2
    //     );
    //     const background = this.add.graphics();
    //     background.fillStyle(0xffffff, 1);
    //     background.fillRect(-150, -150, 300, 300);
    //     const closeButton = this.add
    //         .text(130, -130, "X", { fontSize: "24px", color: "#000000" })
    //         .setInteractive();
    //     closeButton.on("pointerup", () => {
    //         // Close the popup
    //         popup.destroy();
    //     });
    //     popup.add(background);
    //     popup.add(closeButton);
    //     // Pop Up Seeings
    // }
}
