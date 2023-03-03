const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/client', express.static('../client'));

app.get('/', function(req, res) {
    res.sendFile('/client/views/index.html', { root: '../' });
});

io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(io.engine.clientsCount);
    if(io.engine.clientsCount == 4){
      console.log("4 users connected");
      app.get('/', function(req, res) {
        console.log("jifeoijf");
        res.sendFile('/client/views/start.html', { root: '../' });
        if (err) {
          next(err);
      } else {
          console.log('Sent:', fileName);
      }
    });
    }
    socket.on('disconnect', function () 
    {
      console.log('user disconnected');
    });
});

server.listen(8080, function () {
  console.log(`Listening on http://localhost:${server.address().port}`);
});