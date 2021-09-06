const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http,{
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
  }
});
const sockets = require('./sockets.js');
const server = require('./listen.js');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Define port used for server
const PORT = 3000;

//apply express middleware
app.use(cors());

//setup socket
sockets.connect(io, PORT);

//start server listening for requests
server.listen(http, PORT);

app.post('/api/auth', require('./router/postLogin.js'));
