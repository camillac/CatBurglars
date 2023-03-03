export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload() {
        // this.load.html("how_to_play", "client/assets/how_to_play.html");
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        this.socket = io();
        var add = this.add;

        WebFont.load({
            google: {
                families: ['Chela One']
            },
            active: function () {
                // title
                add.text(125, 110, 'Cat', {
                    fontFamily: 'Chela One',
                    fontSize: 100,
                    color: '#F8F0C6'
                });

                add.text(250, 110, 'Burglars', {
                    fontFamily: 'Chela One',
                    fontSize: 100,
                    color: '#C1A87D'
                });

                add.text(565, 110, '.io', {
                    fontFamily: 'Chela One',
                    fontSize: 100,
                    color: '#EFC482'
                });

                // buttons
                const playButton = add.text(400, 325, 'Start', {
                    fontFamily: 'Chela One',
                    fontSize: 60,
                    color: '#FFFBF4',
                    backgroundColor: "#C1A87D"
                })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);

                const howToPlayButton = add.text(400, 440, 'How To Play', {
                    fontFamily: 'Chela One',
                    fontSize: 60,
                    color: '#FFFBF4',
                    backgroundColor: "#C1A87D"
                })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);

                playButton.setInteractive();
                howToPlayButton.setInteractive();
                // how to pop up
                // messy way of doing it, basically pasting a textbox on top of the home screen
                // can clean up by creating a background sprite and placing text on top of it,
                // or by making new scene when we get more comfortable with it
                howToPlayButton.on('pointerup', () => {
                    var box = add.group();

                    var instructions = add.text(400, 300, "These are instructions!", {
                        fontFamily: 'Chela One',
                        fontSize: 50,
                        color: '#FFFBF4',
                        backgroundColor: "#C1A87D"
                    })
                        .setOrigin(0.5)
                        .setPadding(200, 200, 200, 200);

                    var closeButton = add.text(400, 450, "Close", {
                        fontFamily: 'Chela One',
                        fontSize: 50,
                        color: '#FFFBF4',
                    })
                        .setOrigin(0.5)
                        .setPadding(10, 10, 10, 10)
                        .setInteractive();

                    box.add(instructions);
                    box.add(closeButton);

                    closeButton.on('pointerup', () => {
                        instructions.destroy();
                        closeButton.destroy();
                        box.destroy();
                    })
                });
            }
        });
    }

    update() {

    }
};