var fs = require('fs');

module.exports = {

    connect: function(io, PORT){

        const login = io.of('/login')
        const chat = io.of('/chat')

        chat.on('connection',(socket) => {
            //output connection requests to the server console
            console.log('user connection on port ' + PORT + ':' + socket.id);
            //when message is recieved emit it back to all sockets
            socket.on('message', (message)=>{
                chat.emit('message', message);
            });
        });


        login.on('connection', (socket) => {
            socket.on('sendLogin', (logininfo)=>{
                fs.readFile('/data/users.json', 'utf-8', function(err, data){
                    if (err) throw err;
                    let userArray = JSON.parse(data);
                    console.log(userArray);
                    for (let i = 0; i < userArray.length; i++) {
                        //if the login information contains the correct username/email & password combination
                        if (((userArray[i].username == logininfo.username) || (userArray[i].email == logininfo.username)) && (userArray[i].password == logininfo.password)) {
                            userInfo = delete(userArray[i].password);
                            login.emit('sendLogin', userInfo);
                        }else{
                            console.log('try again');
                        }
                    }
                });
            });
        });
    }
}