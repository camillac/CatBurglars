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
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        var add = this.add;
        const scene = this;

        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        WebFont.load({
            google: {
                families: ["Chela One", "Martian Mono"],
            },
            active: function () {
                
                // Title
                add.text(125, 110, "Cat", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#F8F0C6",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(250, 110, "Burglars", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#C1A87D",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(565, 110, ".io", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#EEBA6B",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });

                // Play button
                const playButton = add
                    .text(400, 325, "Play", {
                        fontFamily: "Chela One",
                        fontSize: 50,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 12,
                    })
                    .setOrigin(0.5)
                    .setPadding(5, 5, 5, 5);

                // How to Play button
                const howToPlayButton = add
                    .text(400, 455, "How To Play", {
                        fontFamily: "Chela One",
                        fontSize: 50,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 12,
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

    update() { }
}
