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

app.set('view engine', 'pug')
app.get('/', function (req, res) {
    connection.query('SELECT * FROM countdown', function (err, rows, fields) {
        if (err) throw err
        let status = rows[0].status;        
        let minute = rows[0].minute;
        let start  = rows[0].start;
        let end    = rows[0].end;
        if(status == 'send'){
            res.render('index', { minute: msConversion(minute), message: 'Index page', status: status })
        }  
        if(status == 'start'){
            res.render('index', { end: end, message: 'Index pagee', status: status })
        }             
        //console.log(rows)
        //res.send(rows)
    })            
})

app.get('/admin', function (req, res) {
    res.render('admin', { message: 'Admin page' })
})

server = http.Server(app);
server.listen(5000);

io = socketIO(server);

io.on('connection', function (socket) {    
    console.log('success-connection')
    socket.on('send-minute', ({status, inputValue, clickSend}) => {
        io.emit('send-minute', ({status, inputValue, clickSend}));  
        
        //connection.connect()
        connection.query('UPDATE countdown SET status ='+'"'+status+'"'+', minute ='+inputValue+', save = '+clickSend+', start = NULL, end = NULL WHERE id=1;', function (err, rows, fields) {
            if (err) throw err
                //console.log(rows)
        })
        //connection.end()

    }); 
    socket.on('send-start', ({status, clickStart, endTime}) => {
        io.emit('send-start', ({status, clickStart, endTime}));

        //connection.connect()
        connection.query('UPDATE countdown SET status ='+'"'+status+'"'+', start = '+'"'+clickStart+'"'+', end = '+'"'+endTime+'"'+' WHERE id=1;', function (err, rows, fields) {
            if (err) throw err
                //console.log(rows)
        })
        //connection.end()
    }); 
});

// handle timesync requests
app.use('/timesync', timesyncServer.requestHandler);

app.use('/public', express.static(__dirname + '/public'));

function msConversion(millis) {
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;
    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);
    if (hrs > 0) {
        min = '' + min;
        min = ('00' + min).substring(min.length);
        return hrs + ":" + min + ":" + sec;
    }
    else {
        return min + ":" + sec;
    }
}