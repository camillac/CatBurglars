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
            "client/assets/backgrounds/settings_icon.png"
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
