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
        this.load.image("House","client/assets/sprites/House.png") //Need to Update this
       //load background
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        // Add Background 

        this.cameras.main.setBounds(0,0,50,150);
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);
        var House = this.add.image(500,500,"House");
        House.setScale(2.5).setPosition(450,300);
        this.cameras.startFollow(House);


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
