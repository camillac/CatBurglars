export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super("LobbyScene");
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        console.log('init'); 
        console.log(data);
        console.log(data.hello);
        console.log(data.socket);
        this.socket = data.socket;
    }
    preload() {
        // this.load.setBaseURL('http://labs.phaser.io');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        //load images from the assets folder
        this.load.image('icon', 'client/assets/sprites/cat.png'); //Files might not be in the root
    }
    create() {
        const scene = this;
        scene.boxes = scene.add.graphics();
        scene.circle = scene.add.graphics();
        //add circle

        //creates box for the lobby and start page 
        scene.boxes.fillStyle(0xbeb2a8, 1);
        scene.boxes.fillRect(280, 400, 250, 90);
        scene.makeButton = scene.add.text(320, 400, "Lobby Code", {
            fontFamily: "Chela One",
            fontcolor: "#FFFBF4'",
            fontSize: "40px",
        });

        //creates 4 circles for the players. 
        //Player 1 
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(125, 200, 50);
        //player 2 
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(300, 200, 50);
        //player 3 
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(475, 200, 50);
        //player 4 
        scene.circle.fillStyle(0xe8ded1, 1);
        scene.circle.fillCircle(650, 200, 50);


        //title
        var back = scene.add.text(100, 100, 'back', {
            fontFamily: 'Chela One',
            fontSize: 40,
            color: '#FFFBF4'
        });

        var cat = scene.add.text(200, 5, 'Cat', {
            fontFamily: 'Chela One',
            fontSize: 65,
            color: '#F8F0C6',
        });
        var burg = scene.add.text(280, 5, 'Burglars', {
            fontFamily: 'Chela One',
            fontSize: 65,
            color: '#C1A87D'
        });
        var end = scene.add.text(485, 5, '.io', {
            fontFamily: 'Chela One',
            fontSize: 65,
            color: '#EFC482'
        });
        scene.boxes.fillStyle(0xc1a87d, 1);
        scene.boxes.fillRect(280, 500, 250, 75);
        var startGame = scene.add.text(400, 530, "Start Game", {
            fontFamily: 'Chela One',
            fontSize: 40,
            color: '#FFFBF4',
            //backgroundColor: "#C1A87D"
        })
            .setOrigin(0.5)
            .setPadding(0.0, 0.0, 0)
        startGame.setInteractive();
        startGame.on('pointerup', () => {
            scene.scene.start("FirstTask", { ...scene.state, socket: scene.socket });
        });


        var mycats = this.add.sprite(300, 300, 'icon');
        mycats.setScale(0.3).setPosition(125, 200);

        console.log(scene.socket)
        // scene.socket.emit("inLobby", "is in lobby");

        // scene.socket.on("currentPlayers", (arg) => {
        //     console.log("THIS IS THE CLIENT SIDE:");
        //     console.log(arg?arg:"jhihefo");
        //     // console.log(arg); // world
        //   });

    }

}