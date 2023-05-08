// the inspiration and general outline for a lot of functionality of 
// this task is attributed to this tutorial: https://www.youtube.com/watch?v=hkedWHfU_oQ&list=PLDyH9Tk5ZdFzEu_izyqgPFtHJJXkc79no&index=10

import Sidebar from "./Sidebar.js";

export default class FinalTask extends Phaser.Scene {
    constructor() {
        super("FinalTask");
        this.state = {};
    }
    init(data) {
        this.socket = data.socket;
        this.roomKey = data.roomKey;
        this.playerNum = data.playerNum;
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
        this.load.image("basket", "client/assets/sprites/basket.png");
        

        // Load fish images
        for (let i = 1; i <= 4; i++) {
            this.load.image(`fish${i}`, `client/assets/sprites/fish/fish${i}.png`);
        }

        //load background
        this.scene.run("FinalTask");
        this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );
    }

    create() {
        const scene = this;
        scene.state.start_game = false; // flag to tell fish when to start falling
        scene.state.fishCaughtN = 0; 
        // Setting up background for the game
        const background = this.add.image(400, 300, "background");
        background.setScale(2.0);

        // tell backend to start task
        if (scene.socket.id === this.start) {
            this.socket.emit("startFinalTask", this.roomKey, scene.socket.id);
        }

        // Sidebar Set Up
        const sidebar = new Sidebar(
            scene,
            this.game.config.width,
            this.game.config.height,
            scene.players,
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

        this.socket.on("startTimerEXFinal", function (arg) {
            console.log("IN TIMRE EX");
            const { roomKey, counter } = arg;
            scene.socket.emit("startTimerFinal", roomKey, counter);
        });

        // wait for other players until everybody syncs
        scene.waiting = scene.add.text(
            180,
            30,
            "Waiting for other players.. ",
            {
                fontFamily: "Black Ops One",
                fontSize: 40,
                color: "#FFFFFF",
                fontStyle: "normal",
                stroke: "#000000",
                strokeThickness: 8,
            }
        );

        // create and manage fish sprites
        scene.fish1 = this.add.image(Phaser.Math.Between(this.game.config.width / 4, this.game.config.width), (-10), "fish1");
        scene.fish1.setScale(0.1);
        scene.fish2 = this.add.image(Phaser.Math.Between(this.game.config.width / 4, this.game.config.width), (-10), "fish2");
        scene.fish2.setScale(0.1);
        scene.fish3 = this.add.image(Phaser.Math.Between(this.game.config.width / 4, this.game.config.width), (-10), "fish3");
        scene.fish3.setScale(0.1);
        scene.fish4 = this.add.image(Phaser.Math.Between(this.game.config.width / 4, this.game.config.width), (-10), "fish4");
        scene.fish4.setScale(0.1);

        scene.fish1.setInteractive();
        scene.fish2.setInteractive();
        scene.fish3.setInteractive();
        scene.fish4.setInteractive();

        this.fishies = this.physics.add.group();
        this.fishies.add(this.fish1);
        this.fishies.add(this.fish2);
        this.fishies.add(this.fish3);
        this.fishies.add(this.fish4);


        // *** Host and other players are separated in case we need it for backend, but
        // *** there is no UI difference for this task as of now between them
        // Main Player Final Task Display
        this.socket.on("displayFinal", function (arg) {
            // destroy "Waiting for players..."
            scene.waiting.destroy();

            // tell update() to start moving fish
            scene.state.start_game = true;

            const { playerId, playerNum } = arg;
            var dragBasket = scene.add.text(170, 20, "Drag the basket to Catch at least 30 Fish!", {
                fontFamily: "Black Ops One",
                fontSize: 27,
                color: "black",
                align: "center",
            });
            /*var fishCatch = scene.add.text(250, 40, "at least 30 fish!", {
               fontFamily: "Black Ops One",
                fontSize: 40,
                color: "black",
                align: "center",
            });*/
            // Fish Caught text 
            var fishCaught = scene.add.text(200, 550, "Fish Caught: ", {
                fontFamily: "Black Ops One",
                fontSize: 30,
                color: "black",
                align: "center",
            });
            var fishCaughtNumber = scene.add.text(400, 550, "", {
                fontFamily: "Black Ops One",
                fontSize: 40,
                color: "black",
                align: "center",
            });
            // credit: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/input/dragging/drag%20horizontally.js
            // create basket and allow it to be dragged
            // ** boundaries are not working, need to fix so that it doesnt overlap sidebar
            var basket = scene.physics.add.sprite(scene.game.config.width / 2, scene.game.config.height - 200, "basket");
            basket.setScale(0.5);
            basket.setInteractive({ draggable: true });

            basket.body.onOverlap = true;

            // credit: https://labs.phaser.io/edit.html?src=src/physics/arcade/overlap%20event.js
            // collision event with basket+fish
            scene.physics.add.overlap(basket, scene.fishies);
            scene.physics.world.on('overlap', (basket, fish, basketbody, fishbody) =>
            {
                // this is the resetFish code, for some reason it was not letting me call it
                fish.y = 0;
                var randomX = Phaser.Math.Between(scene.game.config.width / 4, scene.game.config.width - 10);
                fish.x = randomX;
                scene.state.fishCaughtN +=1; 
                fishCaughtNumber.text = scene.state.fishCaughtN; 
                console.log(scene.state.fishCaughtN); 
                if(scene.state.fishCaughtN ==30){
                    console.log("GOT ALL 30"); 
                    scene.socket.emit("gotAllFish", scene.roomKey, scene.socket.id ); 
                }
            })
        });

        // credit: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/input/dragging/drag%20horizontally.js
        this.input.on('drag', (pointer, gameObject, dragX) => {
            dragX = Phaser.Math.Clamp(dragX, scene.game.config.width / 5, scene.game.config.width);

            gameObject.x = dragX;
        });

        // timer text connected with socket
        var timerFinal = scene.add.text(750, 550, "", {
            fontFamily: "Black Ops One",
            fontSize: 40,
            color: "black",
            align: "center",
        });

        

        this.socket.on("counterFinal", function (counterFinal) {
            timerFinal.text = counterFinal;
        });

        this.socket.on("endGameFinal", function (newKey) {
            scene.socket.emit("stopTimerFinal", newKey);
        });

        // win condition
        this.socket.on("winFinal", function (roomKey) {
            console.log("Won!");
            scene.scene.start("WinningScene", {
                ...scene.state,
                socket: scene.socket,
                roomKey: scene.roomKey,
            });
        });

        // lost condition
        this.socket.on("lostFinal", function (roomKey) {
            console.log("Lost!");
            scene.scene.start("LostScene", {
                ...scene.state,
                socket: scene.socket,
            });
        });
    }

    update() {
        // starts fish once waiting for players text is destroyed
        if (this.state.start_game === true) {
            this.moveFish(this.fish1, 3);
            this.moveFish(this.fish2, 4);
            this.moveFish(this.fish3, 5);
            this.moveFish(this.fish4, 6);
        }
    }

    // moves fish down screen and resets them once they leave the screen
    moveFish(fish, speed) {
        fish.y += speed;
        if (fish.y > this.game.config.height) {
            this.resetFish(fish);
        }
    }

    // sets fish back to top of screen
    resetFish(fish) {
        fish.y = 0;
        var randomX = Phaser.Math.Between(this.game.config.width / 4, this.game.config.width - 10);
        fish.x = randomX;
    }
}


