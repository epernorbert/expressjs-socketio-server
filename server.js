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
    console.log('success-connection')
    socket.on('minute', ({data1, data2}) => {
        io.emit('minute', ({data1, data2}));
    });  
});

// handle timesync requests
app.use('/timesync', timesyncServer.requestHandler);

app.use('/public', express.static(__dirname + '/public'));