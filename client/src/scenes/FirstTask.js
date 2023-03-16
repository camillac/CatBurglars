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
    }

    create() {
        const scene = this;
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        const width = this.game.config.width;
        const height = this.game.config.height;

        const menu = this.add.graphics();
        menu.fillStyle(0x808080, 1);
        menu.fillRect(0, 0, width/3, height);
    }

    upload() {}
}
