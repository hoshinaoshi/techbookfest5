var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var request = require('sync-request');

// GraphQL schema
var schema = buildSchema(`
  type Query {
    top: Root
    user: User
    item: Item
  },
  type Item {
    user_id: Int
    title: String
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

async function httpRequest(method, url) {
  var options = { 
    method: method,
    url: url,
    headers: { 
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json'
    },
  };
  return request(method, url, options);
}

async function items() {
  var response = await httpRequest("GET", "https://requestloggerbin.herokuapp.com/bin/bf985753-3191-47f1-b014-9324d1126aa8")
  return { items: JSON.parse(response.getBody('utf8')) }
}

async function user() {
  var response = await httpRequest("GET", "https://requestloggerbin.herokuapp.com/bin/d20aa466-fa08-4249-a8d3-cfe633fafd14")
  return { user: JSON.parse(response.getBody('utf8')) }
}


async function top_data() {
  var returnHash = {}
  Promise.all([user(), items()]).then(function (results) {
    results.forEach(function(result){
      for(key in result){
        returnHash[key] = result[key]
      }
    });
  });
  return returnHash
  // return { user: { id:1, name: "name"}, items: [ { user_id: 1, title: "example" } ] }
}

var root = {
  top: top_data()
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
