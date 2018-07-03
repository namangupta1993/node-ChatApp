'use strict';

const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const messageGenerator = require(__dirname + '/Utils/message')
const { Users } = require(__dirname + '/Utils/users');
const locationService = require(__dirname + '/Utils/locationUriGenerator');

const hbs = require('hbs');

var port = process.env.PORT || 1337;
var users = new Users();

const publicPath = path.join(__dirname, '../public')

console.log(publicPath);

var app = express();

app.set('view engine', 'hbs');
app.set('views', publicPath);



var server = http.createServer((app));
var io = socketIO(server);

//var roomList = [];


io.on('connection', (socket) => {

    var message = messageGenerator('', 'Welcome to the chat application')

    socket.emit('newMessageAdmin', message);

    socket.on('join', (params, message) => {

        socket.join(params.room);


        var messageSend = messageGenerator('', `${message.name} has joined the room`)
        socket.broadcast.to(params.room).emit('newMessageAdmin', messageSend);

        if (!users.addUser(socket.id, params.name, params.room)) {
            socket.emit('error_duplicateUser', (params))
        }
        else {
            var roomUsers = users.getUsers(params.room);

            console.log(`Room sidebar users ${JSON.stringify(roomUsers, undefined, 2)}`)

            io.to(params.room).emit('updateUserList', roomUsers)

            console.log(roomUsers);
        }




    });

    socket.on('createLocationMessage', (coordinates) => {

        var userName = users.getUserbyID(socket.id).name

        var locationObject = locationService(userName, coordinates);

        var locationMessage = messageGenerator(userName, locationObject);


        var messageObject = { createdAt: locationMessage.text.createtAt, from: locationMessage.text.from, url: locationMessage.text.url }


        socket.broadcast.to(users.getUserbyID(socket.id).room).emit('newLocationMessage-left', messageObject);

        socket.emit('newLocationMessage-right', messageObject)


    })

    socket.on('createMessage', (message, params, callback) => {

        var messageObj = messageGenerator(message.from, message.text);

        //io.to(params.room).emit('newMessage', messageObj);

        socket.broadcast.to(params.room).emit('newMessage', messageObj);

        socket.emit('newMessage2', messageObj);

        callback();

    });


    socket.on('disconnect', () => {

        console.log('inside disconnect')

        var removedUser = users.getUserbyID(socket.id);
        var roomInfo = removedUser.room;
        users.removeUser(socket.id);
        var roomUsers = users.getUsers(roomInfo);

        io.to(roomInfo).emit('updateUserList', roomUsers)

        var message = messageGenerator('', `${removedUser.name} has left the room`)

        io.to(roomInfo).emit('newMessageAdmin', message);


        
    });

});



app.use(express.static(publicPath));

server.listen(port, () => {

    console.log('The server is up and running')

});




app.get('/', (req, res) => {

    var obj = {
        Rooms: users.getRoomsCount()
        , Users: users.getUserCount()
    };

    res.render('index', obj);

});


module.exports = { app };
