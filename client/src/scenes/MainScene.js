export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        );

        this.load.image(
            "Background1",
            "client/assets/sprites/colored_talltrees.png"
        );

        this.load.image(
            "House_main",
            "client/assets/sprites/House_No_Backgroung2.png"
        );

        //------------------ ADD CATS------------------------
        this.load.image("Cats_1", "client/assets/sprites/player1.png");
        this.load.image("Cats_2", "client/assets/sprites/player2.png");
        this.load.image("Cats_3", "client/assets/sprites/player3.png");
        this.load.image("Cats_4", "client/assets/sprites/player4.png");

        //---------------SUN ASSETS----------------
        this.load.image("Main_Sun", "client/assets/sprites/sun.png");

        //---- CLOUD -----------
        this.load.image("Main_cloud", "client/assets/sprites/cloud8.png");
    }

    create() {
        var add = this.add;
        const scene = this;

        //Add The House Background
        const background = this.add.image(400, 300, "Background1");
        background.setScale(0.8);

        // Add the House in the Background
        const Home = this.add.image(270, 320, "House_main");
        Home.setScale(1);

        //To add cats
        const cat1 = this.add.image(100, 200, "Cats_1");
        cat1.setScale(0.3);
        const cat2 = this.add.image(130, 200, "Cats_2");
        cat2.setScale(0.3);
        const cat3 = this.add.image(160, 200, "Cats_3");
        cat3.setScale(0.3);
        const cat4 = this.add.image(190, 200, "Cats_4");
        cat4.setScale(0.3);

        //---- SUN ASSETS
        const Sun = this.add.image(200, 50, "Main_Sun");
        Sun.setScale(0.7);

        const MainCloud = this.add.image(260, 70, "Main_cloud");
        MainCloud.setScale(0.5);

        scene.tweens.add({
            targets: Home,
            y: { from: 290, to: 300 },
            duration: 800,
            ease: "sine.inout",
            repeat: -1,
            yoyo: true, // Will go back and Forth
        });
        scene.tweens.add({
            targets: cat1,
            x: { from: 120, to: 200 },
            y: { from: 390, to: 380 },
            duration: 8000,
            ease: "sine.inout",
            repeat: -1,
            yoyo: false,
            scale: 0.175,
        });
        scene.tweens.add({
            targets: cat2,
            x: { from: 130, to: 210 },
            y: { from: 390, to: 380 },
            duration: 8000,
            ease: "sine.inout",
            repeat: -1,
            yoyo: false, //Will only go from x to y
            scale: 0.175,
        });
        scene.tweens.add({
            targets: cat3,
            x: { from: 140, to: 230 },
            y: { from: 390, to: 380 },
            duration: 8000,
            ease: "sine.inout",
            repeat: -1,
            yoyo: false,
            scale: 0.2,
        });
        scene.tweens.add({
            targets: cat4,
            x: { from: 150, to: 240 },
            y: { from: 390, to: 380 },
            duration: 8000,
            ease: "sine.inout",
            repeat: -1,
            yoyo: false,
            scale: 0.2,
        });

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

                // Play button
                const playButton = add
                    .text(400, 325, "Play", {
                        fontFamily: "Black Ops One",
                        fontSize: 50,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 8,
                    })
                    .setOrigin(0.5)
                    .setPadding(5, 5, 5, 5)
                    .setDepth(3);

                // How to Play button
                const howToPlayButton = add
                    .text(400, 455, "How To Play", {
                        fontFamily: "Black Ops One",
                        fontSize: 50,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 8,
                    })
                    .setOrigin(0.5)
                    .setPadding(15, 15, 15, 15);

                playButton.setInteractive();
                howToPlayButton.setInteractive();

                // How to Play button events
                howToPlayButton.on("pointerover", () => {
                    howToPlayButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                howToPlayButton.on("pointerout", () => {
                    howToPlayButton.setStyle({
                        color: "#FFFBF4",
                    });
                });
                howToPlayButton.on("pointerup", () => {
                    scene.scene.start("HowtoPlayScene", {
                        ...scene.state,
                        socket: scene.socket,
                    });
                });

                // Play button events
                playButton.on("pointerover", () => {
                    playButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                playButton.on("pointerout", () => {
                    playButton.setStyle({
                        color: "#FFFBF4",
                    });
                });
                playButton.on("pointerup", () => {
                    scene.scene.start("PlayScene", {
                        ...scene.state,
                        socket: scene.socket,
                    });
                });
            },
        });
    }

    update() {}
}
