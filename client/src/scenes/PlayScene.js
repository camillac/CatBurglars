export default class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.state = {};
    }

    preload() {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        );

        /*this.load.image(
            "background",
            "client/assets/backgrounds/blob-scene-haikei (6).png"
        );*/
        this.load.image("PlayerScene_Bg", "client/assets/sprites/backgroundColorGrass.png");
        this.load.image("grass1","client/assets/sprites/fish/bush3.png")
        this.load.image("Back", "client/assets/sprites/Button2.png");
        this.load.image("Grass_PlayScene","client/assets/sprites/fish/bush2.png");
        this.load.image("puff", "client/assets/sprites/whitePuff01.png");

        // ------- PLUGIN FOR SHAKE----
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshakepositionplugin.min.js';
        this.load.plugin('rexshakepositionplugin', url, true);
    }

    create() {
        var add = this.add;
        const scene = this;

        const background = this.add.image(400, 300, "PlayerScene_Bg");
        background.setScale(1.0);

        const Home= this.add.image(650,360,"House_main");
        Home.setScale(1);
        //-----------------------CAT ASSETS-------------------
        /*const cat1 = this.add.image(100,200,"Cats_1");
         cat1.setScale(0.3);
         const cat2 = this.add.image(130,200,"Cats_2");
         cat2.setScale(0.3);
         const cat3 = this.add.image(160,200,"Cats_3");
         cat3.setScale(0.3);
         const cat4 = this.add.image(190,200,"Cats_4");
         cat4.setScale(0.3);*/
        //----------------------- GRASS ASSETS------------------
        const Bush1 = this.add.image(100,420,"Grass_PlayScene");
        Bush1.setScale(0.75);
        Bush1.setDepth(1);
        const Bush2 = this.add.image(300,420,"Grass_PlayScene");
        Bush2.setScale(0.75);
        Bush2.setDepth(1);
        const Bush3 = this.add.image(500,420,"Grass_PlayScene");
        Bush3.setScale(0.75);
        Bush3.setDepth(1);
        const Bush4 = this.add.image(700,420,"Grass_PlayScene");
        Bush4.setScale(0.75);
        Bush4.setDepth(1);

        //------------------------ SMOKE SPRITE--------------------
        const smoke = this.add.image(300,300,"puff");
        smoke.setScale(0.2);
        const Smoke_tween = scene.tweens.add({
            targets: smoke,
            y: { from: 290, to: 180},
            x: {from:720, to:730},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: -1,
            yoyo: false,

        });

       //------------------------GRASS TWEEN----------------------
       scene.tweens.add({
        targets:Bush1,
       // y: { from: 350, to: 300},
        x: {from:200, to:250},
        duration: 10000,
        ease: "linear",
        //ease:'bounce.out', 
        repeat: 50, 
        yoyo: false,
        scale: {from:0.5, to:0.75}
    });
       scene.tweens.add({
            targets:Bush2,
           // y: { from: 350, to: 300},
            x: {from:300, to:350},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: 50, 
            yoyo: false,
            scale: {from:0.5, to:0.75}
        });
        scene.tweens.add({
            targets: (Bush3),
           // y: { from: 350, to: 300},
            x: {from:400, to:450},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: 50, 
            yoyo: false,
            scale: {from:0.5, to:0.75}
        })
        scene.tweens.add({
            targets: (Bush4),
           // y: { from: 350, to: 300},
            x: {from:500, to:550},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: 50, 
            yoyo: false,
            scale: {from:0.5, to:0.75}
        })

        //----------------END OF GRASS TWEENS---------------------

        //---------------START OF CAT TWEENS-----------------
        var cat1 = scene.add.image(100,420,"Cats_1");
        cat1.setScale(0.3);
        scene.tweens.add({
            targets: cat1,
            x: {from:500, to:550},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: 50, 
            yoyo: false,
            scale: {from:0.1, to:0.3}

        });
        var cat2 = scene.add.image(100,420,"Cats_2");
        cat2.setScale(0.3);
        scene.tweens.add({
            targets: cat2,
            x: {from:400, to:450},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: 50, 
            yoyo: false,
            scale: {from:0.1, to:0.3}

        });

        var cat3 = scene.add.image(100,420,"Cats_3");
        cat3.setScale(0.3);
        scene.tweens.add({
            targets: cat3,
            x: {from:300, to:350},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: 50, 
            yoyo: false,
            scale: {from:0.1, to:0.3}

        });

        var cat4 = scene.add.image(100,420,"Cats_4");
        cat4.setScale(0.3);
        scene.tweens.add({
            targets: cat4,
            x: {from:200, to:250},
            duration: 10000,
            ease: "linear",
            //ease:'bounce.out', 
            repeat: 50, 
            yoyo: false,
            scale: {from:0.1, to:0.3}

        })

        WebFont.load({
            google: {
                families: ["Black Ops One"],
            },
            active: function () {
                // Title
                add.text(15, 110, "Cat", {
                    fontFamily: "Black Ops One",
                    fontSize: 95,
                    color: "#f1c582",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
                add.text(185, 110, "Burglars", {
                    fontFamily: "Black Ops One",
                    fontSize: 95,
                    color: "#f1c582",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
                add.text(655, 110, ".io", {
                    fontFamily: "Black Ops One",
                    fontSize: 95,
                    color: "#f1c582",
                    fontStyle: "normal",
                    stroke: "#000000",
                    strokeThickness: 8,
                });
        
                // Create lobby button
                const createButton = add
                    .text(400, 325, "Create A Lobby", {
                        fontFamily: "Black Ops One",
                        fontSize: 50,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 8,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);

                // Back button
               /* const backButton = add.image(70,25,"Back");
                backButton.setScale(0.15)*/
                  
                const backButton = add.text(60, 25, "Back", {
                        fontFamily: "Black Ops One",
                        fontSize: 25,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 8,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10);
        

                // Join lobby button
                const joinButton = add
                    .text(400, 450, "Join A Lobby", {
                        fontFamily: "Black Ops One",
                        fontSize: 50,
                        color: "#FFFBF4",
                        fontStyle: "normal",
                        stroke: "#000000",
                        strokeThickness: 8,
                    })
                    .setOrigin(0.5)
                    .setPadding(10, 10, 10, 10)
                    .setDepth(5);

                createButton.setInteractive();
                backButton.setInteractive();
                joinButton.setInteractive();

                // Back button events
                backButton.on("pointerover", () => {
                    backButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                backButton.on("pointerout", () => {
                    backButton.setStyle({
                        color: "#FFFBF4",
                    });
                });
                backButton.on("pointerup", () => {
                    backButton.destroy();

                    scene.scene.start("MainScene", {
                        ...scene.state,
                        socket: scene.socket,
                    });
                });

                // Play button events
                createButton.on("pointerover", () => {
                    createButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                createButton.on("pointerout", () => {
                    createButton.setStyle({
                        color: "#FFFBF4",
                    });
                });
                createButton.on("pointerup", () => {
                    scene.scene.start("CreateLobbyScene", {
                        ...scene.state,
                        socket: scene.socket,
                    });
                });

                // Join button events
                joinButton.on("pointerover", () => {
                    joinButton.setStyle({
                        color: "#FFEBB9",
                    });
                });
                joinButton.on("pointerout", () => {
                    joinButton.setStyle({
                        color: "#FFFBF4",
                    });
                });
                joinButton.on("pointerup", () => {
                    scene.scene.start("JoinLobbyScene", {
                        ...scene.state,
                        socket: scene.socket,
                    });
                });
            },
        });
    }

    update() { }
}
