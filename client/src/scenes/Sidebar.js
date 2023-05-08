class Sidebar extends Phaser.GameObjects.Container {

  preload() {
    this.load.image("player1", "client/assets/sprites/player1.png");
    this.load.image("player2", "client/assets/sprites/player2.png");
    this.load.image("player3", "client/assets/sprites/player3.png");
    this.load.image("player4", "client/assets/sprites/player4.png");
  }
  constructor(scene, width, height, roomkey, socket) {
    super(scene, width, height);
    this.scene = scene; // scene that is requesting sidebar
    this.width = width; // width of screen
    this.height = height; // height of screen
    this.roomkey = roomkey; // player data
    this.socket = socket; // socket data
    this.roomList = [];
    // this.scene.add.existing(this);
    let increment = 0;

    // Rectangle background for sidebar
    const menu = this.scene.add.graphics();
    menu.fillStyle(0xf6f0e3, 1);
    menu.fillRect(0, 0, this.width / 5, this.height);
    const menu_side = this.scene.add.graphics();
    menu_side.fillStyle(0xfffaf0, 1);
    menu_side.fillRect(this.width / 5, 0, 7, this.height);

    //Add Players Sprite
    scene.circle = this.scene.add.graphics();
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(85, 70, 50);

    // Player 2
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(85, 190, 50);

    // Player 3
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(85, 310, 50);

    // Player 4
    scene.circle.fillStyle(0xe8ded1, 1);
    scene.circle.fillCircle(85, 430, 50);

    console.log(this.roomkey);
    socket.emit("getRooms", {});

    socket.on("getRooms", (data) => {
      console.log(data);
      var rooms = Object.values(data);

      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomKey == this.roomkey) {
          this.roomList.push(rooms[i]);
        }
      }
      let players = this.roomList[0].players;

      // destroy prevoius players before adding new ones
      if (scene.currentPlayer) {
        scene.currentPlayer.destroy();
        scene.playerNames.destroy();
        // scene.playerNames.destroy();
      }
      if (scene.otherPlayers) {
        scene.otherPlayers.destroy();
        scene.playerNames.destroy();
        increment = 0;
      }
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === scene.socket.id) {
          // add current player
          var circle = scene.circle.fillStyle(0xffffff, 1);
          circle.fillCircle(85, 70, 50);
          scene.currentPlayer = scene.add
            .sprite(85, 70, "player" + players[id].playerNum)
            .setScale(0.5);
          scene.playerNames = scene.add.text(85, 130, players[id].playerName, {
            fontSize: "24px",
            color: "#000000",
            fontFamily: "Chela One",
          });
          scene.playerNames.setOrigin(0.5);
          scene.playerNames.setWordWrapWidth(100, true);
          scene.playerNames.setAlign("center");
          scene.playerNames.setDepth(1);
          scene.currentPlayer.setDepth(1);
        } else {
          scene.otherPlayers = scene.add
            .sprite(85, 190 + increment, "player" + players[id].playerNum)
            .setScale(0.5);
          scene.playerNames = scene.add.text(85, 190 + increment + 60, players[id].playerName, {
            fontSize: "24px",
            color: "#000000",
            fontFamily: "Chela One",
          });
          scene.playerNames.setOrigin(0.5);
          scene.playerNames.setWordWrapWidth(100, true);
          scene.playerNames.setAlign("center");
          scene.playerNames.setDepth(1);
          scene.otherPlayers.setDepth(1);
          increment += 120;
        }
      });
    });
    // Add the setting wheel button
    /*
    const settingsBtn = this.scene.add
      .image(width / 9.5, 535, "settings")
      .setInteractive();
    settingsBtn.setScale(0.5);
    settingsBtn.on("pointerup", () => {
      // Open the settings popup
      showSettingsPopup();
    });*/

    /*function showSettingsPopup() {
      // Create and display the settings popup
      const popup = scene.add.container(width / 2, height / 2);
      const background = scene.add.graphics();
      background.fillStyle(0xffffff, 1);
      background.fillRect(-150, -150, 300, 300);
      const closeButton = scene.add
        .text(0, 100, "Close", {
          fontSize: "24px",
          color: "#000000",
          fontFamily: "Chela One",
        })
        .setOrigin(0.5)
        .setInteractive();
      closeButton.on("pointerup", () => {
        // Close the popup
        popup.destroy();
      });
      popup.add(background);
      popup.add(closeButton);
      // Pop Up Settings
    }*/

  } // end of constructor

}

export default Sidebar;
