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
        this.load.image("table", "client/assets/sprites/confettis/table.png");

        // Load fish images
        for (let i = 1; i <= 4; i++) {
            this.load.image(`fish${i}`, `client/assets/sprites/fish/fish${i}.png`);
            this.load.image(`fish_flopping${i}`, `client/assets/sprites/fish/fish_flopping${i}.png`);
        }
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
                add.text(95, 70, "Con", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#F8F0C6",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(240, 70, "gratula", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#C1A87D",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                add.text(500, 70, "tions!", {
                    fontFamily: "Chela One",
                    fontSize: 100,
                    color: "#EEBA6B",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                });
                // Back button
            const backButton = scene.add.rectangle(50, 50, 140, 40, 0xffebb9, 1);
            backButton.setInteractive();
            backButton.on('pointerdown', () => {
                scene.scene.start('Lobby');
            });

            // Back button label
            const backButtonLabel = add.text(10, 33, "< BACK", {
                fontFamily: "Martian Mono",
                fontSize: 24,
                color: "#ffffff",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 4,
            });
            },

        });
        const confetti = this.add.particles('confetti');
        confetti.createEmitter({
            frame: ['confeti1.png', 'confeti2.png', 'confeti3.png', 'confeti4.png', 'confeti5.png', 'confeti6.png'],
            x: 1000,
            y: -100,
            alpha: { min: 0.75, max: 1 },
            lifespan: 2000,
            angle: { min: 0, max: 180 },
            speed: { min: 500, max: 600 },
            scale: { start: 0.1, end: 0 },
            gravityY: 200
        });

        const table = this.add.image(300, 540, "table");
        table.setScale(1);

        const fishPositions = [
            { x: 400, y: 350 },
            { x: 300, y: 400 },
            { x: 400, y: 450 },
            { x: 500, y: 400 },
        ];

        this.anims.create({
            key: "flopping",
            frames: [
                { key: "fish1" },
                { key: "fish_flopping1" },
                { key: "fish2" },
                { key: "fish_flopping2" },
                { key: "fish3" },
                { key: "fish_flopping3" },
                { key: "fish4" },
                { key: "fish_flopping4" },
            ],
            frameRate: 4,
            repeat: -1,
        });

        for (const position of fishPositions) {
            const fish = this.add.sprite(position.x, position.y, "fish1");
            fish.setScale(0.2);
            fish.play("flopping");

            // Add bouncing animation using tweens
        this.tweens.add({
            targets: fish,
            y: position.y - 20,
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1,
        });
        }


    }

    update() { }

}
