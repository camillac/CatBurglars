// Importing all of the scenes necessary
import config from "./config/config.js";
import MainScene from "./scenes/MainScene.js";
import HowtoPlayScene from "./scenes/HowtoPlayScene.js";
import LobbyScene from "./scenes/LobbyScene.js";
import PlayScene from "./scenes/PlayScene.js";
import FirstTask from "./scenes/FirstTask.js";
import LostScene from "./scenes/LostScene.js";
import CreateLobbyScene from "./scenes/CreateLobbyScene.js";
import JoinLobbyScene from "./scenes/JoinLobbyScene.js";
import WinningScene from "./scenes/WinningScene.js";
import IntroductionScene from "./scenes/IntroductionScene.js";
import FirstTask_Instruction from "./scenes/FirstTask_Instruction.js";
import FinalTask_Instruction from "./scenes/FinalTask_Instruction.js";
import FinalTask from "./scenes/FinalTask.js";

// Insert all of the scenes into the game
class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.add("MainScene", MainScene);
        this.scene.add("FirstTask_Instruction", FirstTask_Instruction);
        this.scene.add("IntroductionScene", IntroductionScene);
        this.scene.add("FirstTask", FirstTask);
        this.scene.add("HowtoPlayScene", HowtoPlayScene);
        this.scene.add("LobbyScene", LobbyScene);
        this.scene.add("PlayScene", PlayScene);
        this.scene.add("LostScene", LostScene);
        this.scene.add("CreateLobbyScene", CreateLobbyScene);
        this.scene.add("JoinLobbyScene", JoinLobbyScene);
        this.scene.add("WinningScene", WinningScene);
        this.scene.add("FinalTask_Instruction", FinalTask_Instruction);
        this.scene.add("FinalTask", FinalTask);

        this.scene.start("MainScene");
    }
}

// Create the game window
window.onload = function () {
    window.game = new Game();
};
