class Sidebar extends Phaser.GameObjects.Container {
  constructor(scene, width, height, players, socket) {
    super(scene, width, height);
    this.scene = scene; // scene that is requesting sidebar
    this.width = width; // width of screen
    this.height = height; // height of screen
    this.players = players; // player data
    this.socket = socket; // socket data

    this.scene.add.existing(this);

    const menu = this.scene.add.graphics();
    menu.fillStyle(0xf6f0e3, 1);
    menu.fillRect(0, 0, this.width / 5, this.height);
    const menu_side = this.scene.add.graphics();
    menu_side.fillStyle(0xfffaf0, 1);
    menu_side.fillRect(this.width / 5, 0, 7, this.height);

    //Add Players Sprite
    var player_1 = this.scene.add.sprite(100, 300, "Player_1");
    player_1.setScale(0.9).setPosition(width / 9.5, 70);
    var player_2 = this.scene.add.sprite(100, 300, "Player_2");
    player_2.setScale(0.9).setPosition(width / 9.5, 190);
    var player_3 = this.scene.add.sprite(100, 300, "Player_3");
    player_3.setScale(0.9).setPosition(width / 9.5, 310);
    var player_4 = this.scene.add.sprite(100, 300, "Player_4");
    player_4.setScale(0.9).setPosition(width / 9.5, 430);

    // Add the setting wheel button
    const settingsBtn = this.scene.add
      .image(width / 9.5, 535, "settings")
      .setInteractive();
    settingsBtn.setScale(0.5);
    settingsBtn.on("pointerup", () => {
      // Open the settings popup
      showSettingsPopup();
    });

    function showSettingsPopup() {
      // Create and display the settings popup
      const popup = scene.add.container(width / 2, height / 2);
      const background = scene.add.graphics();
      background.fillStyle(0xffffff, 1);
      background.fillRect(-150, -150, 300, 300);
      const closeButton = scene.add
        .text(0, 100, "Close", {
          fontSize: "24px",
          color: "#000000",
          fontFamily: "Chela One",
        })
        .setOrigin(0.5)
        .setInteractive();
      closeButton.on("pointerup", () => {
        // Close the popup
        popup.destroy();
      });
      popup.add(background);
      popup.add(closeButton);
      // Pop Up Settings
    }
  }
}

export default Sidebar;
