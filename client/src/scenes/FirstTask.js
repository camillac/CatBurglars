import Sidebar from "./Sidebar.js";

export default class FirstTask extends Phaser.Scene {
    constructor() {
        super("FirstTask");
        this.state = {};
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerNum = data.playerNum;
        this.playerName = data.playerName;
        // console.log(this.socket.id);
        console.log(this.playerName);
        this.players = data.players;
        this.start = data.start;
    }
    preload() {
        //load cats/players
        this.load.image("Player_1", "client/assets/sprites/player1.png");
        this.load.image("Player_2", "client/assets/sprites/player2.png");
        this.load.image("Player_3", "client/assets/sprites/player3.png");
        this.load.image("Player_4", "client/assets/sprites/player4.png");
        this.load.image("settings", "client/assets/sprites/settings_icon.png");
        this.load.image("key1Image", "client/assets/sprites/key1.png");
        this.load.image("key2Image", "client/assets/sprites/key2.png");
        this.load.image("key3Image", "client/assets/sprites/key3.png");
        this.load.image("key4Image", "client/assets/sprites/key4.png");
        this.load.image("key5Image", "client/assets/sprites/key5.png");
        this.load.image("key6Image", "client/assets/sprites/key6.png");
        this.load.image("correctImage", "client/assets/sprites/correct.png");
        this.load.image(
            "incorrectImage",
            "client/assets/sprites/incorrect.png"
        );

        //load background
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

        if (scene.socket.id == this.start) {
            scene.socket.emit("startTaskOne", this.roomKey, 1, scene.socket.id);
        }

        // Sidebar Set Up
        let sidebar = new Sidebar(
            scene,
            this.game.config.width,
            this.game.config.height,
            this.roomKey,
            scene.socket
        );

        // DISCONNECT
        this.socket.on("backToLobby", function (arg) {
            console.log("LOBBYSCENE");
            const { roomKey } = arg;

            scene.scene.start("LobbyScene", {
                ...scene.state,
                socket: scene.socket,
                roomKey: roomKey,
                playerName: this.playerName,
            });
        });

        this.socket.on("startTimerEX", function (arg) {
            const { roomKey, counter } = arg;
            scene.socket.emit("startTimer", roomKey, counter);
        });

        // wait for other players until everybody syncs
        scene.waiting = scene.add.text(
            290,
            30,
            "Waiting for other players.. ",
            {
                fontFamily: "Chela One",
                fontSize: 45,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 12,
            }
        );

        // Main Player Display
        this.socket.on("displayMainTaskOne", function (arg) {
            scene.waiting.destroy();
            console.log("displayMainTaskOne");
            scene.add.text(290, 30, "Choose the right keys!", {
                fontFamily: "Chela One",
                fontSize: 45,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 12,
            });

            const { playerId, playerNum, key1, key2, key3 } = arg;

            // position and scale sprites
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

            scene.correct = 0;
            scene.alreadyClickedKeys = [];
            console.log(key1, key2, key3);

            // key actions
            key_1.on("pointerup", () => {
                scene.isCorrectKey(scene, 1, key1, key2, key3, 330, 250);
                console.log("pressed key 1 ");
            });
            key_2.on("pointerup", () => {
                scene.isCorrectKey(scene, 2, key1, key2, key3, 480, 250);
                console.log("pressed key 2 ");
            });
            key_3.on("pointerup", () => {
                scene.isCorrectKey(scene, 3, key1, key2, key3, 630, 250);
                console.log("pressed key 3 ");
            });
            key_4.on("pointerup", () => {
                scene.isCorrectKey(scene, 4, key1, key2, key3, 330, 450);

                console.log("pressed key 4 ");
            });
            key_5.on("pointerup", () => {
                scene.isCorrectKey(scene, 5, key1, key2, key3, 480, 450);
                console.log("pressed key 5 ");
            });
            key_6.on("pointerup", () => {
                scene.isCorrectKey(scene, 6, key1, key2, key3, 630, 450);
                console.log("pressed key 6 ");
            });

            // hover effect on keys
            key_1.on("pointerover", () => {
                key_1.setAlpha(0.75);
            });
            key_1.on("pointerout", () => {
                key_1.setAlpha(1);
            });

            key_2.on("pointerover", () => {
                key_2.setAlpha(0.75);
            });
            key_2.on("pointerout", () => {
                key_2.setAlpha(1);
            });

            key_3.on("pointerover", () => {
                key_3.setAlpha(0.75);
            });
            key_3.on("pointerout", () => {
                key_3.setAlpha(1);
            });

            key_4.on("pointerover", () => {
                key_4.setAlpha(0.75);
            });
            key_4.on("pointerout", () => {
                key_4.setAlpha(1);
            });

            key_5.on("pointerover", () => {
                key_5.setAlpha(0.75);
            });
            key_5.on("pointerout", () => {
                key_5.setAlpha(1);
            });

            key_6.on("pointerover", () => {
                key_6.setAlpha(0.75);
            });
            key_6.on("pointerout", () => {
                key_6.setAlpha(1);
            });
        });

        // Side Task Display
        this.socket.on("displaySideTaskOne", function (arg) {
            scene.waiting.destroy();
            console.log("displaySideTaskOne");
            const { playerId, playerNum, key } = arg;
            var keyImage = scene.add.sprite(250, 300, `key` + key + `Image`);
            keyImage.setScale(5).setPosition(475, 350);

            scene.add.text(320, 50, "Describe your key!", {
                fontFamily: "Chela One",
                fontSize: 45,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 12,
            });
        });

        // timer text connected with socket
        var timer = scene.add.text(750, 550, "", {
            fontFamily: "Chela One",
            fontSize: 40,
            color: "black",
            align: "center",
        });
        this.socket.on("counter", function (counter) {
            timer.text = counter;
        });

        this.socket.on("endGame", function (newKey) {
            scene.socket.emit("stopTimer", newKey);
        });

        this.socket.on("win", function (roomKey) {
            console.log("Won!");
            scene.scene.start("WinningScene", {
                ...scene.state,
                socket: scene.socket,
                roomKey: scene.roomKey,
            });
        });

        // lost condition
        this.socket.on("lost", function (roomKey) {
            console.log("Lost!");
            scene.scene.start("LostScene", {
                ...scene.state,
                socket: scene.socket,
            });
        });
    }

