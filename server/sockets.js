var ObjectID = require('mongodb').ObjectID;
module.exports = {
    connect: function(io, PORT, db){
        const chat = io.of('/chat');
        const room = io.of('/room');
        const userManage = io.of('/users');
        var socketChannel = [];
        var joinedRoom;
        //get rooms collection as array
        var roomArray;

        //gets collection name for Rooms database
        const rooms=db.collection('rooms');
        //gets and saves entire Rooms db at current time.
        rooms.find({}).toArray((err, data)=>{//initialise room data
            roomArray = data;
        })

        //gets collection name for Users database
        const users=db.collection('users');
        
        //on connection to localhost:3000/chat
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

        //on connection to localhost:3000/room
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
                            channelsArr.splice(i, 1);
                        }
                    }
                }
                for (let i=0; i<roomArray[curRoom].users.length; i++){
                    if(roomArray[curRoom].users[i].id == id){
                        AssisStatus = roomArray[curRoom].users[i].role;
                    }
                }
                socket.emit('joinroom', channelsArr);
                socket.emit('assisstatus', AssisStatus);
            });

            //creates a new room with a name and adds the user who created it to the user list
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
                        })
                    }
                })
            });
            //removes a room based on the room name
            socket.on("removeroom", (roomname)=>{
                rooms.remove({"name": roomname}, ()=>{
                    rooms.find({}).toArray((err, data)=>{//update room data
                        roomArray = data;
                    })
                })
            })
            //creates a new channel for a room based on the roomname. also names the channel
            socket.on("createchannel", (roomname, channelname)=>{
                rooms.updateOne({"name":roomname}, {"$push":{"channels":{
                    "name":channelname,
                    "messages":[],
                    "excludes":[]
                }}})
            })
            //removes a channel based on the name of it's corresponding room, and the name of the channel
            socket.on("removechannel", (roomname, channelname)=>{
                rooms.updateOne({"name":roomname}, {"$pull":{"channels":{
                    "name":channelname
                }}})
            })

            //manage users in rooms
            //get all users
            socket.on('getusers', ()=>{
                userResults=[];
                users.find({}).toArray((err,data)=>{
                    var result=[];
                    for (i=0; i<data.length; i++){
                        result.push({"_id": data[i]._id, "username": data[i].username})
                    }
                    return room.emit('getusers', result);
                })
            })

            //get users in specific room(group)
            socket.on('getroomusers', (roomname)=>{
                userResults=[];
                rooms.find({"name":roomname}).toArray((err,data)=>{
                    for(i=0; i<data[0].users.length; i++){
                        console.log(data[0].users[i].id + " 1");
                        var id = new ObjectID(data[0].users[i].id);
                        users.find({"_id":id}).toArray((err,userdata)=>{
                            userResults.push({"_id":userdata[0]._id, "username":userdata[0].username});
                            if(userResults.length == i){
                                room.emit('getroomusers', userResults);
                            }
                        })
                    }
                })
            })
            //add user to group
            socket.on('addroomuser', (roomname, userid, role)=>{
                console.log(userid);
                rooms.find({"name":roomname}).toArray((err,data)=>{
                    for(i=0; i<data[0].users.length; i++){
                        if(data[0].users[i].id==userid){
                            console.log("there");
                            break
                        }
                        if(i+1 == data[0].users.length){
                            console.log("here");
                            rooms.updateOne({"name": roomname}, {"$push":{"users":{"id":userid, "role":role}}})
                        }
                    }
                })
            })
            //remove user from group
            socket.on('removeroomuser', (roomname, userid)=>{
                rooms.find({"name":roomname}).toArray((err,data)=>{
                    for(i=0; i<data[0].users.length; i++){
                        if(data[0].users[i].id==userid){
                            rooms.updateOne({"name": roomname}, {"$pull":{"users":{"id":userid}}})
                        }
                    }
                })
            })

            //exclude groupuser from channel
            socket.on('removechanneluser', (roomname, channelname, userid)=>{
                rooms.find({"name":roomname, "channels.$.name":channelname,"channels.excludes.id":userid}).toArray((err,data)=>{
                    console.log(data)
                    if(data.length == 0){
                        rooms.updateOne({"name":roomname, "channels.name":channelname}, {"$push":{"channels.$.excludes":{"id":userid}}})
                    }
                })
            })
            //unexclude groupuser from channel
            socket.on('addchanneluser', (roomname, channelname, userid)=>{
                rooms.updateOne({"name":roomname, "channels.name":channelname,"channels.excludes.id":userid}, {"$pull":{"channels.$.excludes":{"id":userid}}})
                
            })
        });

        //on connection to localhost:3000/users
        userManage.on('connection',(socket)=>{
            console.log('user: user connection on port ' + PORT + ':' + socket.id);

            //creates one user based on New-User class
            socket.on('createuser', (userInfo)=>{
                users.insertOne(userInfo);
            })

            //gets a list of all users
            socket.on('getusers', ()=>{
                userResults=[];
                users.find({}).toArray((err,data)=>{
                    var result=[];
                    for (i=0; i<data.length; i++){
                        result.push({"_id": data[i]._id, "username": data[i].username})
                    }
                    return userManage.emit('getusers', result);
                })
            })

            //returns user details for user based on the user's ID (excluding password)
            socket.on('getuserdetails', (id)=>{
                var _id = new ObjectID(id)
                users.find({"_id": _id}).toArray((err, data)=>{
                    if(data.length == 1){
                        userManage.emit('getuserdetails', {_id:data[0]._id, username:data[0].username, email:data[0].email, role:data[0].role});
                    }
                })
            })

            //changes the username, email & role of a user based off the ID.
            socket.on('updateuserdetails', (id, username, email, role)=>{
                var _id = new ObjectID(id)
                users.updateOne({"_id": _id}, {"$set":{"username": username, "email": email, "role": role}})
            })
        });
    }
}