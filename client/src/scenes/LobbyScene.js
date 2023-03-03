// import Phaser from "phaser";

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super("LobbyScene");
        this.state = {};
    }
    init(data) {
        this.socket = data.socket;
      }
    preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        // this.socket = io();
        var add = this.add;
        const scene = this;

        WebFont.load({
            google: {
                families: ['Chela One']
            },
            active: function () {
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
                
            }
        });
    }

    update() {}
}