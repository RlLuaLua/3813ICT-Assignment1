var fs = require('fs');

roomArraytxt = fs.readFileSync('./data/rooms.json', 'utf-8');
let roomArray = JSON.parse(roomArraytxt);

userArraytxt = fs.readFileSync('./data/users.json', 'utf-8');
let userArray = JSON.parse(userArraytxt);

var socketChannel = [];

module.exports = {
    
    connect: function(io, PORT){
        const chat = io.of('/chat');
        const room = io.of('/room');
        //const chat = io.of("/chat");
        chat.on('connection',(socket) => {
            //output connection requests to the server console
            console.log('chat: user connection on port ' + PORT + ':' + socket.id);
            
            chat.on("gethistory", (room, channel) => {
                console.log("gethistory");
                //returns messages from room's selected channel
                for (let i=0; i < roomArray.length; i++){
                    if (roomArray[i].name == room) {
                        for (let j=0; j < roomArray[i].channels.length; j++){
                            if (roomArray[i].channels[j].name == channel){
                                console.log(roomArray[i].channels[j].messages);
                                socketChannel.push([socket.id, room+channel]);
                                chat.join(room+channel).emit("gethistory", roomArray[i].channels[j].messages)
                            }
                        }
                    }
                }
            });

            //when message is recieved emit it back to all sockets
            socket.on('message', (message)=>{
                for (i=0; i<socketChannel.length; i++){
                    if (socketChannel[i][0] == socket.id){//check socket channel for current socket id
                        for(let j=0; j<roomArray.length; j++){
                            if(socketChannel[i][1] == roomArray[i].name){
                                for(k=0; k<roomArray[j].channels.length; k++){
                                    if(socketChannel[i][2] == roomArray[j].channels[j].name){
                                        chat.to(socketChannel[i][2]).emit('message', message);
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });

        room.on('connection',(socket) => {
            console.log('room: user connection on port ' + PORT + ':' + socket.id);
            
            socket.on("rooms", (id) => {
                for(let i=0; i < roomArray.length; i++) {
                    for(let j=0; j < roomArray[i].users.length; j++) {
                        if (roomArray[i].users[j].id == id){
                            socket.emit('rooms', roomArray[i]);
                        }
                    }
                }
            });
            //gets all channels for selected room (group)
            socket.on("joinroom", (room) => {
                for (let i=0; i < roomArray.length; i++) {
                    if(roomArray[i].name == room){
                        socket.emit("joinroom", roomArray[i].channels);
                    }
                  }
            });
        });
        
    }

}