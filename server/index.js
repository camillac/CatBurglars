// Imports
const path = require("path");
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const socketio = require("socket.io");
module.exports = app;
require('events').EventEmitter.defaultMaxListeners = 0

// Create the express app
const createApp = () => {
    app.use("/client", express.static(__dirname + "/../client"));

    app.use("*", (req, res) => {
        res.sendFile("/client/assets/index.html", { root: __dirname + "/../" });
    });
};

// Create the server
const startListening = () => {
    const server = app.listen(PORT, () =>
        console.log(`Listening on http://localhost:${PORT}`)
    );
    const io = socketio(server);
    require("./src/sockets")(io);
};

// Function to boot the server up
async function bootApp() {
    await createApp();
    await startListening();
}

// BOOT THE SERVER
bootApp();
