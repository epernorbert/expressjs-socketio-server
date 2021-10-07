var timesyncServer = require('timesync/server');
var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/admin.html');
});

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function (socket) {
    socket.emit('greeting-from-server', {
        greeting: 'Hello Client'
    });
    socket.on('greeting-from-client', function (message) {
        console.log(message);
    }); 
    //console.log('success-connection')
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });  
});

// handle timesync requests
app.use('/timesync', timesyncServer.requestHandler);

app.use('/public', express.static(__dirname + '/public'));