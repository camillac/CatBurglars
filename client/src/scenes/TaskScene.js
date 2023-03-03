
/** @type {import("../types/phaser")} */
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

  this.load.image('sky', 'assets/skies/space3.png');
  console.log("fhuiehf");
  }
  create() {
    const scene = this;
    this.add.image(400, 320, "sky");
  }
}
