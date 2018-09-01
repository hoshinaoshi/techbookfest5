var express = require('express');
var app = express();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser')
var redis = require('redis');
var redisClient = redis.createClient();
const ACCESS_ID = 0123456789;

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

app.get('/cart', function (req, res) {
  var items = []
  redisClient.lrange(req.cookies.access_id, 0, 10, function(err, reply) {
    res.send('items: ' + reply);
  });
});

// curl -X POST http://localhost:3000/items/1
app.post('/items/:id', function (req, res) {
  var id = req.params.id;
  redisClient.lpush(ACCESS_ID, id, redis.print)
});


app.get('/', function (req, res) {
  var access_id = ACCESS_ID //req.cookies.access_id || Math.random() * 100000000000000000;
  res.cookie('access_id', access_id , { maxAge:60000, httpOnly:false } );

  res.send('access_id: ' + access_id);
});

app.listen(3000);
