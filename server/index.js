const path = require('path');
const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const socketio = require('socket.io');
module.exports = app;

const createApp = () => {
  app.use('/client', express.static(__dirname + '/../client'));

  app.use('*', (req, res) => {
    res.sendFile('/client/assets/index.html', { root: __dirname + '/../' });
  });
};

const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(`Listening on http://localhost:${PORT}`)
  );
  const io = socketio(server);
  require('./src/sockets')(io);
};

async function bootApp() {
  await createApp();
  await startListening();
};

bootApp();