    update() {
        // this.socket.on("disconnected", function (arg) {
        //     console.log("LOBBYSCENE");
        //     scene.scene.start("LobbyScene", {
        //         ...scene.state,
        //         socket: scene.socket,
        //         roomKey: roomKey,
        //         playerName: this.playerName,
        //     });
        // });
    }

    // Check if the Key selected is correct/incorrect
    isCorrectKey(scene, currentKey, key1, key2, key3, posX, posY) {
        // if the key is incorrect
        if (!(key1 == currentKey || key2 == currentKey || key3 == currentKey)) {
            scene.socket.emit("decreaseCounter");
            var incorrect = scene.add.sprite(200, 300, "incorrectImage");
            incorrect.setScale(1).setPosition(posX, posY);
            // destroy the incorrect image
            function incorr() {
                incorrect.destroy();
            }
            scene.time.addEvent({
                delay: 200,
                callback: incorr,
                callbackScope: this,
            });
        } else {
            // the key is correct
            if (scene.alreadyClickedKeys.length == 0) {
                scene.correct++;
                scene.alreadyClickedKeys.push(currentKey);
            }
            var hasNot = true; // check if the key has not been clicked
            scene.alreadyClickedKeys.forEach((element) => {
                if (element == currentKey) {
                    hasNot = false;
                }
            });
            if (hasNot) {
                scene.correct++;
                scene.alreadyClickedKeys.push(currentKey);
            }

            var correctImage = scene.add.sprite(200, 300, "correctImage");
            correctImage.setScale(1).setPosition(posX, posY);
            // destory the correct image
            function corr() {
                correctImage.destroy();
            }
            scene.time.addEvent({
                delay: 200,
                callback: corr,
                callbackScope: this,
            });
            console.log(scene.correct);
            // All 3 correct keys are pressed
            if (scene.correct === 3) {
                scene.socket.emit("showWinScene");
            }
        }
    }

    // Check if the Key selected is correct/incorrect
    isCorrectKey(scene, currentKey, key1, key2, key3, posX, posY) {
        // if the key is incorrect
        if (!(key1 == currentKey || key2 == currentKey || key3 == currentKey)) {
            scene.socket.emit("decreaseCounter");
            var incorrect = scene.add.sprite(200, 300, "incorrectImage");
            incorrect.setScale(1).setPosition(posX, posY);
            // destroy the incorrect image
            function incorr() {
                incorrect.destroy();
            }
            scene.time.addEvent({
                delay: 200,
                callback: incorr,
                callbackScope: this,
            });
        } else {
            // the key is correct
            if (scene.alreadyClickedKeys.length == 0) {
                scene.correct++;
                scene.alreadyClickedKeys.push(currentKey);
            }
            var hasNot = true; // check if the key has not been clicked
            scene.alreadyClickedKeys.forEach((element) => {
                if (element == currentKey) {
                    hasNot = false;
                }
            });
            if (hasNot) {
                scene.correct++;
                scene.alreadyClickedKeys.push(currentKey);
            }

            var correctImage = scene.add.sprite(200, 300, "correctImage");
            correctImage.setScale(1).setPosition(posX, posY);
            // destory the correct image
            function corr() {
                correctImage.destroy();
            }
            scene.time.addEvent({
                delay: 200,
                callback: corr,
                callbackScope: this,
            });
            console.log(scene.correct);
            // All 3 correct keys are pressed
            if (scene.correct === 3) {
                scene.socket.emit("showWinScene");
            }
        }
    }
}
