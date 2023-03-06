export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        this.socket = io();
        var add = this.add;
        const scene = this;
        scene.roomKey = '';

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
                const playButton = add.text(400, 325, 'Create A Room', {
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
                howToPlayButton.on('pointerup', () => {
                    scene.scene.launch("HowtoPlayScene", { ...scene.state, socket: scene.socket });
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

    update() {

    }
};
