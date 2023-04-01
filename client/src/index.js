import config from "./config/config.js";
import MainScene from "./scenes/MainScene.js";
import HowtoPlayScene from "./scenes/HowtoPlayScene.js";
import LobbyScene from "./scenes/LobbyScene.js";
import PlayScene from "./scenes/PlayScene.js";
import FirstTask from "./scenes/FirstTask.js";
import LostScene from "./scenes/LostScene.js";

// Insert all of the scenes into the game
class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.add("FirstTask", FirstTask);
        this.scene.add("MainScene", MainScene);
        this.scene.add("HowtoPlayScene", HowtoPlayScene);
        this.scene.add("LobbyScene", LobbyScene);
        this.scene.add("PlayScene", PlayScene);
        this.scene.add("LostScene", LostScene);

        this.scene.start("MainScene");
    }
}

// Create the game window
window.onload = function () {
    window.game = new Game();
};
