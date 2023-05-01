export default class HowtoPlayScene extends Phaser.Scene {
    constructor() {
        super("HowtoPlayScene");
        this.state = {};
        this.hasBeenSet = false;
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        );

        this.load.image(
            "Uncolored_plain",
            "client/assets/sprites/uncolored_plain.png"
        );
        
    }

    create() {
        const scene = this;
        var box = scene.add.group();

        const background = this.add.image(400, 300, "Uncolored_plain");
        background.setScale(2.0);

        // Title
        var title = scene.add
            .text(400, 100, "How To Play", {
                fontFamily: "Black Ops One",
                fontSize: 60,
                color: "#FFFFFF",
                stroke: "#1E5162",
                strokeThickness:4,
                align: "center",
            })
            .setOrigin(0.5)
            .setPadding(10, 10, 10, 10);

        // Instructions
        var instructions = scene.add
            .text(
                400,
                300,
                "Communicate and work together to\nsteal a fresh supply of fish before\nthe owners get home! \nUse your mouse to navigate and\ncommunicate with your team to \nccomplete tasks and win.",
                {
                    fontFamily: "Black Ops One",
                    fontSize: 40,
                    color: "#1E5162",
                    align: "center",
                    stroke: "#ffffff",
                    strokeThickness:4,
                }
            )
            .setOrigin(0.5);

        // Close Button
        var closeButton = scene.add
            .text(400, 500, "Close", {
                fontFamily: "Black Ops One",
                fontSize: 45,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#1E5162",
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setPadding(10, 10, 10, 10)
            .setInteractive();

        box.add(background);
        box.add(title);
        box.add(instructions);
        box.add(closeButton);

        // Close button events
        closeButton.on("pointerover", () => {
            closeButton.setStyle({
                color: "#FFEBB9",
            });
        });
        closeButton.on("pointerout", () => {
            closeButton.setStyle({
                color: "#FFFBF4",
            });
        });
        closeButton.on("pointerup", () => {
            title.destroy();
            instructions.destroy();
            closeButton.destroy();
            box.destroy();

            scene.scene.start("MainScene", {
                ...scene.state,
                socket: scene.socket,
            });
        });
    }

    update() {}
}
