var fs = require('fs');

roomArraytxt = fs.readFileSync('./data/rooms.json', 'utf-8');
let roomArray = JSON.parse(roomArraytxt);

userArraytxt = fs.readFileSync('./data/users.json', 'utf-8');
let userArray = JSON.parse(userArraytxt);

module.exports = {
    
    connect: function(io, PORT){
        const chat = io.of('/chat');
        const room = io.of('/room');
        //const chat = io.of("/chat");
        chat.on('connection',(socket) => {

            //output connection requests to the server console
            console.log('chat: user connection on port ' + PORT + ':' + socket.id);
            //when message is recieved emit it back to all sockets
            socket.on('message', (message)=>{
                chat.emit('message', message);
            });
        });

        room.on('connection',(socket) => {
            console.log('room: user connection on port ' + PORT + ':' + socket.id);
            
            socket.on("rooms", (id) => {
                var retRooms = [];
                for(let i=0; i < roomArray.length; i++) {
                    console.log('step2');
                    console.log(roomArray[i]);
                    for(let j=0; j < roomArray[i].users.length; j++) {
                        console.log('step3');
                        console.log(roomArray[i].users[j]);
                        if (roomArray[i].users[j].id == id){
                            console.log('step4');
                            console.log(roomArray[i]);
                            room.emit('rooms', roomArray[i]);
                        }
                    }
                }
            });
        });
    }

}