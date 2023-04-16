export default class LostScene extends Phaser.Scene {
    constructor() {
        super("LostScene");
        this.state = {};
    }

    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
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

                // Back to lobby button
                const Lost = add
                    .text(400, 325, "Unfortunately your team has lost the game. \nYou can try again by starting over!", {
                        fontFamily: "Chela One",
                        fontSize: 45,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 12,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);

                // backtolobbyButton.setInteractive();
                // Back to lobby button
                const backtolobbyButton = add
                    .text(400, 525, "Back to Homepage", {
                        fontFamily: "Chela One",
                        fontSize: 50,
                        color: "#FFEBB9",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 12,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);

                backtolobbyButton.setInteractive();

                // Play button events
                backtolobbyButton.on("pointerover", () => {
                    backtolobbyButton.setStyle({
                        // color: "#FFEBB9",
                        color: "#FFFBF4"
                    });
                });
                backtolobbyButton.on("pointerout", () => {
                    backtolobbyButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                backtolobbyButton.on("pointerup", () => {
                    scene.scene.start("MainScene", {
                        ...scene.state
                    });
                });
            }
        });
    }

    update() {

    }
}