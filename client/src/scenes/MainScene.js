export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image('background', 'client/assets/backgrounds/blob-scene-haikei (6).png');
    }

    create() {
        this.socket = io();
        var add = this.add;
        const scene = this;
        scene.roomKey = '';

        const background = this.add.image(400, 300, "background")
        background.setScale(2.0)

        WebFont.load({
            google: {
                families: ['Chela One']
            },
            active: function () {
                // title
                add.text(125, 110, 'Cat', {
                    fontFamily: 'Chela One',
                    fontSize: 100,
                    color: '#F8F0C6',
                    fontStyle: 'normal',
                    stroke: '#000000',
                    strokeThickness: 12
                });
                
                add.text(250, 110, 'Burglars', {
                    fontFamily: 'Chela One',
                    fontSize: 100,
                    color: '#C1A87D',
                    fontStyle: 'normal',
                    stroke: '#000000',
                    strokeThickness: 12
                });

                add.text(565, 110, '.io', {
                    fontFamily: 'Chela One',
                    fontSize: 100,
                    color: '#EEBA6B',
                    fontStyle: 'normal',
                    stroke: '#000000',
                    strokeThickness: 12
                });

                // buttons
                const playButton = add.text(400, 325, 'Create A Room', {
                    fontFamily: 'Chela One',
                    fontSize: 60,
                    color: '#FFFBF4',
                    fontStyle: 'normal',
                    stroke: '#000000',
                    strokeThickness: 12
                })
                .setOrigin(0.5)
                .setPadding(10, 10, 10, 10);


                const howToPlayButton = add.text(400, 440, 'How To Play', {
                    fontFamily: 'Chela One',
                    fontSize: 60,
                    color: '#FFFBF4',
                    fontStyle: 'normal',
                    stroke: '#000000',
                    strokeThickness: 12
                })
                .setOrigin(0.5)
                .setPadding(10, 10, 10, 10);

                playButton.setInteractive();
                howToPlayButton.setInteractive();

                // how to play button events
                howToPlayButton.on('pointerover', () => {
                    howToPlayButton.setStyle({
                        color: '#FFEBB9'
                    })
                });
                howToPlayButton.on('pointerout', () => {
                    howToPlayButton.setStyle({
                        color: '#FFFBF4'
                    })
                });
                howToPlayButton.on('pointerup', () => {
                    scene.scene.start("HowtoPlayScene", { ...scene.state, socket: scene.socket });
                });

                // play button events
                playButton.on('pointerover', () => {
                    playButton.setStyle({
                        color: '#FFEBB9'
                    })
                });
                playButton.on('pointerout', () => {
                    playButton.setStyle({
                        color: '#FFFBF4'
                    })
                });
                playButton.on('pointerup', () => {
                    scene.socket.emit("getRoomCode");

                    scene.socket.on("roomCreated", function (roomKey) {
                        scene.socket.emit("isKeyValid", roomKey);

                        scene.socket.on("keyNotValid", function () {
                        scene.notValidText.setText("Invalid Room Key");
                      });

                      scene.socket.on("keyIsValid", function (input) {
                        scene.socket.emit("joinRoom", input);
                      });

                      scene.scene.start("LobbyScene", { ...scene.state, socket: scene.socket, roomKey: roomKey });
                    });
                })
            }
        });
    }

    update() {}
};
