export default class FirstTask_Instruction extends Phaser.Scene {
    constructor() {
        super("FirstTask_Instruction");
        this.state = {};
        this.hasBeenSet = false;
    }
    init(data) {
        this.socket = data.socket;
    }

    preload() {
        this.load.image('Scroll','client/assets/sprites/scroll.png');
        this.load.image('Background','client/assets/backgrounds/blob-scene-haikei (6).png')
    }

    create() { 
        const scene = this;
        const background = this.add.image(400,300,"Background");
        background.setScale(2);
        //background.setScale(1);
       // const scroll = this.add.image(400,300,"Scroll");
       var sky = this.add.image(400,300,"Sky");
        sky.setScale(4.0);

        var Clouds_bg1 = this.add.tileSprite(400,470,800,1000,"Clouds_small");
        var Clouds_bg2 = this.add.tileSprite(400,470,800,1000,"big_clouds");
        scene.tweens.add({
            targets: Clouds_bg1,
            tilePositionX: { from: 0, to: 180},
            ease: 'linear', 
            duration: 8000, 
            repeat: -1, //Infinity Times 
            yoyo: (true, 2000)
        });
        scene.tweens.add({
            targets: Clouds_bg2,
            tilePositionX: { from: 0, to: 180},
            ease: 'linear', 
            duration: 8000, 
            repeat: -1, //Infinity Times
            yoyo: false
        });
        var instructions = scene.add.text(400, 300,
                "Communicate with your team and\ninsert the key in order.",
                {
                    fontFamily: "Chela One",
                    fontSize: 60,
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5);

            timedEvent = this.time.delayedCall(3000, onEvent, [], this);
            onEvent({ 
                
            })
    }
    update() {}


}
