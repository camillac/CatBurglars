export default class FirstTask extends Phaser.Scene {
    constructor() {
        super("FirstTask");
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        this.socket = data.socket;
    }
    preload() {
        //load cats/players
        this.load.image('Player_1','client/assets/sprites/player1.png');
        this.load.image('Player_2','client/assets/sprites/player2.png');
        this.load.image('Player_3','client/assets/sprites/player3.png');
        this.load.image('Player_4','client/assets/sprites/player4.png');
        this.load.image("House","client/assets/backgrounds/example_background.png") //Need to Update this
       //load background
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        // Add Background 

        
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);
        var House = this.add.image(500,500,"House");
        House.setScale(4,4.5).setPosition(450,300);

        //Zoom Effect 
      /*  //House.setScale(4).setOrigin(0);
        House.cameras.main.setBounds(0,0,1024,1024);
        House.cameras.main.setZoom(1);
        House.cameras.main.centerOn(0,0)

        House.input('PointerDown,function()')
        { 
            var cam = House.cameras.main;
            cam.pan(200,200,2000,'Power 2');
            cam.Zoomto(4,2050);
        }*/
        //Click on the house creates new scene
        House.setInteractive();
        House.on("pointerup", () => {
            scene.scene.launch("LobbyScene", {
                ...scene.state,
                socket:scene.socket,
            });
        });
        // Add Rectangle 
       var rect = this.add.rectangle(0,100,200,1000,0xE9D6C5);
        //Add Players Sprite
        var player_1 = this.add.sprite(100,300,"Player_1");
        player_1.setScale(0.75).setPosition(50, 100);
        var player_2 = this.add.sprite(100,300,"Player_2");
        player_2.setScale(0.75).setPosition(50, 220);
        var player_3 = this.add.sprite(100,300,"Player_3");
        player_3.setScale(0.75).setPosition(50, 340);
        var player_4 = this.add.sprite(100,300,"Player_4");
        player_4.setScale(0.75).setPosition(50, 460);
        //Add House
    }

    upload() {}
}
