const express = require('express');
const app = express();
let userCount = 0;

const server = app.listen(4113, function() {
    console.log('server running on port 4113');
});


const io = require('socket.io')(server);

io.on('connection', function(socket) {
    let roomId = null;

    socket.emit("success", socket.id)
    
    socket.on('create', function (room) {
        socket.join(room);
        roomId = room;
        userCount++;
        console.log("Created room", room);
    });

    socket.on('connect', function(roomId) {
        if (userCount < 2) {
            userCount++;
            socket.join(roomId);
            room = roomId;
            console.log("a user is connected in room", roomId, "socketID", socket.id, "userCount", userCount);
            // io.to(roomId).emit("connect", socket.id);
            io.emit("connect", socket.id);
        } else {
            console.log("too many players in the room. disconnect", socket.id, userCount);
            io.to(roomId).emit("disconnect", "player 2");
            socket.disconnect();
        }
    });
    
    // socket.in(roomId).on('SEND_MESSAGE', function(data) {
    socket.on('playerChoice', function(data) {
        console.log("playerChoice EVENT", data);
        io.emit('playerChoice', data)
        // io.to(roomId).emit('MESSAGE', data)
    });
    
    socket.on('restartGame', function(data) {
        console.log("restartGame EVENT", data);
        io.emit('restartGame', data)
        // io.to(roomId).emit('MESSAGE', data)
    });
    
    
    // socket.in(roomId).on('disconnect', function () {
    // socket.on('disconnect', function () {
    //     console.log('A user disconnected for room', roomId);
    //     io.to(roomId).emit("disconnect", "player 2");
    //     userCount--;
    // });
});