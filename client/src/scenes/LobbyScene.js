export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super("LobbyScene");
        this.state = {};
    }
    
    init(data) {
        this.socket = data.socket;
    }
    
    preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const scene = this;
        var box = scene.add.group();
        var cat = scene.add.text(125, 110, 'Cat', {
            fontFamily: 'Chela One',
            fontSize: 100,
            color: '#F8F0C6',
        });

        var burg = scene.add.text(250, 110, 'Burglars', {
            fontFamily: 'Chela One',
            fontSize: 100,
            color: '#C1A87D'
        });
        var end = scene.add.text(565, 110, '.io', {
            fontFamily: 'Chela One',
            fontSize: 100,
            color: '#EFC482'
        });
        var closeButton = scene.add.text(400, 450, "Go back to the Start Page", {
            fontFamily: 'Chela One',
            fontSize: 50,
            color: '#FFFBF4',
            backgroundColor: "#C1A87D"
        })
            .setOrigin(0.5)
            .setPadding(10, 10,10, 10)
                .setInteractive();
        box.add(closeButton);
        box.add(cat); 
        box.add(burg); 
        box.add(end);
        closeButton.on('pointerup', () => {
            scene.scene.start("MainScene", { ...scene.state, socket: scene.socket });
        })
    }

    update() { 

    }
}