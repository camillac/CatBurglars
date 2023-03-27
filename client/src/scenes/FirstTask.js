import Sidebar from "./Sidebar.js";

export default class FirstTask extends Phaser.Scene {
  constructor() {
    super("FirstTask");
    this.state = {};
    this.hasBeenSet = false;
  }
  init(data) {
    this.socket = data.socket;
    this.players = data.players;
  }
  preload() {
    //load cats/players
    this.load.image("Player_1", "client/assets/sprites/player1.png");
    this.load.image("Player_2", "client/assets/sprites/player2.png");
    this.load.image("Player_3", "client/assets/sprites/player3.png");
    this.load.image("Player_4", "client/assets/sprites/player4.png");
    this.load.image("House", "client/assets/sprites/log-cabin.png"); //Need to Update this
    this.load.image("settings", "client/assets/sprites/settings_icon.png");
    //load background

    this.load.image(
      "background",
      "client/assets/backgrounds/blob-scene-haikei (6).png"
    );
  }

  create() {
    const scene = this;
    // Setting up background for the game
    const background = this.add.image(400, 300, "background");
    background.setScale(2.0);

    var House = this.add.image(500, 300, "House")
        .setOrigin(0.5)
        .setScale(0.2);
    scene.tweens.add({
      targets: House,
      scaleX: 2,
      scaleY: 2,
      ease: "Cubic.easeIn",
      duration: 4000,
      onComplete: () => {
        House.destroy();
      },
    });

    const sidebar = new Sidebar(scene, this.game.config.width, this.game.config.height, scene.players, scene.socket);
  }

  update() {}

}
