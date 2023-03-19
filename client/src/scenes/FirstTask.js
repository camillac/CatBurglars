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
        this.load.image("House","client/assets/sprites/House_1.png"); //Need to Update this
        this.load.image("Sky", "client/assets/sprites/Sky.png");
       //load background
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        // Add Background 
        const scene = this;

        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);
        var sky = this.add.image(400,300,"Sky");
        sky.setScale(2.0)
      

        var House = this.add.image(500,600,"House");
        House.setScale(3).setPosition(450,300);
        
        var House = this.add.image(500,300,"House").setOrigin(0.5).setScale(0.2);
        scene.tweens.add({
            targets: House,
            scaleX: 2,
            scaleY: 2,
            ease: 'Cubic.easeIn',
            duration: 4000,
            onComplete: () => {
                House.destroy();
            }
        });


        // Add Rectangle 
       //var rect = this.add.rectangle(0,100,200,1000,0xE9D6C5);
        //Add Players Sprite
        scene.circle = scene.add.graphics();
        

        //Player 1 
        scene.circle.fillStyle(0xADD8E6, 1);
        scene.circle.fillCircle(50, 100, 50)
        var player_1 = this.add.sprite(100,300,"Player_1");
        player_1.setScale(0.75).setPosition(50, 100);
        

        //Player 2 
        scene.circle.fillStyle(0xADD8E6, 1);
        scene.circle.fillCircle(50, 220, 50)
        var player_2 = this.add.sprite(100,300,"Player_2");
        player_2.setScale(0.75).setPosition(50, 220);
        
        //Player 3
        scene.circle.fillStyle(0xADD8E6, 1);
        scene.circle.fillCircle(50, 340, 50)
        var player_3 = this.add.sprite(100,340,"Player_3");
        player_3.setScale(0.75).setPosition(50, 340);

        //Player 4 
        scene.circle.fillStyle(0xADD8E6, 1);
        scene.circle.fillCircle(50, 460, 50)
        var player_4 = this.add.sprite(100,460,"Player_4");
        player_4.setScale(0.75).setPosition(50, 460);
        //Add House

    }

    upload() {
    }
}
