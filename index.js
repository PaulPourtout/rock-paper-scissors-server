const express = require('express');
const app = express();

const server = app.listen(4113, function() {
    console.log('server running on port 4113');
});


const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log("a user is connected", socket.id);

    socket.on('SEND_MESSAGE', function(data) {
        console.log(data);
        io.emit('MESSAGE', data)
    });
});