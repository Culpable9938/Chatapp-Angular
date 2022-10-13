const path = require('path')
const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userDiconnects, RoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const botname = 'Admin'


io.on('connection', (socket) => {

    socket.on('joinroom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);   
        socket.join(user.room);

        //Welcome the user
        socket.emit('message', formatMessage(botname, 'Welcome to the Chat'))

        // User connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botname, `${user.username} has joined the chat`));

        //USer and room info
        io.to(user.room).emit('roomusers', {
            room: user.room,
            users: RoomUsers(user.room)
        });

    });


    // User disconnects
    socket.on('disconnect', () => {
        const user = userDiconnects(socket.id);

        if(user)
        {
            io.to(user.room).emit('message', formatMessage(botname, `A ${user.username} has left the chat`))
        }

        io.to(user.room).emit('roomusers', {
            room: user.room,
            users: RoomUsers(user.room)
        });
    });
    

    //Chat message
    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
