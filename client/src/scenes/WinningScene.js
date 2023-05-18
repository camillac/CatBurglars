export default class WinningScene extends Phaser.Scene {
    constructor() {
        super("WinningScene");
        this.state = {};
    }

    preload() {

        this.load.atlas('confetti', 'client/assets/sprites/confettis/confetti.png', 'client/assets/sprites/confettis/confetti.json');
        this.load.image("table", "client/assets/sprites/confettis/table.png");
        this.load.image(
            "Background2",
            "client/assets/backgrounds/uncolored_hills.png"
        );

        this.load.image("cloud1", "client/assets/sprites/cloud_1.png");
        this.load.image("cloud2", "client/assets/sprites/cloud2.png");
        this.load.image("cloud3", "client/assets/sprites/cloud3.png");

        // Load fish images
        for (let i = 1; i <= 4; i++) {
            this.load.image(`fish${i}`, `client/assets/sprites/fish/fish${i}.png`);
            this.load.image(`fish_flopping${i}`, `client/assets/sprites/fish/fish_flopping${i}.png`);
        }
    }

    create() {
        var add = this.add;
        const scene = this;

        const background = this.add.image(400, 300, "Background2");
        background.setScale(1.0);

        WebFont.load({
            google: {
                families: ["Black Ops One"],
            },
            active: function () {

                // Title
                add.text(35, 90, "Con", {
                    fontFamily: "Black Ops One",
                    fontSize: 80,
                    color: "#19aad7",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
                add.text(195, 90, "gratula", {
                    fontFamily: "Black Ops One",
                    fontSize: 80,
                    color: "#51c7eb",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
                add.text(515, 90, "tions!", {
                    fontFamily: "Black Ops One",
                    fontSize: 80,
                    color: "#96ddf3",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
                add.text(290, 190, "You win!", {
                    fontFamily: "Black Ops One",
                    fontSize: 50,
                    color: "#FFFFFF",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                })

                // Back button label
                const backButtonLabel = add.text(100, 25, "Back To Home", {
                    fontFamily: "Black Ops One",
                    fontSize: 22,
                    color: "#FFFBF4",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                })
                .setOrigin(0.5)
                .setPadding(10, 10, 10, 10);

                backButtonLabel.setInteractive();

                backButtonLabel.on('pointerdown', () => {
                    scene.scene.start('MainScene');
                });
                backButtonLabel.on('pointerover', () => {
                    backButtonLabel.setStyle({
                        color: "#FFEBB9",
                    });
                });
                backButtonLabel.on("pointerout", () => {
                    backButtonLabel.setStyle({
                        color: "#FFFBF4",
                    });
                });
            }
        });
        
        // Confetti
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

        var cloud1 = this.add.image(300, 450, "cloud1");
        cloud1.setScale(1.5);

        var cloud2 = this.add.image(480, 450, "cloud1");
        cloud2.setFlipX(true);
        cloud2.setScale(1.5);

        var cloud3 = this.add.image(390, 390, "cloud3");
        cloud3.setScale(1.5);

        var cloud4 = this.add.image(410, 390, "cloud3");
        cloud4.setFlipX(true);
        cloud4.setScale(1.5);

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
