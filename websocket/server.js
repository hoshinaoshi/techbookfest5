var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
 
// chatでメッセージを受信したらクライアント全体にキャスト
io.on('connection', (socket) => {
  socket.on('chat', (msg) => {
    io.emit('chat', msg);
  });
});
 
server.on('listening', () => {
  console.log('listening on 3000');
});
 
server.listen(3000);
