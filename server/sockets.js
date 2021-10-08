module.exports = {
    connect: function(io, PORT, db){
        const chat = io.of('/chat');
        const room = io.of('/room');
        var socketChannel = [];
        var joinedRoom;
        //get rooms collection as array
        var roomArray;

        const rooms=db.collection('rooms');
        rooms.find({}).toArray((err, data)=>{//initialise room data
            roomArray = data;
        })

        const users=db.collection('users');

        chat.on('connection',(socket) => {
            //output connection requests to the server console
            console.log('chat: user connection on port ' + PORT + ':' + socket.id);
            socket.on('gethistory', (room, channel) => {
                rooms.find({}).toArray((err, data)=>{//update room data
                    roomArray = data;
                });
                //returns messages from room's selected channel
                for (let i=0; i < roomArray.length; i++){
                    if (roomArray[i].name == room) {
                        for (let j=0; j < roomArray[i].channels.length; j++){
                            if (roomArray[i].channels[j].name == channel){
                                var socketroom = room+"-"+channel;
                                socket.join(socketroom);
                                socketChannel.push([socket.id, socketroom]);
                                var chatHist = roomArray[i].channels[j].messages
                                return chat.in(socketroom).emit('gethistory', chatHist);
                            }
                        }
                    }
                }
            });

            //when message is recieved emit it back to all sockets
            socket.on('message', (message, user)=>{
                for (i=0; i<socketChannel.length; i++){//for each socket channel connection pair
                    if (socketChannel[i][0] == socket.id){//check socket channel for current socket id
                        for(let j=0; j<roomArray.length; j++){//for each room in roomArray
                            for(k=0; k<roomArray[j].channels.length; k++){//for each channel in current room
                                if(socketChannel[i][1]==roomArray[j].name + '-' + roomArray[j].channels[k].name){
                                    roomArray[j].channels[k].messages.push({user: user, message: message});
                                    //add messages to mongo
                                    rooms.update({"name":roomArray[j].name, "channels.name":roomArray[j].channels[k].name}, {"$push":{"channels.$.messages":{"user":user,"message":message}}});
                                    return chat.to(roomArray[j].name + '-' + roomArray[j].channels[k].name)
                                        .emit('message', {user: user, message: message})
                                }
                            }
                        }
                    }
                }
            });
        });

        room.on('connection',(socket) => {
            console.log('room: user connection on port ' + PORT + ':' + socket.id);

            rooms.find({}).toArray((err, data)=>{//update room data
                roomArray = data;
            });

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
            socket.on("joinroom", (room, id) => {
                var channelsArr = [];
                var curRoom;
                for (let i=0; i < roomArray.length; i++) {
                    if(roomArray[i].name == room){
                        channelsArr = roomArray[i].channels;
                        curRoom = i;
                    }
                }
                for (let i=0; i < roomArray[curRoom].channels.length; i++) {
                    for(let j=0;j<roomArray[curRoom].channels[i].excludes.length; j++){
                        if(roomArray[curRoom].channels[i].excludes[j].id != id){
                            console.log(roomArray[curRoom].channels[i]);
                            channelsArr.splice(i, 1);
                        }
                    }
                }
                socket.emit('joinroom', channelsArr);
            });

            socket.on("createroom", (roomname, id)=>{
                rooms.find({"name":roomname}).toArray((err, data)=>{
                    if(data.length == 0){//if no match was found
                        rooms.insertOne({
                            "name": roomname, 
                            "channels": [],
                            "users": [
                                {
                                    "id": id
                                }
                            ]
                        }, ()=>{
                            rooms.find({}).toArray((err, data)=>{//update room data
                                roomArray = data;
                            })
                        })
                    }
                })
            });

            socket.on("removeroom", (roomname)=>{
                rooms.remove({"name": roomname}, ()=>{
                    rooms.find({}).toArray((err, data)=>{//update room data
                        roomArray = data;
                    })
                })
            })

            socket.on("createchannel", (roomname, channelname)=>{
                rooms.updateOne({"name":roomname}, {"$push":{"channels":{
                    "name":channelname,
                    "messages":[],
                    "excludes":[]
                }}})
            })

            socket.on("removechannel", (roomname, channelname)=>{
                rooms.updateOne({"name":roomname}, {"$pull":{"channels":{
                    "name":channelname
                }}})
            })
        });
    }
}