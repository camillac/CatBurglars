export default class LostScene extends Phaser.Scene {
    constructor() {
        super("LostScene");
        this.state = {};
    }

    init(data) {
        this.socket = data.socket;
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        );

        this.load.image("cat_skull", "client/assets/sprites/cat_skull.png");
        this.load.audio('cat_screaming', 'client/assets/sounds/cat_screaming.wav');
        this.load.audio('typing', 'client/assets/sounds/typing.wav');
        this.load.image('retry', 'client/assets/sprites/retry.png');
        this.load.image('background', 'client/assets/backgrounds/lose_background.png');
    }

    create() {
        var add = this.add;
        const scene = this;

        const background = this.add.image(400, 300, "background");
        background.setScale(1.0);

        // Add the cat skull image to the scene
        const catSkull = this.add.image(450, 150, "cat_skull").setScale(0.7);

        // Create the 'retry' sprite
        const retryButton = this.add.sprite(this.game.config.width / 2, 500, 'retry').setScale(0.5);

        // Create the text object
        const lostMessage = scene.add.text(this.game.config.width / 2, 325, "", {
            fontFamily: "Black Ops One",
            fontSize: 45,
            color: "#FFFBF4",
            fontStyle: "normal",
            stroke: "#000000",
            strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5)
        .setPadding(10, 10, 10, 10);

        const lostMessageContent = "Unfortunately your team\nhas lost the game. \nRetry!";

        // Apply a "shaky" animation to the cat skull
        this.tweens.add({
            targets: catSkull,
            x: {
                value: () => Phaser.Math.Between(catSkull.x - 2, catSkull.x + 2),
                duration: 50,
                yoyo: true,
                repeat: 39
            },
            y: {
                value: () => Phaser.Math.Between(catSkull.y - 2, catSkull.y + 2),
                duration: 50,
                yoyo: true,
                repeat: 39
            },
            onStart: () => {
            this.sound.play('cat_screaming');
            },
            onComplete: () => {
                let currentChar = 0;

                // Create a timer event to add characters one by one
                scene.time.addEvent({
                    delay: 120, // 100 ms between each character
                    callback: () => {
                        // Add the next character to the text object
                        lostMessage.text += lostMessageContent[currentChar];
                        currentChar++;

                        // Play the 'typing' sound
                        scene.sound.play('typing');
                    },
                    repeat: lostMessageContent.length - 1 // Repeat for as many characters as there are in the string
                });
            }
        });

        retryButton.setInteractive();

        // Change the sprite's tint when the pointer is over it
        retryButton.on('pointerover', () => {
            retryButton.setTint(0xffffff); // Change to white
        });

        retryButton.on('pointerout', () => {
            retryButton.clearTint(); // Remove the tint
        });

        // Rotate the sprite when it is clicked
                retryButton.on('pointerup', () => {
            this.tweens.add({
                targets: retryButton,
                rotation: Math.PI / 2, // Rotate by 90 degrees
                duration: 300, // In half a second
                onComplete: () => {
                    scene.scene.start("MainScene", {
                        ...scene.state
                    });
                }
            });
        });

        WebFont.load({
            google: {
                families: ["Black Ops One"],
            },
            active: function () {
                // Title
                const gameText = add.text(40, 90, "GAME", {
                    fontFamily: "Black Ops One",
                    fontSize: 100,
                    color: "#787270",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                }).setScale(0.8);

                const overText = add.text(500, 90, "VER!", {
                    fontFamily: "Black Ops One",
                    fontSize: 100,
                    color: "#787270",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 12,
                }).setScale(0.8);

                // Apply a "breathing" animation to the text
                scene.tweens.add({
                    targets: [gameText, overText],
                    scaleX: 1,
                    scaleY: 1,
                    yoyo: false,
                    duration: 500,
                    ease: 'Sine.easeIn',
                    repeat: 0
                });
            },
        });
    }

    update() {

    }
}