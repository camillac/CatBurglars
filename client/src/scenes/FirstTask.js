export default class FirstTask extends Phaser.Scene {
    constructor() {
        super("FirstTask");
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerNum = data.playerNum;
        console.log(this.socket.id);
    }
    preload() {
        //load cats/players
        this.load.image("Player_1", "client/assets/sprites/player1.png");
        this.load.image("Player_2", "client/assets/sprites/player2.png");
        this.load.image("Player_3", "client/assets/sprites/player3.png");
        this.load.image("Player_4", "client/assets/sprites/player4.png");
        this.load.image("House", "client/assets/sprites/log-cabin.png"); //Need to Update this
        this.load.image("settings", "client/assets/sprites/settings_icon.png");
        this.load.image("key1Image", "client/assets/sprites/key1.png");
        this.load.image("key2Image", "client/assets/sprites/key2.png");
        this.load.image("key3Image", "client/assets/sprites/key3.png");
        this.load.image("key4Image", "client/assets/sprites/key4.png");
        this.load.image("key5Image", "client/assets/sprites/key5.png");
        this.load.image("key6Image", "client/assets/sprites/key6.png");
        //load background

        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        const scene = this;

        // Setting up background for the game
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        var House = this.add
            .image(500, 300, "House")
            .setOrigin(0.5)
            .setScale(0.2);
        scene.tweens.add({
            targets: House,
            scaleX: 2,
            scaleY: 2,
            ease: "Cubic.easeIn",
            duration: 4000,
            onComplete: () => {
                House.destroy();

                scene.socket.emit(
                    "startTaskOne",
                    this.roomKey,
                    1, // MAIN PLAYER: HARDCODED AS 1
                    scene.socket.id
                );
            },
        });

        // Left side menu dimensions
        const width = this.game.config.width;
        const height = this.game.config.height;

        const menu = this.add.graphics();
        menu.fillStyle(0xe9d6c5, 1);
        menu.fillRect(0, 0, width / 4, height);

        // Add the setting wheel button
        const settingsBtn = this.add
            .image(100, 530, "settings")
            .setInteractive();
        settingsBtn.setScale(0.75);
        settingsBtn.on("pointerup", () => {
            // Open the settings popup
            this.showSettingsPopup();
        });

        background.setScale(2.0);

        //Add Players Sprite
        var player_1 = this.add.sprite(100, 300, "Player_1");
        player_1.setScale(0.75).setPosition(100, 70);
        var player_2 = this.add.sprite(100, 300, "Player_2");
        player_2.setScale(0.75).setPosition(100, 185);
        var player_3 = this.add.sprite(100, 300, "Player_3");
        player_3.setScale(0.75).setPosition(100, 300);
        var player_4 = this.add.sprite(100, 300, "Player_4");
        player_4.setScale(0.75).setPosition(100, 415);
        //Add House

        this.socket.on("displayMainTaskOne", function (arg) {
            console.log("displayMainTaskOne");
            console.log(arg);
            const { playerId, playerNum, key1, key2, key3 } = arg;
            var key_1 = scene.add.sprite(200, 300, "key1Image");
            key_1.setScale(0.05).setPosition(300, 70);
            // var key_2 = scene.add.sprite(200, 300, "key2Image");
            // player_2.setScale(0.05).setPosition(300, 185);
            var key_3 = scene.add.sprite(200, 300, "key3Image");
            key_3.setScale(0.05).setPosition(300, 300);
            // var key_4 = scene.add.sprite(100, 100, "key4Image");
            // key_4.setScale(0.75).setPosition(200, 415);
            // var key_5 = scene.add.sprite(100, 100, "key5Image");
            // key_5.setScale(0.75).setPosition(200, 500);
            // var key_6 = scene.add.sprite(100, 100, "key6Image");
            // key_6.setScale(0.75).setPosition(200, 550);
            // console.log(key1, key2, key3);
            // console.log(this.roomKey)
            // scene.scene.start("FirstTask", {
            //     ...scene.state,
            //     socket: scene.socket,
            //     roomKey: arg,
            // });
        });
        this.socket.on("displaySideTaskOne", function (arg) {
            console.log("displaySideTaskOne");
            console.log(arg);
            // let playerKey = 0 ;
            const { playerId, playerNum, key } = arg;
            // if(playerNum ==2){
            //     playerKey = key1;
            // }
            // if(playerNum ==3){
            //     playerKey = key2;
            // }
            // if(playerNum ==4){
            //     playerKey = key3
            // }
            var keyImage = scene.add.sprite(200, 300, `key` + key + `Image`);
            keyImage.setScale(0.05).setPosition(300, 70);
            console.log(key);
            // console.log(this.roomKey)
            // scene.scene.start("FirstTask", {
            //     ...scene.state,
            //     socket: scene.socket,
            //     roomKey: arg,
            // });
        });
    }

    update() {}

    showSettingsPopup() {
        // Create and display the settings popup
        const popup = this.add.container(
            this.game.config.width / 2,
            this.game.config.height / 2
        );
        const background = this.add.graphics();
        background.fillStyle(0xffffff, 1);
        background.fillRect(-150, -150, 300, 300);
        const closeButton = this.add
            .text(130, -130, "X", { fontSize: "24px", color: "#000000" })
            .setInteractive();
        closeButton.on("pointerup", () => {
            // Close the popup
            popup.destroy();
        });
        popup.add(background);
        popup.add(closeButton);
        // Pop Up Seeings
    }
}
