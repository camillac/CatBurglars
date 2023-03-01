export default {
    type: Phaser.AUTO, // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
    // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
    width: 800, 
    height: 600,
    backgroundColor: '#FCFBF4', 
    render: {
      pixelArt: true,
    },
    scale: {
      parent: "game",
      autoCenter: true,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }, 
        debug: false, // Whether physics engine should run in debug mode
      },
    },
    dom: {
      createContainer: true,
    },
    scene: [],
};