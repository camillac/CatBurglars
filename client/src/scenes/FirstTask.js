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
        this.load.image("House","client/assets/sprites/log-cabin.png") //Need to Update this
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
        var House = this.add.image(500,500,"House").setOrigin(0.5);
        House.setScale(1).setPosition(450,300);
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


        // Left side menu dimensions
        const width = this.game.config.width;
        const height = this.game.config.height;

        const menu = this.add.graphics();
        menu.fillStyle(0xBBC2CC, 1);
        menu.fillRect(0, 0, width/4, height);

        // Add the setting wheel button
        const settingsBtn = this.add.image(100, 530, 'settings').setInteractive();
        settingsBtn.on('pointerup', () => {
            // Open the settings popup
            this.showSettingsPopup();
        });
    }



    update() {}

    showSettingsPopup() {
        // Create and display the settings popup
        const popup = this.add.container(this.game.config.width / 2, this.game.config.height / 2);
        const background = this.add.graphics();
        background.fillStyle(0xffffff, 1);
        background.fillRect(-150, -150, 300, 300);
        const closeButton = this.add.text(130, -130, 'X', {fontSize: '24px'}).setInteractive();
        closeButton.on('pointerup', () => {
            // Close the popup
            popup.destroy();
        });
        popup.add(background);
        popup.add(closeButton);
        // Pop Up Seeings
    }
}
