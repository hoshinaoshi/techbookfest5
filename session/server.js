// execute "redis-server" when before start this script
var express      = require('express');
var session      = require('express-session');
var RedisStore   = require('connect-redis')(session);
var cookieParser = require('cookie-parser')
var request      = require('sync-request');
var redis        = require('redis');
var redisClient  = redis.createClient();
var app = express();

const SESSION_ID = 0123456789;

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

app.use(cookieParser());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
    prefix: 'sid:'
  }),
  cookie: {
    path: '/'
  }
}));

app.get('/', function (req, res) {
  var session_id = SESSION_ID //req.cookies.session_id || Math.random() * 100000000000000000;
  res.cookie('session_id', session_id , { maxAge:60000, httpOnly:false } );

  res.send('session_id: ' + session_id);
});

// curl -X POST http://localhost:3000/cart/items/:id
app.post('/cart/items/:id', function (req, res) {
  var id = req.params.id;
  redisClient.lpush(SESSION_ID, id, redis.print)
});

app.get('/cart', function (req, res) {
  var items = []
  redisClient.lrange(req.cookies.session_id, 0, 10, function(err, reply) {
    res.send('items: ' + reply);
  });
});

// curl -X POST http://localhost:3000/checkout
app.post('/checkout', function (req, res) {
  redisClient.lrange(req.cookies.session_id, 0, 10, function(err, reply) {
    httpRequest(
      "POST",
      "https://requestloggerbin.herokuapp.com/bin/bf985753-3191-47f1-b014-9324d1126aa8",
      Buffer.alloc(
        128,
        reply
      )
    )
  });
  redisClient.del(SESSION_ID);
});

app.listen(3000);
