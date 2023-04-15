import Sidebar from "./Sidebar.js";

export default class FirstTask extends Phaser.Scene {
    constructor() {
        super("FirstTask");
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerNum = data.playerNum;
        console.log(this.socket.id);
        this.players = data.players;
        this.start = data.start
    }
    preload() {
        //load cats/players
        this.load.image("Player_1", "client/assets/sprites/player1.png");
        this.load.image("Player_2", "client/assets/sprites/player2.png");
        this.load.image("Player_3", "client/assets/sprites/player3.png");
        this.load.image("Player_4", "client/assets/sprites/player4.png");
        this.load.image("House", "client/assets/sprites/log-cabin.png"); //Need to Update this
        this.load.image("settings", "client/assets/sprites/settings_icon.png");
        this.load.image("key1Image", "client/assets/sprites/key1.png");
        this.load.image("key2Image", "client/assets/sprites/key2.png");
        this.load.image("key3Image", "client/assets/sprites/key3.png");
        this.load.image("key4Image", "client/assets/sprites/key4.png");
        this.load.image("key5Image", "client/assets/sprites/key5.png");
        this.load.image("key6Image", "client/assets/sprites/key6.png");
        this.load.image("correctImage", "client/assets/sprites/correct.png");

        this.load.image("incorrectImage", "client/assets/sprites/incorrect.png");

        //load background
        // this.stage.disableVisibilityChange = true;
        this.scene.run("FirstTask");
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

        var House = this.add
            .image(500, 300, "House")
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
                console.log(scene.socket.id);
                console.log(this.start);
                if (scene.socket.id == this.start) {
                    console.log('hfiuehfius')
                    scene.socket.emit("startTaskOne", this.roomKey, 1, scene.socket.id);

                }
            },
        });
        const sidebar = new Sidebar(
            scene,
            this.game.config.width,
            this.game.config.height,
            scene.players,
            scene.socket
        );
        this.socket.on("hello", () => {
            console.log("hello");
        });

        this.socket.on("displayMainTaskOne", function (arg) {
            console.log("displayMainTaskOne");
            console.log(arg);

            scene.add.text(290, 50, "Choose the right keys!", {
                fontFamily: "Chela One",
                fontSize: 45,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 12,
            });

            const { playerId, playerNum, key1, key2, key3 } = arg;
            var key_1 = scene.add.sprite(200, 300, "key1Image");
            key_1.setScale(3).setPosition(330, 250);
            var key_2 = scene.add.sprite(200, 300, "key2Image");
            key_2.setScale(3).setPosition(480, 250);
            var key_3 = scene.add.sprite(200, 300, "key3Image");
            key_3.setScale(3).setPosition(630, 250);
            var key_4 = scene.add.sprite(200, 300, "key4Image");
            key_4.setScale(3).setPosition(330, 450);
            var key_5 = scene.add.sprite(200, 300, "key5Image");
            key_5.setScale(3).setPosition(480, 450);
            var key_6 = scene.add.sprite(200, 300, "key6Image");
            key_6.setScale(3).setPosition(630, 450);

            key_1.setInteractive();
            key_2.setInteractive();
            key_3.setInteractive();
            key_4.setInteractive();
            key_5.setInteractive();
            key_6.setInteractive();

            this.correct = 0;
            this.alreadyClickedKey1 = 0;
            this.alreadyClickedKey2 = 0;
            this.alreadyClickedKey3 = 0;
            this.alreadyClickedKey4 = 0;
            this.alreadyClickedKey5 = 0;
            this.alreadyClickedKe6 = 0;

            console.log(key1, key2, key3);

            key_1.on("pointerup", () => {
                if (!(key1 == 1 || key2 == 1 || key3 == 1)) {
                    console.log("wrong key ")
                    scene.socket.emit("decreaseCounter");
                    var incorrect = scene.add.sprite(200, 300, "incorrectImage");
                    incorrect.setScale(1).setPosition(500, 185);
                    function incorr() {
                        incorrect.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: incorr,
                        callbackScope: this,
                    });
                }
                else {
                    if (!(this.alreadyClickedKey1)) {
                        this.correct++;
                    }
                    this.alreadyClickedKey1++;
                    var correctImage = scene.add.sprite(200, 300, "correctImage");
                    correctImage.setScale(1).setPosition(500, 185);
                    function corr() {
                        correctImage.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: corr,
                        callbackScope: this,
                    });
                    // key_1.destroy(); 
                    console.log(this.correct);
                    if (this.correct === 3) {
                        console.log('hfhiuhf');
                        scene.socket.emit('showWinScene');
                    }
                }
                console.log("pressed key 1 ");
            });
            key_2.on("pointerup", () => {
                if (!(key1 == 2 || key2 == 2 || key3 == 2)) {
                    console.log("wrong key ")
                    scene.socket.emit("decreaseCounter");
                    var incorrect = scene.add.sprite(200, 300, "incorrectImage");
                    incorrect.setScale(1).setPosition(500, 185);
                    function incorr() {
                        incorrect.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: incorr,
                        callbackScope: this,
                    });
                }
                else {
                    if (!(this.alreadyClickedKey2)) {
                        this.correct++;
                    }
                    this.alreadyClickedKey2++;
                    // key_2.destroy(); 
                    var correctImage = scene.add.sprite(200, 300, "correctImage");
                    correctImage.setScale(1).setPosition(500, 185);
                    console.log(this.correct);
                    function corr() {
                        correctImage.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: corr,
                        callbackScope: this,
                    });
                    if (this.correct === 3) {
                        console.log('hfhiuhf');
                        scene.socket.emit('showWinScene');

                    }
                }
                console.log("pressed key 2 ");
            });
            key_3.on("pointerup", () => {
                if (!(key1 == 3 || key2 == 3 || key3 == 3)) {
                    console.log("wrong key ")
                    scene.socket.emit("decreaseCounter");
                    var incorrect = scene.add.sprite(200, 300, "incorrectImage");
                    incorrect.setScale(1).setPosition(500, 185);
                    function incorr() {
                        incorrect.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: incorr,
                        callbackScope: this,
                    });
                }
                else {
                    if (!(this.alreadyClickedKey3)) {
                        this.correct++;
                    }
                    this.alreadyClickedKey3++;
                    // this.correct++; 
                    // key_3.destroy(); 
                    var correctImage = scene.add.sprite(200, 300, "correctImage");
                    correctImage.setScale(1).setPosition(500, 185);
                    // correct.setScale(1).setPosition(500, 185);
                    function corr() {
                        correctImage.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: corr,
                        callbackScope: this,
                    });
                    console.log(this.correct);
                    if (this.correct === 3) {
                        console.log('hfhiuhf');
                        scene.socket.emit('showWinScene');

                    }
                }
                console.log("pressed key 3 ");
            });
            key_4.on("pointerup", () => {

                if (!(key1 == 4 || key2 == 4 || key3 == 4)) {
                    console.log("wrong key ")
                    scene.socket.emit("decreaseCounter");
                    var incorrect = scene.add.sprite(200, 300, "incorrectImage");
                    incorrect.setScale(1).setPosition(500, 185);
                    function incorr() {
                        incorrect.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: incorr,
                        callbackScope: this,
                    });
                }
                else {
                    if (!(this.alreadyClickedKey4)) {
                        this.correct++;
                    }
                    this.alreadyClickedKey4++;
                    // this.correct++; 
                    // key_4.destroy(); 
                    var correctImage = scene.add.sprite(200, 300, "correctImage");
                    correctImage.setScale(1).setPosition(500, 185);
                    // correct.setScale(1).setPosition(500, 185);
                    function corr() {
                        correctImage.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: corr,
                        callbackScope: this,
                    });
                    console.log(this.correct);
                    if (this.correct === 3) {
                        console.log('hfhiuhf');
                        scene.socket.emit('showWinScene');

                    }
                }
                console.log("pressed key 4 ");
            });
            key_5.on("pointerup", () => {
                if (!(key1 == 5 || key2 == 5 || key3 == 5)) {
                    console.log("wrong key ")
                    var incorrect = scene.add.sprite(200, 300, "incorrectImage");
                    incorrect.setScale(1).setPosition(500, 185);
                    function incorr() {
                        incorrect.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: incorr,
                        callbackScope: this,
                    });
                    scene.socket.emit("decreaseCounter");
                }
                else {
                    if (!(this.alreadyClickedKey5)) {
                        this.correct++;
                    }
                    this.alreadyClickedKey5++;
                    // this.correct++; 
                    // key_5.destroy(); 
                    var correctImage = scene.add.sprite(200, 300, "correctImage");
                    correctImage.setScale(1).setPosition(500, 185);
                    function corr() {
                        correctImage.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: corr,
                        callbackScope: this,
                    });
                    console.log(this.correct);
                    if (this.correct === 3) {
                        console.log('hfhiuhf');
                        scene.socket.emit('showWinScene');

                    }
                }
                console.log("pressed key 5 ");
            });
            key_6.on("pointerup", () => {
                if (!(key1 == 6 || key2 == 6 || key3 == 6)) {
                    console.log("wrong key ")
                    var incorrect = scene.add.sprite(200, 300, "incorrectImage");
                    incorrect.setScale(1).setPosition(500, 185);
                    function incorr() {
                        incorrect.destroy();
                    }
                    scene.time.addEvent({
                        delay: 1000,
                        callback: incorr,
                        callbackScope: this,
                    });
                    scene.socket.emit('decreaseCounter');
                }
                else {
                    if (!(this.alreadyClickedKey6)) {
                        this.correct++;
                    }
                    this.alreadyClickedKey6++;
                    // this.correct++; 
                    console.log(this.correct);
                    var correctImage = scene.add.sprite(200, 300, "correctImage");
                    correctImage.setScale(1).setPosition(500, 185);
                    function corr() {
                        correctImage.destroy();
                    }
                    scene.time.addEvent({
                        delay: 200,
                        callback: corr,
                        callbackScope: this,
                    });
                    // key_6.destroy(); 
                    if (this.correct === 3) {
                        console.log('hfhiuhf');
                        scene.socket.emit('showWinScene');

                    }
                }
                console.log("pressed key 6 ");
            });


        });
        this.socket.on("displaySideTaskOne", function (arg) {
            console.log("displaySideTaskOne");
            console.log(arg);
            const { playerId, playerNum, key } = arg;
            var keyImage = scene.add.sprite(250, 300, `key` + key + `Image`);
            keyImage.setScale(5).setPosition(475, 350);
            console.log(key);

            scene.add.text(320, 50, "Describe your key!", {
                fontFamily: "Chela One",
                fontSize: 45,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 12,
            });
        });

        this.socket.on("counter", function (counter) {
            console.log(counter);
        });

        this.socket.on("lost", function (roomKey) {
            console.log("Lost!");
            scene.scene.start("LostScene", {
                ...scene.state,
                socket: scene.socket,
                roomKey: scene.roomKey,
            });
        });
    }

    update() {
    }
}
