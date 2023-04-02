export default class WinningScene extends Phaser.Scene {
    constructor() {
        super("WinningScene");
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
        this.load.atlas('confetti', 'client/assets/sprites/confettis/confetti.png', 'client/assets/sprites/confettis/confetti.json');



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
                add.text(125, 110, "Con", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#F8F0C6",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(270, 110, "gratula", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#C1A87D",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(530, 110, "tions!", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#EEBA6B",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
            },
        });
        const confetti = this.add.particles('confetti');
        confetti.createEmitter({
            frame: ['confetti1.png', 'confetti2.png', 'confetti3.png', 'confetti4.png', 'confetti5.png', 'confetti6.png'],
            x: 1000,
            y: -100,
            alpha: { min: 0.75, max: 1 },
            lifespan: 3000,
            angle: { min: 0, max: 180 },
            speed: { min: 500, max: 600 },
            scale: { start: 0.1, end: 0 },
            gravityY: 200
        });

    }

    update() { }
}