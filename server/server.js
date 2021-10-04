const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const io = require('socket.io')(http,{
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
  }
});
//apply express middleware
app.use(cors());
app.use (bodyParser.json());

//Define port used for server
const PORT = 3000;
const MongoURL = 'mongodb://localhost:27017';



MongoClient.connect(MongoURL, function(err, client){
  //callback function, when connection is established, start the rest of the application

  if (err) {return console.log(err)}
      const dbName = '3813';
      const db = client.db(dbName);

      require('./routes/login.js')(db, app);

      sockets = require('./sockets.js');
      server = require('./listen.js');
      //start server listening for requests
      server.listen(http, PORT);

      //setup socket
      sockets.connect(io, PORT);
});