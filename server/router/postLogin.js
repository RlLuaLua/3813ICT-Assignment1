var fs = require('fs');

module.exports = function(req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    c = user + pass;
    console.log(c);

    fs.readFile('./data/users.json', 'utf8', function(err, data) {
        if (err) throw err;
        let userArray = JSON.parse(data);
        for ( let i = 0; i < userArray.length; i++){
            if ((userArray[i].username == user) && (userArray[i].password == pass)){
                console.log(userArray[i]);
                returnObj = {};
                returnObj.username = userArray[i].username;
                returnObj.email = userArray[i].email;
                returnObj.id = userArray[i].id;
                returnObj.role = userArray[i].role;
                console.log(returnObj);
                res.send(returnObj);
                return;
            } else {
                console.log(i);
            }
        }
        res.send({ "valid": false });
        return;
    });
}