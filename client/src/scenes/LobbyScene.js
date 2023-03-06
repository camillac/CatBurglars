export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({LobbyScene});
        this.state = {};
        this.hasBeenSet = false; 
    }
    init(data) {
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
    scene.circle= scene.add.graphics();
    //add circle

    //creates box for the lobby and start page 
    scene.boxes.fillStyle(0xbeb2a8, 1);
    scene.boxes.fillRect(280,400,250,90);
    scene.makeButton = scene.add.text(320, 400, "Lobby Code", {
      fontFamily: "Chela One",
      fontcolor: "#FFFBF4'",
      fontSize: "40px",
    });

 //creates 4 circles for the players. 
    //Player 1 
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(125,200,50);
    //player 2 
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(300,200,50);
    //player 3 
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(475,200,50);
    //player 4 
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(650,200,50);
 

  //title
    var back = scene.add.text(100,100,'back',{ 
         fontFamily: 'Chela One',
         fontSize: 40, 
         color: '#FFFBF4'
    });

    var cat = scene.add.text(200,5, 'Cat', {
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
    scene.boxes.fillRect(280,500,250,75);
    var startGame = scene.add.text(400,530, "Start Game", {
        fontFamily: 'Chela One',
        fontSize: 40,
        color: '#FFFBF4',
        //backgroundColor: "#C1A87D"
    })
        .setOrigin(0.5)
        .setPadding(0.0,0.0,0)
           startGame.setInteractive();
            startGame.on('pointerup', () => {
                scene.scene.start("FirstTask", { ...scene.state, socket: scene.socket });
            }) ;
           

            var mycats = this.add.sprite(300,300,'icon');
            mycats.setScale(0.3).setPosition(125,200);
    //right popup
    /*scene.inputElement = scene.add.dom(562.5, 250).createFromCache("codeform");
    scene.inputElement.addListener("click");
    scene.inputElement.on("click", function (event) {
      if (event.target.name === "enterRoom") {
        const input = scene.inputElement.getChildByName("code-form");

        scene.socket.emit("isKeyValid", input.value);
      }
    });
        this.add.image(400,300,'icon') //add cats 
        var mycats = this.add.sprite(300,300,'icon');
       // var mycats = this.add.sprite(300,300,'icon');
        // this.icon.anchor.setTo(0.5,0.5);
        // this.icon.scale.setTo();
        */

    }

}