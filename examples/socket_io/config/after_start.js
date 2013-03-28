nails.io.sockets.on('connection', function(socket) {
  socket.emit('hello', {message: "world"});
  socket.on('message', function(message) {
    nails.log.notice(message);
  });
});
