// import Phaser from "phaser";
const Phaser = require('phaser');

export default class TaskScene extends Phaser.Scene {
  constructor() {
    super("TaskScene");
  }
//   init(data) {
//     this.roomKey = data.roomKey;
//     this.players = data.players;
//     this.numPlayers = data.numPlayers;
//     this.socket = data.socket;
//   }
  preload() {
    // this.load.image("computer", "assets/backgrounds/computer.png");
    this.load.setBaseURL('http://labs.phaser.io');
  this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'); // google font API
  }

    create ()
  {
    this.socket = io();
    var add = this.add;
    var text = null;
    WebFont.load({
      google: {
          families: [ 'Chela One' ]
      },
      active: function ()
        {
          // title
          add.text(125, 110, 'Cat', { 
            fontFamily: 'Chela One', 
            fontSize: 100, 
            color: '#F8F0C6' 
          });
          add.text(250, 110, 'Burglars', { 
            fontFamily: 'Chela One', 
            fontSize: 100, 
            color: '#C1A87D' 
          });
          add.text(565, 110, '.io', { 
            fontFamily: 'Chela One', 
            fontSize: 100, 
            color: '#EFC482' 
          });
  
          // buttons
          const playButton = add.text(400, 325, 'Start', { 
            fontFamily: 'Chela One', 
            fontSize: 60, 
            color: '#FFFBF4', 
            backgroundColor: "#C1A87D"
          })
            .setOrigin(0.5)
            .setPadding(10,10,10,10);
          const howToPlayButton = add.text(400, 440, 'How To Play', { 
            fontFamily: 'Chela One', 
            fontSize: 60, 
            color: '#FFFBF4', 
            backgroundColor: "#C1A87D"
          })
            .setOrigin(0.5)
            .setPadding(10,10,10,10);
  
          playButton.setInteractive();
          howToPlayButton.setInteractive();
          howToPlayButton.on('pointerdown', () => { console.log('pointerover');  scene.scene.start("TaskScene"); });
        }
    });
  }
}
