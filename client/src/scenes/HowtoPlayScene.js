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
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        const scene = this;
        var box = scene.add.group();

        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        var title = scene.add
            .text(400, 150, "How To Play", {
                fontFamily: "Chela One",
                fontSize: 60,
                color: "#C1A87D",
                align: "center",
            })
            .setOrigin(0.5)
            .setPadding(10, 10, 10, 10);

        var instructions = scene.add
            .text(
                400,
                300,
                "Communicate and work together to steal a \nfresh supply of fish before the owners get home!\nUse your mouse to navigate and communicate with \nyour team to complete tasks and win.",
                {
                    fontFamily: "Chela One",
                    fontSize: 40,
                    color: "#C1A87D",
                    align: "center",
                }
            )
            .setOrigin(0.5);

        var closeButton = scene.add
            .text(400, 450, "Close", {
                fontFamily: "Chela One",
                fontSize: 45,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 12,
            })
            .setOrigin(0.5)
            .setPadding(10, 10, 10, 10)
            .setInteractive();

        box.add(background);
        box.add(title);
        box.add(instructions);
        box.add(closeButton);

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
