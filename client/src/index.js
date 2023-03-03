import config from './config/config.js';
import MainScene from './scenes/MainScene.js';
import HowtoPlayScene from './scenes/HowtoPlayScene.js';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    
    this.scene.add("MainScene", MainScene);
    this.scene.add("HowtoPlayScene", HowtoPlayScene);

    this.scene.start("MainScene");
  }
}

window.onload = function () {
  window.game = new Game();
};

/*
preload ()
{
  // this.load.html("how_to_play", "client/assets/how_to_play.html");
  this.load.setBaseURL('http://labs.phaser.io');
  this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'); // google font API
}

create ()
{
  this.socket = io();
  var add = this.add;

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
      }
  });
}
*/