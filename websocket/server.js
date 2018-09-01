var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  var loginUsers = []; //ログインユーザ

  // ログイン処理
  socket.on('login', function(userInfo){
    loginUsers[userInfo.userID] = userInfo.userName;
  });

  // メッセージ送信処理
  socket.on('message', function(msg){
    userName = loginUsers[socket.id];
    io.emit('message', {
      userName: userName,
      message: msg
    });
  });
});

server.listen(3000);
