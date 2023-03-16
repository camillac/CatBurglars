export default class FirstTask extends Phaser.Scene {
    constructor() {
        super({ FirstTask });
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        this.socket = data.socket;
    }
    preload() {
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
        this.load.image(
            "settings",
            "client/assets/backgrounds/settings_icon"
        );
    }

    create() {
        const scene = this;
        // Setting up background for the game
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        // Left side menu dimensions
        const width = this.game.config.width;
        const height = this.game.config.height;

        const menu = this.add.graphics();
        menu.fillStyle(0xBBC2CC, 1);
        menu.fillRect(0, 0, width/4, height);

        // Display players
    }

    update() {}
}
