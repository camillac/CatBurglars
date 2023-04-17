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
        this.scene.add("IntroductionScene", IntroductionScene);
        this.scene.add("FirstTask_Instruction", FirstTask_Instruction);

        this.scene.start("MainScene");
        // this.events.off("hidden", this.onHidden, this, true);
        // this.events.off("visible", this.onVisible, this, true);
        this.events.on('hidden',function(){
            console.log('hidden');
            this.scene.resume(); 
        },this);
        // this.stage.disableVisibilityChange = true;
       
    }
}

// Create the game window
window.onload = function () {
    window.game = new Game();
};
