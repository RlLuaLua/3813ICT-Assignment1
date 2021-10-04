module.exports = function(db, app){
    app.post('/api/auth', function(req, res){
        if(!req.body){
            return res.sendStatus(400);
        }
        login = req.body;
        const collection = db.collection('users');
        collection.find({username: login.username, password: login.password}).toArray((err, data)=>{
            res.send({_id:data[0]._id, username:data[0].username, email:data[0].email, role:data[0].role});
        })
    });
}