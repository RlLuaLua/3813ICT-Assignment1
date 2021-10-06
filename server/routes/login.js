module.exports = function(db, app){
    app.post('/api/auth', function(req, res){
        if(!req.body){
            return res.sendStatus(400);
        }
        login = req.body;
        console.log('server reached');
        console.log(login);
        const collection = db.collection('users');
        collection.find({username: login.username, password: login.password}).toArray((err, data)=>{
            console.log('data');
            console.log(data);
            if (err) {
                res.send(data.err);
            }else if(data.length == 1){
                res.send({_id:data[0]._id, username:data[0].username, email:data[0].email, role:data[0].role});
            }else{
                res.send('invalid login');
            }
        })
    });
}