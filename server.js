const express= require("express");
const app=express();
const server =require('http').Server(app);
const io=require('socket.io')(server);
const {ExpressPeerServer}=require('peer');
const peerServer =ExpressPeerServer(server,{
    debug: true
})

const {v4: uuidv4}=require('uuid');
app.set('view engine','ejs');


app.use('/peerjs',peerServer);
app.use(express.static('public'));

app.get('/',function(req,res){
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room',function(req,res){
    res.render('room',{roomId: req.params.room});
});
io.on('connection',function(socket){
    socket.on('join-room',function(roomId,userId){
        socket.join(roomId);
        io.to(roomId).emit('user-connected',userId);
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message);
        });
    });
});





server.listen(3000);