var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('sync-request');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function httpRequest(method, url, body) {
  var options = {
    method: method,
    url: url,
    body: body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json'
    },
  };
  return request(method, url, options);
}

io.on('connection', function(socket){

  var loginUsers = [];

  // ログイン処理
  socket.on('login', function(userInfo){
    loginUsers[userInfo.userID] = userInfo.userName;
  });

  // メッセージ処理
  socket.on('message', function(msg){
    userName = loginUsers[socket.id];
    io.emit('message', {
      userName: userName,
      message: msg
    });
    httpRequest(
      "POST",
      "https://requestloggerbin.herokuapp.com/bin/bf985753-3191-47f1-b014-9324d1126aa8",
      Buffer.alloc(
        128,
        { userName: userName, message: msg }
      )
    )
  });
});

server.listen(3000);
