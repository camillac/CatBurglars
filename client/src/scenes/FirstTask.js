export default class FirstTask extends Phaser.Scene {
    constructor() {
        super("FirstTask");
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
            },
        });
    }

    update() { }
}