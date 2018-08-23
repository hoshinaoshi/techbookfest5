var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
// GraphQL schema
var schema = buildSchema(`
  type Query {
    top: Root
    user: User
    item: Item
  },
  type Item {
    test: Int
    ex: String
  },
  type User {
    id: Int
    name: String
  },
  type Root {
    user: User
    items: [Item]
  }
  `);

/*
var user = new Promise(function(resolve, reject) {
  setTimeout(function () {
    console.log('taskA');
    resolve();
  }, 16);
});

var items = new Promise(function(resolve, reject) {
  setTimeout(function () {
    console.log('taskB');
    resolve();
  }, 20);
});

var result;
Promise.all([taskA, taskB]).then(function () {
  console.log(result);
});
*/
async function user2() {
  var qs = require("querystring");
  var http = require("https");

  var options = {
    "method": "POST",
    "hostname": "requestloggerbin.herokuapp.com",
    "port": null,
    "path": "/bin/57e23c59-cf67-41b2-8e37-31e49c852cf2?foo=bar&foo=baz",
    "headers": {
      "cookie": "foo=bar; bar=baz",
      "accept": "application/json",
      "content-type": "application/x-www-form-urlencoded"
    }
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write(qs.stringify({ foo: 'bar', bar: 'baz' }));
  console.log("aaa")
  req.end();
  console.log("bbb")
}

async function user() {
  var request = require("request");

  var jar = request.jar();
  jar.setCookie(request.cookie("foo=bar"), "https://requestloggerbin.herokuapp.com/bin/57e23c59-cf67-41b2-8e37-31e49c852cf2");
  jar.setCookie(request.cookie("bar=baz"), "https://requestloggerbin.herokuapp.com/bin/57e23c59-cf67-41b2-8e37-31e49c852cf2");

  var options = { method: 'POST',
    url: 'https://requestloggerbin.herokuapp.com/bin/57e23c59-cf67-41b2-8e37-31e49c852cf2',
    qs: { foo: [ 'bar', 'baz' ] },
    headers: 
    { 'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json' },
    form: { foo: 'bar', bar: 'baz' },
    jar: 'JAR' };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    return body
  });
}

async function items() {
  return [{test: 1, ex: "bb"}];
}

async function top_data() {
  return  {user: await user(), items: await items()}
  /*
  var returnHash = {}
  Promise.all([await user(), await items()]).then(function (results) {
    results.forEach(function(result){
      for(key in result){
        returnHash[key] = result[key]
      }
    });
    console.log(returnHash)
  });
  return returnHash
  */
   // return {user: {id:1, name: "a"}, items: [{test:1, ex:"bb"}]}
}

/*
function timer(ms, name) {
  //console.log(`name: ${name} start!`)
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(name), ms)
  })
}

(async () => {
  const p1 = timer(1000, 'a')
  const p2 = timer(1000, 'b')
  const [result1, result2] = [await p1, await p2]
  //console.log(result1, result2)
})()
*/

var root = {
  top: top_data()
};
/*
var root = {
  top: {user: {id: 1, name: "aa"}, items: [{test: 1, ex: "bb"}]}
};
*/

console.log(root)

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
