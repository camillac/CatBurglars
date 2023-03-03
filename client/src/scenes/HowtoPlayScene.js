export default class HowtoPlayScene extends Phaser.Scene {
    constructor() {
      super("HowtoPlayScene");
      this.state = {};
      this.hasBeenSet = false;
    }
  
    init(data) {
        this.socket = data.socket;
      }
    preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const scene = this;
        // this.socket = io();
        var box = scene.add.group();

                    var instructions = scene.add.text(400, 300, "These are instructions!", {
                        fontFamily: 'Chela One',
                        fontSize: 50,
                        color: '#FFFBF4',
                        backgroundColor: "#C1A87D"
                    })
                        .setOrigin(0.5)
                        .setPadding(200, 200, 200, 200);

                    var closeButton = scene.add.text(400, 450, "Close", {
                        fontFamily: 'Chela One',
                        fontSize: 50,
                        color: '#FFFBF4',
                    })
                        .setOrigin(0.5)
                        .setPadding(10, 10, 10, 10)
                        .setInteractive();

                    box.add(instructions);
                    box.add(closeButton);

                    closeButton.on('pointerup', () => {
                        instructions.destroy();
                        closeButton.destroy();
                        box.destroy();
                    })
    }

    update() {}
}