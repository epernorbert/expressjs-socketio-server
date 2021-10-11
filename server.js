/* database connection */
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'countdown'
})

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
    socket.on('send-minute', ({status, inputValue, clickSend}) => {
        io.emit('send-minute', ({status, inputValue, clickSend}));  
        
        //connection.connect()
        connection.query('UPDATE countdown SET status = "send", minute ='+inputValue+', save = '+clickSend+', start = NULL, end = NULL WHERE id=1;', function (err, rows, fields) {
        if (err) throw err
            console.log(rows)
        })
        //connection.end()                    

    }); 
    socket.on('send-start', ({status, clickStart, endTime}) => {
        io.emit('send-start', ({status, clickStart, endTime}));
    }); 
});

// handle timesync requests
app.use('/timesync', timesyncServer.requestHandler);

app.use('/public', express.static(__dirname + '/public'));