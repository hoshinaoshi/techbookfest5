var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
// GraphQL schema
var schema = buildSchema(`
  type Query {
    top: Root
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

async function user() {
  return {a: 1};
}

async function items() {
  return {b: 2};
}

Promise.all([user(), items()]).then(function (result) {
  console.log(result);
});


var root = {
  top: {user: {id: 1, name: "aa"}, items: [{test: 1, ex: "bb"}]}
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
